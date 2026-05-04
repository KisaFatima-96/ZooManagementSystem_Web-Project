import React, { useState } from 'react';
import { PawPrint, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        navigate('/');
    } catch (err) {
        alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534567153574-2b12153a87f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
      <div className="glass max-w-md w-full p-10 rounded-[2rem] text-center">
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white/30">
          <PawPrint size={40} className="text-accent" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">ZooAdmin</h2>
        <p className="text-gray-500 mb-8">Management Portal Login</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Admin Email" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary py-4 text-lg font-bold mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
