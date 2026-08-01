import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useSocket } from '../../../hooks/useSocket';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../ui/Button/Button';

interface MessageFormProps {
  exchangeId: string;
  onMessageSent?: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageForm: React.FC<MessageFormProps> = ({
  exchangeId,
  onMessageSent,
  disabled = false,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage } = useSocket();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled || !user) {
      return;
    }

    setIsLoading(true);
    
    try {
      sendMessage(exchangeId, message.trim());
      onMessageSent?.(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cf-dark-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              minHeight: '40px',
              maxHeight: '120px',
            }}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || disabled || isLoading}
          isLoading={isLoading}
          size="sm"
          className="px-3 py-2"
        >
          <Send size={16} />
        </Button>
      </div>
      
      {disabled && (
        <p className="text-xs text-gray-500 mt-1">
          Chat is currently unavailable
        </p>
      )}
    </form>
  );
};

export default MessageForm;
