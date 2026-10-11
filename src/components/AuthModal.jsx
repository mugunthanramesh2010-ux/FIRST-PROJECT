import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import {
  loginUser,
  registerStudent
} from '../services/db';

const DEPARTMENTS = [
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science',
  'Biomedical Engineering'
];

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('714022104055');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register Form State (2 Columns)
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: DEPARTMENTS[0],
    regNo: '',
    year: 'III',
    section: 'A',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode, isOpen]);

  // Load saved credentials on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('viva_saved_student_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.identifier) setLoginIdentifier(parsed.identifier);
        if (parsed.password) setLoginPassword(parsed.password);
      }
    } catch (e) {}
  }, []);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);
    try {
      const user = await loginUser(loginIdentifier, loginPassword);
      if (rememberMe) {
        try {
          localStorage.setItem('viva_saved_student_credentials', JSON.stringify({
            identifier: loginIdentifier,
            password: loginPassword
          }));
        } catch (e) {}
      }
      setSuccessMessage(`Welcome back, ${user.fullName}!`);
      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || 'Login credentials invalid.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regData.fullName.trim()) return setErrorMessage('Please enter Full Name.');
    if (!regData.email.trim()) return setErrorMessage('Please enter Email.');
    if (!regData.mobile.trim()) return setErrorMessage('Please enter Mobile Number.');
    if (!regData.regNo.trim()) return setErrorMessage('Please enter Register Number.');
    if (regData.password.length < 4) return setErrorMessage('Password must be at least 4 characters.');
    if (regData.password !== regData.confirmPassword) return setErrorMessage('Passwords do not match.');

    setSubmitting(true);
    try {
      const newStudent = await registerStudent({
        ...regData,
        role: 'student'
      });
      if (rememberMe) {
        try {
          localStorage.setItem('viva_saved_student_credentials', JSON.stringify({
            identifier: regData.regNo || regData.email,
            password: regData.password
          }));
        } catch (e) {}
      }
      setSuccessMessage(`Registered successfully! Welcome, ${newStudent.fullName}.`);
      setTimeout(() => {
        onAuthSuccess(newStudent);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in text-left">
      <div className="relative w-full max-w-[960px] bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#718096] hover:text-[#2D3748] hover:bg-[#FFF3D6] transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with Switcher Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2D3A7] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3D6] border-2 border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
              <GraduationCap className="w-7 h-7 text-[#B7791F]" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#2D3748]">
                {mode === 'login' ? 'Student & Academic Login' : 'New Student Registration'}
              </h2>
              <p className="text-xs sm:text-sm text-[#718096]">
                {mode === 'login' ? 'Sign in to access assigned viva tests' : '2-Column student profile with autofill & visibility toggle'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[#FFF3D6] rounded-xl border border-[#E2D3A7]">
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                mode === 'login' ? 'bg-[#B7791F] text-white shadow-sm' : 'text-[#8B5E34] hover:bg-[#FFF8E8]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                mode === 'register' ? 'bg-[#B7791F] text-white shadow-sm' : 'text-[#8B5E34] hover:bg-[#FFF8E8]'
              }`}
            >
              Register (2 Columns)
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#FFF0F0] border border-[#FECACA] text-[#C53030] text-sm font-bold flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-[#E6F4EA] border border-[#A8DAB5] text-[#2F855A] text-sm font-bold flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-6 max-w-[560px] mx-auto py-2">
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                Email OR Register Number
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. 714022104055 or kanish@viva.edu"
                className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 pr-12 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-[#718096] hover:text-[#B7791F]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 accent-[#B7791F]"
                />
                <span className="text-sm font-bold text-[#4A5568]">Remember & Autofill Password</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-[#B7791F] hover:bg-[#975A16] text-white text-base sm:text-lg font-extrabold shadow-lg shadow-[#B7791F]/25 transition-all cursor-pointer"
            >
              {submitting ? 'Signing in...' : 'Sign In Now'}
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM - TWO COLUMNS */
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Left Column: Name, Email, Mobile, Department */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-[#B7791F] uppercase tracking-wider pb-1 border-b border-[#E2D3A7]">
                  Contact Information
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#2D3748]">Full Name</label>
                  <input
                    type="text"
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    placeholder="e.g. Kanish M"
                    className="w-full text-base font-medium p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#2D3748]">Email Address</label>
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="student@viva.edu"
                    className="w-full text-base font-medium p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#2D3748]">Mobile Number</label>
                  <input
                    type="tel"
                    value={regData.mobile}
                    onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                    placeholder="9876543210"
                    className="w-full text-base font-medium p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#2D3748]">Department</label>
                  <select
                    value={regData.department}
                    onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                    className="w-full text-base font-bold p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Academic Credentials */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-[#B7791F] uppercase tracking-wider pb-1 border-b border-[#E2D3A7]">
                  Academic & Credentials
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#2D3748]">Register / Roll No</label>
                  <input
                    type="text"
                    value={regData.regNo}
                    onChange={(e) => setRegData({ ...regData, regNo: e.target.value })}
                    placeholder="e.g. 714022104055"
                    className="w-full text-base font-mono font-bold uppercase p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#2D3748]">Year</label>
                    <select
                      value={regData.year}
                      onChange={(e) => setRegData({ ...regData, year: e.target.value })}
                      className="w-full text-base font-bold p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                    >
                      <option value="I">Year 1 (I)</option>
                      <option value="II">Year 2 (II)</option>
                      <option value="III">Year 3 (III)</option>
                      <option value="IV">Year 4 (IV)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#2D3748]">Section</label>
                    <select
                      value={regData.section}
                      onChange={(e) => setRegData({ ...regData, section: e.target.value })}
                      className="w-full text-base font-bold p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#2D3748]">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="Minimum 4 characters"
                      className="w-full text-base font-medium p-3.5 pr-12 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#718096] hover:text-[#B7791F]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#2D3748]">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regData.confirmPassword}
                      onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      className="w-full text-base font-medium p-3.5 pr-12 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#718096] hover:text-[#B7791F]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 accent-[#B7791F]"
                />
                <span className="text-sm font-bold text-[#4A5568]">Save credentials & autofill password</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 rounded-xl bg-[#B7791F] hover:bg-[#975A16] text-white text-base font-extrabold shadow-md transition-all cursor-pointer"
              >
                {submitting ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
