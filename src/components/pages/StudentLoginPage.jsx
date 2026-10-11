import React, { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, AlertCircle, CheckCircle2, Smartphone, Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';
import { loginUser } from '../../services/db';

export default function StudentLoginPage({ onNavigate, onAuthSuccess, onOpenInstallModal }) {
  const [fullName, setFullName] = useState('Kanish M');
  const [email, setEmail] = useState('kanish@viva.edu');
  const [mobile, setMobile] = useState('9876543210');
  const [department, setDepartment] = useState('Electronics and Communication Engineering (ECE)');
  const [regNo, setRegNo] = useState('714022104055');
  const [year, setYear] = useState('III');
  const [section, setSection] = useState('A');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-fill saved credentials on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('viva_saved_student_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.identifier) setRegNo(parsed.identifier);
        if (parsed.regNo) setRegNo(parsed.regNo);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.mobile) setMobile(parsed.mobile);
        if (parsed.year) setYear(parsed.year);
        if (parsed.section) setSection(parsed.section);
        if (parsed.department) setDepartment(parsed.department);
        if (parsed.password) setPassword(parsed.password);
      }
    } catch (e) {}
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const loginId = regNo.trim() || email.trim();
    if (!loginId || !password.trim()) {
      return setError('Please enter your Register / Roll Number (or Email) and Password.');
    }

    setLoading(true);
    try {
      const user = await loginUser(loginId, password);
      if (user.role !== 'student') {
        throw new Error('This account is registered as Faculty. Please switch to the Faculty Login portal.');
      }

      // Save credentials for autofill if rememberMe is enabled
      if (rememberMe) {
        try {
          localStorage.setItem('viva_saved_student_credentials', JSON.stringify({
            identifier: loginId,
            regNo: user.regNo || regNo,
            fullName: user.fullName || fullName,
            email: user.email || email,
            mobile: user.mobile || mobile,
            year: user.year || year,
            section: user.section || section,
            department: user.department || department,
            password: password
          }));
        } catch (e) {}
      }

      setSuccess(`Authentication successful! Welcome, ${user.fullName} (${user.year || year} - Sec ${user.section || section})`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
      }, 700);
    } catch (err) {
      setError(err.message || 'Invalid student credentials.');
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
            onClick={() => onNavigate('faculty-login')}
            className="px-3.5 py-1.5 rounded-xl border border-[#E2D3A7] bg-[#FFF3D6] text-xs font-bold text-[#8B5E34] hover:bg-[#B7791F] hover:text-white transition-all cursor-pointer"
          >
            Faculty Portal Login
          </button>
          <span className="text-xs text-[#718096] font-mono">Page 5 • Student Login</span>
        </div>
      </div>

      {/* Main Full-Page 2-Column Login Container */}
      <main className="w-full max-w-none my-auto py-6 animate-fade-in text-left">
        <div className="ent-card p-6 sm:p-10 space-y-7 bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl shadow-xl shadow-[#B7791F]/10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2D3A7] pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF3D6] border-2 border-[#E2D3A7] flex items-center justify-center text-[#B7791F] shadow-sm">
                <GraduationCap className="w-8 h-8 text-[#B7791F]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight">
                  Student Portal Login
                </h1>
                <p className="text-sm font-medium text-[#718096] mt-0.5">
                  Enter your credentials to access your autonomous oral examination portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
              <ShieldCheck className="w-4 h-4 text-[#B7791F]" />
              <span>Offline Local Auth</span>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              
              {/* Personal Details */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E2D3A7]">
                  <User className="w-5 h-5 text-[#B7791F]" />
                  <h2 className="text-base sm:text-lg font-extrabold text-[#2D3748] uppercase tracking-wide">
                    Personal Information
                  </h2>
                </div>

                {/* 1. Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kanish M"
                    className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                  />
                </div>

                {/* 2. Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. kanish@viva.edu"
                    className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                  />
                </div>

                {/* 3. Mobile Number */}
                <div className="space-y-1.5">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                  />
                </div>

                {/* Department Info */}
                <div className="space-y-1.5">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none"
                  />
                </div>

              </div>

              {/* Academic Credentials & Password */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E2D3A7]">
                  <Lock className="w-5 h-5 text-[#B7791F]" />
                  <h2 className="text-base sm:text-lg font-extrabold text-[#2D3748] uppercase tracking-wide">
                    Academic & Security
                  </h2>
                </div>

                {/* 1. Register / Roll Number */}
                <div className="space-y-1.5">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Register / Roll Number <span className="text-[#C53030]">*</span>
                  </label>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. 714022104055"
                    className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                    required
                  />
                </div>

                {/* 2. Class / Year & Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                      Class / Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full text-base sm:text-lg font-bold p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none cursor-pointer"
                    >
                      <option value="I">1st Year (I)</option>
                      <option value="II">2nd Year (II)</option>
                      <option value="III">3rd Year (III)</option>
                      <option value="IV">4th Year (IV)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                      Section
                    </label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full text-base sm:text-lg font-bold p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none cursor-pointer"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                </div>

                {/* 3. Password with Eye Viewing Toggle */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                      Password <span className="text-[#C53030]">*</span>
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
                      placeholder="Enter password"
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

                {/* Remember Me / Autofill Checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 rounded-md text-[#B7791F] accent-[#B7791F] cursor-pointer"
                    />
                    <span className="text-sm font-bold text-[#4A5568]">
                      Remember credentials & Auto-fill on next login
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
                    {loading ? 'Authenticating...' : 'Sign In to Student Portal'}
                  </button>
                </div>

              </div>

            </div>

            {/* Switch to Registration */}
            <div className="text-center pt-4 border-t border-[#E2D3A7]">
              <span className="text-sm text-[#718096]">New student joining a cohort? </span>
              <button
                type="button"
                onClick={() => onNavigate('student-register')}
                className="text-sm font-extrabold text-[#B7791F] hover:underline cursor-pointer ml-1"
              >
                Register Here (Student Registration Portal)
              </button>
            </div>

          </form>

        </div>
      </main>

      <footer className="text-center text-xs text-[#718096] py-3">
        VIVA ANALYSER Enterprise • Secured Academic Examinations
      </footer>

    </div>
  );
}
