'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/axios';

export default function ChatPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // WebSocket connection
    useEffect(() => {
        
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL + "/chat/ws/public";
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);
            // Ensure unique ID to prevent duplicate key warnings
            const newMessage = {
                ...data,
                id: data.id || `ws-${Date.now()}-${Math.random()}`,
                timestamp: data.timestamp || 'Just now'
            };
            setMessages((prev) => [...prev, newMessage]);
        };

        ws.onopen = () => console.log("✅ WebSocket connected");
        ws.onclose = () => console.log("❌ WebSocket closed");
        ws.onerror = (e) => console.error("🔴 WebSocket error:", e);

        return () => ws.close();
    }, []);

    // get old masseges
    useEffect(() => {
        const load = async () => {
            const res = await api.get("/chat/public/history?limit=100");
            setMessages(res.data); // must match your UI shape or map it
        };
        load();
    }, []);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const userAvatar = localStorage.getItem('bitzify_avatar') || '🐱';

        // Send via WebSocket
        const messageData = {
            user: user?.name || 'You',
            avatar: userAvatar,
            message: newMessage,
        };

        wsRef.current.send(JSON.stringify(messageData));
        setNewMessage('');
    };


    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading chat...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                        Global Chat 💬
                    </h1>
                    <p className="text-xl text-foreground/70 font-medium">
                        Connect with players from around the world! 🌍✨
                    </p>
                </div>

                {/* Chat Container */}
                <Card className="h-[600px] flex flex-col shadow-2xl border-2 border-primary/20 overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="font-bold text-lg">Online Players: 127</span>
                            </div>
                            <span className="text-sm opacity-80">🌟 Be kind and have fun!</span>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background/50 to-secondary/5">
                        {messages.map((msg, index) => {
                            // Check if this message is from the current user
                            const isOwnMessage = msg.senderName === user?.name || msg.isOwn;

                            return (
                                <div
                                    key={msg.id || index}
                                    className={`flex gap-3 items-start ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl shadow-lg transform hover:scale-110 transition-transform">
                                            {msg.avatar}
                                        </div>
                                    </div>

                                    {/* Message Content */}
                                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm text-foreground/80">{msg.senderName}</span>
                                            <span className="text-xs text-foreground/50">{msg.timestamp || 'Just now'}</span>
                                        </div>
                                        <div
                                            className={`px-4 py-3 rounded-2xl shadow-md ${isOwnMessage
                                                ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-sm'
                                                : 'bg-white border-2 border-primary/10 text-foreground rounded-tl-sm'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.message}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t-2 border-primary/10">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                            <Input
                                type="text"
                                placeholder="Type your message... 💭"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 text-base px-4 py-6 rounded-xl border-2 border-primary/20 focus:ring-4 focus:ring-primary/20 transition-all"
                                maxLength={200}
                            />
                            <Button
                                type="submit"
                                className="px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all"
                            >
                                Send 🚀
                            </Button>
                        </form>
                        <div className="text-xs text-foreground/50 mt-2 text-center">
                            Remember: Be respectful and friendly to everyone! 💖
                        </div>
                    </div>
                </Card>

                {/* Fun Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <Card className="p-4 text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20 hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-2">💬</div>
                        <div className="text-2xl font-bold text-primary">2,547</div>
                        <div className="text-sm text-foreground/70 font-medium">Messages Today</div>
                    </Card>
                    <Card className="p-4 text-center bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20 hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-2">👥</div>
                        <div className="text-2xl font-bold text-secondary">127</div>
                        <div className="text-sm text-foreground/70 font-medium">Players Online</div>
                    </Card>
                    <Card className="p-4 text-center bg-gradient-to-br from-accent/5 to-transparent border-accent/20 hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-2">🌟</div>
                        <div className="text-2xl font-bold text-primary">98%</div>
                        <div className="text-sm text-foreground/70 font-medium">Friendly Vibes</div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
