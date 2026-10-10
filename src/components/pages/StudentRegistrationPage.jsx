import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, GraduationCap, Eye, EyeOff, User, Mail, Phone, BookOpen, Lock, ShieldCheck } from 'lucide-react';
import { registerStudent } from '../../services/db';

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

export default function StudentRegistrationPage({ onNavigate, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    regNo: '',
    email: '',
    mobile: '',
    department: DEPARTMENTS[0],
    year: 'III',
    section: 'A',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Strict Validations
    if (!formData.fullName.trim()) return setError('Please enter your Full Name.');
    if (!formData.regNo.trim()) return setError('Please enter your Register / Roll Number.');
    if (!formData.email.trim()) return setError('Please enter your Email Address.');
    if (!formData.mobile.trim()) return setError('Please enter your Mobile Number.');
    if (formData.password.length < 4) return setError('Password must be at least 4 characters.');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const student = await registerStudent({
        ...formData,
        role: 'student'
      });

      // Save credentials for autofill if rememberMe is enabled
      if (rememberMe) {
        try {
          localStorage.setItem('viva_saved_student_credentials', JSON.stringify({
            identifier: formData.regNo || formData.email,
            email: formData.email,
            password: formData.password
          }));
        } catch (e) {}
      }

      setSuccess(`Student account successfully created! Welcome, ${student.fullName}.`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(student);
      }, 900);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8] flex flex-col justify-between p-4 sm:p-8 text-left">
      
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#E2D3A7]">
        <button
          onClick={() => onNavigate('student-login')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#8B5E34] hover:text-[#B7791F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Already have an account? Login Here</span>
        </button>
        <div className="flex items-center gap-2 text-xs font-mono text-[#718096]">
          <span className="w-2 h-2 rounded-full bg-[#2F855A] animate-pulse"></span>
          <span>Student Portal Enrollment</span>
        </div>
      </div>

      {/* Main Full-Page 2-Column Registration Container */}
      <main className="w-full max-w-none my-6 animate-fade-in">
        <div className="ent-card p-6 sm:p-10 space-y-8 bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl shadow-xl shadow-[#B7791F]/10">
          
          {/* Header Title Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2D3A7] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF3D6] border-2 border-[#E2D3A7] flex items-center justify-center text-[#B7791F] shadow-sm">
                <GraduationCap className="w-8 h-8 text-[#B7791F]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight">
                  Student Portal Registration
                </h1>
                <p className="text-sm font-medium text-[#718096] mt-0.5">
                  Enter your student credentials below. All fields have slightly big, high-visibility text.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
              <ShieldCheck className="w-4 h-4 text-[#B7791F]" />
              <span>Offline Local Encrypted</span>
            </div>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* TWO MAIN COLUMNS: Left (Personal & Contact) | Right (Academic & Security) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              
              {/* COLUMN 1: LEFT SIDE (Name, Email, Mobile No, Department) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E2D3A7]">
                  <User className="w-5 h-5 text-[#B7791F]" />
                  <h2 className="text-base sm:text-lg font-extrabold text-[#2D3748] uppercase tracking-wide">
                    Personal & Contact Information
                  </h2>
                </div>

                {/* 1. Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Full Name <span className="text-[#C53030]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Kanish M"
                      className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* 2. Email Address */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Email Address <span className="text-[#C53030]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. kanish@viva.edu"
                      className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* 3. Mobile Number */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Mobile Number <span className="text-[#C53030]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* 4. Department */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Department / Branch <span className="text-[#C53030]">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full text-base font-bold p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none focus:border-[#B7791F] transition-all shadow-inner cursor-pointer"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d} className="py-1">{d}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* COLUMN 2: RIGHT SIDE (Reg No, Class/Year, Section, Password, Confirm Password) */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E2D3A7]">
                  <GraduationCap className="w-5 h-5 text-[#B7791F]" />
                  <h2 className="text-base sm:text-lg font-extrabold text-[#2D3748] uppercase tracking-wide">
                    Academic ID & Password Security
                  </h2>
                </div>

                {/* 5. Register Number / Roll No */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Register Number / Roll No <span className="text-[#C53030]">*</span>
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                    placeholder="e.g. 714022104055"
                    className="w-full text-base sm:text-lg font-mono font-bold uppercase p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                    required
                  />
                </div>

                {/* 6 & 7: Year and Section in Side-by-Side Boxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                      Class / Year <span className="text-[#C53030]">*</span>
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full text-base font-bold p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none focus:border-[#B7791F] transition-all shadow-inner cursor-pointer"
                    >
                      <option value="I">Year 1 (I)</option>
                      <option value="II">Year 2 (II)</option>
                      <option value="III">Year 3 (III)</option>
                      <option value="IV">Year 4 (IV)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                      Section <span className="text-[#C53030]">*</span>
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full text-base font-bold p-3.5 sm:p-4 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none focus:border-[#B7791F] transition-all shadow-inner cursor-pointer"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                </div>

                {/* 8. Password with Viewing Option */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Password <span className="text-[#C53030]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 4 characters"
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

                {/* 9. Confirm Password with Viewing Option */}
                <div className="space-y-2">
                  <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                    Confirm Password <span className="text-[#C53030]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full text-base sm:text-lg font-medium p-3.5 sm:p-4 pr-12 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all shadow-inner"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#718096] hover:text-[#B7791F] transition-colors cursor-pointer"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Remember Me / Autofill Checkbox */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-4 border-t border-[#E2D3A7]">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-md text-[#B7791F] accent-[#B7791F] cursor-pointer"
                />
                <span className="text-sm font-bold text-[#4A5568]">
                  Save credentials & autofill password on next login
                </span>
              </label>

              <div className="text-xs text-[#718096] font-medium">
                Targeting: Year {formData.year} • Section {formData.section}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onNavigate('student-login')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border-2 border-[#E2D3A7] bg-[#FFF8E8] text-[#8B5E34] hover:bg-[#FFF3D6] text-sm font-extrabold transition-all cursor-pointer text-center"
              >
                Go to Login
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#B7791F] hover:bg-[#975A16] text-white text-base sm:text-lg font-extrabold shadow-lg shadow-[#B7791F]/25 transition-all cursor-pointer text-center"
              >
                {loading ? 'Creating Student Account...' : 'Complete Registration & Access Portal'}
              </button>
            </div>

          </form>

        </div>
      </main>

      <footer className="text-center text-xs text-[#718096] py-3">
        VIVA ANALYSER Enterprise • Class-Specific Academic Security Engine
      </footer>

    </div>
  );
}
