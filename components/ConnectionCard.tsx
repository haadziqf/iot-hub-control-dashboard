import React, { useEffect } from 'react';
import { ConnectIcon, DisconnectIcon } from './icons';

interface ConnectionCardProps {
  connect: (protocol: string, host: string, port: string, path: string, options: any) => void;
  disconnect: () => void;
  connectionStatus: string;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connect, disconnect, connectionStatus }) => {
  const [protocol, setProtocol] = React.useState('wss://');
  const [host, setHost] = React.useState('broker.avisha.id');
  const [port, setPort] = React.useState('8084');
  const [path, setPath] = React.useState('/mqtt');
  const [clientId, setClientId] = React.useState(`mqttx_${Math.random().toString(16).slice(2, 10)}`);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    if (protocol === 'wss://') {
      setPort('8084');
    } else if (protocol === 'ws://') {
      setPort('8083');
    }
  }, [protocol]);


  const isConnected = connectionStatus === 'Connected';

  const handleConnect = () => {
    connect(protocol, host, port, path, { clientId, username, password });
  };

  const statusColor =
    connectionStatus === 'Connected' ? 'bg-green-500' :
    connectionStatus === 'Connecting' ? 'bg-yellow-500' :
    'bg-red-500';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-100">Connection</h2>
        <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
            <span className="text-slate-300 text-sm font-medium">{connectionStatus}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Host</label>
          <div className="flex rounded-md shadow-sm">
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-100 text-sm focus:ring-cyan-500 focus:border-cyan-500"
              disabled={isConnected}
            >
              <option>wss://</option>
              <option>ws://</option>
            </select>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="flex-1 block w-full rounded-none rounded-r-md bg-slate-700 border border-slate-600 px-3 py-2 text-slate-100 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              placeholder="broker.avisha.id"
              disabled={isConnected}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Port</label>
          <input
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="8084"
            disabled={isConnected}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Path</label>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="/mqtt"
            disabled={isConnected}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Client ID</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            disabled={isConnected}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-400"
            disabled={isConnected}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-400"
            disabled={isConnected}
          />
        </div>
      </div>
      
      <div className="flex-grow"></div>
      
      {isConnected ? (
        <button
          onClick={disconnect}
          className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          <DisconnectIcon className="w-5 h-5 mr-2" />
          Disconnect
        </button>
      ) : (
        <button
          onClick={handleConnect}
          className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          <ConnectIcon className="w-5 h-5 mr-2" />
          Connect
        </button>
      )}
    </div>
  );
};

export default ConnectionCard;