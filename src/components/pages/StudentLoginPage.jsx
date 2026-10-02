import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginUser } from '../../services/db';

export default function StudentLoginPage({ onNavigate, onAuthSuccess }) {
  const [identifier, setIdentifier] = useState('714022104055'); // Default seed student
  const [password, setPassword] = useState('password123'); // Default seed password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!identifier.trim() || !password.trim()) {
      return setError('Please enter both Register Number/Email and Password.');
    }

    setLoading(true);
    try {
      const user = await loginUser(identifier, password);
      if (user.role !== 'student') {
        throw new Error('This account is registered as Faculty. Please use the Faculty Login portal.');
      }
      setSuccess(`Authentication successful! Welcome, ${user.fullName}`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
      }, 700);
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8] flex flex-col justify-between p-4 sm:p-8">
      
      {/* Top Bar */}
      <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8B5E34] hover:text-[#B7791F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <span className="text-xs text-[#718096] font-mono">Page 5 • Student Login</span>
      </div>

      {/* Main Login Form Container */}
      <main className="w-full max-w-[520px] mx-auto my-auto py-8 animate-fade-in text-left">
        <div className="ent-card p-6 sm:p-8 space-y-6 bg-[#FFFCF4] border-[#E2D3A7]">
          
          <div className="flex items-center gap-3 border-b border-[#E2D3A7] pb-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#FFF3D6] border border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2D3748]">Student Login</h1>
              <p className="text-xs text-[#718096]">Access your viva assessments, assignments & Learning DNA</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-[12px] bg-[#FFF0F0] border border-[#FECACA] text-[#C53030] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-[12px] bg-[#E6F4EA] border border-[#A8DAB5] text-[#2F855A] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Email OR Register Number</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 714022104055 or kanish@viva.edu"
                className="form-input"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0">Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-bold text-[#B7791F] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your student password"
                className="form-input"
                required
              />
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Authenticating...' : 'Login as Student'}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Tip */}
          <div className="p-3 rounded-[12px] bg-[#FFF3D6] border border-[#E2D3A7] text-[11px] text-[#4A5568] space-y-1">
            <span className="font-bold text-[#8B5E34]">Demo Student Credentials:</span>
            <div className="font-mono text-[#4A5568]">Reg No: <strong>714022104055</strong> | Password: <strong>password123</strong></div>
          </div>

          {/* Links: Forgot Password, Create Account, Faculty Portal */}
          <div className="pt-3 border-t border-[#E2D3A7] flex flex-wrap items-center justify-between text-xs text-[#718096] gap-2">
            <button
              onClick={() => onNavigate('student-register')}
              className="text-[#B7791F] font-bold hover:underline"
            >
              Create Account
            </button>
            <button
              onClick={() => onNavigate('faculty-login')}
              className="text-[#8B5E34] font-bold hover:underline"
            >
              Faculty Portal
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-[#2D3748]"
            >
              Home
            </button>
          </div>

        </div>
      </main>

      <footer className="text-center text-xs text-[#718096] py-2">
        Encrypted Local Storage • Smart India Hackathon Standard
      </footer>

    </div>
  );
}
