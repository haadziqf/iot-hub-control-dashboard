import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded authentication for demonstration
    if (username === 'admin' && password === 'password') {
      setError('');
      onLogin(username);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-slate-100 mb-2">
              IoT Hub Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Please sign in to access the dashboard.</p>
        </div>

        <form 
            onSubmit={handleLogin}
            className="bg-slate-800 border border-slate-700 shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow-sm bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow-sm bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <p className="text-xs text-slate-500 mt-2">Hint: admin / password</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-md mb-4 text-center">
                {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
                <p className="text-xs text-slate-500">
          &copy;2025 IoT Hub Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;