'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import bitzifylogo from '@/public/bitzify-logo.svg';
import Image from 'next/image';
export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <>
      <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src={bitzifylogo} alt="Bitzify Logo" width={32} height={32} />
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

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline font-bold text-accent">Hi, {user?.name}! 👋</span>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-white text-black hover:text-white hover:bg-white/10 font-bold rounded-xl "
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="text-white hover:bg-white/10 font-bold px-6">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="bg-secondary hover:brightness-110 text-secondary-foreground font-bold rounded-xl shadow-lg shadow-secondary/20 px-6"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal removed because we use dedicated pages now, but keeping for reference if needed elsewhere */}
    </>
  );
}
