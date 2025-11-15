import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { ClearIcon } from './icons';

interface MessagesCardProps {
  messages: Message[];
  clearMessages: () => void;
}

const MessagesCard: React.FC<MessagesCardProps> = ({ messages, clearMessages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-100">Messages</h2>
        <button
          onClick={clearMessages}
          className="flex items-center text-sm text-slate-400 hover:text-slate-100"
        >
          <ClearIcon className="w-4 h-4 mr-1" />
          Clear
        </button>
      </div>
      <div className="flex-grow bg-slate-900 rounded-md p-2 overflow-y-auto space-y-2 border border-slate-700">
        {messages.length === 0 && (
            <p className="text-slate-500 text-center text-sm py-4">Waiting for messages...</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className="bg-slate-800 p-3 rounded-md border border-slate-700">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span className="font-mono bg-slate-600 px-2 py-0.5 rounded">{msg.topic}</span>
              <span className="font-mono">{msg.timestamp}</span>
            </div>
            <pre className="text-slate-200 font-mono text-sm whitespace-pre-wrap break-all">{msg.payload}</pre>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesCard;