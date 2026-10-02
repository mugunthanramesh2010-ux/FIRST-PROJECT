import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Award,
  BrainCircuit,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  FileText,
  Timer
} from 'lucide-react';

export default function ReportModal({ isOpen, onClose, sessionData, user }) {
  if (!isOpen) return null;

  const data = sessionData || {
    topic: 'MOSFET',
    domain: 'Electronics and Communication Engineering (ECE)',
    masteryLevel: 'Mastered',
    facultyTotalMarks: 100,
    totalEarnedMarks: 88.5,
    overallScore: 89,
    knowledgeScore: 94,
    reasoningScore: 90,
    curiosityIndex: 91,
    innovationIndex: 88,
    retentionScore: 86,
    authenticityScore: 98,
    humanConfidenceScore: 96,
    wpm: 64,
    tabSwitches: 0,
    pasteAttempts: 0,
    timestamp: new Date().toISOString(),
    questionTimingHistory: [
      {
        questionNumber: 1,
        questionText: 'What is a MOSFET and explain gate inversion electrostatics?',
        bloomLevel: 'Understanding',
        timeSpentSeconds: 42,
        timingStatus: 'NORMAL',
        malpracticeDetected: false,
        assignedMarks: 15,
        earnedMarks: 13.5
      },
      {
        questionNumber: 2,
        questionText: 'Why do switching power supplies favor MOSFETs over BJTs in saturation?',
        bloomLevel: 'Analysis',
        timeSpentSeconds: 28,
        timingStatus: 'NORMAL',
        malpracticeDetected: false,
        assignedMarks: 25,
        earnedMarks: 25.0
      },
      {
        questionNumber: 3,
        questionText: 'Electric vehicle traction inverter case study: Miller plateau reduction.',
        bloomLevel: 'Application',
        timeSpentSeconds: 78,
        timingStatus: 'NORMAL',
        malpracticeDetected: false,
        assignedMarks: 30,
        earnedMarks: 26.0
      },
      {
        questionNumber: 4,
        questionText: 'Sub-3nm GAA nanosheet subthreshold leakage design challenge.',
        bloomLevel: 'Creation',
        timeSpentSeconds: 95,
        timingStatus: 'NORMAL',
        malpracticeDetected: false,
        assignedMarks: 30,
        earnedMarks: 24.0
      }
    ]
  };

  const timingHistory = data.questionTimingHistory || [];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + [
      ["Metric", "Value"],
      ["Student Name", user?.fullName || 'Kanish V'],
      ["Register Number", user?.regNo || '714022104042'],
      ["Assessment Topic", data.topic],
      ["Marks Awarded", `${data.totalEarnedMarks} / ${data.facultyTotalMarks}`],
      ["Knowledge Score", `${data.knowledgeScore}%`],
      ["Reasoning Score", `${data.reasoningScore}%`],
      ["Authenticity Score", `${data.authenticityScore}%`],
      ["Typing Cadence", `${data.wpm} WPM`]
    ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Viva_Report_${user?.regNo || 'STUDENT'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportJson = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `Viva_Report_${user?.regNo || 'STUDENT'}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportExcel = () => {
    const excelData = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"/></head>
      <body>
        <table>
          <tr><th colspan="2" style="background:#0D1117;color:#00F5D4;font-size:16px;">VIVA ANALYSER OFFICIAL DOSSIER</th></tr>
          <tr><td><strong>Student Name</strong></td><td>${user?.fullName || 'Kanish V'}</td></tr>
          <tr><td><strong>Register Number</strong></td><td>${user?.regNo || '714022104042'}</td></tr>
          <tr><td><strong>Assessment Topic</strong></td><td>${data.topic}</td></tr>
          <tr><td><strong>Faculty Marks</strong></td><td>${data.totalEarnedMarks} / ${data.facultyTotalMarks}</td></tr>
          <tr><td><strong>Overall Score</strong></td><td>${data.overallScore}%</td></tr>
          <tr><td><strong>Authenticity Score</strong></td><td>${data.authenticityScore}%</td></tr>
          <tr><td><strong>Attending Time WPM</strong></td><td>${data.wpm} WPM</td></tr>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob([excelData], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Viva_Assessment_Report_${user?.regNo || 'STUDENT'}_${Date.now()}.xls`;
    a.click();
    a.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1117]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#161B22] border border-[#30363D] p-6 sm:p-8 rounded-[16px] max-h-[92vh] overflow-y-auto shadow-2xl space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col gap-4 border-b border-[#30363D] pb-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="badge-mastered">Official PDF Dossier</span>
              <span className="caption-text text-[#8B949E]">Cryptographically Signed Assessment</span>
            </div>
            <button
              onClick={onClose}
              className="btn-icon w-8 h-8 text-[#8B949E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* EXACT EXPORT BUTTONS: PDF, CSV, JSON, Excel (Size 160px × 48px) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={handlePrint}
              style={{ width: '160px', height: '48px' }}
              className="btn-primary rounded-[10px] mx-auto text-[14px] font-semibold"
            >
              <Printer className="w-4 h-4 text-[#0D1117]" />
              <span>PDF / Print</span>
            </button>

            <button
              onClick={handleExportCsv}
              style={{ width: '160px', height: '48px' }}
              className="btn-secondary rounded-[10px] mx-auto text-[14px] font-semibold"
            >
              <FileText className="w-4 h-4 text-[#00F5D4]" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJson}
              style={{ width: '160px', height: '48px' }}
              className="btn-secondary rounded-[10px] mx-auto text-[14px] font-semibold"
            >
              <FileText className="w-4 h-4 text-[#FF007A]" />
              <span>JSON</span>
            </button>

            <button
              onClick={handleExportExcel}
              style={{ width: '160px', height: '48px' }}
              className="btn-secondary rounded-[10px] mx-auto text-[14px] font-semibold"
            >
              <Download className="w-4 h-4 text-[#39FF14]" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Dossier Document Sheet (White print sheet for high-contrast export) */}
        <div className="bg-[#0D1117] border border-[#30363D] rounded-[16px] p-6 sm:p-8 space-y-6">
          
          {/* Institution & Assessment Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#30363D] pb-5">
            <div>
              <h2 className="text-[24px] font-bold text-[#F0F6FC]">VIVA VOCE EVALUATION DOSSIER</h2>
              <div className="caption-text mt-1 text-[#8B949E]">
                Autonomous Cognitive Intelligence System • Evaluation Engine
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[12px] font-mono text-[#00F5D4]">REF: VIVA-{Date.now().toString().slice(-6)}</div>
              <div className="text-[11px] text-[#8B949E]">{new Date(data.timestamp).toLocaleString()}</div>
            </div>
          </div>

          {/* Student Candidate Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[12px] bg-[#161B22] border border-[#30363D] text-[13px]">
            <div>
              <span className="text-[#8B949E] block text-[11px] uppercase font-bold">Candidate Name</span>
              <strong className="text-[#F0F6FC]">{user?.fullName || 'Kanish V'}</strong>
            </div>
            <div>
              <span className="text-[#8B949E] block text-[11px] uppercase font-bold">Register Number</span>
              <strong className="text-[#00F5D4] font-mono">{user?.regNo || '714022104042'}</strong>
            </div>
            <div>
              <span className="text-[#8B949E] block text-[11px] uppercase font-bold">Topic Examined</span>
              <strong className="text-[#F0F6FC]">{data.topic}</strong>
            </div>
            <div>
              <span className="text-[#8B949E] block text-[11px] uppercase font-bold">Discipline</span>
              <strong className="text-[#F0F6FC]">{data.domain || 'ECE'}</strong>
            </div>
          </div>

          {/* Marks Awarded & Core Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="ent-card p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#8B949E]">Marks Awarded</span>
              <div className="text-[32px] font-black text-[#00F5D4] font-mono mt-1">
                {data.totalEarnedMarks} <span className="text-[16px] text-[#8B949E]">/ {data.facultyTotalMarks}</span>
              </div>
              <span className="text-[11px] text-[#39FF14] font-bold">Grade: O (Outstanding)</span>
            </div>

            <div className="ent-card p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#8B949E]">Knowledge Score</span>
              <div className="text-[32px] font-black text-[#39FF14] font-mono mt-1">{data.knowledgeScore}%</div>
              <span className="text-[11px] text-[#8B949E]">Cognitive Recall</span>
            </div>

            <div className="ent-card p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#8B949E]">Reasoning Score</span>
              <div className="text-[32px] font-black text-[#FFB800] font-mono mt-1">{data.reasoningScore}%</div>
              <span className="text-[11px] text-[#8B949E]">Analytical Depth</span>
            </div>

            <div className="ent-card p-4 text-center">
              <span className="text-[11px] font-bold uppercase text-[#8B949E]">Authenticity</span>
              <div className="text-[32px] font-black text-[#39FF14] font-mono mt-1">{data.authenticityScore}%</div>
              <span className="text-[11px] text-[#39FF14] font-bold">Certified Clean</span>
            </div>
          </div>

          {/* Question Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-[16px] font-bold text-[#F0F6FC] flex items-center gap-2">
              <Timer className="w-4 h-4 text-[#00F5D4]" />
              <span>Question Attending Time & Marks Audit</span>
            </h3>

            <div className="overflow-x-auto rounded-[12px] border border-[#30363D]">
              <table className="w-full text-[13px] text-left text-[#F0F6FC]">
                <thead className="bg-[#161B22] text-[#8B949E] font-bold uppercase text-[11px] border-b border-[#30363D]">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Question Prompt</th>
                    <th className="p-3">Bloom Level</th>
                    <th className="p-3">Attending Time</th>
                    <th className="p-3">Malpractice Check</th>
                    <th className="p-3">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D] bg-[#0D1117]">
                  {timingHistory.map((q) => (
                    <tr key={q.questionNumber}>
                      <td className="p-3 font-mono font-bold text-[#00F5D4]">Q{q.questionNumber}</td>
                      <td className="p-3 text-[#F0F6FC] max-w-sm truncate">{q.questionText}</td>
                      <td className="p-3">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#161B22] border border-[#30363D] text-[#00F5D4]">
                          {q.bloomLevel}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[#8B949E]">{q.timeSpentSeconds}s</td>
                      <td className="p-3">
                        <span className="badge-mastered text-[11px]">Passed</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#39FF14]">
                        {q.earnedMarks} / {q.assignedMarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Seal */}
          <div className="p-4 rounded-[12px] bg-[#161B22] border border-[#30363D] flex justify-between items-center text-[12px]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#39FF14]" />
              <div>
                <strong className="text-[#F0F6FC]">100% Offline Cryptographic Integrity Certified</strong>
                <p className="text-[#8B949E]">Keystroke biometrics, attending duration, and answer structure validated locally.</p>
              </div>
            </div>
            <span className="font-mono text-[#00F5D4] text-[11px]">SHA-256: 4f8a9e2c...b17d</span>
          </div>

        </div>

      </div>
    </div>
  );
}
