'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/header';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/user-context';
import CustomizationDialog from '@/components/profile/CustomizationDialog';
import { updateCustomizations, getUserProfile } from '@/services/user-service';

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { user: profileData } = useUser();
  const router = useRouter();

  const [selectedAvatar, setSelectedAvatar] = useState<string>('🐱');
  const [selectedTheme, setSelectedTheme] = useState<string>('from-primary to-secondary');
  const [selectedPattern, setSelectedPattern] = useState<string>('none');

  useEffect(() => {
    // 1. Load from localStorage for instant feedback
    const savedAvatar = localStorage.getItem('bitzify_avatar');
    const savedTheme = localStorage.getItem('bitzify_theme');
    const savedPattern = localStorage.getItem('bitzify_pattern');
    if (savedPattern) setSelectedPattern(savedPattern);

    // 2. Fetch from backend to ensure state is fresh
    const syncBackend = async () => {
      try {
        const profile = await getUserProfile();
        if (profile.customizations) {
          const { avatar, theme, pattern, effect } = profile.customizations;
          if (avatar) {
            setSelectedAvatar(avatar);
            localStorage.setItem('bitzify_avatar', avatar);
          }
          if (theme) {
            setSelectedTheme(theme);
            localStorage.setItem('bitzify_theme', theme);
          }
          if (pattern) {
            setSelectedPattern(pattern);
            localStorage.setItem('bitzify_pattern', pattern);
          }
        }
      } catch (error) {
        console.error("Failed to sync profile from backend:", error);
      }
    };

    if (isAuthenticated) {
      syncBackend();
    }
  }, [isAuthenticated]);

  const handleSelectAvatar = async (avatar: string) => {
    setSelectedAvatar(avatar);
    localStorage.setItem('bitzify_avatar', avatar);
    try {
      await updateCustomizations({ avatar });
    } catch (err) {
      console.error("Error saving avatar to backend:", err);
    }
  };

  const handleSelectTheme = async (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem('bitzify_theme', theme);
    try {
      await updateCustomizations({ theme });
    } catch (err) {
      console.error("Error saving theme to backend:", err);
    }
  };

  const handleSelectPattern = async (pattern: string) => {
    setSelectedPattern(pattern);
    localStorage.setItem('bitzify_pattern', pattern);
    try {
      await updateCustomizations({ pattern });
    } catch (err) {
      console.error("Error saving pattern to backend:", err);
    }
  };


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
    { label: 'Games Played', value: profileData?.gameCount || '0', icon: '🎮' },
    { label: 'Total Score', value: profileData?.totalScore?.toLocaleString() || '0', icon: '⭐' },
    { label: 'Badges Earned', value: Math.floor((profileData?.totalScore || 0) / 1000).toString(), icon: '🏅' },
    { label: 'Total Time', value: profileData?.totalTimeSpent ? `${Math.floor(profileData.totalTimeSpent / 60)}m` : '0m', icon: '⏱️' },
  ];

  const recentAchievements = [
    { badge: '🥇', title: 'Speed Master', description: 'Completed 5 games in one day' },
    { badge: '🎯', title: 'Perfect Score', description: 'Got 100% in Letter Trace' },
    { badge: '🚀', title: 'Rising Star', description: 'Reached level 10' },
    { badge: '🧠', title: 'Brain Genius', description: 'Solved 50 puzzles' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10 relative overflow-hidden">
      <Header />

      {/* Background Pattern Layer */}
      {selectedPattern !== 'none' && (
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none select-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ctext x='30' y='70' font-size='50'%3E${encodeURIComponent(selectedPattern)}%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Profile Header */}
        <Card className={`p-8 mb-8 shadow-2xl border-none bg-gradient-to-br ${selectedTheme} text-white transition-all duration-700 relative overflow-hidden group`}>
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000" />

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative">
              <div className="text-9xl transform transition-all hover:scale-110 hover:rotate-6 duration-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] cursor-default">
                {selectedAvatar}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded-lg rotate-12 shadow-lg">
                Level {Math.floor((profileData?.totalScore || 0) / 1000)}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  Super Explorer 🌟
                </span>
                <h1 className="text-5xl font-black mb-2 tracking-tight drop-shadow-sm">{user.name}</h1>
                <p className="text-xl text-white/80 font-medium italic">"{user.email}"</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl flex items-center gap-2">
                  <CustomizationDialog
                    totalScore={profileData?.totalScore || 0}
                    currentAvatar={selectedAvatar}
                    currentTheme={selectedTheme}
                    currentPattern={selectedPattern}
                    onSelectAvatar={handleSelectAvatar}
                    onSelectTheme={handleSelectTheme}
                    onSelectPattern={handleSelectPattern}
                  />
                  <Button variant="outline" className="bg-transparent hover:bg-white/20 text-white border-white/40 hover:border-white font-bold rounded-xl transition-all h-10">
                    Settings ⚙️
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-3">{stat.icon}</div>
              <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-foreground/70 font-semibold">{stat.label}</p>
            </Card>
          ))}
        </div> */}

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
