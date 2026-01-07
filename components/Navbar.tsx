'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useUser();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-blue-600">QuestPath</h1>
            <div className="hidden md:flex space-x-4">
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md ${
                  isActive('/dashboard')
                    ? 'text-gray-900 font-medium bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/leaderboard" 
                className={`px-3 py-2 rounded-md ${
                  isActive('/leaderboard')
                    ? 'text-gray-900 font-medium bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Leaderboard
              </Link>
              <Link 
                href="/profile" 
                className={`px-3 py-2 rounded-md ${
                  isActive('/profile')
                    ? 'text-gray-900 font-medium bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Profile
              </Link>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
