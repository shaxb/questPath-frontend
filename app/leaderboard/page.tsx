'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, User as UserIcon } from 'lucide-react';
import api from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Loading from '@/components/ui/Loading';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { useUser } from '@/contexts/UserContext';

interface LeaderboardEntry {
  rank: number;
  user_id: number;
  email: string;
  total_exp: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  current_user: LeaderboardEntry;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} fill="currentColor" />;
      case 2:
        return <Medal className="text-gray-400" size={24} fill="currentColor" />;
      case 3:
        return <Medal className="text-amber-700" size={24} fill="currentColor" />;
      default:
        return <span className="text-lg font-bold text-gray-500 w-6 text-center">{rank}</span>;
    }
  };

  const getRowStyle = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-blue-50 border-blue-200 ring-1 ring-blue-300';
    if (rank === 1) return 'bg-yellow-50/50 border-yellow-100';
    if (rank === 2) return 'bg-gray-50/50 border-gray-100';
    if (rank === 3) return 'bg-orange-50/50 border-orange-100';
    return 'bg-white hover:bg-gray-50';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Loading fullPage message="Loading leaderboard..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorDisplay 
          fullPage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center justify-center gap-3">
              <Trophy className="text-yellow-500" size={40} />
              Leaderboard
            </h1>
            <p className="text-gray-600 text-lg">See who's leading the quest for knowledge!</p>
          </div>

          {data && (
            <div className="space-y-6">
              {/* Your Rank Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 flex items-center justify-between mb-8 transform transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    #{data.current_user.rank}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Rank</h2>
                    <p className="text-gray-500">{data.current_user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-600">{data.current_user.total_exp}</p>
                  <p className="text-sm font-bold text-blue-400 uppercase tracking-wider">Total XP</p>
                </div>
              </div>

              {/* Leaderboard List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider w-24">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">Total XP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.leaderboard.map((entry) => {
                        const isCurrentUser = user?.id === entry.user_id;
                        return (
                          <tr 
                            key={entry.user_id} 
                            className={`transition-colors ${getRowStyle(entry.rank, isCurrentUser)}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center w-8">
                                {getRankIcon(entry.rank)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${isCurrentUser ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                  <UserIcon size={20} />
                                </div>
                                <span className={`font-medium ${isCurrentUser ? 'text-blue-900 font-bold' : 'text-gray-700'}`}>
                                  {entry.email}
                                  {isCurrentUser && <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">YOU</span>}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="font-black text-gray-900">{entry.total_exp}</span>
                              <span className="text-xs text-gray-400 ml-1 font-medium">XP</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {data.leaderboard.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No active users yet. Be the first to earn XP!
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
