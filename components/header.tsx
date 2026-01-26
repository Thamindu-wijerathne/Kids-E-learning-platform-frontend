'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import SignInModal from './signin-modal';

export default function Header() {
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <>
      <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-3xl font-bold">🎮</div>
            <span className="text-2xl font-bold hidden sm:inline">PlayLearn</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-accent transition-colors font-semibold">
              Home
            </Link>
            <Link href="/games" className="hover:text-accent transition-colors font-semibold">
              Games
            </Link>
            <Link href="/progress" className="hover:text-accent transition-colors font-semibold">
              Progress
            </Link>
            <Link href="/profile" className="hover:text-accent transition-colors font-semibold">
              Profile
            </Link>
          </nav>

          {/* Sign In Button */}
          <Button
            onClick={() => setSignInOpen(true)}
            className="bg-accent hover:bg-yellow-400 text-foreground font-bold rounded-xl"
          >
            Sign In
          </Button>
        </div>
      </header>

      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
