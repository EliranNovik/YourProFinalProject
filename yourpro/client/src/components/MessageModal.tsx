import React, { useState } from 'react';
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

  const handleSendInitialMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !initialMessage.trim()) return;

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    try {
      // Create conversation
      const { data: conversation, error: convError } = await supabase.rpc('get_or_create_conversation', {
        user1_id: currentUser.id,
        user2_id: recipient.id
      });

      if (convError) throw convError;

      // Send initial message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation,
          sender_id: currentUser.id,
          content: initialMessage.trim()
        });

      if (msgError) throw msgError;

      // Close modal and reset state
      onClose();
      setInitialMessage('');
      
      // Show success message
      alert('Message sent successfully! You can continue the conversation in the Messages page.');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setInitialMessage('');
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
            }}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSendInitialMessage} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
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