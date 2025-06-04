import React, { useState, useEffect, useRef } from 'react';
import { Modal, Box, Avatar, Typography, IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../config/supabase';

interface MessageModalProps {
  open: boolean;
  onClose: () => void;
  recipient: {
    id: string;
    full_name: string;
    professional_title?: string;
    avatar_url?: string;
  };
}

const MessageModal: React.FC<MessageModalProps> = ({ open, onClose, recipient }) => {
  const [initialMessage, setInitialMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Fetch current user and messages
  useEffect(() => {
    if (!open || !recipient) return;
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user);
      // Get conversation id
      const { data: conversationId, error: convError } = await supabase.rpc('get_or_create_conversation', {
        user1_id: user.id,
        user2_id: recipient.id
      });
      if (convError || !conversationId) {
        setMessages([]);
        setLoading(false);
        return;
      }
      // Fetch messages
      const { data: msgs, error: msgErr } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (isMounted) {
        setMessages(msgs || []);
        setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [open, recipient]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendInitialMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !initialMessage.trim() || !currentUser) return;
    // Optimistically add message
    const optimistic = {
      id: `optimistic-${Date.now()}`,
      sender_id: currentUser.id,
      content: initialMessage.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setInitialMessage('');
    try {
      // Get conversation id
      const { data: conversationId, error: convError } = await supabase.rpc('get_or_create_conversation', {
        user1_id: currentUser.id,
        user2_id: recipient.id
      });
      if (convError || !conversationId) throw convError;
      // Send message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: optimistic.content
        });
      if (msgError) throw msgError;
      // Refetch messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      setMessages(msgs || []);
    } catch (error) {
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setInitialMessage('');
        setMessages([]);
      }}
      aria-labelledby="message-modal-title"
    >
      <Box className="message-modal" sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        maxWidth: '90vw',
        maxHeight: '80vh',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={recipient?.avatar_url || '/default-avatar.png'}
            sx={{ width: 64, height: 64, mr: 3 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Message {recipient?.full_name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {recipient?.professional_title}
            </Typography>
          </Box>
          <IconButton
            onClick={() => {
              onClose();
              setInitialMessage('');
              setMessages([]);
            }}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Messages container */}
        <Box sx={{ flex: 1, minHeight: 180, maxHeight: 320, overflowY: 'auto', mb: 2, bgcolor: '#f8fafc', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {loading ? (
            <Typography color="text.secondary">Loading messages...</Typography>
          ) : messages.length === 0 ? (
            <Typography color="text.secondary">No messages yet. Start the conversation!</Typography>
          ) : (
            messages.map((msg) => (
              <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender_id === currentUser?.id ? 'flex-end' : 'flex-start' }}>
                <Box sx={{
                  bgcolor: msg.sender_id === currentUser?.id ? '#2563eb' : '#fff',
                  color: msg.sender_id === currentUser?.id ? '#fff' : '#23263a',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  maxWidth: 340,
                  boxShadow: 1,
                  mb: 0.5
                }}>
                  <Typography fontSize={15}>{msg.content}</Typography>
                  <Typography variant="caption" sx={{ color: msg.sender_id === currentUser?.id ? '#e0e7ff' : '#888', mt: 0.5, display: 'block', textAlign: msg.sender_id === currentUser?.id ? 'right' : 'left' }}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                </Box>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>
        <form onSubmit={handleSendInitialMessage} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Type your message..."
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
                padding: 2,
                '& textarea': {
                  padding: 2
                }
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!initialMessage.trim()}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Send Message
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default MessageModal; 