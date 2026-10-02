import React, { useState } from 'react';
import { FileSpreadsheet, Printer, Download, Eye, Search, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getAllAssessmentSessions } from '../../services/db';

export default function FacultyResultsPage({ onNavigate, onOpenReport }) {
  const [sessions] = useState(() => {
    const list = getAllAssessmentSessions();
    if (list && list.length > 0) return list;
    return [
      {
        id: 'sess-1',
        studentName: 'Kanish M',
        studentRegNo: '714022104055',
        topic: 'MOSFET',
        totalEarnedMarks: 88.5,
        facultyTotalMarks: 100,
        masteryLevel: 'Mastered',
        authenticityScore: 98,
        timestamp: new Date().toISOString()
      },
      {
        id: 'sess-2',
        studentName: 'Aarav Sharma',
        studentRegNo: '714022104001',
        topic: 'CNN & Deep Learning',
        totalEarnedMarks: 94.0,
        facultyTotalMarks: 100,
        masteryLevel: 'Mastered',
        authenticityScore: 96,
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'sess-3',
        studentName: 'Divya Krishnan',
        studentRegNo: '714022104018',
        topic: 'Satellite Communication',
        totalEarnedMarks: 72.0,
        facultyTotalMarks: 100,
        masteryLevel: 'Proficient',
        authenticityScore: 91,
        timestamp: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(s =>
    (s.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.studentRegNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.topic || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = (session) => {
    window.print();
  };

  const handleExportCsv = (session) => {
    const csvContent = "data:text/csv;charset=utf-8," + [
      ["Metric", "Value"],
      ["Student Name", session.studentName || 'Student'],
      ["Register Number", session.studentRegNo || 'REG-NO'],
      ["Subject / Topic", session.topic || 'MOSFET'],
      ["Marks", `${session.totalEarnedMarks || 0} / ${session.facultyTotalMarks || 100}`],
      ["Mastery Level", session.masteryLevel || 'Mastered'],
      ["Authenticity Score", `${session.authenticityScore || 95}%`],
      ["Date", new Date(session.timestamp).toLocaleDateString()]
    ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RESULT_${session.studentRegNo || 'STUDENT'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-[32px] animate-fade-in max-w-[1280px] mx-auto py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#CBD5E1] pb-4">
        <div>
          <span className="text-xs font-mono text-[#64748B]">Page 21 of 24 • Results Registry</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
            Faculty Results
          </h1>
          <p className="text-xs text-[#64748B]">
            Aggregated oral examination performance, authenticity scoring, and marks transcripts
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

      {/* Search Toolbar */}
      <div className="ent-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, register number, or subject..."
            className="form-input pl-10 text-xs"
          />
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <div className="text-xs text-[#64748B]">
          Showing <strong>{filteredSessions.length}</strong> validated evaluation records
        </div>
      </div>

      {/* Mandated Table: Student, Subject, Marks, Mastery, Authenticity, Date, Actions (View, Export, Print) */}
      <div className="ent-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#EEF4FF] border-b border-[#CBD5E1] text-[#0F172A] font-bold text-xs">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Student</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Marks</th>
                <th className="py-3.5 px-4">Mastery</th>
                <th className="py-3.5 px-4">Authenticity</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E1]">
              {filteredSessions.map((session, idx) => (
                <tr key={session.id || idx} className="hover:bg-[#F8FAFC] transition-colors">
                  
                  {/* Student */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="font-semibold text-[#0F172A]">{session.studentName || 'Student'}</div>
                    <div className="text-[11px] font-mono text-[#64748B]">{session.studentRegNo || '714022104055'}</div>
                  </td>

                  {/* Subject */}
                  <td className="py-3.5 px-4 font-medium text-[#1E3A8A]">
                    {session.topic || 'MOSFET'}
                  </td>

                  {/* Marks */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A]">
                    {session.totalEarnedMarks || 88} / {session.facultyTotalMarks || 100}
                  </td>

                  {/* Mastery */}
                  <td className="py-3.5 px-4">
                    <span className="badge-mastered">
                      {session.masteryLevel || 'Mastered'}
                    </span>
                  </td>

                  {/* Authenticity */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#15803D]">
                    {session.authenticityScore || 98}%
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-[#64748B]">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </td>

                  {/* Mandated Actions: View, Export, Print */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      
                      <button
                        onClick={() => onOpenReport(session)}
                        className="px-2.5 py-1 rounded-lg bg-[#EEF4FF] hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white border border-[#CBD5E1] font-semibold text-[11px] transition-all"
                        title="View detailed dossier"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 inline" />
                        View
                      </button>

                      <button
                        onClick={() => handleExportCsv(session)}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#334155] text-[#334155] hover:text-white border border-[#CBD5E1] font-semibold text-[11px] transition-all"
                        title="Export CSV"
                      >
                        <Download className="w-3.5 h-3.5 mr-1 inline" />
                        Export
                      </button>

                      <button
                        onClick={() => handlePrint(session)}
                        className="p-1.5 rounded-lg border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] hover:bg-[#EEF4FF] transition-colors"
                        title="Print Result"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
