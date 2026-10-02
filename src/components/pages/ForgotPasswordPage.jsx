import React, { useState } from 'react';
import {
  ArrowLeft,
  KeyRound,
  Mail,
  Phone,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Users
} from 'lucide-react';
import {
  generateRecoveryOtp,
  verifyOtpAndResetPassword,
  submitFacultyRecoveryRequest
} from '../../services/db';

export default function ForgotPasswordPage({ onNavigate }) {
  // Step 1: Account Type (Student or Faculty)
  const [accountType, setAccountType] = useState('student'); // 'student' | 'faculty'
  
  // Step 2: Recovery Method
  const [recoveryMethod, setRecoveryMethod] = useState('email'); // 'email' | 'mobile' | 'authorized'
  
  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [activeUserId, setActiveUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Authorized Recovery fields
  const [regNo, setRegNo] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [recoveryReason, setRecoveryReason] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');

  // 1. Request OTP (Email or Mobile)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!identifier.trim()) {
      return setError(`Please enter your ${recoveryMethod === 'email' ? 'Email Address' : 'Mobile Number'}.`);
    }

    setLoading(true);
    try {
      const res = generateRecoveryOtp(identifier, recoveryMethod);
      setOtpSent(true);
      setActiveUserId(res.userId);
      setSimulatedCode(res.code);
      setSuccess(`Verification code dispatched to ${res.maskedTarget}. (Offline OTP: ${res.code})`);
    } catch (err) {
      setError(err.message || 'Account not found.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit New Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otpCode.trim()) return setError('Please enter the 6-digit OTP code.');
    if (newPassword.length < 6) return setError('New password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      await verifyOtpAndResetPassword(activeUserId, otpCode, newPassword);
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        onNavigate(accountType === 'student' ? 'student-login' : 'faculty-login');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Authorized Recovery Request
  const handleSubmitAuthorized = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regNo.trim() || !authEmail.trim()) {
      return setError('Please enter your Register Number / Faculty ID and Email.');
    }

    setLoading(true);
    try {
      submitFacultyRecoveryRequest(regNo, authEmail, recoveryReason);
      setSuccess('Authorized recovery request submitted to Department Administrator. You can collect your temporary key from faculty.');
    } catch (err) {
      setError(err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF4FF] flex flex-col justify-between p-4 sm:p-8">
      
      {/* Top Bar */}
      <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#334155] hover:text-[#1E3A8A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back Home</span>
        </button>
        <span className="text-xs text-[#64748B] font-mono">Page 7 of 24 • Forgot Password</span>
      </div>

      {/* Main Container (520px Rule) */}
      <main className="w-full max-w-[520px] mx-auto my-6 animate-fade-in">
        <div className="ent-card p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center gap-3 border-b border-[#CBD5E1] pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] border border-[#CBD5E1] flex items-center justify-center text-[#1E3A8A]">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">Account Recovery</h1>
              <p className="text-xs text-[#64748B]">Multi-channel verification & authorized key reset</p>
            </div>
          </div>

          {/* CHOOSE ACCOUNT TYPE */}
          <div>
            <label className="form-label">1. Choose Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType('student')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  accountType === 'student'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm'
                    : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:bg-[#EEF4FF]'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Account</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('faculty')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  accountType === 'faculty'
                    ? 'bg-[#334155] text-white border-[#334155] shadow-sm'
                    : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:bg-[#EEF4FF]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Faculty Account</span>
              </button>
            </div>
          </div>

          {/* CHOOSE RECOVERY METHOD */}
          <div>
            <label className="form-label">2. Recovery Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setRecoveryMethod('email'); setOtpSent(false); }}
                className={`py-2 px-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  recoveryMethod === 'email'
                    ? 'border-[#1E3A8A] bg-[#EEF4FF] text-[#1E3A8A] font-bold'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#475569]'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={() => { setRecoveryMethod('mobile'); setOtpSent(false); }}
                className={`py-2 px-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  recoveryMethod === 'mobile'
                    ? 'border-[#1E3A8A] bg-[#EEF4FF] text-[#1E3A8A] font-bold'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#475569]'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Mobile</span>
              </button>

              <button
                type="button"
                onClick={() => { setRecoveryMethod('authorized'); setOtpSent(false); }}
                className={`py-2 px-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  recoveryMethod === 'authorized'
                    ? 'border-[#1E3A8A] bg-[#EEF4FF] text-[#1E3A8A] font-bold'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#475569]'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Authorized</span>
              </button>
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

          {/* METHOD 1 & 2: EMAIL OR MOBILE VERIFICATION */}
          {(recoveryMethod === 'email' || recoveryMethod === 'mobile') && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="form-label">
                      {recoveryMethod === 'email' ? 'Registered Email Address' : 'Registered Mobile Number'}
                    </label>
                    <input
                      type={recoveryMethod === 'email' ? 'email' : 'tel'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={recoveryMethod === 'email' ? 'kanish@viva.edu' : '9876543210'}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full max-w-full"
                    >
                      {loading ? 'Sending Code...' : `Send Verification ${recoveryMethod === 'email' ? 'Email' : 'SMS'}`}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="form-label">Enter 6-Digit Verification Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder={simulatedCode || '123456'}
                      className="form-input font-mono text-center tracking-widest text-lg font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Set New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full max-w-full"
                    >
                      {loading ? 'Resetting Password...' : 'Reset & Save Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* METHOD 3: AUTHORIZED RECOVERY */}
          {recoveryMethod === 'authorized' && (
            <form onSubmit={handleSubmitAuthorized} className="space-y-4">
              <div>
                <label className="form-label">Register Number OR Faculty ID</label>
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. 714022104055 or FAC-ECE-01"
                  className="form-input uppercase"
                  required
                />
              </div>

              <div>
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@viva.edu"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Reason for Authorized Recovery</label>
                <textarea
                  value={recoveryReason}
                  onChange={(e) => setRecoveryReason(e.target.value)}
                  placeholder="Lost device / Forgotten credentials / Account locked"
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full max-w-full"
                >
                  {loading ? 'Submitting...' : 'Submit to Faculty Queue'}
                </button>
              </div>
            </form>
          )}

          <div className="pt-3 border-t border-[#CBD5E1] flex items-center justify-between text-xs text-[#64748B]">
            <button
              onClick={() => onNavigate(accountType === 'student' ? 'student-login' : 'faculty-login')}
              className="text-[#1E3A8A] font-semibold hover:underline"
            >
              Back to Login
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-[#0F172A]"
            >
              Cancel
            </button>
          </div>

        </div>
      </main>

      <footer className="text-center text-xs text-[#64748B] py-2">
        Encrypted Local Storage • Zero External Cloud Telemetry
      </footer>

    </div>
  );
}
