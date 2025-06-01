import React, { useState, useRef } from 'react';
import { aiService } from '../services/aiService';
import './AISearchBar.css';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SiriWave from 'react-siriwave';

interface AISearchBarProps {
  onSearch: (query: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  highlight?: boolean;
}

function extractJobTitle(aiResponse: string): string {
  // Match 'You might need a (jobtitle)' or 'You need a (jobtitle)'
  const match = aiResponse.match(/need (?:a|an)\s+([a-zA-Z ]+)/i);
  if (match && match[1]) {
    // Remove trailing punctuation and whitespace
    return match[1].replace(/[.?!,]+$/, '').trim();
  }
  // Fallback: return the whole response
  return aiResponse;
}

const PLACEHOLDERS = [
  'Just ask... ',
  'Tell us what you need... ',
  'What are you searching for?'
];

const AILoader = () => (
  <div className="ai-loader-container">
    <span className="ai-loader-text">AI is thinking</span>
    <span className="ai-loader-dots">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </span>
  </div>
);

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '/api';

const AISearchBar: React.FC<AISearchBarProps> = ({ onSearch, inputRef, highlight }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderFade, setPlaceholderFade] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Placeholder cycling with fade animation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderFade(true);
      setTimeout(() => {
        setPlaceholderIdx((idx) => (idx + 1) % PLACEHOLDERS.length);
        setPlaceholderFade(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Microphone speech-to-text
  const handleSpeech = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          setSearchQuery(event.results[0][0].transcript);
        }
        setListening(false);
      };
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      setListening(false);
      recognitionRef.current.stop();
    }
  };

  // Camera/file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setShowSuggestion(false);
      setSuggestion(null);
      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/api/ai-image-suggestion`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to get AI suggestion for image');
        }
        const data = await response.json();
        if (data.suggestion) {
          setSuggestion(data.suggestion);
          setShowSuggestion(true);
          setSearchQuery('');
        } else {
          setError('No suggestion returned from AI');
        }
      } catch (err: any) {
        setError(err.message || 'Error processing image');
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const aiSuggestion = await aiService.getServiceSuggestion(searchQuery);
      setSuggestion(aiSuggestion);
      setShowSuggestion(true);
    } catch (error) {
      console.error('Error getting suggestion:', error);
      setError(error instanceof Error ? error.message : 'Failed to get suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (suggestion) {
      onSearch(suggestion);
      setShowSuggestion(false);
      setSuggestion(null);
      // Extract job title from AI suggestion
      const jobtitle = extractJobTitle(suggestion);
      navigate('/searching-for-pro', { state: { jobtitle } });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="ai-searchbar-minimal">
      <div className="ai-searchbar-row">
        <div className="ai-searchbar-input-wrapper">
          <input
            type="text"
            className={`ai-searchbar-input${highlight ? ' ai-highlight' : ''}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setPlaceholderFade(true)}
            onBlur={() => setPlaceholderFade(false)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            ref={inputRef}
            style={{ transition: 'all 0.4s' }}
          />
          <div className={`ai-siri-icon${(searchQuery || document.activeElement === inputRef?.current) ? ' active' : ''}`}>
            {/* Siri-like animated icon */}
            <SiriWave width={36} height={24} color="#2563eb" amplitude={searchQuery ? 2 : 1} speed={0.15} />
          </div>
          {(!searchQuery && !placeholderFade) && (
            <span className="ai-placeholder-anim">{PLACEHOLDERS[placeholderIdx]}</span>
          )}
        </div>
        <IconButton onClick={handleSpeech} className="ai-mic-btn" aria-label="Voice search">
          <MicIcon />
        </IconButton>
        <IconButton onClick={handleCameraClick} className="ai-cam-btn" aria-label="Image search">
          <CameraAltIcon />
        </IconButton>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      {isLoading && <AILoader />}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {showSuggestion && suggestion && (
        <div className="suggestion-box pro-suggestion-box" role="dialog" aria-modal="true" aria-label="AI Suggestion">
          <div className="suggestion-header">
            <CheckCircleIcon style={{ color: '#2563eb', fontSize: 32, marginRight: 10 }} />
            <span className="suggestion-title">AI Suggestion</span>
          </div>
          <p className="suggestion-text">{suggestion}</p>
          <div className="suggestion-actions pro-actions">
            <button onClick={handleConfirm} className="confirm-button pro-confirm">
              <CheckCircleIcon style={{ marginRight: 8, fontSize: 22 }} /> Accept
            </button>
            <button 
              onClick={() => {
                setShowSuggestion(false);
                setSuggestion(null);
              }} 
              className="cancel-button pro-cancel"
            >
              <CloseIcon style={{ marginRight: 8, fontSize: 22 }} /> Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearchBar; 