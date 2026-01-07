'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Sparkles, Loader2, Target } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
// Example goals users can click to try
const EXAMPLE_GOALS = [
  "🌐 Learn web development",
  "🐍 Master Python",
  "🎨 UI/UX design",
  "🤖 Machine learning",
  "📱 Mobile app dev",
  "⚡ Master TypeScript",
];

export default function NewGoalPage() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('What do you want to learn?');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/goals', {
        description: description.trim()
      });

      router.push(`/goals/${response.data.id}`);
    } catch (err: any) {
      // Handle different error formats
      let errorMessage = 'Failed to create goal. Please try again.';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        // If detail is a string, use it directly
        if (typeof detail === 'string') {
          errorMessage = detail;
        }
        // If detail is an array (validation errors), extract the message
        else if (Array.isArray(detail)) {
          errorMessage = detail[0]?.msg || errorMessage;
        }
        // If detail is an object, try to get a message
        else if (typeof detail === 'object') {
          errorMessage = detail.msg || JSON.stringify(detail);
        }
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const selectExample = (example: string) => {
    setDescription(example.substring(2).trim()); // Remove emoji
    setError('');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 animate-bounce-subtle">
            <Target className="text-blue-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-slide-up">Create New Goal</h1>
          <p className="text-gray-600 text-lg animate-slide-up animation-delay-100">Tell us what you want to learn, and we'll create your personalized roadmap</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 animate-slide-up animation-delay-200 hover:shadow-md transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                Your Learning Goal
              </label>
              <input
                id="goal"
                type="text"
                value={description}
                onChange={(e) => setDescription(String(e.target.value))}
                placeholder="e.g., Learn web development"
                disabled={loading}
                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed focus:scale-[1.01] transform"
              />
              
              {error && (
                <div className="mt-3">
                  <ErrorDisplay
                    message={error}
                    onRetry={() => setError('')}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transform hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating your roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="animate-pulse" size={20} />
                  Generate AI Roadmap
                </>
              )}
            </button>
          </form>
        </div>

        {/* Example Suggestions */}
        <div className="animate-slide-up animation-delay-300">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Or try one of these popular goals:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {EXAMPLE_GOALS.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectExample(example)}
                disabled={loading}
                style={{ animationDelay: `${index * 50}ms` }}
                className="px-4 py-3 bg-white border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 hover:text-blue-600 text-left hover:scale-105 transform animate-slide-up hover:shadow-md"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
