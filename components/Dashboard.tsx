import React, { useEffect } from 'react';
import { SensorData, TemperatureLevel, HumidityLevel, LEDState } from '../types';
import { ThermometerIcon, DropletIcon, CloudIcon, WindIcon } from './icons';
import Chart from './Chart';

interface DashboardProps {
  sensorData: SensorData | null;
  sensorHistory: SensorData[];
  ledStates: LEDState[];
  isConnected: boolean;
  onToggleLED: (ledId: string) => void;
  commandFormat: 'boolean' | 'numeric';
  onCommandFormatChange: (format: 'boolean' | 'numeric') => void;
}

const getTemperatureInfo = (temp: number): { level: TemperatureLevel; textColor: string; badgeColor: string; } => {
  if (temp < 10) return { level: 'Cold', textColor: 'text-blue-400', badgeColor: 'bg-blue-500/20 text-blue-300' };
  if (temp < 18) return { level: 'Cool', textColor: 'text-cyan-400', badgeColor: 'bg-cyan-500/20 text-cyan-300' };
  if (temp < 26) return { level: 'Normal', textColor: 'text-green-400', badgeColor: 'bg-green-500/20 text-green-300' };
  if (temp < 32) return { level: 'Warm', textColor: 'text-yellow-400', badgeColor: 'bg-yellow-500/20 text-yellow-300' };
  return { level: 'Hot', textColor: 'text-red-400', badgeColor: 'bg-red-500/20 text-red-300' };
};

const getHumidityInfo = (humidity: number): { level: HumidityLevel; textColor: string; badgeColor: string; } => {
  if (humidity < 30) return { level: 'Dry', textColor: 'text-orange-400', badgeColor: 'bg-orange-500/20 text-orange-300' };
  if (humidity < 60) return { level: 'Normal', textColor: 'text-green-400', badgeColor: 'bg-green-500/20 text-green-300' };
  if (humidity < 80) return { level: 'Humid', textColor: 'text-blue-400', badgeColor: 'bg-blue-500/20 text-blue-300' };
  return { level: 'Very Humid', textColor: 'text-purple-400', badgeColor: 'bg-purple-500/20 text-purple-300' };
};

const SummaryCard: React.FC<{ title: string; value: string | number; level?: string; badgeColor?: string; unit?: string; }> = ({ title, value, level, badgeColor, unit }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
    <p className="text-sm text-slate-400 font-medium">{title}</p>
    <div className="flex items-baseline space-x-2 mt-1">
      <p className="text-3xl font-bold text-slate-100">{value}{unit && <span className="text-lg text-slate-400 ml-1">{unit}</span>}</p>
      {level && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${badgeColor}`}>{level}</span>}
    </div>
  </div>
);


const SensorCard: React.FC<{
  icon: React.ReactNode,
  name: string,
  value: number | string,
  unit: string,
}> = ({ icon, name, value, unit }) => {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center space-x-4">
            {icon}
            <div>
                <p className="text-sm text-slate-400">{name}</p>
                <p className="text-xl font-bold text-slate-100">{value}<span className="text-sm text-slate-400 font-medium ml-1">{unit}</span></p>
            </div>
        </div>
    );
};

const LEDControlCard: React.FC<{
  led: LEDState;
  onToggle: (ledId: string) => void;
  commandFormat: 'boolean' | 'numeric';
}> = ({ led, onToggle, commandFormat }) => {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        led.status ? 'bg-green-400 shadow-lg shadow-green-400/30' : 'bg-slate-600'
                    }`}>
                        <div className={`w-3 h-3 rounded-full ${
                            led.status ? 'bg-white' : 'bg-slate-400'
                        }`}></div>
                    </div>
                    <h3 className="text-lg font-medium text-slate-200">{led.name}</h3>
                </div>
                <button
                    onClick={() => onToggle(led.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        led.status 
                            ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30' 
                            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                    }`}
                >
                    {led.status ? 'ON' : 'OFF'}
                </button>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Status: {led.status ? 'Active' : 'Inactive'}</span>
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-400 font-mono">
                        {commandFormat === 'numeric' ? (led.status ? '1' : '0') : (led.status ? 'true' : 'false')}
                    </span>
                </div>
                <span className="text-xs text-slate-500">Last: {new Date(led.lastToggled).toLocaleTimeString()}</span>
            </div>
        </div>
    );
};

const DashboardSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700 h-24 rounded-lg"></div>
            <div className="bg-slate-700 h-24 rounded-lg"></div>
        </div>
        <div className="bg-slate-700 h-72 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-700 h-32 rounded-lg"></div>)}
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ sensorData, sensorHistory, ledStates, isConnected, onToggleLED, commandFormat, onCommandFormatChange }) => {
  // Force re-render when LED states change
  useEffect(() => {
    // LED states updated
  }, [ledStates]);
  
  if (!isConnected) {
    return (
        <div className="text-center py-20 bg-slate-800 border border-slate-700 rounded-lg">
            <h2 className="text-2xl font-semibold text-slate-200">IoT Hub Disconnected</h2>
            <p className="text-slate-400 mt-2 px-4">Please connect to MQTT broker in Settings to monitor sensors and control devices.</p>
        </div>
    );
  }

    // Show dashboard even if no sensor data for LED controls
  if (!sensorData) {
    // Don't return skeleton, continue to show LED controls
  }
  
  // Handle sensor data conditionally
  const hasSensorData = sensorData && !(sensorData.temperature === 0 && sensorData.humidity === 0);
  let tempInfo, humidityInfo, history24h, avgTemp24h, avgHumidity24h, lastUpdated;
  
  if (hasSensorData) {
    tempInfo = getTemperatureInfo(sensorData.temperature);
    humidityInfo = getHumidityInfo(sensorData.humidity);
    history24h = sensorHistory.filter(d => new Date(d.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000));
    avgTemp24h = history24h.length > 0 ? (history24h.reduce((sum, d) => sum + d.temperature, 0) / history24h.length).toFixed(1) : 'N/A';
    avgHumidity24h = history24h.length > 0 ? Math.round(history24h.reduce((sum, d) => sum + d.humidity, 0) / history24h.length) : 'N/A';
    lastUpdated = new Date(sensorData.timestamp).toLocaleTimeString();
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
             <h1 className="text-3xl font-bold text-slate-100">IoT Hub Control</h1>
             <p className="text-sm text-slate-500">Last updated: {hasSensorData ? lastUpdated : 'No sensor data'}</p>
        </div>
        
        {/* Environmental Summary - Only show if we have sensor data */}
        {hasSensorData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryCard 
                    title="Temperature" 
                    value={sensorData.temperature} 
                    unit="°C"
                    level={tempInfo.level} 
                    badgeColor={tempInfo.badgeColor} 
                />
                <SummaryCard 
                    title="Humidity" 
                    value={sensorData.humidity} 
                    unit="%"
                    level={humidityInfo.level} 
                    badgeColor={humidityInfo.badgeColor} 
                />
            </div>

            {/* Environmental Averages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryCard title="24h Avg Temperature" value={avgTemp24h} unit="°C" />
                <SummaryCard title="24h Avg Humidity" value={avgHumidity24h} unit="%" />
            </div>
          
            {/* Chart */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 h-80">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Environmental Trends</h3>
                <Chart data={sensorHistory} />
            </div>
          </>
        )}

        {/* Show message if no sensor data */}
        {!hasSensorData && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">No Sensor Data</h3>
            <p className="text-slate-400">Publish sensor data to see environmental monitoring. LED controls are available below.</p>
          </div>
        )}

        {/* LED Controls */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-200">Device Controls</h2>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-400">Command Format:</span>
                    <div className="flex bg-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => onCommandFormatChange('boolean')}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                commandFormat === 'boolean'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:text-slate-100'
                            }`}
                        >
                            true/false
                        </button>
                        <button
                            onClick={() => onCommandFormatChange('numeric')}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                commandFormat === 'numeric'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:text-slate-100'
                            }`}
                        >
                            1/0
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ledStates.map(led => (
                    <LEDControlCard 
                        key={`${led.id}-${led.status}-${led.lastToggled}`}
                        led={led}
                        onToggle={onToggleLED}
                        commandFormat={commandFormat}
                    />
                ))}
                {ledStates.length === 0 && (
                    <div className="col-span-full text-center py-8 bg-slate-800 border border-slate-700 rounded-lg">
                        <p className="text-slate-400">No LED devices configured</p>
                    </div>
                )}
            </div>

        </div>

        {/* Current Sensor Readings - Only show if we have sensor data */}
        {hasSensorData && (
          <div>
              <h2 className="text-xl font-semibold text-slate-200 mb-4">Current Readings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SensorCard 
                      icon={<ThermometerIcon className="w-8 h-8 text-orange-400" />} 
                      name="Temperature" 
                      value={sensorData.temperature} 
                      unit="°C" 
                  />
                  <SensorCard 
                      icon={<DropletIcon className="w-8 h-8 text-blue-400" />} 
                      name="Humidity" 
                      value={sensorData.humidity} 
                      unit="%" 
                  />
              </div>
          </div>
        )}
    </div>
  );
};

export default Dashboard;