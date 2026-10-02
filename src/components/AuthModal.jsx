import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import {
  loginUser,
  registerStudent,
  generateRecoveryOtp,
  verifyOtpAndResetPassword
} from '../services/db';

const DEPARTMENTS = [
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Computer Science Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biomedical Engineering'
];

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [registerStep, setRegisterStep] = useState(1); // 1: Basic, 2: Academic, 3: Security, 4: Verification

  useEffect(() => {
    if (initialMode) setMode(initialMode);
    setRegisterStep(1);
  }, [initialMode, isOpen]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State (4 Steps)
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    regNo: '',
    department: DEPARTMENTS[0],
    year: 'III',
    section: 'A',
    password: '',
    confirmPassword: '',
    verificationCode: '849201' // Simulated instant verification
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);
    try {
      const user = await loginUser(loginIdentifier, loginPassword);
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

  const handleNextStep = () => {
    setErrorMessage('');
    if (registerStep === 1) {
      if (!regData.fullName) {
        setErrorMessage('Please enter your Full Name.');
        return;
      }
      if (!regData.email) {
        setErrorMessage('Please enter your Email Address.');
        return;
      }
    } else if (registerStep === 2) {
      if (!regData.regNo) {
        setErrorMessage('Please enter your Register Number.');
        return;
      }
    } else if (registerStep === 3) {
      const pwd = regData.password || '';
      // Allow 4 or more characters
      if (pwd.length < 4) {
        setErrorMessage('Password must be at least 4 characters.');
        return;
      }
      // If user typed a confirm password that doesn't match
      if (regData.confirmPassword && regData.confirmPassword !== pwd) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
      // Auto-sync confirm password if blank
      if (!regData.confirmPassword) {
        setRegData(prev => ({ ...prev, confirmPassword: pwd }));
      }
    }
    setRegisterStep(prev => prev + 1);
  };

  const handleRegisterFinalSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    try {
      // Ensure password fields match before save
      const finalRegData = {
        ...regData,
        confirmPassword: regData.confirmPassword || regData.password
      };
      const newUser = await registerStudent(finalRegData);
      setSuccessMessage('Registration verified and complete! Logging in...');
      setTimeout(() => {
        onAuthSuccess(newUser);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(13, 17, 23, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      
      {/* ========================================================================= */}
      {/* 1. LOGIN PAGE DESIGN (Max Width 500px, Center Aligned, Strict Fields Only) */}
      {/* ========================================================================= */}
      {mode === 'login' && (
        <div
          style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
            position: 'relative',
            textAlign: 'center',
            color: '#F0F6FC'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px' }}
          >
            <X className="w-4 h-4" />
          </button>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
            Account Login
          </h2>
          <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '6px', marginBottom: '20px' }}>
            Enter your credentials to access the viva engine
          </p>

          {errorMessage && (
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 0, 122, 0.15)',
                border: '1px solid rgba(255, 0, 122, 0.4)',
                color: '#FF007A',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
                marginBottom: '16px'
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(57, 255, 20, 0.15)',
                border: '1px solid rgba(57, 255, 20, 0.4)',
                color: '#39FF14',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
                marginBottom: '16px'
              }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                Email / Register Number
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="student@university.edu or 714022104042"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#0D1117',
                  border: '1px solid #30363D',
                  color: '#F0F6FC',
                  padding: '0 16px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#8B949E', margin: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  style={{ background: 'none', border: 'none', color: '#00F5D4', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#0D1117',
                  border: '1px solid #30363D',
                  color: '#F0F6FC',
                  padding: '0 16px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            {/* Login Primary Button: Height 48-52px, Width 160-240px */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ width: '100%', maxWidth: '240px', height: '50px' }}
              >
                <span>{submitting ? 'Authenticating...' : 'Login'}</span>
                <ArrowRight className="w-4 h-4 text-[#0D1117]" />
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #30363D', fontSize: '14px', color: '#8B949E' }}>
            Don't have an account?{' '}
            <button
              onClick={() => {
                setErrorMessage('');
                setMode('register');
              }}
              style={{ background: 'none', border: 'none', color: '#00F5D4', fontWeight: 700, cursor: 'pointer' }}
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REGISTRATION PAGE DESIGN (Max Width 700px, Multi-Step 1 to 4)         */}
      {/* ========================================================================= */}
      {mode === 'register' && (
        <div
          style={{
            width: '100%',
            maxWidth: '700px',
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
            position: 'relative',
            color: '#F0F6FC'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px' }}
          >
            <X className="w-4 h-4" />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#F0F6FC', margin: 0, letterSpacing: '-0.02em' }}>
              Student Registration
            </h2>
            <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '4px', marginBottom: '16px' }}>
              Step {registerStep} of 4: Multi-Step Academic Onboarding
            </p>
            
            {/* Step Progress Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxWidth: '480px', margin: '0 auto' }}>
              {['Basic Details', 'Academic Details', 'Security Setup', 'Verification'].map((title, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      height: '6px',
                      borderRadius: '999px',
                      backgroundColor: registerStep >= i + 1 ? '#00F5D4' : '#30363D',
                      transition: 'all 0.3s ease',
                      marginBottom: '4px'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'block',
                      color: registerStep === i + 1 ? '#00F5D4' : '#8B949E',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 0, 122, 0.15)',
                border: '1px solid rgba(255, 0, 122, 0.4)',
                color: '#FF007A',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: BASIC DETAILS */}
          {registerStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kanish V"
                  value={regData.fullName}
                  onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#0D1117',
                    border: '1px solid #30363D',
                    color: '#F0F6FC',
                    padding: '0 16px',
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#0D1117',
                      border: '1px solid #30363D',
                      color: '#F0F6FC',
                      padding: '0 16px',
                      fontSize: '15px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={regData.mobile}
                    onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#0D1117',
                      border: '1px solid #30363D',
                      color: '#F0F6FC',
                      padding: '0 16px',
                      fontSize: '15px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC DETAILS */}
          {registerStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                  Register Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 714022104042"
                  value={regData.regNo}
                  onChange={(e) => setRegData({ ...regData, regNo: e.target.value })}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#0D1117',
                    border: '1px solid #30363D',
                    color: '#00F5D4',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                    padding: '0 16px',
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                  Department / Discipline
                </label>
                <select
                  value={regData.department}
                  onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#0D1117',
                    border: '1px solid #30363D',
                    color: '#F0F6FC',
                    padding: '0 16px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} style={{ background: '#161B22', color: '#F0F6FC' }}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                    Academic Year
                  </label>
                  <select
                    value={regData.year}
                    onChange={(e) => setRegData({ ...regData, year: e.target.value })}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#0D1117',
                      border: '1px solid #30363D',
                      color: '#F0F6FC',
                      padding: '0 16px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="I">I Year</option>
                    <option value="II">II Year</option>
                    <option value="III">III Year</option>
                    <option value="IV">IV Year</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                    Section
                  </label>
                  <select
                    value={regData.section}
                    onChange={(e) => setRegData({ ...regData, section: e.target.value })}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#0D1117',
                      border: '1px solid #30363D',
                      color: '#F0F6FC',
                      padding: '0 16px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SECURITY SETUP (Minimum 4 characters) */}
          {registerStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#8B949E', margin: 0 }}>
                    Create Password (Min 4 chars)
                  </label>
                  <span style={{ fontSize: '12px', color: (regData.password?.length || 0) >= 4 ? '#39FF14' : '#8B949E', fontWeight: 700 }}>
                    {regData.password?.length || 0} / 4 characters
                  </span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter at least 4 characters"
                  value={regData.password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRegData(prev => ({ ...prev, password: val, confirmPassword: val }));
                    if (val.length >= 4) setErrorMessage('');
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#0D1117',
                    border: `1px solid ${(regData.password?.length || 0) >= 4 ? '#39FF14' : '#30363D'}`,
                    color: '#F0F6FC',
                    padding: '0 16px',
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#0D1117',
                    border: '1px solid #30363D',
                    color: '#F0F6FC',
                    padding: '0 16px',
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: '#0D1117',
                  border: '1px solid #30363D',
                  fontSize: '12px',
                  color: '#8B949E'
                }}
              >
                <span style={{ fontWeight: 700, color: '#00F5D4' }}>Security Policy: </span>
                <span>Passwords are hashed offline using SHA-256 with local biometric zero-trust verification.</span>
              </div>
            </div>
          )}

          {/* STEP 4: VERIFICATION */}
          {registerStep === 4 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(57, 255, 20, 0.15)',
                  border: '1px solid #39FF14',
                  color: '#39FF14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}
              >
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#F0F6FC', margin: 0 }}>
                  Verification Token Ready
                </h3>
                <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '6px' }}>
                  Candidate: <strong style={{ color: '#F0F6FC' }}>{regData.fullName}</strong> ({regData.regNo}) • {regData.department}
                </p>
              </div>

              <div style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
                  Offline Cryptographic Token
                </label>
                <input
                  type="text"
                  readOnly
                  value="849-201 (Self-Verified)"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#0D1117',
                    border: '1px solid #00F5D4',
                    color: '#00F5D4',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    textAlign: 'center',
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* Step Controls (Back & Continue / Register) */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #30363D',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {registerStep > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setRegisterStep(prev => prev - 1);
                }}
                className="btn-secondary"
                style={{ height: '48px', minWidth: '140px' }}
              >
                <ArrowLeft className="w-4 h-4 text-[#8B949E]" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ background: 'none', border: 'none', color: '#8B949E', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Already have account? Login
              </button>
            )}

            {registerStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-primary"
                style={{ height: '50px', minWidth: '160px' }}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-[#0D1117]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegisterFinalSubmit}
                disabled={submitting}
                className="btn-primary"
                style={{ height: '50px', minWidth: '180px' }}
              >
                <span>{submitting ? 'Registering...' : 'Register'}</span>
                <CheckCircle2 className="w-4 h-4 text-[#0D1117]" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* Forgot Password Flow */}
      {mode === 'forgot' && (
        <div
          style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
            position: 'relative',
            textAlign: 'center',
            color: '#F0F6FC'
          }}
        >
          <button
            onClick={() => setMode('login')}
            className="btn-icon"
            style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px' }}
          >
            <X className="w-4 h-4" />
          </button>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#F0F6FC', margin: 0 }}>Account Recovery</h2>
          <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '6px', marginBottom: '16px' }}>
            Reset your password using your register number
          </p>

          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8B949E', marginBottom: '6px' }}>
              Register Number
            </label>
            <input
              type="text"
              placeholder="714022104042"
              style={{
                display: 'block',
                width: '100%',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#0D1117',
                border: '1px solid #30363D',
                color: '#00F5D4',
                fontFamily: 'JetBrains Mono, monospace',
                padding: '0 16px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => setMode('login')}
              className="btn-secondary"
              style={{ height: '46px', minWidth: '140px' }}
            >
              Back to Login
            </button>
            <button
              onClick={() => {
                alert('Recovery request sent to Faculty Admin.');
                setMode('login');
              }}
              className="btn-primary"
              style={{ height: '48px', minWidth: '160px' }}
            >
              Request Reset
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
