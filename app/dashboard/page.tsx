'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Target, Trophy, Zap, Plus } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useUser } from "@/contexts/UserContext";
import Loading from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

interface Goal {
  id: number;
  title: string;
  category: string;
  difficulty_level: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading: userLoading, getLevel, getXPProgress, refreshUser } = useUser();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const router = useRouter();

  const fetchGoals = async () => {
    try {
      setGoalsLoading(true);
      const response = await api.get('/goals/me');
      setGoals(response.data);
    } catch (err: any) {
      // Error already shown by toast
      console.error('Failed to fetch goals:', err);
    } finally {
      setGoalsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-yellow-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Show loading while user or goals are loading
  if (userLoading || goalsLoading) {
    return (
      <ProtectedRoute>
        <Loading fullPage message="Loading your dashboard..." />
      </ProtectedRoute>
    );
  }

  // ProtectedRoute handles the case where user is null (redirects to login)
  // So here we can safely assume user exists
  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  // Get level and XP progress from UserContext (only after loading completes)
  const currentLevel = getLevel();
  const { current: xpInCurrentLevel, needed: xpForNextLevel, percentage: xpProgress } = getXPProgress();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.display_name || user?.email?.split('@')[0] || 'Learner'}! 👋
          </h2>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Level Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Trophy className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Level</p>
                  <p className="text-2xl font-bold text-gray-900">{currentLevel}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress to Level {currentLevel + 1}</span>
                <span className="font-medium">{xpInCurrentLevel}/{xpForNextLevel} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Total XP Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Zap className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="text-2xl font-bold text-gray-900">{user?.total_exp || 0}</p>
              </div>
            </div>
          </div>

          {/* Goals Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Your Goals</h3>
              <p className="text-sm text-gray-600 mt-1">Track your learning objectives</p>
            </div>
            <Link
              href="/goals/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Create Goal
            </Link>
          </div>

          <div className="p-6">
            {goals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h4>
                <p className="text-gray-600 mb-6">Create your first learning goal to get started!</p>
                <Link
                  href="/goals/new"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  Create Your First Goal
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {goals.map((goal) => (
                  <Link
                    key={goal.id}
                    href={`/goals/${goal.id}`}
                    className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{goal.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className={`font-medium ${getDifficultyColor(goal.difficulty_level)}`}>
                        {goal.difficulty_level.charAt(0).toUpperCase() + goal.difficulty_level.slice(1)}
                      </span>
                      <span className="text-gray-500">
                        {goal.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
