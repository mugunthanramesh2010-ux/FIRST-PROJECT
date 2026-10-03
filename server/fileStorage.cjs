// server/fileStorage.cjs
// 100% Offline Local File Manager Storage System for VIVA ANALYSER
// Writes student viva results, marklists, and audit logs directly to physical folders on the computer.

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Root records directory inside the project root (or customizable via env)
const BASE_RECORDS_DIR = path.resolve(__dirname, '..', 'Viva_Records');

function ensureDirectoriesExist() {
  const dirs = [
    BASE_RECORDS_DIR,
    path.join(BASE_RECORDS_DIR, 'Students'),
    path.join(BASE_RECORDS_DIR, 'Faculty_Consolidated'),
    path.join(BASE_RECORDS_DIR, 'Audit_Logs')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Clean string for safe filename
 */
function sanitizeFileName(str) {
  return String(str || 'UNKNOWN').replace(/[^a-zA-Z0-9_\-]/g, '_');
}

/**
 * Format CSV row
 */
function toCsvRow(items) {
  return items.map(val => {
    const s = String(val === undefined || val === null ? '' : val).replace(/"/g, '""');
    return `"${s}"`;
  }).join(',');
}

/**
 * Save Viva Assessment Record to disk
 * Creates:
 * 1. Viva_Records/Students/{regNo}/{sessionId}_report.json
 * 2. Viva_Records/Students/{regNo}/{sessionId}_report.csv
 * 3. Appends to Viva_Records/Faculty_Consolidated/Master_Marklist.csv
 * 4. Logs to Viva_Records/Audit_Logs/system_audit.log
 */
function saveVivaRecord(sessionData) {
  ensureDirectoriesExist();

  const regNo = sanitizeFileName(sessionData.studentRegNo || sessionData.studentId || 'GUEST_STUDENT');
  const studentName = sessionData.studentName || 'Student';
  const topic = sanitizeFileName(sessionData.topic || 'General_Topic');
  const timestamp = sessionData.timestamp || new Date().toISOString();
  const dateStr = timestamp.split('T')[0];
  const timeStr = timestamp.replace(/[:.]/g, '-');
  const sessionId = sanitizeFileName(sessionData.id || `viva_${dateStr}_${Date.now()}`);

  // 1. Create Student Directory
  const studentDir = path.join(BASE_RECORDS_DIR, 'Students', regNo);
  if (!fs.existsSync(studentDir)) {
    fs.mkdirSync(studentDir, { recursive: true });
  }

  // 2. Save JSON Detailed Report
  const jsonPath = path.join(studentDir, `${sessionId}_report.json`);
  const jsonContent = JSON.stringify(sessionData, null, 2);
  fs.writeFileSync(jsonPath, jsonContent, 'utf-8');

  // 3. Save Student CSV Summary Report
  const csvPath = path.join(studentDir, `${sessionId}_report.csv`);
  const studentCsvHeader = ['Field', 'Value'];
  const studentCsvRows = [
    studentCsvHeader,
    ['Session ID', sessionData.id || sessionId],
    ['Student Name', studentName],
    ['Register Number', sessionData.studentRegNo || regNo],
    ['Department', sessionData.department || 'ECE'],
    ['Subject / Domain', sessionData.domain || 'Engineering'],
    ['Viva Topic', sessionData.topic || topic],
    ['Overall Score (%)', sessionData.overallScore || 0],
    ['Faculty Marks Awarded', sessionData.facultyMarksAwarded || sessionData.totalMarksEarned || 0],
    ['Total Marks Assigned', sessionData.totalMarksAssigned || 100],
    ['Mastery Level', sessionData.masteryLevel || 'Competent'],
    ['Authenticity Score (%)', sessionData.authenticityScore || 100],
    ['Human Rhythm (%)', sessionData.humanRhythm || 100],
    ['Tab Switches', sessionData.tabSwitches || 0],
    ['Blocked Pastes', sessionData.blockedPastes || 0],
    ['Average Time per Question (s)', sessionData.avgTimePerQuestion || 0],
    ['Total Attending Time (s)', sessionData.totalAttendingTime || 0],
    ['Completion Date', timestamp]
  ];

  if (Array.isArray(sessionData.questionHistory) && sessionData.questionHistory.length > 0) {
    studentCsvRows.push(['', '']);
    studentCsvRows.push(['--- QUESTION WISE BREAKDOWN ---', '']);
    studentCsvRows.push(['Q#', 'Question Text', 'Bloom Level', 'Marks Awarded', 'Assigned Marks', 'Time Spent (s)', 'Timing Flag']);
    sessionData.questionHistory.forEach((q, idx) => {
      studentCsvRows.push([
        idx + 1,
        q.questionText || '',
        q.bloomLevel || 'Understanding',
        q.earnedMarks || 0,
        q.assignedMarks || 0,
        q.timeSpentSeconds || 0,
        q.timingFlag || 'NORMAL'
      ]);
    });
  }

  const csvContent = studentCsvRows.map(row => toCsvRow(row)).join('\r\n');
  fs.writeFileSync(csvPath, csvContent, 'utf-8');

  // 4. Update Faculty Consolidated Master Marklist (Master_Marklist.csv)
  const masterCsvPath = path.join(BASE_RECORDS_DIR, 'Faculty_Consolidated', 'Master_Marklist.csv');
  const masterHeader = [
    'Timestamp',
    'Register Number',
    'Student Name',
    'Department',
    'Topic',
    'Score (%)',
    'Marks Awarded',
    'Total Marks',
    'Mastery Level',
    'Authenticity (%)',
    'Tab Switches',
    'JSON Report File'
  ];

  const masterRow = [
    timestamp,
    sessionData.studentRegNo || regNo,
    studentName,
    sessionData.department || 'ECE',
    sessionData.topic || topic,
    sessionData.overallScore || 0,
    sessionData.facultyMarksAwarded || sessionData.totalMarksEarned || 0,
    sessionData.totalMarksAssigned || 100,
    sessionData.masteryLevel || 'Competent',
    sessionData.authenticityScore || 100,
    sessionData.tabSwitches || 0,
    path.relative(BASE_RECORDS_DIR, jsonPath)
  ];

  if (!fs.existsSync(masterCsvPath)) {
    fs.writeFileSync(masterCsvPath, toCsvRow(masterHeader) + '\r\n' + toCsvRow(masterRow) + '\r\n', 'utf-8');
  } else {
    fs.appendFileSync(masterCsvPath, toCsvRow(masterRow) + '\r\n', 'utf-8');
  }

  // 5. Append to Audit Log
  const auditPath = path.join(BASE_RECORDS_DIR, 'Audit_Logs', 'system_audit.log');
  const auditLine = `[${timestamp}] [OFFLINE_STORAGE] Saved session ${sessionId} for ${regNo} (${studentName}) - Topic: ${topic} - Score: ${sessionData.overallScore}%\r\n`;
  fs.appendFileSync(auditPath, auditLine, 'utf-8');

  return {
    success: true,
    folderPath: BASE_RECORDS_DIR,
    studentDir,
    jsonPath,
    csvPath,
    masterCsvPath,
    timestamp
  };
}

/**
 * Open Records Folder in Windows File Explorer
 */
function openRecordsFolder() {
  ensureDirectoriesExist();
  const cmd = `start "" "${BASE_RECORDS_DIR}"`;
  exec(cmd, (err) => {
    if (err) {
      console.error('Error opening folder:', err);
    }
  });
  return { success: true, path: BASE_RECORDS_DIR };
}

/**
 * List all saved records and files summary
 */
function getRecordsSummary() {
  ensureDirectoriesExist();
  const studentsDir = path.join(BASE_RECORDS_DIR, 'Students');
  const studentFolders = fs.readdirSync(studentsDir).filter(f => {
    try {
      return fs.statSync(path.join(studentsDir, f)).isDirectory();
    } catch {
      return false;
    }
  });

  let totalReports = 0;
  const studentSummaries = [];

  for (const sFolder of studentFolders) {
    const sPath = path.join(studentsDir, sFolder);
    const files = fs.readdirSync(sPath).filter(f => f.endsWith('.json'));
    totalReports += files.length;
    studentSummaries.push({
      regNo: sFolder,
      reportCount: files.length,
      files
    });
  }

  const masterCsvPath = path.join(BASE_RECORDS_DIR, 'Faculty_Consolidated', 'Master_Marklist.csv');
  const hasMasterList = fs.existsSync(masterCsvPath);

  return {
    baseDirectory: BASE_RECORDS_DIR,
    totalStudents: studentFolders.length,
    totalReports,
    hasMasterList,
    students: studentSummaries
  };
}

module.exports = {
  BASE_RECORDS_DIR,
  ensureDirectoriesExist,
  saveVivaRecord,
  openRecordsFolder,
  getRecordsSummary
};
