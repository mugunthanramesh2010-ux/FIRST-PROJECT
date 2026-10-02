import React, { useState } from 'react';
import { PlusCircle, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { saveCohortAssignment } from '../../services/db';

export default function CreateAssignmentPage({ currentUser, onNavigate }) {
  const [formData, setFormData] = useState({
    assignmentName: 'Semiconductor Inversion & MOSFET Viva',
    subject: 'Solid State Semiconductor Devices',
    topic: 'MOSFET',
    students: 'Whole Class (All Cohort - Section A, B, C)',
    deadline: '15',
    marks: 100,
    questionCount: 10,
    difficultyPolicy: 'Adaptive (Bloom Dynamic Scale)',
    hintPolicy: 'Progressive 4-Level Guidance',
    mode: 'Mixed'
  });

  const [loading, setLoading] = useState(false);
  const [createdAssignment, setCreatedAssignment] = useState(null);
  const [error, setError] = useState('');

  const questionPresets = [5, 10, 15, 20, 25, 30, 50, 75, 100];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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

      const saved = saveCohortAssignment({
        id: assignmentId,
        subjectName: formData.assignmentName,
        subject: formData.subject,
        topic: formData.topic,
        assignedTo: formData.students,
        deadlineMinutes: parseInt(formData.deadline, 10) || 15,
        totalMarks: parseInt(formData.marks, 10) || 100,
        questionCount: count,
        difficultyPolicy: formData.difficultyPolicy,
        hintPolicy: formData.hintPolicy,
        mode: formData.mode,
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
    <div className="space-y-[32px] animate-fade-in max-w-[1280px] mx-auto py-4 text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-4">
        <div>
          <span className="text-xs font-mono text-[#718096]">Page 19 • Assignment Builder</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            Create Assignment
          </h1>
          <p className="text-xs text-[#718096]">
            Configure syllabus, customize question count (1 to 100), and publish directly to students
          </p>
        </div>
        <button
          onClick={() => onNavigate('faculty-dashboard')}
          className="btn-outline text-xs h-[40px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Dashboard
        </button>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-[520px] mx-auto">
        <div className="ent-card p-6 sm:p-8 space-y-6 bg-[#FFFCF4] border-[#E2D3A7]">
          
          <div className="flex items-center gap-3 border-b border-[#E2D3A7] pb-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#FFF3D6] border border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2D3748]">New Viva Assignment</h2>
              <p className="text-xs text-[#718096]">Custom syllabus module with 1 to 100 questions</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-[12px] bg-[#FFF0F0] border border-[#FECACA] text-[#C53030] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Inbuilt Assignment Confirmation Banner */}
          {createdAssignment && (
            <div className="p-4 rounded-[14px] bg-[#E6F4EA] border border-[#A8DAB5] space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2F855A]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Assignment Successfully Published!</span>
              </div>
              <p className="text-xs text-[#2F855A]">
                Configured with <strong>{createdAssignment.questionCount} Questions</strong>. It is now active in student assignments.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('faculty-dashboard')}
                  className="btn-primary h-[38px] min-w-0 px-4 text-xs"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedAssignment(null)}
                  className="btn-outline h-[38px] min-w-0 px-4 text-xs"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="form-label">Assignment Name</label>
              <input
                type="text"
                name="assignmentName"
                value={formData.assignmentName}
                onChange={handleChange}
                placeholder="e.g. Semiconductor Inversion & MOSFET Viva"
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Solid State Semiconductor Devices"
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. MOSFET, CNN, Blockchain, Medicine"
                className="form-input"
                required
              />
            </div>

            {/* QUESTION COUNT SELECTOR (1 to 100 Questions) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0">Question Count (1 to 100 Questions)</label>
                <span className="text-xs font-bold text-[#B7791F] font-mono">
                  {formData.questionCount} Questions Selected
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-2">
                {questionPresets.map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, questionCount: qty }))}
                    className={`px-2.5 py-1 rounded-[10px] text-xs font-bold border transition-all ${
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
                className="form-input font-bold"
                min="1"
                max="100"
                placeholder="Enter any number between 1 and 100"
                required
              />
            </div>

            {/* ASSESSMENT MODE SELECTOR: Choice Based (MCQ), Conceptual Text, Mixed */}
            <div>
              <label className="form-label">Question & Answer Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'Choice Based (MCQ)', label: 'Choice Based (MCQ)' },
                  { value: 'Conceptual Text', label: 'Conceptual Text' },
                  { value: 'Mixed', label: 'Mixed (Both)' }
                ].map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, mode: m.value }))}
                    className={`py-2 px-2 rounded-[12px] text-[11px] font-bold border transition-all text-center leading-tight ${
                      formData.mode === m.value
                        ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                        : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:bg-[#FFF3D6]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Assigned Cohort</label>
              <input
                type="text"
                name="students"
                value={formData.students}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Publishing...' : `Publish Assignment (${formData.questionCount} Qs)`}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}
