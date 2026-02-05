'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/header';
import { useEffect } from 'react';

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (!user) {
    return null;
  }

  const stats = [
    { label: 'Games Played', value: '24', icon: '🎮' },
    { label: 'Total Score', value: '8,450', icon: '⭐' },
    { label: 'Badges Earned', value: '12', icon: '🏅' },
    { label: 'Learning Streak', value: '15 days', icon: '🔥' },
  ];

  const recentAchievements = [
    { badge: '🥇', title: 'Speed Master', description: 'Completed 5 games in one day' },
    { badge: '🎯', title: 'Perfect Score', description: 'Got 100% in Letter Trace' },
    { badge: '🚀', title: 'Rising Star', description: 'Reached level 10' },
    { badge: '🧠', title: 'Brain Genius', description: 'Solved 50 puzzles' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <Card className="p-8 mb-8 shadow-lg bg-gradient-to-r from-primary to-secondary text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-9xl">{user.avatar}</div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
              <p className="text-xl text-white/90 mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-accent hover:brightness-110 text-accent-foreground font-bold rounded-xl">
                  Edit Profile ✏️
                </Button>
                <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white font-bold rounded-xl">
                  Settings ⚙️
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-3">{stat.icon}</div>
              <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-foreground/70 font-semibold">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Recent Achievements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Recent Achievements 🎉</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentAchievements.map((achievement, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow transform hover:scale-105">
                <div className="text-6xl mb-4">{achievement.badge}</div>
                <h3 className="font-bold text-lg text-foreground mb-2">{achievement.title}</h3>
                <p className="text-sm text-foreground/70">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Stats */}
        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6">Learning Statistics</h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-foreground">Overall Progress</span>
                <span className="text-primary font-bold">75%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-foreground">Letter Trace Mastery</span>
                <span className="text-primary font-bold">90%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-foreground">Shape Matching Skills</span>
                <span className="text-primary font-bold">60%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-foreground">Number Quest Adventure</span>
                <span className="text-primary font-bold">45%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
