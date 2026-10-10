import React, { useState } from 'react';
import {
  User,
  Mail,
  Building,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  GraduationCap,
  LogOut,
  Shield,
  Activity,
  HardDrive,
  Lock
} from 'lucide-react';
import { updateUserProfile, changeUserPassword } from '../../services/db';

export default function ProfilePage({ currentUser, onNavigate, onLogout }) {
  const isFaculty = currentUser?.role === 'faculty';
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'password'

  // Editable Profile States
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    department: currentUser?.department || 'Computer Science & Engineering',
    regNo: currentUser?.regNo || '',
    year: currentUser?.year || 'IV',
    section: currentUser?.section || 'A',
    organization: currentUser?.organization || 'National Engineering College'
  });

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (currentUser?.id) {
        updateUserProfile(currentUser.id, {
          fullName: profileData.fullName,
          email: profileData.email,
          department: profileData.department,
          ...(isFaculty ? { organization: profileData.organization } : { year: profileData.year, section: profileData.section })
        });
      }
      setSuccess('Profile credentials successfully saved to offline local records!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (currentUser?.id) {
        await changeUserPassword(currentUser.id, currentPassword, newPassword);
      }
      setSuccess('Password updated successfully! Please use new credentials on next login.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-[28px] animate-fade-in w-full py-2 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#CBD5E1] pb-4">
        <div>
          <span className="text-xs font-mono text-[#64748B]">Page 24 of 24 • User Identity & Credentials</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            {isFaculty ? 'Faculty Profile' : 'Student Profile'}
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage your credentials, academic details, and security keys stored 100% locally
          </p>
        </div>

        {/* Action: Logout Button */}
        <button
          onClick={onLogout}
          className="btn-danger text-xs h-[40px] px-4 w-auto flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* 12-Column Edge-to-Edge Widescreen Container (Zero Blank Space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* Left Column (7 cols): Main Form Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="ent-card p-6 sm:p-8 space-y-6">
            
            {/* Identity Header */}
            <div className="flex items-center gap-3 border-b border-[#CBD5E1] pb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] border border-[#CBD5E1] flex items-center justify-center text-[#1E3A8A] shrink-0">
                {isFaculty ? <Users className="w-7 h-7" /> : <GraduationCap className="w-7 h-7" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">{currentUser?.fullName || 'User Profile'}</h2>
                <span className="text-xs font-mono text-[#64748B] font-bold">{currentUser?.regNo || 'REG-ID'}</span>
                <span className="ml-2 px-2 py-0.5 rounded-md bg-[#EEF4FF] text-[11px] font-bold text-[#1E3A8A]">
                  {isFaculty ? 'Faculty Member' : 'Active Student'}
                </span>
              </div>
            </div>

            {/* Tab Switcher: Profile Details vs Change Password */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#EEF4FF] border border-[#CBD5E1]">
              <button
                type="button"
                onClick={() => { setActiveTab('details'); setError(''); setSuccess(''); }}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-white text-[#1E3A8A] shadow-sm font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Profile Details
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'password'
                    ? 'bg-white text-[#1E3A8A] shadow-sm font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Change Password
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* TAB 1: DETAILS */}
            {activeTab === 'details' && (
              <form onSubmit={handleUpdateProfile} className="space-y-4 text-left">
                
                {/* Name */}
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(p => ({ ...p, fullName: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>

                {/* Register Number / Faculty ID */}
                <div>
                  <label className="form-label">{isFaculty ? 'Faculty ID' : 'Register Number'}</label>
                  <input
                    type="text"
                    value={profileData.regNo}
                    disabled
                    className="form-input bg-[#E2E8F0] font-mono cursor-not-allowed"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData(p => ({ ...p, department: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>

                {/* Student specific: Year, Section */}
                {!isFaculty && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Year</label>
                      <input
                        type="text"
                        value={profileData.year}
                        onChange={(e) => setProfileData(p => ({ ...p, year: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Section</label>
                      <input
                        type="text"
                        value={profileData.section}
                        onChange={(e) => setProfileData(p => ({ ...p, section: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                {/* Faculty specific: Organization */}
                {isFaculty && (
                  <div>
                    <label className="form-label">Organization / College</label>
                    <input
                      type="text"
                      value={profileData.organization}
                      onChange={(e) => setProfileData(p => ({ ...p, organization: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                )}

                {/* Action: Update Profile */}
                <div className="pt-2 flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-sm font-bold shadow-md cursor-pointer"
                  >
                    {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>

              </form>
            )}

            {/* TAB 2: CHANGE PASSWORD */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-4 text-left">
                <div>
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">New Password</label>
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
                    className="btn-primary w-full py-3 text-sm font-bold shadow-md cursor-pointer"
                  >
                    {loading ? 'Updating Password...' : 'Update Password Securely'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

        {/* Right Column (5 cols): Security Badges, Academic Affiliation & Storage Status */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Academic Identity Clearance */}
          <div className="ent-card p-6 space-y-4 bg-white border border-[#CBD5E1]">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#0F172A] border-b border-[#CBD5E1] pb-3">
              <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
              <span>Identity & Academic Clearance</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] font-medium">Role Access Level:</span>
                <span className="font-extrabold text-[#0F172A]">{isFaculty ? 'Faculty Privileges' : 'Student Examiner'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] font-medium">Authentication Type:</span>
                <span className="font-extrabold text-[#2F855A]">Zero-Cloud Local DB</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] font-medium">Storage Location:</span>
                <span className="font-mono font-bold text-[#0F172A]">VIVA_ANALYSER_RECORDS/</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] font-medium">Active Session Token:</span>
                <span className="font-mono text-[#059669] font-bold">CRYPT-SHA256-ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Privacy & Anti-Leak Safeguard Card */}
          <div className="p-5 rounded-2xl bg-[#EEF4FF] border border-[#CBD5E1] space-y-3 text-xs text-[#1E3A8A]">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Lock className="w-4 h-4 text-[#1E3A8A]" />
              <span>Data Sovereignty & Offline Guarantee</span>
            </div>
            <p className="leading-relaxed text-[#334155]">
              All profiles, examination scores, and behavioral biometrics remain exclusively stored inside your offline local database. No student or faculty data is ever transferred to external cloud servers.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
