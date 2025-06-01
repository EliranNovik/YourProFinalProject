import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import type { Request, Response } from 'express';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/ai-image-suggestion', upload.single('image'), async (req: Request, res: Response) => {
  console.log('Received POST /api/ai-image-suggestion');
  try {
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ error: 'No image uploaded' });
    }
    console.log('File received:', req.file.originalname, req.file.mimetype, req.file.size, 'bytes');
    const imagePath = path.resolve(req.file.path);
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    // Prepare OpenAI Vision API request
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.log('OpenAI API key not configured');
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    console.log('Sending image to OpenAI...');
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that classifies service needs from images. Based on the image, suggest the most suitable job title such as plumber, electrician, or locksmith. Respond with: "You might need a (jobtitle)".'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'What kind of professional is needed for this image?' },
              { type: 'image_url', image_url: { url: `data:${req.file.mimetype};base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 100,
        temperature: 0.6,
      })
    });
    console.log('OpenAI response status:', openaiRes.status);
    const data: any = await openaiRes.json();
    fs.unlinkSync(imagePath); // Clean up uploaded file

    if (!data.choices?.[0]?.message?.content) {
      console.log('No response from OpenAI', data);
      return res.status(500).json({ error: 'No response from OpenAI' });
    }
    console.log('AI suggestion:', data.choices[0].message.content.trim());
    return res.json({ suggestion: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('AI image suggestion error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
    return res.status(500).json({ error: 'Failed to process image' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 