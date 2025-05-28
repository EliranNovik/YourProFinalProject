import { supabase } from '../config/supabase';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const aiService = {
  async getServiceSuggestion(userInput: string): Promise<string> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const prompt = `Based on the following description, return the job title in the format 'You might need a (jobtitle)'. Be concise. Description: ${userInput}`;

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // or "gpt-4" if available
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that classifies service needs. Based on a user’s message, suggest the most suitable job title such as 'plumber', 'electrician', or 'locksmith'. Respond with: 'You might need a (jobtitle)'."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.6,
        }),
      });

      const data = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('No response from OpenAI for service suggestion');
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error getting AI service suggestion:', error);
      throw error;
    }
  },

  async getJobReport(jobRequest: string): Promise<{
    jobTitle: string;
    keywords: string[];
    report: string;
    timeFrame: string;
    costEstimate: string;
  }> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const prompt = `Given the following user request: '${jobRequest}', do the following:
1. Determine the appropriate job title (e.g., electrician, plumber, handyman) based on the context.
2. Extract key action phrases and user intent (e.g., 'install lamp', 'living room').
3. Write a professional 1–2 sentence report summarizing what the client needs, including the job title in the text.
4. Provide a time frame estimate for how long the job might take.
5. Estimate a cost range in USD.
Respond ONLY in the following JSON format:
{
  "jobTitle": "...",
  "keywords": ["..."],
  "report": "...",
  "timeFrame": "...",
  "costEstimate": "..."
}

Example:
User: I bought a new lamp and need it installed in the living room.
Response: {
  "jobTitle": "Electrician",
  "keywords": ["lamp", "installation", "living room"],
  "report": "The client needs an electrician to professionally install a newly purchased lamp in their living room.",
  "timeFrame": "1 hour",
  "costEstimate": "$80–$120"
}`;

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // or "gpt-4" if you want more accuracy
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that provides job reports, estimated time, and cost based on a client's service request. Always respond with valid JSON as described."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 350,
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No content returned from OpenAI');

      // Try parsing with fallback
      try {
        return JSON.parse(content.trim());
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse job report from OpenAI');
        }
      }
    } catch (error) {
      console.error('Error getting AI job report:', error);
      throw error;
    }
  }
};
