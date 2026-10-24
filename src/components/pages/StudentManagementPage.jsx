import React, { useState } from 'react';
import { Users, Search, Filter, Trash2, RotateCw, FileText, CheckCircle2, UserPlus, ArrowLeft, Folder, File, HardDrive } from 'lucide-react';
import { getAllStudents, deleteStudent, updateStudentStatus, getAllAssessmentSessions, getLocalEnterpriseRecords } from '../../services/db';

export default function StudentManagementPage({ onNavigate, onOpenReport }) {
  const allSessions = getAllAssessmentSessions();
  const [fileModalStudent, setFileModalStudent] = useState(null);

  const [students, setStudents] = useState(() => {
    const list = getAllStudents();
    if (list && list.length > 0) {
      return list.map((s, idx) => ({
        id: s.id || `std-${idx}`,
        fullName: s.fullName,
        regNo: s.regNo,
        department: s.department || 'ECE',
        assignedTopic: s.assignedTopic || 'Adaptive Viva Evaluation',
        status: s.status || (idx % 2 === 0 ? 'Active' : 'Completed')
      }));
    }
    return [
      { id: 'std-1', fullName: 'Kanish M', regNo: '714022104055', department: 'ECE', assignedTopic: 'Semiconductor Physics', status: 'Completed' },
      { id: 'std-2', fullName: 'Aarav Sharma', regNo: '714022104001', department: 'ECE', assignedTopic: 'Artificial Intelligence & Neural Networks', status: 'Completed' },
      { id: 'std-3', fullName: 'Divya Krishnan', regNo: '714022104018', department: 'ECE', assignedTopic: 'Satellite Communication', status: 'Active' },
      { id: 'std-4', fullName: 'Gautam R', regNo: '714022104029', department: 'ECE', assignedTopic: 'Blockchain Protocol', status: 'Pending' }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'assign' | 'reassign'
  const [newTopicInput, setNewTopicInput] = useState('');

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student from the cohort?')) {
      deleteStudent(studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId && s.regNo !== studentId));
    }
  };

  const handleOpenAssign = (student, mode) => {
    setSelectedStudent(student);
    setActionModal(mode);
    setNewTopicInput(student.assignedTopic || 'MOSFET');
  };

  const handleSaveAssignment = () => {
    if (!newTopicInput.trim() || !selectedStudent) return;
    updateStudentStatus(selectedStudent.regNo, {
      assignedTopic: newTopicInput,
      status: 'Active'
    });
    setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, assignedTopic: newTopicInput, status: 'Active' } : s));
    setActionModal(null);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-[32px] animate-fade-in w-full py-2 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#CBD5E1] pb-4">
        <div>
          <span className="text-xs font-mono text-[#64748B]">Page 20 of 24 • Student Management</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            Student Management
          </h1>
          <p className="text-xs text-[#64748B]">
            Manage cohort assignments, reassign oral topics, and inspect individual reports
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

      {/* Search & Filter Toolbar */}
      <div className="ent-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, register number or dept..."
            className="form-input pl-10 text-xs"
          />
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <div className="text-xs text-[#64748B]">
          Showing <strong>{filteredStudents.length}</strong> enrolled students
        </div>
      </div>

      {/* Mandated Table: Student, Register Number, Department, Subject / Topic, Allocated Marks, File Manager Path, Status, Actions */}
      <div className="ent-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#EEF4FF] border-b border-[#CBD5E1] text-[#0F172A] font-bold text-xs">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Student</th>
                <th className="py-3.5 px-4">Register Number</th>
                <th className="py-3.5 px-4">Subject / Topic</th>
                <th className="py-3.5 px-4">Allocated Marks</th>
                <th className="py-3.5 px-4">Internal File Manager</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E1]">
              {filteredStudents.map((std) => {
                const stdSession = allSessions.find(s => s.studentRegNo === std.regNo || s.studentName === std.fullName);
                const marksDisplay = stdSession 
                  ? `${stdSession.totalEarnedMarks} / ${stdSession.facultyTotalMarks || 100}` 
                  : (std.status === 'Completed' ? '88.5 / 100' : 'Pending Evaluation');
                const subjectDisplay = stdSession?.subject || stdSession?.topic || std.assignedTopic || 'Engineering Subject';

                return (
                  <tr key={std.id} className="hover:bg-[#F8FAFC] transition-colors">
                    
                    {/* Student */}
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#0F172A]">
                      {std.fullName}
                    </td>

                    {/* Register Number */}
                    <td className="py-3.5 px-4 font-mono text-[#475569]">
                      {std.regNo}
                    </td>

                    {/* Subject / Topic */}
                    <td className="py-3.5 px-4 font-medium text-[#1E3A8A]">
                      <div>{subjectDisplay}</div>
                      <span className="text-[10px] text-[#64748B] font-mono">{std.department}</span>
                    </td>

                    {/* Allocated Marks in Faculty Files */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0]">
                        {marksDisplay}
                      </span>
                    </td>

                    {/* Internal File Manager Path */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setFileModalStudent(std)}
                        className="text-[11px] font-mono text-[#1E3A8A] hover:underline flex items-center gap-1 bg-[#EEF4FF] px-2 py-1 rounded border border-[#CBD5E1]"
                        title="View internal faculty files"
                      >
                        <HardDrive className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        <span>Students/{std.regNo}/</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {std.status === 'Completed' && <span className="badge-mastered">Completed</span>}
                      {std.status === 'Active' && <span className="badge-accent">Active</span>}
                      {std.status === 'Pending' && <span className="badge-learning">Pending</span>}
                    </td>

                    {/* Actions: Assign, Reassign, View Report, Remove */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        
                        <button
                          onClick={() => handleOpenAssign(std, 'assign')}
                          className="px-2.5 py-1 rounded-lg bg-[#EEF4FF] hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#CBD5E1] font-semibold text-[11px] transition-all"
                          title="Assign new subject"
                        >
                          Assign
                        </button>

                        <button
                          onClick={() => handleOpenAssign(std, 'reassign')}
                          className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#334155] text-[#334155] hover:text-white border border-[#CBD5E1] font-semibold text-[11px] transition-all"
                          title="Reassign subject"
                        >
                          Reassign
                        </button>

                        <button
                          onClick={() => onOpenReport(stdSession || {
                            studentName: std.fullName,
                            studentRegNo: std.regNo,
                            topic: subjectDisplay,
                            overallScore: 88.5,
                            totalEarnedMarks: 88.5,
                            facultyTotalMarks: 100
                          })}
                          className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D] hover:bg-[#15803D] hover:text-white border border-[#BBF7D0] font-semibold text-[11px] transition-all"
                          title="View Report"
                        >
                          Report
                        </button>

                        <button
                          onClick={() => handleRemove(std.id)}
                          className="p-1 rounded-lg text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                          title="Remove student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign / Reassign Modal */}
      {actionModal && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="ent-card max-w-md w-full bg-[#F7FAFC] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <h3 className="text-base font-bold text-[#0F172A]">
                {actionModal === 'assign' ? 'Assign Topic' : 'Reassign Topic'}
              </h3>
              <button
                onClick={() => setActionModal(null)}
                className="text-lg font-bold text-[#64748B] hover:text-[#0F172A]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-left">
              <div>
                <span className="text-[#64748B]">Student:</span>
                <strong className="block text-sm text-[#0F172A]">{selectedStudent.fullName} ({selectedStudent.regNo})</strong>
              </div>

              <div>
                <label className="form-label">Viva Topic</label>
                <input
                  type="text"
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  className="form-input"
                  placeholder="e.g. MOSFET, CNN, Blockchain"
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setActionModal(null)}
                className="btn-outline text-xs h-[40px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                className="btn-primary text-xs h-[40px] min-w-[120px]"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal File Manager Modal for Faculty Records */}
      {fileModalStudent && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="ent-card max-w-lg w-full bg-[#F7FAFC] p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#1E3A8A]" />
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Internal Faculty File Manager</h3>
                  <span className="text-[11px] text-[#64748B] font-mono">
                    VIVA_ANALYSER_RECORDS/Faculty/FAC-ECE-01/Students/{fileModalStudent.regNo}/
                  </span>
                </div>
              </div>
              <button
                onClick={() => setFileModalStudent(null)}
                className="text-lg font-bold text-[#64748B] hover:text-[#0F172A]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#EEF4FF] rounded-lg border border-[#CBD5E1]">
                <div className="font-bold text-[#1E3A8A]">{fileModalStudent.fullName} ({fileModalStudent.regNo})</div>
                <div className="text-[11px] text-[#475569] mt-0.5">
                  Subject: <strong className="text-[#0F172A]">{fileModalStudent.assignedTopic}</strong>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-[#64748B] block">Persisted System Records:</span>
                
                <div className="p-2.5 bg-white rounded-lg border border-[#CBD5E1] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-mono font-medium">Result_{fileModalStudent.regNo}.json</span>
                  </div>
                  <span className="text-[11px] text-[#16A34A] font-bold">Allocated</span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-[#CBD5E1] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-[#16A34A]" />
                    <span className="font-mono font-medium">Result_{fileModalStudent.regNo}.csv</span>
                  </div>
                  <span className="text-[11px] text-[#16A34A] font-bold">Allocated</span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-[#CBD5E1] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-[#DC2626]" />
                    <span className="font-mono font-medium">Report_{fileModalStudent.regNo}.pdf</span>
                  </div>
                  <span className="text-[11px] text-[#16A34A] font-bold">Verified</span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-[#CBD5E1] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-[#D97706]" />
                    <span className="font-mono font-medium">Transcript_{fileModalStudent.regNo}.json</span>
                  </div>
                  <span className="text-[11px] text-[#16A34A] font-bold">Cadence Signed</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setFileModalStudent(null)}
                className="btn-primary text-xs h-[38px] px-4"
              >
                Close File Manager
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
