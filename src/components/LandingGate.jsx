import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  Shield,
  ArrowRight,
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  Award,
  Users
} from 'lucide-react';

export default function LandingGate({ onSelectRole, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-12 animate-fade-in">
      
      {/* 1. HERO BRAND BANNER WITH SPACIOUS PADDING */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#D0E3F5] shadow-lg shadow-blue-900/5 text-center relative overflow-hidden">
        {/* Subtle Cyan ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#E6F2FD] border border-[#BAE6FD] text-[#000080] font-bold text-xs tracking-wider uppercase">
            <Cpu className="w-4 h-4 text-[#4169E1]" />
            <span>Universal Adaptive Cognitive Viva Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
            <span className="text-[#059669]">100% Offline AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#333333] tracking-tight font-heading leading-tight">
            VIVA <span className="text-[#4169E1]">ANALYSER</span>
          </h1>

          <p className="text-base sm:text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed">
            Welcome to the Next-Generation Academic Viva Evaluation Platform. Seamlessly assess viva examinations, evaluate answer attending time, prevent malpractice, and dynamically award marks.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-primary text-sm px-8 py-3.5 shadow-lg shadow-blue-600/30 flex items-center gap-2.5"
            >
              <UserCheck className="w-5 h-5 text-cyan-200" />
              <span>Login to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="btn-secondary text-sm px-8 py-3.5 flex items-center gap-2.5"
            >
              <GraduationCap className="w-5 h-5 text-cyan-300" />
              <span>New Student Registration</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CHOOSE YOUR PORTAL: FACULTY OR STUDENT GATE */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#333333] font-heading">
            Choose Your Access Portal
          </h2>
          <p className="text-sm text-[#777777]">
            Select whether you are attending a viva assessment or administering the cohort examination
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* STUDENT CARD */}
          <div className="bg-white rounded-3xl p-8 border border-[#D0E3F5] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#E6F2FD] border border-[#BAE6FD] flex items-center justify-center text-[#4169E1] group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#4169E1] border border-blue-200">
                  Student Portal
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#333333] font-heading">
                  Student Viva Arena
                </h3>
                <p className="text-sm text-[#555555] mt-2 leading-relaxed">
                  Enter your details or topic to start an adaptive oral examination. Answer multi-level conceptual questions with real-time Bloom taxonomy calibration and zero copy-paste protection.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#555555]">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Choose or type <strong>ANY Topic / Subject</strong> (120+ Disciplines)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#555555]">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Real-time Attending Time Tracking & Historic Baseline comparison</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#555555]">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>Instant Cognitive Feedback & Adaptive Hints without revealing answers</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectRole('student')}
                className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 font-bold"
              >
                <span>Enter as Student (Start Viva)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FACULTY CARD */}
          <div className="bg-white rounded-3xl p-8 border border-[#D0E3F5] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#E6F2FD] border border-[#BAE6FD] flex items-center justify-center text-[#000080] group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-[#000080]" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-[#000080] border border-indigo-200">
                  Faculty Authority
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#333333] font-heading">
                  Faculty Assignment & Governance
                </h3>
                <p className="text-sm text-[#555555] mt-2 leading-relaxed">
                  Assign subjects and quizzes to entire student cohorts (up to 1,000+ students). Set deadlines, total marks, and evaluate results stored securely in local file manager records.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#555555]">
                  <CheckCircle2 className="w-4 h-4 text-[#4169E1] shrink-0" />
                  <span>Assign Subjects, Quiz Duration & Total Marks for Whole Class</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#555555]">
                  <CheckCircle2 className="w-4 h-4 text-[#4169E1] shrink-0" />
                  <span>Batch Store Student Result Files (1,000+ cohort records in file store)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#555555]">
                  <CheckCircle2 className="w-4 h-4 text-[#4169E1] shrink-0" />
                  <span>Live Malpractice & Copy-Paste Keystroke Cadence Interceptor</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectRole('faculty')}
                className="w-full btn-secondary py-3.5 text-sm flex items-center justify-center gap-2 font-bold"
              >
                <span>Enter Faculty Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. PLATFORM HIGHLIGHTS (SPACIOUS 3-CARD ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white rounded-2xl p-6 border border-[#D0E3F5] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4169E1]">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-[#333333] text-base">Timing Baseline Intelligence</h4>
          <p className="text-xs text-[#555555] leading-relaxed">
            Calculates student attending time per question, compares with historical averages, and flags suspicious speed bursts or malpractice.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D0E3F5] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#000080]">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-[#333333] text-base">Faculty Mark Evaluation</h4>
          <p className="text-xs text-[#555555] leading-relaxed">
            Faculty sets total marks (e.g. 100 Marks) and deadline. AI balances dynamic question weights and automatically evaluates student scores.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D0E3F5] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-[#00E5FF]">
            <Users className="w-5 h-5 text-cyan-600" />
          </div>
          <h4 className="font-bold text-[#333333] text-base">Cohort Batch File Storage</h4>
          <p className="text-xs text-[#555555] leading-relaxed">
            Handles up to 1,000+ students per class. Stores individual mark files and evaluation transcripts in the local offline database storage.
          </p>
        </div>
      </div>

    </div>
  );
}
