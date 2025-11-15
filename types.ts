export interface Message {
  topic: string;
  payload: string;
  qos: number;
  timestamp: string;
}

export interface Subscription {
  topic: string;
  qos: number;
}

export type TemperatureLevel = 'Cold' | 'Cool' | 'Normal' | 'Warm' | 'Hot';
export type HumidityLevel = 'Dry' | 'Normal' | 'Humid' | 'Very Humid';

export interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface LEDState {
  id: string;
  name: string;
  status: boolean;
  brightness?: number;
  color?: string;
  lastToggled: string;
}

export interface IoTDeviceStatus {
  deviceId: string;
  isOnline: boolean;
  lastSeen: string;
  batteryLevel?: number;
}

export interface User {
  username: string;
}

export interface TopicSettings {
  temperature: string;
  humidity: string;
  sensorData: string;
  ledCommand: string;
  ledStatus: string;
}