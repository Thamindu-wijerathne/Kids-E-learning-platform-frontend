'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/header';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password. Try test@gmail.com / test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-blue-50">
      <Header />

      <section className="px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-xl">
            <div className="mb-8 text-center">
              <div className="text-6xl mb-4">👤</div>
              <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back!</h1>
              <p className="text-foreground/70">Sign in to continue your learning journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="test@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="test"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-xl text-lg"
              >
                {isLoading ? 'Signing In...' : 'Sign In 🚀'}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm font-semibold text-foreground mb-2">Demo Credentials:</p>
              <p className="text-sm text-foreground/70">Email: <span className="font-mono font-bold">test@gmail.com</span></p>
              <p className="text-sm text-foreground/70">Password: <span className="font-mono font-bold">test</span></p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
