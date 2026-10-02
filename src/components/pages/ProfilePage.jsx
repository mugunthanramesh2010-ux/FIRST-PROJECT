import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Users,
  KeyRound,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { updateUserProfile, changeUserPassword } from '../../services/db';

export default function ProfilePage({
  currentUser,
  onNavigate,
  onLogout
}) {
  const isFaculty = currentUser?.role === 'faculty';

  // Profile fields state
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    regNo: currentUser?.regNo || '',
    email: currentUser?.email || '',
    department: currentUser?.department || 'Electronics and Communication Engineering (ECE)',
    year: currentUser?.year || 'III',
    section: currentUser?.section || 'A',
    organization: currentUser?.organization || 'VIVA Institute of Technology'
  });

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'password'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (currentUser?.id) {
        updateUserProfile(currentUser.id, profileData);
      }
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      if (currentUser?.id) {
        await changeUserPassword(currentUser.id, currentPassword, newPassword);
      }
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-[32px] animate-fade-in max-w-[1280px] mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#CBD5E1] pb-4">
        <div>
          <span className="text-xs font-mono text-[#64748B]">Page 24 of 24 • User Identity</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            {isFaculty ? 'Faculty Profile' : 'Student Profile'}
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage your credentials, academic details, and security keys
          </p>
        </div>

        {/* Action: Logout Button */}
        <button
          onClick={onLogout}
          className="btn-danger text-xs h-[40px] px-4 w-auto flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Container (Form Width 520px Rule) */}
      <div className="w-full max-w-[520px] mx-auto">
        <div className="ent-card p-6 sm:p-8 space-y-6">
          
          {/* Identity Header */}
          <div className="flex items-center gap-3 border-b border-[#CBD5E1] pb-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] border border-[#CBD5E1] flex items-center justify-center text-[#1E3A8A]">
              {isFaculty ? <Users className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">{currentUser?.fullName || 'User Profile'}</h2>
              <span className="text-xs font-mono text-[#64748B]">{currentUser?.regNo || 'REG-ID'}</span>
            </div>
          </div>

          {/* Tab Switcher: Profile Details vs Change Password */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#EEF4FF] border border-[#CBD5E1]">
            <button
              type="button"
              onClick={() => { setActiveTab('details'); setError(''); setSuccess(''); }}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'details'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Profile Details
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'password'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Change Password
            </button>
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

              {/* Mandated Action: Update Profile */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full max-w-full"
                >
                  {loading ? 'Saving Changes...' : 'Update Profile'}
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

              {/* Mandated Action: Change Password */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full max-w-full"
                >
                  {loading ? 'Updating Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
