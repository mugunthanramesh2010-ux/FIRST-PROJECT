import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { registerFaculty } from '../../services/db';

const DEPARTMENTS = [
  'Electronics and Communication Engineering (ECE)',
  'Computer Science and Engineering (CSE)',
  'Electrical and Electronics Engineering (EEE)',
  'Biotechnology',
  'Textile Technology',
  'Fashion Technology',
  'Automobile Engineering',
  'Aeronautical Engineering',
  'Mechanical Engineering',
  'Mechatronics Engineering',
  'Information Technology (IT)',
  'Artificial Intelligence and Data Science (AI & DS)',
  'Civil Engineering',
  'Electronics & Instrumentation Engineering (E&I)'
];

export default function FacultyRegistrationPage({ onNavigate, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    facultyName: '',
    facultyId: '',
    email: '',
    mobile: '',
    department: DEPARTMENTS[0],
    organization: 'VIVA Institute of Technology',
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
    if (!formData.facultyName.trim()) return setError('Please enter Faculty Name.');
    if (!formData.facultyId.trim()) return setError('Please enter Faculty ID.');
    if (!formData.email.trim()) return setError('Please enter Email Address.');
    if (!formData.mobile.trim()) return setError('Please enter Mobile Number.');
    if (!formData.organization.trim()) return setError('Please enter Organization.');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const faculty = await registerFaculty(formData);
      setSuccess('Faculty account registered successfully! Logging you in...');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(faculty);
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
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => onNavigate('register-type')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#334155] hover:text-[#1E3A8A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Account Selection</span>
        </button>
        <span className="text-xs text-[#64748B] font-mono">Page 4 of 24 • Faculty Registration</span>
      </div>

      {/* Main Form Container */}
      <main className="w-full max-w-4xl mx-auto my-6 animate-fade-in">
        <div className="ent-card p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center gap-3 border-b border-[#CBD5E1] pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center text-[#334155]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">Faculty Registration</h1>
              <p className="text-xs text-[#64748B]">Set up faculty privileges for viva assignments and analytics</p>
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
            {/* 1. Faculty Name */}
            <div>
              <label className="form-label">Faculty Name</label>
              <input
                type="text"
                name="facultyName"
                value={formData.facultyName}
                onChange={handleChange}
                placeholder="e.g. Dr. S. Ramanathan"
                className="form-input"
                required
              />
            </div>

            {/* 2. Faculty ID */}
            <div>
              <label className="form-label">Faculty ID</label>
              <input
                type="text"
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                placeholder="e.g. FAC-ECE-01"
                className="form-input uppercase"
                required
              />
            </div>

            {/* 3. Email */}
            <div>
              <label className="form-label">Official Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="faculty@viva.edu"
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
                placeholder="e.g. 9840123456"
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

            {/* 6. Organization */}
            <div>
              <label className="form-label">Organization / College</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. VIVA Institute of Technology"
                className="form-input"
                required
              />
            </div>

            {/* 7. Password */}
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

            {/* 8. Confirm Password */}
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

            {/* Buttons: Create Faculty Account & Back */}
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
                {loading ? 'Creating Account...' : 'Create Faculty Account'}
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
