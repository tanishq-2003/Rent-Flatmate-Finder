"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../../../context/SocketContext';
import { useAuth } from '../../../../context/AuthContext';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import api from '../../../../lib/api';

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const { id: chatId } = params;
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial chat history
    const fetchChatHistory = async () => {
      try {
        const res = await api.get(`/chat/${chatId}`);
        setMessages(res.data.data.messages || []);
      } catch (err) {
        console.error('Failed to fetch chat:', err);
      }
    };
    fetchChatHistory();
  }, [chatId]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the specific chat room
    socket.emit('join_chat', chatId);

    // Listeners
    const handleNewMessage = (message: any) => {
      setMessages(prev => [...prev, message]);
    };
    const handleUserTyping = (data: any) => {
      if (data.chatId === chatId) setIsTyping(data.isTyping);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.emit('leave_chat', chatId);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, isConnected, chatId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socket) return;
    
    socket.emit('send_message', { chatId, content: inputText });
    socket.emit('typing_stop', chatId);
    setInputText('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (socket) {
      if (e.target.value.trim().length > 0) {
        socket.emit('typing_start', chatId);
      } else {
        socket.emit('typing_stop', chatId);
      }
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      {/* Header */}
      <div style={{ height: '80px', borderBottom: '1px solid var(--border)', background: 'rgba(19, 19, 26, 0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/connections" style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={24} />
          </Link>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-hover)' }} />
          <div>
            <h3 style={{ margin: 0 }}>Connection</h3>
            <span style={{ fontSize: '0.75rem', color: isConnected ? 'var(--primary)' : 'var(--accent)' }}>
              {isConnected ? 'Connected' : 'Reconnecting...'}
            </span>
          </div>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Message List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={msg.id || index} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '70%', 
                padding: '1rem 1.25rem', 
                borderRadius: '24px', 
                background: isMe ? 'var(--primary)' : 'var(--surface)',
                color: isMe ? 'white' : 'var(--text-primary)',
                borderBottomRightRadius: isMe ? '4px' : '24px',
                borderBottomLeftRadius: !isMe ? '4px' : '24px',
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'var(--surface)', padding: '0.75rem 1.25rem', borderRadius: '24px', color: 'var(--text-secondary)' }}>
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '2rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            value={inputText}
            onChange={handleTyping}
            placeholder="Type a message..." 
            style={{ 
              flex: 1, 
              background: 'rgba(19, 19, 26, 0.4)', 
              border: '1px solid var(--border)', 
              borderRadius: '999px', 
              padding: '1rem 1.5rem',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
          <button type="submit" className="btn-primary" style={{ width: '56px', height: '56px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}>
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}
