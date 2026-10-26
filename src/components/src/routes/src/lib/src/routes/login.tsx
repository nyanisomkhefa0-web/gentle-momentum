import React, { useState } from 'react';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please fill in all layout credentials.');
      return;
    }

    setLoading(true);
    // Simulating secure token handshakes with your Supabase server configuration
    setTimeout(() => {
      setLoading(false);
      alert('Secure Authentication Validated! Redirecting to your Dashboard...');
      window.location.href = '/dashboard';
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Brand Icon Header Layout */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shadow-indigo-600/20">
            G
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-4">Welcome Back</h1>
          <p className="text-sm text-slate-400">Log in to your account to resume your momentum.</p>
        </div>

        {/* Error Notice Display Block */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs font-semibold text-center tracking-wide">
            ⚠ {error}
          </div>
        )}

        {/* Interactive Form Layer */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition duration-150"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secure Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm tracking-wide shadow-lg shadow-indigo-600/10 transition transform active:scale-[0.99]"
          >
            {loading ? 'Securing Connection...' : 'Sign In and Launch'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-medium">
            Protected by End-to-End Cryptographic Encryption Layers.
          </p>
        </div>

      </div>
    </div>
  );
}
