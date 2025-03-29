
import React from 'react';
import { Bot, User } from 'lucide-react';
import { AIAction } from '@/services/aiService';

interface MessageItemProps {
  message: string;
  isAI: boolean;
  timestamp: string;
  suggestedActions?: AIAction[];
  onActionClick?: (action: AIAction) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  isAI, 
  timestamp, 
  suggestedActions,
  onActionClick
}) => {
  return (
    <div className={`rounded-lg p-3 ${isAI ? 'bg-secondary/20 border border-divider' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAI ? 'bg-primary/20' : 'bg-secondary'}`}>
          {isAI ? <Bot size={16} className="text-primary" /> : <User size={16} className="text-text-primary" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{isAI ? 'AI Assistant' : 'You'}</span>
            <span className="text-xs text-text-secondary">{timestamp}</span>
          </div>
          <div className="text-sm leading-relaxed">{message}</div>
          
          {/* Suggested Actions */}
          {isAI && suggestedActions && suggestedActions.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {suggestedActions.map((action, index) => (
                <button
                  key={index}
                  className="text-xs bg-tool-bg hover:bg-opacity-80 text-text-primary px-3 py-1.5 rounded-full transition-colors"
                  onClick={() => onActionClick && onActionClick(action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
