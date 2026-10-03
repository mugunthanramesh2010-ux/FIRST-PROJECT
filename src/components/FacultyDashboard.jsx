import React, { useState } from 'react';
import {
  Activity,
  Users,
  ShieldAlert,
  KeyRound,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
  Search,
  Sparkles,
  Award,
  Calendar,
  Sliders,
  AlertTriangle,
  Zap,
  Timer,
  BookOpen,
  FolderArchive,
  FileText,
  Check,
  Send,
  Download,
  FolderOpen
} from 'lucide-react';
import {
  getAllStudents,
  getAuditLogs,
  getFacultyRecoveryRequests,
  facultyApproveRecovery,
  getAllAssessmentSessions,
  getQuizConfig,
  updateQuizConfig,
  getCohortAssignments,
  saveCohortAssignment,
  generateCohortStudentMarkFiles,
  openLocalFolderInExplorer
} from '../services/db';

export default function FacultyDashboard({ currentUser, onOpenReport }) {
  const [activeSubTab, setActiveSubTab] = useState('assign'); // 'assign' | 'filemanager' | 'deadline' | 'timing' | 'heatmap' | 'students' | 'security' | 'recovery'
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [students, setStudents] = useState(getAllStudents());
  const [recoveryRequests, setRecoveryRequests] = useState(getFacultyRecoveryRequests());
  const [auditLogs, setAuditLogs] = useState(getAuditLogs());
  const [sessions, setSessions] = useState(getAllAssessmentSessions());
  const [tempKeyAlert, setTempKeyAlert] = useState(null);

  // Cohort Subject Assignment & 1000 Member File State
  const [cohortAssignments, setCohortAssignments] = useState(getCohortAssignments());
  const [assignedSubjectInput, setAssignedSubjectInput] = useState('Semiconductor Device Physics (MOSFET)');
  const [assignedCohortTarget, setAssignedCohortTarget] = useState('Whole Class (All Cohort - 1000 Members)');
  const [assignedMarksInput, setAssignedMarksInput] = useState(100);
  const [assignedDurationInput, setAssignedDurationInput] = useState(15);
  const [assignmentSuccessAlert, setAssignmentSuccessAlert] = useState(false);

  // File Manager & Student Marks Storage State
  const [studentMarkFiles, setStudentMarkFiles] = useState(() => generateCohortStudentMarkFiles(30));
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [selectedFileModal, setSelectedFileModal] = useState(null);

  // Faculty Quiz Config State
  const [quizConfig, setQuizConfig] = useState(getQuizConfig());
  const [configSavedAlert, setConfigSavedAlert] = useState(false);

  // Knowledge Gap Heatmap Mock Aggregate
  const conceptTopics = [
    { topic: 'Semiconductor Inversion (MOSFET)', masteredCount: 18, moderateCount: 6, weakCount: 3 },
    { topic: 'Convolution Kernels (CNN)', masteredCount: 22, moderateCount: 4, weakCount: 1 },
    { topic: 'Constitutional Basic Structure', masteredCount: 12, moderateCount: 9, weakCount: 6 },
    { topic: 'Spaced Memory Retention (Ebbinghaus)', masteredCount: 20, moderateCount: 5, weakCount: 2 },
    { topic: 'Quantum Key Distribution (QKD)', masteredCount: 8, moderateCount: 11, weakCount: 8 }
  ];

  const handleApproveRecovery = async (reqId) => {
    try {
      const tempPass = await facultyApproveRecovery(reqId, currentUser?.regNo || 'FACULTY_ADMIN');
      setRecoveryRequests(getFacultyRecoveryRequests());
      setTempKeyAlert(`Recovery approved! Temporary password generated: ${tempPass}. Student must change password on next login.`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveQuizConfig = (e) => {
    e.preventDefault();
    const updated = updateQuizConfig(quizConfig);
    setQuizConfig(updated);
    setConfigSavedAlert(true);
    setTimeout(() => setConfigSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 border-l-4 border-slate-900 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-amber">Faculty Control Center</span>
            <span className="text-xs text-slate-500 font-medium">Institutional Governance & Quiz Deadline Authority</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
            Faculty Assessment Control & Timing Intelligence
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed font-medium">
            Configure quiz deadlines, total marks, and timing thresholds. Monitor real-time student attending times, compare with historical baselines, and cross-check for malpractice or copy-pasting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={async () => {
              await openLocalFolderInExplorer();
            }}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 font-bold cursor-pointer"
            title="Open Viva_Records folder in Windows File Explorer"
          >
            <FolderOpen className="w-4 h-4 text-[#00F5D4]" />
            <span>Open in File Manager</span>
          </button>

          <button
            onClick={() => onOpenReport && onOpenReport({ isFacultySummary: true })}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 font-bold shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Cohort Report</span>
          </button>
        </div>
      </div>

      {/* 4 CARDS PER ROW GRID LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {/* Card 1: Analytics Charts */}
        <div className="score-card h-[160px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00F5D4]" />
              <span className="text-[12px] font-bold text-[#8B949E] uppercase">Analytics Charts</span>
            </div>
            <div className="text-[32px] font-extrabold text-[#F0F6FC] font-mono leading-tight">
              81.4<span className="text-[16px] text-[#8B949E]">%</span>
            </div>
            <div className="text-[11px] text-[#39FF14] font-semibold">Cohort Mean Mastery</div>
          </div>
          <div className="text-right font-mono text-[11px] text-[#8B949E]">
            <div>Velocity: 1.4x</div>
            <div className="text-[#00F5D4] font-bold mt-1">45s / Q avg</div>
          </div>
        </div>

        {/* Card 2: Student Heatmaps */}
        <div className="score-card h-[160px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FFB800]" />
              <span className="text-[12px] font-bold text-[#8B949E] uppercase">Student Heatmaps</span>
            </div>
            <div className="text-[32px] font-extrabold text-[#F0F6FC] font-mono leading-tight">
              27 <span className="text-[16px] text-[#8B949E]">Nodes</span>
            </div>
            <div className="text-[11px] text-[#8B949E] font-medium">18 Mastered • 3 Weak</div>
          </div>
          <button
            onClick={() => setActiveSubTab('heatmap')}
            className="btn-secondary h-[34px] min-w-0 text-[11px] px-2.5 py-1"
          >
            View Map
          </button>
        </div>

        {/* Card 3: Authenticity Alerts */}
        <div className="score-card h-[160px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#39FF14]" />
              <span className="text-[12px] font-bold text-[#8B949E] uppercase">Authenticity Alerts</span>
            </div>
            <div className="text-[32px] font-extrabold text-[#39FF14] font-mono leading-tight">
              0 <span className="text-[16px] text-[#8B949E]">Flags</span>
            </div>
            <div className="text-[11px] text-[#39FF14] font-semibold">100% Certified Clean</div>
          </div>
          <button
            onClick={() => setActiveSubTab('security')}
            className="btn-secondary h-[34px] min-w-0 text-[11px] px-2.5 py-1"
          >
            Audit Log
          </button>
        </div>

        {/* Card 4: Mastery Reports */}
        <div className="score-card h-[160px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#FF007A]" />
              <span className="text-[12px] font-bold text-[#8B949E] uppercase">Mastery Reports</span>
            </div>
            <div className="text-[32px] font-extrabold text-[#00F5D4] font-mono leading-tight">
              1,000 <span className="text-[16px] text-[#8B949E]">Files</span>
            </div>
            <div className="text-[11px] text-[#8B949E] font-medium">PDF • CSV • Excel</div>
          </div>
          <button
            onClick={() => onOpenReport && onOpenReport({ isFacultySummary: true })}
            className="btn-primary h-[34px] min-w-0 text-[11px] px-3 py-1 text-[#0D1117]"
          >
            Export
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto gap-1">
        <button
          onClick={() => setActiveSubTab('assign')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'assign' ? 'bg-[#000080] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Assign Subject & Quiz (Whole Class)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('filemanager')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'filemanager' ? 'bg-[#000080] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderArchive className="w-4 h-4 text-emerald-400" />
          <span>Class Records Folder (1,000+ Files)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('deadline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'deadline' ? 'bg-[#000080] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Timer className="w-4 h-4 text-amber-400" />
          <span>Quiz Deadline & Total Marks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('timing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'timing' ? 'bg-[#000080] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Timing & Malpractice Analysis</span>
        </button>

        <button
          onClick={() => setActiveSubTab('heatmap')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'heatmap' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Knowledge Gap Heatmap</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'students' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Student Cohort ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'security' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Anti-Cheat Audit</span>
        </button>

        <button
          onClick={() => setActiveSubTab('recovery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeSubTab === 'recovery' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4 text-purple-400" />
          <span>Recovery Queue ({recoveryRequests.filter(r => r.status === 'PENDING').length})</span>
        </button>
      </div>

      {configSavedAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-fade-in shadow-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Faculty Quiz Deadline & Total Marks configuration updated successfully! All active tests will strictly adhere to these limits.</span>
        </div>
      )}

      {tempKeyAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{tempKeyAlert}</span>
          </div>
          <button onClick={() => setTempKeyAlert(null)} className="text-emerald-950 font-bold hover:underline text-xs ml-4">
            Dismiss
          </button>
        </div>
      )}

      {assignmentSuccessAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-fade-in shadow-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Subject and Quiz successfully assigned to the whole class! Student individual result files will be stored automatically in the records folder upon evaluation.</span>
        </div>
      )}

      {/* 0A. ASSIGN SUBJECT & QUIZ TO WHOLE CLASS */}
      {activeSubTab === 'assign' && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-cyan text-xs">Faculty Assignment Portal</span>
                <span className="text-xs text-slate-500 font-medium">Cohort Batch Allocation</span>
              </div>
              <h3 className="font-bold text-[#333333] text-lg mt-1 font-heading">
                Assign Subject & Quiz to Students (Whole Class)
              </h3>
              <p className="text-xs text-[#555555] max-w-2xl font-medium">
                Publish a specific curriculum topic or viva assessment to an entire class of up to 1,000 members. Individual student marks and evaluation metrics will be generated and archived into their respective files.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newAssign = saveCohortAssignment({
                subjectName: assignedSubjectInput,
                assignedTo: assignedCohortTarget,
                facultyName: currentUser?.fullName || 'Faculty Head',
                totalMarks: assignedMarksInput,
                deadlineMinutes: assignedDurationInput
              });
              setCohortAssignments(getCohortAssignments());
              setAssignmentSuccessAlert(true);
              setTimeout(() => setAssignmentSuccessAlert(false), 4000);
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200"
          >
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-[#333333] mb-1">
                  Assigned Subject / Curriculum Topic
                </label>
                <input
                  type="text"
                  required
                  value={assignedSubjectInput}
                  onChange={(e) => setAssignedSubjectInput(e.target.value)}
                  placeholder="e.g. Semiconductor Device Physics (MOSFET & CMOS)"
                  className="glass-input text-xs font-semibold"
                />
                <p className="text-[11px] text-[#777777] mt-1 font-medium">
                  Students will receive this topic on their viva question prompt automatically.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-1">
                  Target Student Cohort
                </label>
                <select
                  value={assignedCohortTarget}
                  onChange={(e) => setAssignedCohortTarget(e.target.value)}
                  className="glass-input text-xs font-semibold"
                >
                  <option value="Whole Class (All Cohort - 1000 Members)">Whole Class (All Cohort - 1,000 Members)</option>
                  <option value="Section A (Students 1 to 500)">Section A (Students 1 to 500)</option>
                  <option value="Section B (Students 501 to 1000)">Section B (Students 501 to 1,000)</option>
                  <option value="Department of Electronics & Communication">Department of Electronics & Communication</option>
                  <option value="Department of Computer Science Engineering">Department of Computer Science Engineering</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-[#333333] mb-1">
                  Total Assessment Marks
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={assignedMarksInput}
                    onChange={(e) => setAssignedMarksInput(parseInt(e.target.value) || 100)}
                    className="glass-input font-mono text-sm"
                  />
                  <span className="text-[#333333] font-bold">Marks</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-1">
                  Quiz Completion Deadline
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={assignedDurationInput}
                    onChange={(e) => setAssignedDurationInput(parseInt(e.target.value) || 15)}
                    className="glass-input font-mono text-sm"
                  />
                  <span className="text-[#333333] font-bold">Minutes</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary py-3 px-6 text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4 text-cyan-200" />
                  <span>Publish Subject Assignment to Whole Class</span>
                </button>
              </div>
            </div>
          </form>

          {/* Assigned History Table */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-[#333333] text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>Active Subject Assignments Published by Faculty</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left text-[#333333]">
                <thead className="bg-slate-100 text-[#333333] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Assigned Subject</th>
                    <th className="p-3">Target Cohort</th>
                    <th className="p-3">Faculty In-Charge</th>
                    <th className="p-3">Marks</th>
                    <th className="p-3">Deadline</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cohortAssignments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#4169E1]">{item.subjectName}</td>
                      <td className="p-3 font-medium">{item.assignedTo}</td>
                      <td className="p-3">{item.facultyName}</td>
                      <td className="p-3 font-mono font-bold">{item.totalMarks} M</td>
                      <td className="p-3 font-mono">{item.deadlineMinutes} mins</td>
                      <td className="p-3 text-[11px] text-[#777777]">{item.assignedDate}</td>
                      <td className="p-3"><span className="badge badge-emerald text-[10px]">{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 0B. CLASS RECORDS FOLDER (1,000+ FILES IN FILE MANAGER) */}
      {activeSubTab === 'filemanager' && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-emerald text-xs">File Manager Store</span>
                <span className="text-xs text-slate-500 font-medium font-mono">/VIVA_ANALYSER_RECORDS/CLASS_COHORT_1000/</span>
              </div>
              <h3 className="font-bold text-[#333333] text-lg mt-1 font-heading">
                Cohort Student Mark Files Storage (1,000 Members)
              </h3>
              <p className="text-xs text-[#555555] max-w-2xl font-medium">
                Individual student evaluations evaluated and stored inside independent file manager records. Faculty can view any student's individual file, inspect evaluated marks, attending times, and edit marks if needed.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={async () => {
                  await openLocalFolderInExplorer();
                }}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-2 font-bold cursor-pointer"
                title="Open Viva_Records directory in Windows File Explorer"
              >
                <FolderOpen className="w-4 h-4 text-[#0D1117]" />
                <span>Open Folder on PC</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(studentMarkFiles, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `VIVA_CLASS_MARKS_1000_STUDENTS_${Date.now()}.json`;
                  a.click();
                }}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-2 font-bold"
              >
                <Download className="w-4 h-4 text-cyan-300" />
                <span>Export All 1,000 Records (.JSON)</span>
              </button>
            </div>
          </div>

          {/* Search File Filter */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student register number, name, or file name (e.g. 22ECE001)..."
              value={fileSearchQuery}
              onChange={(e) => setFileSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-[#333333] font-medium"
            />
          </div>

          {/* File Grid / Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left text-[#333333]">
              <thead className="bg-slate-100 text-[#333333] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">File Name</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Reg No</th>
                  <th className="p-3">Evaluated Marks</th>
                  <th className="p-3">Attending Time</th>
                  <th className="p-3">Authenticity Check</th>
                  <th className="p-3">File Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentMarkFiles
                  .filter(f => f.studentName.toLowerCase().includes(fileSearchQuery.toLowerCase()) || f.regNo.toLowerCase().includes(fileSearchQuery.toLowerCase()))
                  .map((file, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-[#4169E1] font-bold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#000080]" />
                        <span>{file.fileName}</span>
                      </td>
                      <td className="p-3 font-bold text-[#333333]">{file.studentName}</td>
                      <td className="p-3 font-mono font-bold text-[#000080]">{file.regNo}</td>
                      <td className="p-3 font-mono font-bold text-[#059669]">
                        {file.earnedMarks} / {file.totalFacultyMarks} ({file.percentageScore}%)
                      </td>
                      <td className="p-3 font-mono">
                        {file.avgAttendingTimeSecs}s <span className="text-[10px] text-[#777777]">(Base: {file.historicalBaselineSecs}s)</span>
                      </td>
                      <td className="p-3">
                        <span className={`badge ${file.malpracticeFlags === 0 ? 'badge-emerald' : 'badge-rose'} text-[10px]`}>
                          {file.malpracticeFlags === 0 ? 'Authentic (0 Pastes)' : `${file.malpracticeFlags} Flags`}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedFileModal(file)}
                          className="px-3 py-1 rounded bg-[#000080] text-white hover:bg-[#000066] font-bold text-[11px] shadow-sm"
                        >
                          Open & Inspect File
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT INDIVIDUAL FILE MODAL */}
      {selectedFileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-blue-200 shadow-2xl animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4169E1]" />
                <h4 className="font-bold text-base text-[#333333]">File: {selectedFileModal.fileName}</h4>
              </div>
              <button
                onClick={() => setSelectedFileModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 font-mono text-[11px] text-[#333333]">
              <div><strong>Path:</strong> {selectedFileModal.folderPath}{selectedFileModal.fileName}</div>
              <div><strong>Student:</strong> {selectedFileModal.studentName} ({selectedFileModal.regNo})</div>
              <div><strong>Department:</strong> {selectedFileModal.department}</div>
              <div><strong>Assigned Topic:</strong> {selectedFileModal.assignedSubject}</div>
              <div className="text-[#059669] font-bold"><strong>Evaluated Marks:</strong> {selectedFileModal.earnedMarks} / {selectedFileModal.totalFacultyMarks} ({selectedFileModal.percentageScore}%)</div>
              <div><strong>Average Attending Time:</strong> {selectedFileModal.avgAttendingTimeSecs} seconds per question</div>
              <div><strong>Historic Baseline:</strong> {selectedFileModal.historicalBaselineSecs} seconds</div>
              <div><strong>Evaluation Status:</strong> {selectedFileModal.evaluationStatus}</div>
              <div><strong>Timestamp:</strong> {selectedFileModal.timestamp}</div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-[#333333] block">Faculty Adjustment (Override Student Marks):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={selectedFileModal.earnedMarks}
                  id="facultyOverrideMarks"
                  className="glass-input font-mono w-28 text-xs font-bold"
                />
                <button
                  onClick={() => {
                    const newM = parseInt(document.getElementById('facultyOverrideMarks').value) || selectedFileModal.earnedMarks;
                    const updated = studentMarkFiles.map(f => f.regNo === selectedFileModal.regNo ? { ...f, earnedMarks: newM, percentageScore: Math.round((newM / f.totalFacultyMarks) * 100) } : f);
                    setStudentMarkFiles(updated);
                    setSelectedFileModal(null);
                    alert(`Marks updated in student record file for ${selectedFileModal.regNo}!`);
                  }}
                  className="btn-primary py-2 px-4 text-xs font-bold"
                >
                  Save File Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. QUIZ DEADLINE & TOTAL MARKS SETUP */}
      {activeSubTab === 'deadline' && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Quiz Deadline & Total Marks Policy</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Set strict deadlines for student tests. The AI automatically distributes marks across questions and enforces auto-submission when time runs out.
              </p>
            </div>
            <span className="badge badge-amber text-xs">Faculty Authority</span>
          </div>

          <form onSubmit={handleSaveQuizConfig} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Total Assessment Marks Assigned
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={quizConfig.totalMarks}
                    onChange={(e) => setQuizConfig({ ...quizConfig, totalMarks: parseInt(e.target.value) || 100 })}
                    className="glass-input font-mono text-sm"
                  />
                  <span className="text-slate-600 font-bold">Marks</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  AI dynamically weighs questions (e.g. 15, 25, 30, 30 marks) to sum exactly to this total.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Quiz Overall Deadline (Duration)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={quizConfig.durationMinutes}
                    onChange={(e) => setQuizConfig({ ...quizConfig, durationMinutes: parseInt(e.target.value) || 15 })}
                    className="glass-input font-mono text-sm"
                  />
                  <span className="text-slate-600 font-bold">Minutes</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Active countdown clock displayed to student with auto-submit on expiry.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Per-Question Time Limit
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={20}
                    max={600}
                    value={quizConfig.perQuestionSeconds}
                    onChange={(e) => setQuizConfig({ ...quizConfig, perQuestionSeconds: parseInt(e.target.value) || 120 })}
                    className="glass-input font-mono text-sm"
                  />
                  <span className="text-slate-600 font-bold">Seconds</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Baseline allocated per question to evaluate pacing and detect abnormal delays.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Minimum Passing Score
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={quizConfig.totalMarks}
                    value={quizConfig.passingMarks}
                    onChange={(e) => setQuizConfig({ ...quizConfig, passingMarks: parseInt(e.target.value) || 50 })}
                    className="glass-input font-mono text-sm"
                  />
                  <span className="text-slate-600 font-bold">Marks</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Late Submission / Timeout Penalty (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={quizConfig.penaltyForLate}
                    onChange={(e) => setQuizConfig({ ...quizConfig, penaltyForLate: parseInt(e.target.value) || 10 })}
                    className="glass-input font-mono text-sm"
                  />
                  <span className="text-slate-600 font-bold">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Deduction applied if student answer exceeds per-question time limit.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizConfig.strictTiming}
                    onChange={(e) => setQuizConfig({ ...quizConfig, strictTiming: e.target.checked })}
                    className="accent-slate-900"
                  />
                  <span className="font-bold text-slate-900">Enforce Strict Deadline Auto-Submission</span>
                </label>
                <p className="text-[11px] text-slate-500 font-medium">
                  When enabled, student inputs are automatically locked and graded the exact second the quiz deadline expires.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 pt-3 border-t border-slate-200 flex justify-end">
              <button type="submit" className="btn-primary py-2.5 px-7 text-xs font-bold shadow-md">
                Save & Apply Deadline Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. TIMING & MALPRACTICE CROSS-CHECKING INSPECTOR */}
      {activeSubTab === 'timing' && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Student Question Answering Time & Malpractice Log</h3>
              <p className="text-xs text-slate-500 font-medium">
                Detailed comparison of attending time vs student historical baseline. Flags superhuman speed spikes, clipboard dumps, and late timeouts.
              </p>
            </div>
            <span className="badge badge-cyan text-xs">Real-Time Telemetry</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left text-slate-800">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Topic</th>
                  <th className="p-3">Avg Answering Time</th>
                  <th className="p-3">Baseline Compare</th>
                  <th className="p-3">Malpractice / Copy Check</th>
                  <th className="p-3">Faculty Marks</th>
                  <th className="p-3">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 font-medium">
                      No student test sessions recorded yet. Completed tests will appear here with timing analytics.
                    </td>
                  </tr>
                ) : (
                  sessions.map((sess) => {
                    const avgTime = sess.wpm ? Math.round(60 / (sess.wpm / 15)) : 38;
                    const baseline = 45;
                    const isSuspicious = sess.burstsDetected > 0 || sess.pasteAttempts > 0 || avgTime < 10;

                    return (
                      <tr key={sess.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{sess.studentName}</div>
                          <div className="font-mono text-[10px] text-sky-700 font-semibold">{sess.studentRegNo}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{sess.topic}</div>
                          <div className="text-[10px] text-slate-500">{sess.domain}</div>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="text-slate-900 font-bold">{avgTime}s</span> / question
                          <div className="text-[10px] text-slate-500">{sess.wpm} WPM ({sess.cps} CPS)</div>
                        </td>
                        <td className="p-3">
                          <span className={`badge ${avgTime < baseline * 0.4 ? 'badge-rose' : 'badge-emerald'} text-[10px]`}>
                            {avgTime < baseline ? `${Math.round(((baseline - avgTime) / baseline) * 100)}% Faster` : 'Normal Pacing'}
                          </span>
                        </td>
                        <td className="p-3">
                          {sess.pasteAttempts > 0 || sess.burstsDetected > 0 ? (
                            <span className="badge badge-rose text-[10px]">
                              {sess.pasteAttempts} Pastes • {sess.burstsDetected} Dumps
                            </span>
                          ) : (
                            <span className="badge badge-emerald text-[10px]">Clean (0 Pastes)</span>
                          )}
                        </td>
                        <td className="p-3 font-mono font-bold text-sky-800">
                          {Math.round((sess.overallScore / 100) * quizConfig.totalMarks)} / {quizConfig.totalMarks}
                        </td>
                        <td className="p-3">
                          {isSuspicious ? (
                            <span className="badge badge-rose text-[10px]">Flagged Review</span>
                          ) : (
                            <span className="badge badge-emerald text-[10px]">Certified Authentic</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. KNOWLEDGE GAP & CLASS ANALYTICS SUITE */}
      {activeSubTab === 'heatmap' && (
        <div className="space-y-6">
          
          {/* Top Analytics Metrics Row (Subject Analytics, Class Analytics, Learning Velocity, Mastery Prediction) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#D0E3F5] shadow-sm space-y-1">
              <span className="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Subject Analytics</span>
              <div className="text-xl font-black text-[#333333] font-heading">Semiconductor Devices</div>
              <p className="text-[11px] text-[#059669] font-semibold">91.4% Syllabus Coverage</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#D0E3F5] shadow-sm space-y-1">
              <span className="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Class Analytics</span>
              <div className="text-xl font-black text-[#000080] font-heading font-mono">1,000 Students Enrolled</div>
              <p className="text-[11px] text-[#4169E1] font-semibold">82.6% Class Average Score</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#D0E3F5] shadow-sm space-y-1">
              <span className="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Cohort Learning Velocity</span>
              <div className="text-xl font-black text-[#059669] font-heading font-mono">1.38x Baseline Pace</div>
              <p className="text-[11px] text-[#555555]">Rapid Bloom progression</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#D0E3F5] shadow-sm space-y-1">
              <span className="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Mastery Prediction</span>
              <div className="text-xl font-black text-[#D97706] font-heading">18 Days → Expert Tier</div>
              <p className="text-[11px] text-[#555555]">AI projected exam readiness</p>
            </div>
          </div>

          {/* Authenticity & AI Misuse Alerts Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-emerald-950 font-bold block">Authenticity Telemetry: 98.4% Clean Rate</strong>
                <span className="text-emerald-800">984 out of 1,000 submissions certified authentic with 0 clipboard pastes.</span>
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 flex items-center gap-3 text-xs">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong className="text-rose-950 font-bold block">AI Misuse Alerts: 16 Flagged for Audit</strong>
                <span className="text-rose-800">Instant keystroke dumps and burst WPM (&gt;180 WPM) intercepted and locked.</span>
              </div>
            </div>
          </div>

          {/* Student Ranking Heatmap */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-[#333333] text-base font-heading">Student Ranking Heatmap (Top &amp; Bottom Cohort Distribution)</h3>
                <p className="text-xs text-[#555555]">Live ranking based on dynamic evaluation marks, attending time speed factor, and originality.</p>
              </div>
              <span className="badge badge-emerald text-xs">Cohort 1000 Ranked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { rank: '#1', name: 'Kanish (22ECE104)', score: 98.5, status: 'Top 1% Elite', color: 'border-emerald-300 bg-emerald-50/50' },
                { rank: '#2', name: 'Aarav Sharma (22ECE012)', score: 96.0, status: 'Top 5%', color: 'border-blue-300 bg-blue-50/50' },
                { rank: '#3', name: 'Divya Nair (22ECE045)', score: 94.5, status: 'Top 5%', color: 'border-blue-300 bg-blue-50/50' },
                { rank: '#4', name: 'Rohit Verma (22ECE089)', score: 92.0, status: 'Top 10%', color: 'border-slate-300 bg-slate-50' }
              ].map((s, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border ${s.color} space-y-1`}>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="font-mono text-[#000080]">{s.rank}</span>
                    <span className="font-mono text-[#059669]">{s.score} M</span>
                  </div>
                  <div className="font-bold text-[#333333] text-xs truncate">{s.name}</div>
                  <span className="text-[10px] text-[#777777] font-semibold block">{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Concepts vs Strong Concepts Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* STRONG CONCEPTS */}
            <div className="bg-white rounded-2xl p-6 border border-[#D0E3F5] shadow-sm space-y-3">
              <h4 className="font-bold text-[#059669] text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Concepts (Cohort Mastery &gt; 80%)</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                  <div>
                    <strong>Enhancement Mode Operation</strong>
                    <div className="text-[11px] text-emerald-800">92% of students articulated channel turn-on kinetics accurately.</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-700">92%</span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                  <div>
                    <strong>Gate Dielectric SiO2 Capacitance</strong>
                    <div className="text-[11px] text-emerald-800">88% correctly applied Cox = εox / tox formulas.</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-700">88%</span>
                </div>
              </div>
            </div>

            {/* WEAK CONCEPTS */}
            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm space-y-3">
              <h4 className="font-bold text-[#E11D48] text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Weak Concepts (Knowledge Gaps Identified &lt; 60%)</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center">
                  <div>
                    <strong>Inversion Layer Strong Inversion (2DEG)</strong>
                    <div className="text-[11px] text-rose-800">48% deficit in explaining band bending ψs = 2ψB surface potential.</div>
                  </div>
                  <span className="font-mono font-bold text-rose-700">48%</span>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center">
                  <div>
                    <strong>Subthreshold Swing & Leakage Current</strong>
                    <div className="text-[11px] text-rose-800">54% struggled with 60 mV/decade thermodynamic limit.</div>
                  </div>
                  <span className="font-mono font-bold text-rose-700">54%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Cohort Mastery Heatmap */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Concept Knowledge Gap Heatmap</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Visualizing prerequisite understanding across student batch. (Green = Strong Mastery, Yellow = Moderate, Red = Weak Gap).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Strong</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded"></span> Moderate</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-500 rounded"></span> Weak Gap</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {conceptTopics.map((item, idx) => {
                const total = item.masteredCount + item.moderateCount + item.weakCount;
                const pGreen = (item.masteredCount / total) * 100;
                const pYellow = (item.moderateCount / total) * 100;
                const pRed = (item.weakCount / total) * 100;

                return (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-900">{item.topic}</span>
                      <span className="text-slate-500 font-mono">{item.masteredCount} Mastered / {total} Students</span>
                    </div>

                    <div className="w-full h-3 bg-slate-200 rounded-full flex overflow-hidden">
                      <div style={{ width: `${pGreen}%` }} className="bg-emerald-500 h-full" title={`Strong: ${item.masteredCount}`} />
                      <div style={{ width: `${pYellow}%` }} className="bg-amber-500 h-full" title={`Moderate: ${item.moderateCount}`} />
                      <div style={{ width: `${pRed}%` }} className="bg-rose-500 h-full" title={`Weak: ${item.weakCount}`} />
                    </div>

                    <div className="flex justify-between items-center text-[11px] font-bold pt-1">
                      <span className="text-emerald-700">{Math.round(pGreen)}% Confident</span>
                      <span className="text-amber-700">{Math.round(pYellow)}% Need Revision</span>
                      <span className="text-rose-700">{Math.round(pRed)}% Foundational Deficit</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 4. STUDENT ROSTER */}
      {activeSubTab === 'students' && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Enrolled Students Roster</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left text-slate-800">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Reg Number</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Year / Sec</th>
                  <th className="p-3">Learning DNA Primary</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{std.fullName}</td>
                    <td className="p-3 font-mono text-sky-700 font-bold">{std.regNo}</td>
                    <td className="p-3 font-medium">{std.department}</td>
                    <td className="p-3 font-medium">{std.year} - {std.section}</td>
                    <td className="p-3">
                      <span className="badge badge-purple text-[10px]">
                        {std.dnaProfile?.analytical > 80 ? 'Analytical Learner' : 'Visual Learner'}
                      </span>
                    </td>
                    <td className="p-3">
                      {std.isLocked ? (
                        <span className="badge badge-rose text-[10px]">Locked</span>
                      ) : (
                        <span className="badge badge-emerald text-[10px]">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ANTI-CHEAT AUDIT */}
      {activeSubTab === 'security' && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Audit Trail & Zero-Copy Enforcement Log</h3>
            <span className="badge badge-rose text-xs">Behavioral AI Monitoring Active</span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${log.action.includes('LOCK') || log.action.includes('BREACH') ? 'badge-rose' : 'badge-cyan'} text-[10px]`}>
                      {log.action}
                    </span>
                    <span className="font-mono text-slate-600 font-bold">{log.actor}</span>
                  </div>
                  <div className="text-slate-700 mt-1 leading-relaxed font-medium">{log.details}</div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap ml-4">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PASSWORD RECOVERY QUEUE */}
      {activeSubTab === 'recovery' && (
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Faculty Identity Verification & Password Recovery</h3>
            <span className="text-xs text-slate-500 font-medium">Authorized Faculty Action Only</span>
          </div>

          {recoveryRequests.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center font-medium">No pending student recovery requests.</p>
          ) : (
            <div className="space-y-3">
              {recoveryRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{req.regNo}</span>
                      <span className={`badge ${req.status === 'APPROVED' ? 'badge-emerald' : 'badge-amber'} text-[10px]`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Email: {req.email}</div>
                    <div className="text-xs text-slate-700 mt-1 italic font-medium">Reason: "{req.reason}"</div>
                    {req.tempPassword && (
                      <div className="mt-2 text-xs font-mono text-emerald-700 font-bold">
                        Generated Temp Pass: <strong>{req.tempPassword}</strong>
                      </div>
                    )}
                  </div>

                  {req.status === 'PENDING' && (
                    <button
                      onClick={() => handleApproveRecovery(req.id)}
                      className="btn-primary text-xs py-2 px-5 whitespace-nowrap font-bold"
                    >
                      Verify & Generate Temp Password
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
