'use client';

import React from "react"

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800">
              {mode === 'login' ? 'Welcome Back!' : 'Join Us!'}
            </h2>
            <p className="text-slate-500 font-medium">
              {mode === 'login' ? 'Login to your account' : 'Create your free account'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 ml-1">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Superhero Name"
                className="h-12 rounded-xl border-2 border-slate-100 focus:border-purple-400"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className="h-12 rounded-xl border-2 border-slate-100 focus:border-blue-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 rounded-xl border-2 border-slate-100 focus:border-blue-400"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-secondary text-white font-bold rounded-xl mt-4 shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Login 🚀' : 'Create Account ✨')}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm font-bold text-blue-500 hover:underline underline-offset-4"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
