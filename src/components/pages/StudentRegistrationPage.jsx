import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { registerStudent } from '../../services/db';

const DEPARTMENTS = [
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
  'Civil Engineering',
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

    // Validation
    if (!formData.fullName.trim()) return setError('Please enter your Full Name.');
    if (!formData.regNo.trim()) return setError('Please enter your Register Number.');
    if (!formData.email.trim()) return setError('Please enter your Email.');
    if (!formData.mobile.trim()) return setError('Please enter your Mobile number.');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const student = await registerStudent(formData);
      setSuccess('Student account registered successfully! Logging you in...');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(student);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF4FF] flex flex-col justify-between p-4 sm:p-8">
      
      {/* Top Bar */}
      <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => onNavigate('register-type')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#334155] hover:text-[#1E3A8A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Account Selection</span>
        </button>
        <span className="text-xs text-[#64748B] font-mono">Page 3 of 24 • Student Registration</span>
      </div>

      {/* Main Form Container (Strict 520px Width Rule) */}
      <main className="w-full max-w-[520px] mx-auto my-6 animate-fade-in">
        <div className="ent-card p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center gap-3 border-b border-[#CBD5E1] pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] border border-[#CBD5E1] flex items-center justify-center text-[#1E3A8A]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">Student Registration</h1>
              <p className="text-xs text-[#64748B]">Enroll into the universal adaptive offline viva system</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* 1. Full Name */}
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Kanish M"
                className="form-input"
                required
              />
            </div>

            {/* 2. Register Number */}
            <div>
              <label className="form-label">Register Number</label>
              <input
                type="text"
                name="regNo"
                value={formData.regNo}
                onChange={handleChange}
                placeholder="e.g. 714022104055"
                className="form-input uppercase"
                required
              />
            </div>

            {/* 3. Email */}
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@viva.edu"
                className="form-input"
                required
              />
            </div>

            {/* 4. Mobile */}
            <div>
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="form-input"
                required
              />
            </div>

            {/* 5. Department */}
            <div>
              <label className="form-label">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* 6 & 7: Year and Section */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Year of Study</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="I">1st Year (I)</option>
                  <option value="II">2nd Year (II)</option>
                  <option value="III">3rd Year (III)</option>
                  <option value="IV">4th Year (IV)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Section</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
            </div>

            {/* 8. Password */}
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="form-input"
                required
              />
            </div>

            {/* 9. Confirm Password */}
            <div>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="form-input"
                required
              />
            </div>

            {/* Buttons: Create Student Account & Back (Max 2 primary buttons per row) */}
            <div className="pt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onNavigate('register-type')}
                className="btn-outline h-[48px] px-6 text-xs"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Creating Account...' : 'Create Student Account'}
              </button>
            </div>
          </form>

        </div>
      </main>

      <footer className="text-center text-xs text-[#64748B] py-2">
        Encrypted Local Storage • Zero External Cloud Telemetry
      </footer>

    </div>
  );
}
