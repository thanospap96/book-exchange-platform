import React from 'react';
import { Message as MessageType } from '../../../types/exchange';
import { cn } from '../../../utils/cn';

interface MessageProps {
  message: MessageType;
  isOwn: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwn }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex max-w-xs lg:max-w-md', isOwn ? 'flex-row-reverse' : 'flex-row')}>
        {/* Avatar */}
        <div className={cn('flex-shrink-0', isOwn ? 'ml-2' : 'mr-2')}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {message.senderDetails?.avatar ? (
              <img
                src={message.senderDetails.avatar}
                alt={message.senderDetails.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-gray-600">
                {message.senderDetails?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
          {/* Sender Name */}
          {!isOwn && (
            <div className="mb-1">
              <span className="text-xs font-medium text-gray-600">
                {message.senderDetails?.username || 'Unknown User'}
              </span>
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={cn(
              'px-4 py-2 rounded-lg',
              isOwn
                ? 'bg-cf-dark-red text-white rounded-br-sm'
                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
            )}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>

          {/* Timestamp */}
          <div className={cn('mt-1', isOwn ? 'text-right' : 'text-left')}>
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
