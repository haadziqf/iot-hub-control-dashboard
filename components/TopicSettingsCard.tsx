import React, { useState, useEffect } from 'react';
import { TopicSettings } from '../types';

interface TopicSettingsCardProps {
  onTopicsChange: (topics: TopicSettings) => void;
}

const defaultTopics: TopicSettings = {
  temperature: 'haadziq/suhu',
  humidity: 'haadziq/kelembapan',
  sensorData: 'haadziq/sensor_data',
  ledCommand: 'haadziq/led1/command',
  ledStatus: 'haadziq/led1/status'
};

const TopicSettingsCard: React.FC<TopicSettingsCardProps> = ({ onTopicsChange }) => {
  const [topics, setTopics] = useState<TopicSettings>(() => {
    const saved = localStorage.getItem('mqtt-topics');
    return saved ? JSON.parse(saved) : defaultTopics;
  });

  useEffect(() => {
    localStorage.setItem('mqtt-topics', JSON.stringify(topics));
    onTopicsChange(topics);
  }, [topics, onTopicsChange]);

  const handleTopicChange = (key: keyof TopicSettings, value: string) => {
    setTopics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    setTopics(defaultTopics);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Topic Configuration</h3>
        <button
          onClick={resetToDefaults}
          className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded transition-colors"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="space-y-4">
        {/* Sensor Topics */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">📊 Sensor Topics</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Temperature Topic</label>
              <input
                type="text"
                value={topics.temperature}
                onChange={(e) => handleTopicChange('temperature', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="haadziq/suhu"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Humidity Topic</label>
              <input
                type="text"
                value={topics.humidity}
                onChange={(e) => handleTopicChange('humidity', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="haadziq/kelembapan"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Complete Sensor Data Topic</label>
              <input
                type="text"
                value={topics.sensorData}
                onChange={(e) => handleTopicChange('sensorData', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="haadziq/sensor_data"
              />
            </div>
          </div>
        </div>

        {/* LED Topics */}
        <div className="border-t border-slate-700 pt-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">💡 LED Device Topics</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">LED Command Topic</label>
              <input
                type="text"
                value={topics.ledCommand}
                onChange={(e) => handleTopicChange('ledCommand', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="haadziq/led1/command"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">LED Status Topic</label>
              <input
                type="text"
                value={topics.ledStatus}
                onChange={(e) => handleTopicChange('ledStatus', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                placeholder="haadziq/led1/status"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-slate-900 border border-slate-600 rounded p-3 text-xs text-slate-400">
          <p className="mb-1">ℹ️ <strong>Topic Configuration:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>Topics will be automatically subscribed when connected</li>
            <li>LED commands will be published to the command topic</li>
            <li>Status updates will be received from the status topic</li>
            <li>Changes are saved automatically to local storage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopicSettingsCard;