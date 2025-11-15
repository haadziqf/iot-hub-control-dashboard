import React, { useState } from 'react';
import { PublishIcon } from './icons';

interface PublishCardProps {
  publish: (topic: string, payload: string, qos: number, retain: boolean) => void;
  isConnected: boolean;
}

const PublishCard: React.FC<PublishCardProps> = ({ publish, isConnected }) => {
  const [topic, setTopic] = useState('haadziq/data');
  const [qos, setQos] = useState(0);
  const [retain, setRetain] = useState(false);
  const samplePayload = {
    suhu: 28.7,
    kelembapan: 43,
    timestamp: new Date().toISOString()
  };
  const [payload, setPayload] = useState(JSON.stringify(samplePayload, null, 2));

  const handlePublish = () => {
    publish(topic, payload, qos, retain);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-slate-100">Publish</h2>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          placeholder="e.g., haadziq/suhu"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
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
        <div className="flex items-end pb-2">
            <div className="flex items-center">
                <input
                    id="retain"
                    type="checkbox"
                    checked={retain}
                    onChange={(e) => setRetain(e.target.checked)}
                    className="h-4 w-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                />
                <label htmlFor="retain" className="ml-2 text-sm text-slate-300">Retain</label>
            </div>
        </div>
      </div>
      
      {/* Quick Templates */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Quick Templates</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => {
              setTopic('haadziq/suhu');
              setPayload((Math.random() * 15 + 20).toFixed(1));
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs py-1 px-2 rounded transition"
          >
            Suhu
          </button>
          <button
            onClick={() => {
              setTopic('haadziq/kelembapan');  
              setPayload((Math.random() * 40 + 40).toFixed(0));
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition"
          >
            Kelembapan
          </button>
          <button
            onClick={() => {
              setTopic('haadziq/led1/command');
              setPayload('true');
            }}
            className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition"
          >
            LED1 ON
          </button>
          <button
            onClick={() => {
              setTopic('haadziq/led2/command');
              setPayload('false');
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition"
          >
            LED2 OFF
          </button>
          <button
            onClick={() => {
              setTopic('haadziq/led3/command');
              setPayload('80');
            }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1 px-2 rounded transition"
          >
            LED3 80%
          </button>
          <button
            onClick={() => {
              setTopic('haadziq/led1/command');
              setPayload(JSON.stringify({status: true, brightness: 75}, null, 2));
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded transition"
          >
            JSON Format
          </button>
          <button
            onClick={() => {
              setTopic('haadziq/data');
              const data = {
                suhu: parseFloat((Math.random() * 15 + 20).toFixed(1)),
                kelembapan: Math.floor(Math.random() * 40 + 40),
                timestamp: new Date().toISOString()
              };
              setPayload(JSON.stringify(data, null, 2));
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded transition"
          >
            Data JSON
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Payload</label>
        <textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          rows={8}
          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          placeholder="Enter JSON or a single value"
        ></textarea>
      </div>
      
      <button
        onClick={handlePublish}
        disabled={!isConnected}
        className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        <PublishIcon className="w-5 h-5 mr-2" />
        Publish
      </button>
    </div>
  );
};

export default PublishCard;