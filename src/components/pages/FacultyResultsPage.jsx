import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Eye,
  Search,
  ArrowLeft,
  CheckCircle2,
  FolderOpen,
  FileText,
  FileCode,
  FileCheck
} from 'lucide-react';
import { getAllAssessmentSessions, openLocalFolderInExplorer } from '../../services/db';

export default function FacultyResultsPage({ onNavigate, onOpenReport }) {
  const [sessions] = useState(() => {
    const list = getAllAssessmentSessions();
    if (list && list.length > 0) return list;
    return [
      {
        id: 'sess-1',
        studentName: 'Kanish M',
        studentRegNo: '714022104055',
        topic: 'Stress in Strength of Materials',
        totalEarnedMarks: 88.5,
        facultyTotalMarks: 100,
        masteryLevel: 'Mastered',
        authenticityScore: 100,
        tabSwitches: 0,
        pasteAttempts: 0,
        timestamp: new Date().toISOString()
      },
      {
        id: 'sess-2',
        studentName: 'Aarav Sharma',
        studentRegNo: '714022104001',
        topic: 'Mohr’s Circle & Shear Stress',
        totalEarnedMarks: 94.0,
        facultyTotalMarks: 100,
        masteryLevel: 'Mastered',
        authenticityScore: 95,
        tabSwitches: 0,
        pasteAttempts: 0,
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'sess-3',
        studentName: 'Divya Krishnan',
        studentRegNo: '714022104018',
        topic: 'Euler Buckling & Hooke’s Law',
        totalEarnedMarks: 72.0,
        facultyTotalMarks: 100,
        masteryLevel: 'Proficient',
        authenticityScore: 85,
        tabSwitches: 1,
        pasteAttempts: 0,
        timestamp: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredSessions = sessions.filter(s =>
    (s.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.studentRegNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.topic || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. EXCEL EXPORT (.xls / .xlsx Spreadsheet format with styling & headers)
  const handleExportExcel = (targetSession = null) => {
    const list = targetSession ? [targetSession] : filteredSessions;
    const rowsHtml = list.map((s, idx) => `
      <tr>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${idx + 1}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; font-weight: bold;">${s.studentName || 'Student'}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; font-family: monospace;">${s.studentRegNo || 'REG-NO'}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${s.topic || 'Viva Subject'}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center; font-weight: bold; color: #15803D;">${s.totalEarnedMarks || 0} / ${s.facultyTotalMarks || 100}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center;">${s.masteryLevel || 'Mastered'}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center; font-weight: bold;">${s.authenticityScore || 100}%</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center;">${s.tabSwitches || 0}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center;">${s.pasteAttempts || 0}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center;">${s.disqualified ? 'DISQUALIFIED (0)' : 'PASSED'}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${new Date(s.timestamp).toLocaleDateString()}</td>
      </tr>
    `).join('');

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Viva Results Marksheet</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          th { background-color: #B7791F; color: #FFFFFF; font-weight: bold; padding: 10px; border: 1px solid #975A16; font-family: Arial, sans-serif; font-size: 13px; }
          td { font-family: Arial, sans-serif; font-size: 12px; }
        </style>
      </head>
      <body>
        <h2 style="color: #B7791F; font-family: Arial, sans-serif;">VIVA ANALYSER - OFFICIAL CLASS MARKSHEET</h2>
        <p style="font-family: Arial, sans-serif; font-size: 11px; color: #64748B;">Generated: ${new Date().toLocaleString()}</p>
        <table border="1" style="border-collapse: collapse;">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Register Number</th>
              <th>Subject / Topic</th>
              <th>Marks Awarded</th>
              <th>Mastery Level</th>
              <th>Authenticity</th>
              <th>Tab Switches</th>
              <th>Paste Attempts</th>
              <th>Status</th>
              <th>Examination Date</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = targetSession ? `MARKSHEET_${targetSession.studentRegNo}.xls` : `CLASS_VIVA_MARKSHEET.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded Excel Spreadsheet (.xls / .xlsx compatible) successfully!');
  };

  // 2. WORD EXPORT (.docx / .doc formatted document)
  const handleExportDocx = (targetSession = null) => {
    const list = targetSession ? [targetSession] : filteredSessions;
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Viva Examination Official Transcript</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.5; color: #2D3748; }
          h1 { color: #B7791F; border-bottom: 2px solid #B7791F; padding-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #E2D3A7; padding: 8px 12px; text-align: left; }
          th { background-color: #FFF3D6; color: #8B5E34; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>VIVA ANALYSER - OFFICIAL ORAL EXAMINATION TRANSCRIPT</h1>
        <p><strong>Institution:</strong> Autonomous Engineering Academy</p>
        <p><strong>Date Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total Students Evaluated:</strong> ${list.length}</p>
        <table>
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Student Name</th>
              <th>Subject / Topic</th>
              <th>Marks</th>
              <th>Mastery</th>
              <th>Authenticity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(s => `
              <tr>
                <td>${s.studentRegNo || 'REG-NO'}</td>
                <td><strong>${s.studentName || 'Student'}</strong></td>
                <td>${s.topic || 'Subject'}</td>
                <td><strong>${s.totalEarnedMarks || 0} / ${s.facultyTotalMarks || 100}</strong></td>
                <td>${s.masteryLevel || 'Mastered'}</td>
                <td>${s.authenticityScore || 100}%</td>
                <td>${s.disqualified ? '<span style="color:red;">DISQUALIFIED</span>' : 'CERTIFIED'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = targetSession ? `TRANSCRIPT_${targetSession.studentRegNo}.doc` : `CLASS_VIVA_TRANSCRIPT.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded Word Document (.doc / .docx) successfully!');
  };

  // 3. PDF / PRINT EXPORT
  const handlePrintPdf = () => {
    showToast('Preparing PDF formatted printable view...');
    window.print();
  };

  // 4. CSV EXPORT
  const handleExportCsv = (targetSession = null) => {
    const list = targetSession ? [targetSession] : filteredSessions;
    const rows = [
      ["#", "Student Name", "Register Number", "Subject/Topic", "Marks", "Max Marks", "Mastery Level", "Authenticity Score", "Tab Switches", "Paste Attempts", "Date"],
      ...list.map((s, idx) => [
        idx + 1,
        `"${s.studentName || 'Student'}"`,
        `"${s.studentRegNo || 'REG-NO'}"`,
        `"${s.topic || 'Subject'}"`,
        s.totalEarnedMarks || 0,
        s.facultyTotalMarks || 100,
        `"${s.masteryLevel || 'Mastered'}"`,
        `${s.authenticityScore || 100}%`,
        s.tabSwitches || 0,
        s.pasteAttempts || 0,
        `"${new Date(s.timestamp).toLocaleDateString()}"`
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = targetSession ? `RESULT_${targetSession.studentRegNo}.csv` : `CLASS_VIVA_RESULTS.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded CSV successfully!');
  };

  return (
    <div className="space-y-[32px] animate-fade-in w-full py-2 text-left">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-[#E6F4EA] border-2 border-[#A8DAB5] text-[#2F855A] text-sm font-extrabold shadow-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#2F855A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#E2D3A7] pb-4">
        <div>
          <span className="text-xs font-mono text-[#718096]">Page 21 of 24 • Results Registry</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            Faculty Results & Export Registry
          </h1>
          <p className="text-sm font-medium text-[#718096]">
            Aggregated student viva performance, dynamic authenticity scoring, and multi-format marks download
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              await openLocalFolderInExplorer();
            }}
            className="btn-primary text-xs h-[42px] px-4 flex items-center gap-2 shadow-sm cursor-pointer"
            title="Open local Windows File Manager folder where student results are saved"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Open Windows Records Folder</span>
          </button>
        </div>
      </div>

      {/* BATCH DOWNLOAD CENTER BAR: EXCEL, WORD, PDF, CSV */}
      <div className="ent-card p-5 bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#2D3748]">
              Batch Class Marksheet Export Center
            </h3>
            <p className="text-xs text-[#718096]">
              Download the entire cohort marksheet in your preferred office format:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleExportExcel()}
              className="px-4 py-2.5 rounded-xl bg-[#2F855A] hover:bg-[#276749] text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Download Microsoft Excel Spreadsheet (.xlsx / .xls)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => handleExportDocx()}
              className="px-4 py-2.5 rounded-xl bg-[#2B6CB0] hover:bg-[#2C5282] text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Download Microsoft Word Document (.docx / .doc)"
            >
              <FileText className="w-4 h-4" />
              <span>Download Word (.docx)</span>
            </button>

            <button
              onClick={() => handlePrintPdf()}
              className="px-4 py-2.5 rounded-xl bg-[#C53030] hover:bg-[#9B2C2C] text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Print or Save as PDF (.pdf)"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF (.pdf)</span>
            </button>

            <button
              onClick={() => handleExportCsv()}
              className="px-4 py-2.5 rounded-xl bg-[#4A5568] hover:bg-[#2D3748] text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Download Comma-Separated Values (.csv)"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV (.csv)</span>
            </button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="pt-2 border-t border-[#E2D3A7]">
          <div className="relative max-w-[420px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student name, register number, or topic..."
              className="w-full text-sm font-medium p-3 pl-10 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none"
            />
            <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Mandated Results Table */}
      <div className="ent-card p-0 overflow-hidden border-2 border-[#E2D3A7] rounded-3xl bg-[#FFFCF4]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2D3748]">
            <thead className="bg-[#FFF3D6] border-b-2 border-[#E2D3A7] text-[#8B5E34] font-black text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-4">Subject / Topic</th>
                <th className="py-4 px-4 text-center">Marks</th>
                <th className="py-4 px-4 text-center">Mastery</th>
                <th className="py-4 px-4 text-center">Authenticity</th>
                <th className="py-4 px-4 text-center">Violations</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-6 text-right">Individual Downloads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2D3A7]">
              {filteredSessions.map((session, idx) => (
                <tr key={session.id || idx} className="hover:bg-[#FFF8E8] transition-colors">
                  
                  {/* Student */}
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-[#2D3748] text-base">{session.studentName || 'Student'}</div>
                    <div className="text-xs font-mono font-bold text-[#718096]">{session.studentRegNo || '714022104055'}</div>
                  </td>

                  {/* Subject */}
                  <td className="py-4 px-4 font-bold text-[#8B5E34]">
                    {session.topic || 'Strength of Materials'}
                  </td>

                  {/* Marks */}
                  <td className="py-4 px-4 font-mono font-black text-center text-base">
                    <span className={session.disqualified ? 'text-[#C53030]' : 'text-[#2F855A]'}>
                      {session.totalEarnedMarks || 0} / {session.facultyTotalMarks || 100}
                    </span>
                    {session.disqualified && (
                      <span className="block text-[10px] text-[#C53030] font-bold">DISQUALIFIED</span>
                    )}
                  </td>

                  {/* Mastery */}
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                      session.disqualified
                        ? 'bg-[#FFF0F0] text-[#C53030] border border-[#FECACA]'
                        : 'bg-[#E6F4EA] text-[#2F855A] border border-[#A8DAB5]'
                    }`}>
                      {session.masteryLevel || 'Mastered'}
                    </span>
                  </td>

                  {/* Authenticity */}
                  <td className="py-4 px-4 font-mono font-black text-center text-[#2F855A]">
                    {session.authenticityScore || 100}%
                  </td>

                  {/* Violations */}
                  <td className="py-4 px-4 text-center text-xs font-mono">
                    <span className={(session.tabSwitches || 0) + (session.pasteAttempts || 0) > 0 ? 'text-[#C53030] font-bold' : 'text-[#718096]'}>
                      Tabs: {session.tabSwitches || 0} | Pastes: {session.pasteAttempts || 0}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-xs font-bold text-[#718096]">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </td>

                  {/* Individual Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      
                      <button
                        onClick={() => onOpenReport(session)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FFF3D6] hover:bg-[#B7791F] text-[#8B5E34] hover:text-white border border-[#E2D3A7] font-bold text-xs transition-all cursor-pointer"
                        title="View detailed dossier"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 inline" />
                        View
                      </button>

                      <button
                        onClick={() => handleExportExcel(session)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#E6F4EA] hover:bg-[#2F855A] text-[#2F855A] hover:text-white border border-[#A8DAB5] font-bold text-xs transition-all cursor-pointer"
                        title="Export Excel (.xlsx)"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 mr-1 inline" />
                        Excel
                      </button>

                      <button
                        onClick={() => handleExportDocx(session)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#EBF8FF] hover:bg-[#2B6CB0] text-[#2B6CB0] hover:text-white border border-[#BEE3F8] font-bold text-xs transition-all cursor-pointer"
                        title="Export Word (.docx)"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 inline" />
                        Word
                      </button>

                      <button
                        onClick={() => handleExportCsv(session)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#F7FAFC] hover:bg-[#4A5568] text-[#4A5568] hover:text-white border border-[#E2E8F0] font-bold text-xs transition-all cursor-pointer"
                        title="Export CSV"
                      >
                        <Download className="w-3.5 h-3.5 mr-1 inline" />
                        CSV
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
