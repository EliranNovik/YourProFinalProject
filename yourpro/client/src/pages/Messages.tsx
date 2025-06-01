import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import './Messages.css';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_at: string | null;
}

interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants: {
    id: string;
    full_name: string;
    avatar_url: string;
    professional_title?: string;
  }[];
  last_message?: Message;
}

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(true);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        console.log('Current user:', user);
      } else {
        console.error('No user found from supabase.auth.getUser()');
      }
    };
    fetchUser();
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) {
        console.warn('No currentUser, not fetching conversations');
        return;
      }
      console.log('Fetching conversations for user:', currentUser.id);
      // Minimal query without !inner and without nested users join
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('id, created_at, updated_at, conversation_participants(user_id)')
        .order('updated_at', { ascending: false });
      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }
      console.log('Minimal conversationsData:', conversationsData);
      // Fetch all users
      const { data: users } = await supabase.from('users').select('*');
      const userMap: Record<string, any> = {};
      (users || []).forEach(u => { userMap[u.id] = u; });
      // Transform to match Conversation interface and merge user details
      const transformedConversations = (conversationsData || []).map((conv: any) => ({
        id: conv.id,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        participants: (conv.conversation_participants || []).map((cp: any) => {
          const user = userMap[cp.user_id];
          if (user) return user;
          // Fallback: at least provide a placeholder name
          return {
            id: cp.user_id,
            full_name: 'Unknown User',
            avatar_url: '/default-avatar.png',
            professional_title: '',
          };
        }),
      }));
      console.log('Transformed conversations with user details:', transformedConversations);
      setConversations(transformedConversations);
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to new conversations
    const conversationsSubscription = supabase
      .channel('conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations'
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      conversationsSubscription.unsubscribe();
    };
  }, [currentUser]);

  // Fetch messages for selected conversation
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      setMessages(messagesData);
      // Mark messages as read
      const unreadMessages = messagesData.filter(
        msg => !msg.read_at && msg.sender_id !== currentUser?.id
      );
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .in('id', unreadMessages.map(msg => msg.id));
      }
    };
    fetchMessages();
    // Poll every 3 seconds
    pollingInterval = setInterval(fetchMessages, 3000);
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [selectedConversation, currentUser]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;
    // Optimistically add the message to the UI
    const optimisticMessage = {
      id: `optimistic-${Date.now()}`,
      content: newMessage.trim(),
      sender_id: currentUser.id,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages(prev => [...prev, optimisticMessage]);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: currentUser.id,
          content: newMessage.trim()
        });
      if (error) throw error;
      setNewMessage('');
      // The next poll will fetch the real message from the DB
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Start a new conversation
  const startConversation = async (userId: string) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .rpc('get_or_create_conversation', {
          user1_id: currentUser.id,
          user2_id: userId
        });

      if (error) throw error;

      // Find the conversation in our list or fetch it
      const existingConversation = conversations.find(c => c.id === data);
      if (existingConversation) {
        setSelectedConversation(existingConversation);
      } else {
        // Fetch the new conversation
        const { data: newConv, error: fetchError } = await supabase
          .from('conversations')
          .select(`
            id,
            created_at,
            updated_at,
            conversation_participants!inner (
              user_id,
              users (
                id,
                full_name,
                avatar_url,
                professional_title
              )
            )
          `)
          .eq('id', data)
          .single();

        if (fetchError) throw fetchError;

        const transformedConversation = {
          id: newConv.id,
          created_at: newConv.created_at,
          updated_at: newConv.updated_at,
          participants: newConv.conversation_participants
            .map((cp: any) => cp.users)
            .filter((user: any) => user.id !== currentUser.id)
        };

        setConversations(prev => [transformedConversation, ...prev]);
        setSelectedConversation(transformedConversation);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => {
    const participant = conv.participants[0];
    return participant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (participant.professional_title || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) setShowSidebar(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    if (mobileView) setShowSidebar(false);
  };

  const handleBack = () => {
    setShowSidebar(true);
  };

  return (
    <div className="messages-container">
      {/* Sidebar */}
      {(!mobileView || showSidebar) && (
        <div className={`messages-sidebar${mobileView ? ' mobile' : ''}`}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="conversations-list">
            {filteredConversations.map(conv => {
              const participant = conv.participants[0];
              return (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedConversation?.id === conv.id ? 'selected' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <img src={participant?.avatar_url || '/default-avatar.png'} alt={participant?.full_name || participant?.id || 'User'} />
                  <div className="conversation-info">
                    <h3>{participant?.full_name || participant?.id}</h3>
                    <p>{participant?.professional_title || ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main chat area, centered and not overlapping sidebar */}
      {(!mobileView || !showSidebar) && (
        <div className="main-content">
          <div className="chat-area-container">
            {selectedConversation ? (
              <>
                {(() => {
                  const participant = selectedConversation.participants.find(
                    (p) => p.id !== currentUser?.id
                  ) || selectedConversation.participants[0];
                  return (
                    <div className="chat-header">
                      {mobileView && (
                        <button className="back-btn" onClick={handleBack}>← Back</button>
                      )}
                      <img
                        src={participant?.avatar_url || '/default-avatar.png'}
                        alt={participant?.full_name || 'Unknown User'}
                      />
                      <div>
                        <h2>{participant?.full_name || 'Unknown User'}</h2>
                        <p>{participant?.professional_title || 'User'}</p>
                      </div>
                    </div>
                  );
                })()}

                <div className="messages-list">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`message ${message.sender_id === currentUser?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">{message.content}</div>
                      <div className="message-time">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="message-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit" disabled={!newMessage.trim()}>
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="no-conversation">
                <h2>Select a conversation to start chatting</h2>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages; 