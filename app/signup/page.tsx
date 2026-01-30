'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/header';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signup(name, email, password);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-white to-secondary/10">
            <Header />

            <section className="px-4 py-16 flex items-center justify-center">
                <div className="w-full max-w-[480px] relative">
                    {/* Decorative Elements */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/30 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

                    <Card className="p-10 border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] backdrop-blur-sm bg-white/95 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary via-primary to-secondary"></div>

                        <div className="mb-10 text-center relative">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl text-5xl mb-6 shadow-inner transform group-hover:rotate-12 transition-transform duration-500">
                                ✨
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
                                Create Account
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Join our community of happy learners
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-shake">
                                    <span className="text-xl">⚠️</span>
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Your Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 transition-all text-lg placeholder:text-slate-300"
                                        placeholder="Superhero Name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 transition-all text-lg placeholder:text-slate-300"
                                        placeholder="name@email.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Create Password
                                    </label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 transition-all text-lg placeholder:text-slate-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-bold rounded-2xl text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        'Join the Adventure! ✨'
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                            <p className="text-slate-500 font-medium">
                                Already have an account?{' '}
                                <Link href="/login" className="text-secondary-foreground font-bold hover:underline underline-offset-4 bg-secondary/20 px-2 rounded">
                                    Log in here
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] px-8">
                                By joining, you agree to have maximum fun and learning!
                            </p>
                        </div>
                    </Card>
                </div>
            </section>
        </main>
    );
}
