import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, AlertCircle, CheckCircle2, Smartphone, Eye, EyeOff, Lock } from 'lucide-react';
import { loginUser } from '../../services/db';

export default function FacultyLoginPage({ onNavigate, onAuthSuccess, onOpenInstallModal }) {
  const [identifier, setIdentifier] = useState('FAC-ECE-01'); // Default seed faculty
  const [password, setPassword] = useState('password123'); // Default seed password
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-fill saved credentials on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('viva_saved_faculty_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.identifier) setIdentifier(parsed.identifier);
        if (parsed.password) setPassword(parsed.password);
      }
    } catch (e) {}
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!identifier.trim() || !password.trim()) {
      return setError('Please enter both Faculty ID/Email and Password.');
    }

    setLoading(true);
    try {
      const user = await loginUser(identifier, password);
      if (user.role !== 'faculty') {
        throw new Error('This account is registered as Student. Please use the Student Login portal.');
      }

      if (rememberMe) {
        try {
          localStorage.setItem('viva_saved_faculty_credentials', JSON.stringify({
            identifier: identifier.trim(),
            password: password
          }));
        } catch (e) {}
      }

      setSuccess(`Welcome back, Professor ${user.fullName}`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
      }, 700);
    } catch (err) {
      setError(err.message || 'Invalid faculty credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8] flex flex-col justify-between p-4 sm:p-8 text-left">
      
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#E2D3A7]">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8B5E34] hover:text-[#B7791F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('student-login')}
            className="px-3.5 py-1.5 rounded-xl border border-[#E2D3A7] bg-[#FFF3D6] text-xs font-bold text-[#8B5E34] hover:bg-[#B7791F] hover:text-white transition-all cursor-pointer"
          >
            Student Portal Login
          </button>
          <span className="text-xs text-[#718096] font-mono">Page 6 • Faculty Login</span>
        </div>
      </div>

      {/* Main Login Form Container */}
      <main className="w-full max-w-4xl mx-auto my-auto py-8 animate-fade-in text-left">
        <div className="ent-card p-6 sm:p-10 space-y-7 bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl shadow-xl shadow-[#B7791F]/10">
          
          <div className="flex items-center gap-4 border-b border-[#E2D3A7] pb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF3D6] border-2 border-[#E2D3A7] flex items-center justify-center text-[#8B5E34] shadow-sm">
              <Users className="w-8 h-8 text-[#8B5E34]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight">
                Faculty Portal Login
              </h1>
              <p className="text-sm font-medium text-[#718096] mt-0.5">
                Manage viva assignments, assess cohorts & review real-time security analytics
              </p>
            </div>
          </div>

          {onOpenInstallModal && (
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="w-full p-3 rounded-xl bg-[#FFF3D6] border border-[#B7791F]/40 hover:bg-[#B7791F] hover:text-white text-[#8B5E34] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Smartphone className="w-4 h-4 text-[#B7791F]" />
              <span>📲 Install as Phone App (Runs 100% Offline with PC Off)</span>
            </button>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-[#FFF0F0] border-2 border-[#FECACA] text-[#C53030] text-sm font-bold flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-[#E6F4EA] border-2 border-[#A8DAB5] text-[#2F855A] text-sm font-bold flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email / Faculty ID */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                Email OR Faculty ID
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. FAC-ECE-01 or faculty@viva.edu"
                className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                required
              />
            </div>

            {/* Password with Eye Viewing Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-bold text-[#B7791F] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 pr-12 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#718096] hover:text-[#B7791F] transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-md text-[#B7791F] accent-[#B7791F] cursor-pointer"
                />
                <span className="text-sm font-bold text-[#4A5568]">
                  Remember & Autofill Password
                </span>
              </label>
            </div>

            {/* Login Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#B7791F] hover:bg-[#975A16] text-white text-base sm:text-lg font-extrabold shadow-lg shadow-[#B7791F]/25 transition-all cursor-pointer text-center"
              >
                {loading ? 'Authenticating...' : 'Sign In to Faculty Portal'}
              </button>
            </div>

            {/* Switch to Registration */}
            <div className="text-center pt-2 border-t border-[#E2D3A7]">
              <span className="text-sm text-[#718096]">New faculty member? </span>
              <button
                type="button"
                onClick={() => onNavigate('faculty-register')}
                className="text-sm font-extrabold text-[#B7791F] hover:underline cursor-pointer ml-1"
              >
                Register Here
              </button>
            </div>

          </form>

        </div>
      </main>

      <footer className="text-center text-xs text-[#718096] py-3">
        VIVA ANALYSER Enterprise • Faculty Control & Examination Management
      </footer>

    </div>
  );
}
