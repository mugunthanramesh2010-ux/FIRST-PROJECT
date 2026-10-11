import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle2, AlertCircle, ArrowLeft, Upload, FileText, Sparkles, Brain, Cpu, ShieldCheck } from 'lucide-react';
import { saveCohortAssignment } from '../../services/db';
import { checkOllamaAvailability } from '../../services/aiQuestionService';

const DEPARTMENTS = [
  'All Departments',
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

export default function CreateAssignmentPage({ currentUser, onNavigate }) {
  const [formData, setFormData] = useState({
    assignmentName: '',
    subject: '',
    topic: '',
    targetYear: 'III',
    targetSection: 'A',
    targetDepartment: 'Electronics and Communication Engineering',
    deadline: '15',
    marks: 100,
    questionCount: 10,
    difficultyPolicy: 'Adaptive (Bloom Dynamic Scale)',
    hintPolicy: 'Progressive 4-Level Guidance',
    mode: 'Mixed',
    documentContext: '',
    uploadedFileName: ''
  });

  const [ollamaStatus, setOllamaStatus] = useState({ available: false, activeModel: null });
  const [loading, setLoading] = useState(false);
  const [createdAssignment, setCreatedAssignment] = useState(null);
  const [error, setError] = useState('');
  const [lanInfo, setLanInfo] = useState({ hostIp: '127.0.0.1', port: 5173, studentUrl: 'http://localhost:5173/' });

  const questionPresets = [5, 10, 15, 20, 25, 30, 50, 75, 100];

  useEffect(() => {
    checkOllamaAvailability().then(res => setOllamaStatus(res));
    fetch('/api/lan-info')
      .then(res => res.json())
      .then(data => { if (data && data.studentUrl) setLanInfo(data); })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle Document Upload (PDF, PPT, DOC, TXT)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        // Extract plain text
        setFormData(prev => ({
          ...prev,
          documentContext: content,
          uploadedFileName: file.name
        }));
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const count = parseInt(formData.questionCount, 10);
    if (!count || count < 1 || count > 100) {
      return setError('Question count must be between 1 and 100 questions.');
    }

    if (!formData.assignmentName.trim() || !formData.subject.trim() || !formData.topic.trim()) {
      return setError('Please fill in Assignment Name, Subject, and Topic.');
    }

    setLoading(true);
    try {
      const assignmentId = 'asg_' + Date.now();

      const cohortLabel = `Year ${formData.targetYear} • Sec ${formData.targetSection} (${formData.targetDepartment})`;

      const saved = saveCohortAssignment({
        id: assignmentId,
        assignmentName: formData.assignmentName.trim(),
        subjectName: formData.assignmentName.trim(),
        subject: formData.subject.trim(),
        topic: formData.topic.trim(),
        targetYear: formData.targetYear,
        targetSection: formData.targetSection,
        targetDepartment: formData.targetDepartment,
        assignedTo: cohortLabel,
        deadlineMinutes: parseInt(formData.deadline, 10) || 15,
        totalMarks: parseInt(formData.marks, 10) || 100,
        questionCount: count,
        difficultyPolicy: formData.difficultyPolicy,
        hintPolicy: formData.hintPolicy,
        mode: formData.mode,
        documentContext: formData.documentContext,
        facultyName: currentUser?.fullName || 'Dr. S. Ramanathan',
        facultyId: currentUser?.regNo || 'FAC-ECE-01'
      });

      setCreatedAssignment(saved);
    } catch (err) {
      setError(err.message || 'Failed to create assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in w-full py-2 text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#E2D3A7] pb-4">
        <div>
          <span className="text-xs font-mono text-[#718096]">Page 19 • Assignment Builder</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            Create Class Viva Assignment
          </h1>
          <p className="text-sm font-medium text-[#718096]">
            Configure syllabus topic, upload notes/PPT/PDF materials, and assign strictly to Year & Section cohorts
          </p>
        </div>
        <button
          onClick={() => onNavigate('faculty-dashboard')}
          className="btn-outline text-xs h-[40px] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Dashboard
        </button>
      </div>

      {/* Main Form Container - Expanded to 100% Full Width */}
      <div className="w-full">
        <div className="ent-card p-6 sm:p-10 space-y-8 bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl shadow-xl shadow-[#B7791F]/10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2D3A7] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3D6] border-2 border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
                <PlusCircle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#2D3748]">Publish Viva Assessment</h2>
                <p className="text-xs sm:text-sm text-[#718096]">Subject-accurate oral exam with hidden AI progression</p>
              </div>
            </div>

            {/* Hidden AI & Ollama Status Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
              <Sparkles className="w-4 h-4 text-[#B7791F]" />
              <span>
                Hidden AI: {ollamaStatus.available ? `Ollama (${ollamaStatus.activeModel})` : 'Offline Deep Subject Engine'}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-[#FFF0F0] border-2 border-[#FECACA] text-[#C53030] text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {createdAssignment && (
            <div className="p-5 rounded-2xl bg-[#E6F4EA] border-2 border-[#A8DAB5] space-y-3">
              <div className="flex items-center gap-2.5 text-base font-extrabold text-[#2F855A]">
                <CheckCircle2 className="w-6 h-6" />
                <span>Assignment Successfully Published!</span>
              </div>
              <p className="text-sm text-[#2F855A]">
                Assigned strictly to <strong>{createdAssignment.assignedTo}</strong>.
                Only students in that Year and Section can see and attend this viva.
              </p>
              <div className="p-3 bg-white/90 rounded-xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-950 block">Multi-PC / Mobile Student Access Link:</span>
                  <span className="font-mono text-emerald-800 select-all">{lanInfo.studentUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(lanInfo.studentUrl);
                    alert(`Copied link: ${lanInfo.studentUrl}`);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 cursor-pointer text-xs"
                >
                  Copy Student Link
                </button>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('faculty-dashboard')}
                  className="btn-primary h-[40px] px-5 text-xs font-bold cursor-pointer"
                >
                  Return to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedAssignment(null)}
                  className="btn-outline h-[40px] px-5 text-xs font-bold cursor-pointer"
                >
                  Create Another Assignment
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Basic Subject & Assignment Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-bold text-[#2D3748]">Assignment Title</label>
                <input
                  type="text"
                  name="assignmentName"
                  value={formData.assignmentName}
                  onChange={handleChange}
                  placeholder="e.g. Strength of Materials & Stress Analysis Viva"
                  className="w-full text-base font-medium p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm sm:text-base font-bold text-[#2D3748]">Subject Name</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Solid Mechanics & Strength of Materials"
                  className="w-full text-base font-medium p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                  required
                />
              </div>
            </div>

            {/* 2. Specific Topic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm sm:text-base font-bold text-[#2D3748]">
                  Specific Syllabus Topic
                </label>
                <span className="text-xs font-bold text-[#B7791F]">
                  Subject-specific questions generated (NO generic MOSFET templates)
                </span>
              </div>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. Stress in Strength of Materials, Mohr's Circle, Hooke's Law"
                className="w-full text-base sm:text-lg font-bold p-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                required
              />
            </div>

            {/* 3. TARGET COHORT ENFORCEMENT: Class / Year, Section, Department */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF3D6]/50 border-2 border-[#E2D3A7] space-y-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#8B5E34] uppercase tracking-wide">
                <ShieldCheck className="w-5 h-5 text-[#B7791F]" />
                <span>Cohort Targeting: Ensure Only Specific Class Students Can Attend</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2D3748]">Target Year</label>
                  <select
                    name="targetYear"
                    value={formData.targetYear}
                    onChange={handleChange}
                    className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] cursor-pointer"
                  >
                    <option value="I">1st Year (I)</option>
                    <option value="II">2nd Year (II)</option>
                    <option value="III">3rd Year (III)</option>
                    <option value="IV">4th Year (IV)</option>
                    <option value="All Years">All Years</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2D3748]">Target Section</label>
                  <select
                    name="targetSection"
                    value={formData.targetSection}
                    onChange={handleChange}
                    className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] cursor-pointer"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                    <option value="All Sections">All Sections</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2D3748]">Target Department</label>
                  <select
                    name="targetDepartment"
                    value={formData.targetDepartment}
                    onChange={handleChange}
                    className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] cursor-pointer"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. DOCUMENT / SYLLABUS / NOTES UPLOAD OPTION (PDF, PPT, DOCX, TXT) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#B7791F] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-[#2D3748]">
                  <Upload className="w-5 h-5 text-[#B7791F]" />
                  <span>Upload Syllabus / Material Notes (PDF, PPT, DOC, TXT)</span>
                </div>
                {formData.uploadedFileName && (
                  <span className="text-xs font-bold text-[#2F855A] bg-[#E6F4EA] px-2.5 py-1 rounded-md">
                    ✓ {formData.uploadedFileName} Loaded
                  </span>
                )}
              </div>
              <p className="text-xs text-[#718096]">
                When material is uploaded, the Hidden AI analyzes the specific document content and generates acute, topic-focused questions so students master the exact syllabus notes.
              </p>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="w-full text-xs text-[#718096] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#B7791F] file:text-white hover:file:bg-[#975A16] cursor-pointer"
              />
            </div>

            {/* 5. QUESTION COUNT SELECTOR (1 to 100 Questions) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm sm:text-base font-bold text-[#2D3748]">Question Count (1 to 100)</label>
                <span className="text-sm font-bold text-[#B7791F] font-mono">
                  {formData.questionCount} Questions Selected
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {questionPresets.map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, questionCount: qty }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      Number(formData.questionCount) === qty
                        ? 'bg-[#B7791F] text-white border-[#B7791F]'
                        : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:bg-[#FFF3D6]'
                    }`}
                  >
                    {qty} Qs
                  </button>
                ))}
              </div>

              <input
                type="number"
                name="questionCount"
                value={formData.questionCount}
                onChange={handleChange}
                className="w-full text-base font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                min="1"
                max="100"
                required
              />
            </div>

            {/* 6. Total Marks & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-[#2D3748]">Total Marks</label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  className="w-full text-base font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-[#2D3748]">Session Duration (Minutes)</label>
                <input
                  type="number"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full text-base font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                />
              </div>
            </div>

            {/* 7. Mode */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#2D3748]">Question Format</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'Choice Based (MCQ)', label: 'Choice Based (MCQ)' },
                  { value: 'Conceptual Text', label: 'Conceptual Text' },
                  { value: 'Mixed', label: 'Mixed (Both)' }
                ].map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, mode: m.value }))}
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer text-center ${
                      formData.mode === m.value
                        ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-sm'
                        : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:bg-[#FFF3D6]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#B7791F] hover:bg-[#975A16] text-white text-base sm:text-lg font-extrabold shadow-lg shadow-[#B7791F]/25 transition-all cursor-pointer text-center"
              >
                {loading ? 'Publishing...' : `Publish Assignment (${formData.questionCount} Questions to Year ${formData.targetYear} - Sec ${formData.targetSection})`}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}
