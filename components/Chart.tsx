import React from 'react';
import { SensorData } from '../types';

interface ChartProps {
  data: SensorData[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  if (data.length < 2) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500">
        <p>Waiting for more sensor data to render the chart...</p>
      </div>
    );
  }

  const width = 500; // SVG viewBox width
  const height = 200; // SVG viewBox height
  const padding = 20;

  const maxTemp = Math.max(...data.map(d => d.temperature), 30); // Ensure a minimum height
  const minTemp = Math.min(...data.map(d => d.temperature), 0);

  const getX = (index: number) => {
    return (index / (data.length - 1)) * (width - padding * 2) + padding;
  };

  const getY = (temp: number) => {
    return height - padding - ((temp - minTemp) / (maxTemp - minTemp)) * (height - padding * 2);
  };
  
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.temperature)}`).join(' ');

  const areaPath = `${linePath} V ${height - padding} H ${padding} Z`;

  // Y-axis labels
  const yLabels = [minTemp, Math.round((maxTemp + minTemp) / 2), maxTemp];

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0, 180, 255, 0.3)" />
                <stop offset="100%" stopColor="rgba(0, 180, 255, 0)" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#38bdf8" />
                 <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
        </defs>

        {/* Y-axis grid lines and labels */}
        {yLabels.map(label => (
            <g key={label} className="text-slate-600">
                <line 
                    x1={padding} 
                    y1={getY(label)} 
                    x2={width - padding} 
                    y2={getY(label)} 
                    stroke="currentColor" 
                    strokeWidth="0.5" 
                    strokeDasharray="2, 5"
                />
                <text 
                    x={padding - 5}
                    y={getY(label)}
                    dy="0.3em" 
                    textAnchor="end"
                    className="text-[10px] fill-current"
                >
                    {label}
                </text>
            </g>
        ))}

        {/* Data line */}
        <path d={linePath} fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Data area */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Current Value Point */}
        {data.length > 0 && (
            <g>
                <circle 
                    cx={getX(data.length - 1)} 
                    cy={getY(data[data.length - 1].temperature)} 
                    r="4" 
                    fill="#38bdf8"
                    stroke="#1e293b"
                    strokeWidth="2"
                />
            </g>
        )}
      </svg>
    </div>
  );
};

export default Chart;