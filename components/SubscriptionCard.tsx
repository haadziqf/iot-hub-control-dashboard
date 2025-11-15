import React, { useState } from 'react';
import { Subscription } from '../types';
import { SubscribeIcon, UnsubscribeIcon } from './icons';

interface SubscriptionCardProps {
  subscriptions: Subscription[];
  subscribe: (topic: string, qos: number) => void;
  unsubscribe: (topic: string) => void;
  isConnected: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscriptions, subscribe, unsubscribe, isConnected }) => {
  const [topic, setTopic] = useState('haadziq/#');
  const [qos, setQos] = useState(0);

  const handleSubscribe = () => {
    if (topic) {
      subscribe(topic, qos);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 space-y-4 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-slate-100">Subscriptions</h2>
      
      {/* Quick Subscribe Templates */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Quick Subscribe</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => {
              setTopic('haadziq/led1/status');
              subscribe('haadziq/led1/status', 0);
            }}
            disabled={!isConnected}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white text-xs py-1 px-2 rounded transition"
          >
            LED1 Status
          </button>
          <button
            onClick={() => {
              setTopic('haadziq/led2/status');
              subscribe('haadziq/led2/status', 0);
            }}
            disabled={!isConnected}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white text-xs py-1 px-2 rounded transition"
          >
            LED2 Status
          </button>
          <button
            onClick={() => {
              setTopic('haadziq/+/command');
              subscribe('haadziq/+/command', 0);
            }}
            disabled={!isConnected}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white text-xs py-1 px-2 rounded transition"
          >
            All Commands
          </button>
          <button
            onClick={() => {
              setTopic('haadziq/+/status');
              subscribe('haadziq/+/status', 0);
            }}
            disabled={!isConnected}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white text-xs py-1 px-2 rounded transition"
          >
            All Status
          </button>
        </div>
      </div>
      
      <div className="flex items-end space-x-2">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-slate-300 mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="haadziq/#"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">QoS</label>
          <select
            value={qos}
            onChange={(e) => setQos(Number(e.target.value))}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            title="Select QoS level"
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={!isConnected}
          className="flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
          title="Subscribe to topic"
        >
          <SubscribeIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-grow bg-slate-900 rounded-md p-2 space-y-2 overflow-y-auto min-h-[100px] border border-slate-700">
        {subscriptions.length === 0 && (
          <p className="text-slate-500 text-center text-sm py-4">No active subscriptions</p>
        )}
        {subscriptions.map((sub, index) => (
          <div key={index} className="flex justify-between items-center bg-slate-800 p-2 rounded-md border border-slate-700">
            <div>
              <p className="text-slate-200 font-mono text-sm">{sub.topic}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold bg-slate-600 text-slate-200 px-2 py-1 rounded-full">QoS {sub.qos}</span>
              <button 
                onClick={() => unsubscribe(sub.topic)} 
                className="text-red-400 hover:text-red-500"
                title={`Unsubscribe from ${sub.topic}`}
              >
                <UnsubscribeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionCard;