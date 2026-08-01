import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../../../types/exchange';
import { useSocket } from '../../../hooks/useSocket';
import { useAuth } from '../../../hooks/useAuth';
import MessageComponent from '../Message/Message';
import MessageForm from '../MessageForm/MessageForm';
import LoadingSpinner from '../../ui/LoadingSpinner/LoadingSpinner';

interface ChatWindowProps {
  exchangeId: string;
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  exchangeId,
  messages,
  isLoading = false,
  className,
}) => {
  const { user } = useAuth();
  const { joinExchangeRoom, leaveExchangeRoom, onNewMessage, offNewMessage, isConnected } = useSocket();
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (exchangeId && isConnected) {
      joinExchangeRoom(exchangeId);

      const handleNewMessage = (message: Message) => {
        if (message.exchangeId === exchangeId) {
          setLocalMessages(prev => [...prev, message]);
        }
      };

      onNewMessage(handleNewMessage);

      return () => {
        offNewMessage(handleNewMessage);
        leaveExchangeRoom(exchangeId);
      };
    }
  }, [exchangeId, isConnected, joinExchangeRoom, leaveExchangeRoom, onNewMessage, offNewMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content: string) => {
    if (content.trim() && user) {
      // Message will be added via socket event
      // The actual sending is handled by MessageForm component
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {localMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          localMessages.map((message) => (
            <MessageComponent
              key={message._id}
              message={message}
              isOwn={message.sender === user?._id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="px-4 py-2 bg-yellow-100 border-t border-yellow-200">
          <p className="text-sm text-yellow-800 text-center">
            🔌 Reconnecting to chat...
          </p>
        </div>
      )}

      {/* Message Form */}
      <div className="border-t border-gray-200 bg-white">
        <MessageForm
          exchangeId={exchangeId}
          onMessageSent={handleSendMessage}
          disabled={!isConnected}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
