import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { MqttClient } from 'mqtt';
import type { Message, Subscription, SensorData, LEDState, User } from './types';

import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

declare const mqtt: any; // Using mqtt from CDN

const defaultSensorData: SensorData = {
  temperature: 0,
  humidity: 0,
  timestamp: new Date().toISOString(),
};

const defaultLEDs: LEDState[] = [
  { id: 'led1', name: 'LED Device', status: false, brightness: 50, lastToggled: new Date().toISOString() },
];

const MAX_HISTORY_LENGTH = 100; // Store last 100 data points for the chart

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([]);
  const [ledStates, setLedStates] = useState<LEDState[]>(defaultLEDs);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [topicSettings, setTopicSettings] = useState<TopicSettings>({
    temperature: 'haadziq/suhu',
    humidity: 'haadziq/kelembapan',
    sensorData: 'haadziq/sensor_data',
    ledCommand: 'haadziq/led1/command',
    ledStatus: 'haadziq/led1/status'
  });
  
  const clientRef = useRef<MqttClient | null>(null);

  const handleSubscribe = useCallback((topic: string, qos: number, client: MqttClient) => {
    if (client && client.connected) {
      // Avoid duplicate subscriptions
     if (subscriptions.some(s => s.topic === topic)) return;

      client.subscribe(topic, { qos: qos as 0 | 1 | 2 }, (err: any, granted: any) => {
        if (err) {
          console.error('Subscribe error: ', err);
          return;
        }
        console.log('✅ Successfully subscribed to: ', granted);
        setSubscriptions((prev) => {
          const updated = [...prev, { topic, qos }];
          console.log('📋 Active subscriptions:', updated.map(s => s.topic));
          return updated;
        });
      });
    }
  }, [subscriptions]);

  const handleConnect = useCallback((protocol: string, host: string, port: string, path: string, options: any) => {
    setConnectionStatus('Connecting');
    const url = `${protocol}${host}:${port}${path}`;
    
    try {
      clientRef.current = mqtt.connect(url, options);
    } catch(error: any) {
       setConnectionStatus(`Error: ${error.message}`);
       return;
    }
    
    const client = clientRef.current;
    if (!client) return;

    client.on('connect', () => {
      setConnectionStatus('Connected');
       // Auto-subscribe to haadziq topics
       handleSubscribe('haadziq/#', 0, client);
       // Auto-subscribe to configured topics
       handleSubscribe(topicSettings.temperature, 0, client);
       handleSubscribe(topicSettings.humidity, 0, client);
       handleSubscribe(topicSettings.sensorData, 0, client);
       handleSubscribe(topicSettings.ledStatus, 0, client);
       handleSubscribe(topicSettings.ledCommand, 0, client);
    });

    client.on('error', (err: Error) => {
      client.end();
      setConnectionStatus(`Error: ${err.message}`);
    });

    client.on('reconnect', () => {
      setConnectionStatus('Reconnecting');
    });
    
    client.on('close', () => {
      setConnectionStatus('Disconnected');
    });

    client.on('message', (topic: string, message: { toString(): string }, packet: any) => {
      const payloadString = message.toString();
      
      // Always add to messages (don't filter published messages)
      const newMessage: Message = {
        topic,
        payload: payloadString,
        qos: packet.qos,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Handle haadziq sensor data
      if (topic.startsWith('haadziq/')) {
        const subTopic = topic.substring('haadziq/'.length);
        // Handle individual sensor values
        const tempTopicName = topicSettings.temperature.substring('haadziq/'.length);
        if (subTopic === tempTopicName || subTopic === 'suhu' || subTopic === 'temperature') {
          const value = parseFloat(payloadString.trim());
          if (!isNaN(value)) {
            const timestamp = new Date().toISOString();
            setSensorData(prev => {
              const currentData = prev || defaultSensorData;
              const updated = { 
                temperature: value, 
                humidity: currentData.humidity, // Keep existing humidity
                timestamp 
              };
              setSensorHistory(prevHistory => {
                const newHistory = [...prevHistory, updated];
                return newHistory.length > MAX_HISTORY_LENGTH ? newHistory.slice(1) : newHistory;
              });
              return updated;
            });
          }
        }
        
        const humidityTopicName = topicSettings.humidity.substring('haadziq/'.length);
        if (subTopic === humidityTopicName || subTopic === 'kelembapan' || subTopic === 'humidity') {
          const value = parseFloat(payloadString.trim());
          if (!isNaN(value)) {
            const timestamp = new Date().toISOString();
            setSensorData(prev => {
              const currentData = prev || defaultSensorData;
              const updated = { 
                temperature: currentData.temperature, // Keep existing temperature
                humidity: value, 
                timestamp 
              };
              setSensorHistory(prevHistory => {
                const newHistory = [...prevHistory, updated];
                return newHistory.length > MAX_HISTORY_LENGTH ? newHistory.slice(1) : newHistory;
              });
              return updated;
            });
          }
        }
        
        // Handle LED control topics (both status and command for feedback)
        if (subTopic.startsWith('led') && (subTopic.includes('/status') || subTopic.includes('/command'))) {
          const ledId = subTopic.split('/')[0];
          
          let parsedStatus: any = {};
          const trimmedPayload = payloadString.trim();
          
          // First, check if it's a simple boolean/number string
          const lowerPayload = trimmedPayload.toLowerCase();
          
          if (lowerPayload === 'true' || lowerPayload === 'on' || lowerPayload === '1') {
            parsedStatus = { status: true };
          } else if (lowerPayload === 'false' || lowerPayload === 'off' || lowerPayload === '0') {
            parsedStatus = { status: false };
          } else {
            // Try to parse as number (brightness)
            const numValue = parseFloat(trimmedPayload);
            if (!isNaN(numValue)) {
              if (numValue >= 0 && numValue <= 100) {
                parsedStatus = { brightness: numValue, status: numValue > 0 };
              } else {
                parsedStatus = { status: numValue > 0 };
              }
            } else {
              // Finally, try to parse as JSON
              try {
                parsedStatus = JSON.parse(trimmedPayload);
              } catch (e) {
                // Could not parse payload
              }
            }
          }
          
          // Update LED state if we have valid parsed status
          if (Object.keys(parsedStatus).length > 0) {
            setLedStates(prev => {
              const updated = prev.map(led => {
                if (led.id === ledId) {
                  return { 
                    ...led, 
                    ...parsedStatus, 
                    lastToggled: new Date().toISOString() 
                  };
                } else {
                  return { ...led };
                }
              });
              // Force a different array reference
              setForceUpdate(prev => prev + 1);
              return [...updated];
            });
          }
        }
        
        // Handle complete sensor data JSON
        const sensorDataTopicName = topicSettings.sensorData.substring('haadziq/'.length);
        if (subTopic === sensorDataTopicName || subTopic === 'sensor_data' || subTopic === 'data') {
          try {
            const data = JSON.parse(payloadString.trim());
            if (data && (typeof data.temperature !== 'undefined' || typeof data.humidity !== 'undefined' || typeof data.suhu !== 'undefined' || typeof data.kelembapan !== 'undefined')) {
              const timestamp = data.timestamp || new Date().toISOString();
              
              // Map Indonesian field names to English
              const mappedData = {
                temperature: data.temperature !== undefined ? parseFloat(data.temperature) : 
                           data.suhu !== undefined ? parseFloat(data.suhu) : 0,
                humidity: data.humidity !== undefined ? parseFloat(data.humidity) : 
                         data.kelembapan !== undefined ? parseFloat(data.kelembapan) : 0,
                timestamp
              };
              setSensorData(mappedData);
              setSensorHistory(prevHistory => {
                const newHistory = [...prevHistory, mappedData];
                return newHistory.length > MAX_HISTORY_LENGTH ? newHistory.slice(1) : newHistory;
              });
            }
          } catch (e) {
            // Could not parse sensor JSON data
          }
        }
        
        // Also try to parse any JSON payload that looks like sensor data
        else {
          try {
            const data = JSON.parse(payloadString.trim());
            if (data && (typeof data.suhu !== 'undefined' || typeof data.kelembapan !== 'undefined' || typeof data.temperature !== 'undefined' || typeof data.humidity !== 'undefined')) {
              const timestamp = data.timestamp || new Date().toISOString();
              
              const mappedData = {
                temperature: data.temperature !== undefined ? parseFloat(data.temperature) : 
                           data.suhu !== undefined ? parseFloat(data.suhu) : 0,
                humidity: data.humidity !== undefined ? parseFloat(data.humidity) : 
                         data.kelembapan !== undefined ? parseFloat(data.kelembapan) : 0,
                timestamp
              };
              setSensorData(mappedData);
              setSensorHistory(prevHistory => {
                const newHistory = [...prevHistory, mappedData];
                return newHistory.length > MAX_HISTORY_LENGTH ? newHistory.slice(1) : newHistory;
              });
            }
          } catch (e) {
            // Not JSON, ignore silently
          }
        }
      } // Close haadziq topic processing
    });
  }, [handleSubscribe, topicSettings]);

  const handleDisconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.end();
      clientRef.current = null;
    }
    setConnectionStatus('Disconnected');
    setSubscriptions([]);
    setSensorData(null);
    setSensorHistory([]);
    setLedStates(defaultLEDs); // Reset to default state
  }, []);

  const handlePublish = useCallback((topic: string, message: string, qos: number) => {
    if (clientRef.current) {
      clientRef.current.publish(topic, message, { qos });
    }
  }, []);

  const handleTopicsChange = useCallback((newTopics: TopicSettings) => {
    setTopicSettings(newTopics);
  }, []);

  const handleUnsubscribe = useCallback((topic: string) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.unsubscribe(topic, (err: any) => {
        if (!err) {
          setSubscriptions((prev) => prev.filter((sub) => sub.topic !== topic));
        }
      });
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const handleToggleLED = useCallback((ledId: string) => {
    const led = ledStates.find(l => l.id === ledId);
    if (led && clientRef.current && clientRef.current.connected) {
      const newStatus = !led.status;
      const command = {
        status: newStatus,
        brightness: led.brightness
      };
      
      handlePublish(topicSettings.ledCommand, JSON.stringify(command), 0, false);
      
      // Optimistically update local state
      setLedStates(prev => {
        const updated = prev.map(l => 
          l.id === ledId 
            ? { ...l, status: newStatus, lastToggled: new Date().toISOString() }
            : { ...l }
        );
        console.log(`🔄 Optimistic update for ${ledId}:`, updated);
        return [...updated];
      });
    }
  }, [ledStates, handlePublish]);

  const handleSetLEDBrightness = useCallback((ledId: string, brightness: number) => {
    const led = ledStates.find(l => l.id === ledId);
    if (led) {
      const command = {
        status: led.status, // Keep current status
        brightness: brightness
      };
      
      handlePublish(topicSettings.ledCommand, JSON.stringify(command), 0, false);
      
      // Optimistically update local state
      setLedStates(prev => {
        return prev.map(l => l.id === ledId ? {
          ...l,
          brightness: brightness,
          lastToggled: new Date().toISOString()
        } : l);
      });
    }
  }, [ledStates, handlePublish, topicSettings]);

  const handleLogin = (username: string) => {
      setUser({ username });
  };

  const handleLogout = () => {
      handleDisconnect();
      setUser(null);
  };

  if (!user) {
      return <Login onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      {(view) => view === 'dashboard' ? (
        <Dashboard 
            key={forceUpdate}
            sensorData={sensorData} 
            sensorHistory={sensorHistory}
            ledStates={ledStates}
            isConnected={connectionStatus === 'Connected'}
            onToggleLED={handleToggleLED}
            onSetLEDBrightness={handleSetLEDBrightness}
        />
      ) : (
        <Settings 
          connect={handleConnect}
          disconnect={handleDisconnect}
          connectionStatus={connectionStatus}
          subscriptions={subscriptions}
          subscribe={(topic, qos) => handleSubscribe(topic, qos, clientRef.current!)}
          unsubscribe={handleUnsubscribe}
          publish={handlePublish}
          messages={messages}
          clearMessages={clearMessages}
          onTopicsChange={handleTopicsChange}
        />
      )}
    </DashboardLayout>
  );
}

export default App;