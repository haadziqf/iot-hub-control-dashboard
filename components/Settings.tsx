import React from 'react';
import type { Message, Subscription, TopicSettings } from '../types';

import ConnectionCard from './ConnectionCard';
import PublishCard from './PublishCard';
import SubscriptionCard from './SubscriptionCard';
import MessagesCard from './MessagesCard';
import TopicSettingsCard from './TopicSettingsCard';

interface SettingsProps {
    connect: (protocol: string, host: string, port: string, path: string, options: any) => void;
    disconnect: () => void;
    connectionStatus: string;
    subscriptions: Subscription[];
    subscribe: (topic: string, qos: number) => void;
    unsubscribe: (topic: string) => void;
    publish: (topic: string, payload: string, qos: number, retain: boolean) => void;
    messages: Message[];
    clearMessages: () => void;
    onTopicsChange: (topics: TopicSettings) => void;
}


const Settings: React.FC<SettingsProps> = ({
    connect,
    disconnect,
    connectionStatus,
    subscriptions,
    subscribe,
    unsubscribe,
    publish,
    messages,
    clearMessages,
    onTopicsChange
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">MQTT Settings</h1>
      <main className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ConnectionCard
              connect={connect}
              disconnect={disconnect}
              connectionStatus={connectionStatus}
            />
            <TopicSettingsCard onTopicsChange={onTopicsChange} />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <SubscriptionCard
              subscriptions={subscriptions}
              subscribe={subscribe}
              unsubscribe={unsubscribe}
              isConnected={connectionStatus === 'Connected'}
            />
            <PublishCard
              publish={publish}
              isConnected={connectionStatus === 'Connected'}
            />
          </div>

          {/* Right Column */}
          <div className="xl:col-span-1 lg:col-span-2 xl:col-span-1">
            <MessagesCard messages={messages} clearMessages={clearMessages} />
          </div>
        </main>
    </div>
  );
};

export default Settings;