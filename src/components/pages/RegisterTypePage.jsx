import React from 'react';
import { GraduationCap, Users, ArrowRight, ArrowLeft, Shield } from 'lucide-react';

export default function RegisterTypePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#EEF4FF] flex flex-col justify-between p-4 sm:p-8">
      
      {/* Top Header / Back Link */}
      <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#334155] hover:text-[#1E3A8A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-xs text-[#64748B] font-mono">
          VIVA ANALYSER • Account Setup
        </div>
      </div>

      {/* Main Choice Section */}
      <main className="max-w-3xl w-full mx-auto my-auto py-10 space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F2] text-[#0F766E] text-xs font-semibold border border-[#CBD5E1]">
            <Shield className="w-3.5 h-3.5" />
            <span>Role Separation Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Choose Account Type
          </h1>
          <p className="text-sm text-[#475569]">
            Select your academic role to proceed with personalized registration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
          
          {/* Card 1: Create Student Account */}
          <div
            onClick={() => onNavigate('student-register')}
            className="ent-card cursor-pointer group hover:border-[#1E3A8A] flex flex-col justify-between p-8 text-left transition-all"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] border border-[#CBD5E1] flex items-center justify-center text-[#1E3A8A] group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                  Create Student Account
                </h3>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Register with your Register Number, Department, and Year to attend adaptive viva examinations and track your Learning DNA.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#CBD5E1]/60 mt-6 flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E3A8A]">Proceed to Student Form</span>
              <ArrowRight className="w-4 h-4 text-[#1E3A8A] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Create Faculty Account */}
          <div
            onClick={() => onNavigate('faculty-register')}
            className="ent-card cursor-pointer group hover:border-[#334155] flex flex-col justify-between p-8 text-left transition-all"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center text-[#334155] group-hover:scale-105 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#334155] transition-colors">
                  Create Faculty Account
                </h3>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  Register with your Faculty ID and Department to create cohort assignments, review anti-cheat telemetry, and manage students.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#CBD5E1]/60 mt-6 flex items-center justify-between">
              <span className="text-xs font-bold text-[#334155]">Proceed to Faculty Form</span>
              <ArrowRight className="w-4 h-4 text-[#334155] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-[#64748B]">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('student-login')}
              className="text-[#1E3A8A] font-semibold hover:underline"
            >
              Login as Student
            </button>
            {' '}or{' '}
            <button
              onClick={() => onNavigate('faculty-login')}
              className="text-[#334155] font-semibold hover:underline"
            >
              Login as Faculty
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#64748B] py-4">
        100% Offline Cryptographic Architecture • Zero Cloud Dependence
      </footer>

    </div>
  );
}
