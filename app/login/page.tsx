'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Rocket, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, isLoggedIn } = useStore();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@strat101.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let success = false;

    if (isLoginMode) {
      success = login(email, password);
      if (success) {
        useStore.getState().initDemoData?.();
      } else {
        setError("Invalid credentials. Try demo@strat101.com / demo123");
      }
    } else {
      if (!name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      success = signup(name.trim(), email, password);
      if (success) {
        useStore.getState().initDemoData?.();
      } else {
        setError("An account with this email already exists");
      }
    }

    if (success) {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center mb-6 border border-white/20">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">Strat101</h1>
          <p className="text-indigo-300 mt-3 text-xl font-light">Enabling Transformation Journeys</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-semibold text-center mb-2">
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {isLoginMode 
              ? "Sign in to manage your transformation programs" 
              : "Join Strat101 and start your journey"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Alex Rivera"
                    required={!isLoginMode}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-70 text-lg"
            >
              {loading 
                ? "Processing..." 
                : isLoginMode 
                  ? "Sign In" 
                  : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {isLoginMode 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        {/* Demo hint */}
        {isLoginMode && (
          <div className="mt-6 text-center text-xs text-white/50">
            Demo: <strong>demo@strat101.com</strong> / <strong>demo123</strong>
          </div>
        )}
      </div>
    </div>
  );
}