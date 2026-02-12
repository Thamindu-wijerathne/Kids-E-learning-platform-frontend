'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/header';

export default function LoginPage() {
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
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password. Try test@gmail.com / test');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-white to-secondary/10">
            <Header />

            <section className="px-4 py-20 flex items-center justify-center">
                <div className="w-full max-w-[440px] relative">
                    {/* Decorative Elements */}
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-secondary/40 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <Card className="p-10 border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] backdrop-blur-sm bg-white/90 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>

                        <div className="mb-10 text-center relative">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                🚀
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
                                Welcome Back!!!
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Log in to continue your adventure
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-shake">
                                    <span className="text-xl">⚠️</span>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 transition-all text-lg placeholder:text-slate-300"
                                        placeholder="name@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-bold text-slate-700">
                                        Password
                                    </label>
                                    <Link href="#" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                                        Forgot?
                                    </Link>
                                </div>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-blue-400 focus:ring-0 transition-all text-lg placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-bold rounded-2xl text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Logging in...
                                    </div>
                                ) : (
                                    'Let\'s Go! 🚀'
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                            <p className="text-slate-500 font-medium">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4">
                                    Sign up for free
                                </Link>
                            </p>
                        </div>

                        {/* Demo Helper */}
                        <div className="mt-6 p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 group/demo">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Demo Access</p>
                            <div className="flex flex-col gap-2">
                                <code className="text-sm text-slate-600 font-bold flex justify-between">
                                    <span>Email:</span>
                                    <span className="text-primary">test@gmail.com</span>
                                </code>
                                <code className="text-sm text-slate-600 font-bold flex justify-between">
                                    <span>Pass:</span>
                                    <span className="text-primary">test</span>
                                </code>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </main>
    );
}
