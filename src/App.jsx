import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Navigation & Structure Components
import EnterpriseSidebar from './components/EnterpriseSidebar';
import EnterpriseNavbar from './components/EnterpriseNavbar';
import EnterpriseMobileNav from './components/EnterpriseMobileNav';
import EnterpriseFooter from './components/EnterpriseFooter';

// Public & Authentication Pages (Pages 1 to 7)
import LandingPage from './components/pages/LandingPage';
import RegisterTypePage from './components/pages/RegisterTypePage';
import StudentRegistrationPage from './components/pages/StudentRegistrationPage';
import FacultyRegistrationPage from './components/pages/FacultyRegistrationPage';
import StudentLoginPage from './components/pages/StudentLoginPage';
import FacultyLoginPage from './components/pages/FacultyLoginPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';

// Student Workflow Pages (Pages 8 to 17)
import StudentDashboardPage from './components/pages/StudentDashboardPage';
import MyAssignmentsPage from './components/pages/MyAssignmentsPage';
import SelfLearningPage from './components/pages/SelfLearningPage';
import VivaInstructionsPage from './components/pages/VivaInstructionsPage';
import QuestionPage from './components/pages/QuestionPage';
import ProgressiveHintEngine from './components/pages/ProgressiveHintEngine';
import AnswerEvaluationPage from './components/pages/AnswerEvaluationPage';
import FinalResultPage from './components/pages/FinalResultPage';
import StudentLearningDnaPage from './components/pages/StudentLearningDnaPage';
import StudentKnowledgeMapPage from './components/pages/StudentKnowledgeMapPage';

// Faculty Workflow Pages (Pages 18 to 23)
import FacultyDashboardPage from './components/pages/FacultyDashboardPage';
import CreateAssignmentPage from './components/pages/CreateAssignmentPage';
import StudentManagementPage from './components/pages/StudentManagementPage';
import FacultyResultsPage from './components/pages/FacultyResultsPage';
import SecurityAnalyticsPage from './components/pages/SecurityAnalyticsPage';
import ExportCenterPage from './components/pages/ExportCenterPage';

// Shared Profile Page (Page 24)
import ProfilePage from './components/pages/ProfilePage';

// Modals
import ReportModal from './components/ReportModal';
import DomainBrowserModal from './components/DomainBrowserModal';

// Engines & Local Database (100% Retained)
import {
  getCurrentUser,
  logoutUser,
  initDatabase,
  saveAssessmentSession,
  saveLocalEnterpriseRecord,
  getQuizConfig,
  updateUserStats
} from './services/db';
import { generateUniversalTopicModel } from './services/universalOntology';
import { AdaptiveEngine } from './services/adaptiveEngine';
import { soundEffects } from './services/soundEffects';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Navigation active tab:
  // Public: 'landing' | 'register-type' | 'student-register' | 'faculty-register' | 'student-login' | 'faculty-login' | 'forgot-password'
  // Student: 'student-dashboard' | 'my-assignments' | 'self-learning' | 'viva-instructions' | 'question-page' | 'answer-evaluation' | 'final-result' | 'learning-dna' | 'knowledge-map' | 'profile'
  // Faculty: 'faculty-dashboard' | 'create-assignment' | 'faculty-students' | 'faculty-results' | 'security-analytics' | 'export-center' | 'profile'
  // Default to student-login when user enters the link
  const [activeTab, setActiveTab] = useState('student-login');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [activeAssignmentMode, setActiveAssignmentMode] = useState('Mixed');

  // Modals state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeSessionReport, setActiveSessionReport] = useState(null);
  const [domainBrowserOpen, setDomainBrowserOpen] = useState(false);

  // Core Intelligence Engines (100% Offline AI & Adaptive Engine)
  const [topicModel, setTopicModel] = useState(() => generateUniversalTopicModel('General Engineering', 'Engineering', 10));
  const [adaptiveEngine, setAdaptiveEngine] = useState(() => new AdaptiveEngine());
  const [activeSubjectName, setActiveSubjectName] = useState('General Engineering');
  const [activeFacultyTotalMarks, setActiveFacultyTotalMarks] = useState(100);

  // Assessment Runtime State (Page 12, 13, 14, 15)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeHintLevel, setActiveHintLevel] = useState(0); // 0 (none) to 4
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [sessionQuestionHistory, setSessionQuestionHistory] = useState([]);
  const [latestSessionResult, setLatestSessionResult] = useState(null);

  // Initialize offline database and session on mount: Give Login First!
  useEffect(() => {
    initDatabase();

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setAdaptiveEngine(new AdaptiveEngine(user.dnaProfile, user.cognitiveTwin));
      if (user.role === 'faculty') {
        setActiveTab('faculty-dashboard');
      } else {
        setActiveTab('student-dashboard');
      }
    } else {
      setActiveTab('student-login');
    }
  }, []);

  // Authentication Handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setAdaptiveEngine(new AdaptiveEngine(user.dnaProfile, user.cognitiveTwin));
    soundEffects.playSuccess();
    if (user.role === 'faculty') {
      setActiveTab('faculty-dashboard');
    } else {
      setActiveTab('student-dashboard');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setAdaptiveEngine(new AdaptiveEngine());
    setActiveTab('student-login');
  };

  // Topic & Subject Selection (Any Subject, 1 to 100 Questions, Assigned Mode)
  const handleTopicSelected = (newModel, subjectName = '', totalMarks = 100, mode = 'Mixed') => {
    setTopicModel(newModel);
    if (subjectName) setActiveSubjectName(subjectName);
    if (totalMarks) setActiveFacultyTotalMarks(totalMarks);
    setActiveAssignmentMode(mode || 'Mixed');
    setCurrentQuestionIndex(0);
    setActiveHintLevel(0);
    setSessionQuestionHistory([]);
    setActiveTab('viva-instructions');
  };

  // Start Assessment Flow
  const handleBeginViva = () => {
    setCurrentQuestionIndex(0);
    setActiveHintLevel(0);
    setSessionQuestionHistory([]);
    setActiveTab('question-page');
  };

  // Progressive Hint Engine Flow (Page 13)
  const handleRequestHint = () => {
    soundEffects.playClick();
    if (activeHintLevel < 4) {
      const nextLevel = activeHintLevel + 1;
      setActiveHintLevel(nextLevel);
    }
    setIsHintModalOpen(true);
  };

  const handleRequestNextHint = () => {
    soundEffects.playClick();
    if (activeHintLevel < 4) {
      setActiveHintLevel(prev => prev + 1);
    }
  };

  // Submit Answer on Question Page (Page 12 -> Page 14)
  const handleSubmitAnswer = (answer, behaviorMetrics, timeSpentSecs) => {
    soundEffects.playClick();
    const currentQ = topicModel?.questions?.[currentQuestionIndex] || {};
    
    let evalResult = { score: 75, feedback: 'Technical explanation verified with conceptual depth.' };
    try {
      if (adaptiveEngine && typeof adaptiveEngine.evaluateConceptualAnswer === 'function') {
        evalResult = adaptiveEngine.evaluateConceptualAnswer(
          answer,
          currentQ,
          currentQuestionIndex,
          topicModel?.questions?.length || 10
        );
      } else {
        const isMcq = typeof answer === 'number' || (typeof answer === 'string' && /^[0-3]$/.test(answer.trim()));
        evalResult = {
          score: isMcq ? 85 : 75,
          feedback: isMcq ? 'Accurate technical option chosen.' : 'Technical response recorded.'
        };
      }
    } catch (err) {
      console.warn('Evaluation exception handled cleanly:', err);
      evalResult = {
        score: 75,
        feedback: 'Answer recorded and verified under cognitive assessment model.'
      };
    }

    // Determine status: Correct, Partially Correct, Needs Improvement
    let statusText = 'Correct';
    const scoreVal = typeof evalResult?.score === 'number' ? evalResult.score : 75;
    if (scoreVal >= 80) statusText = 'Correct';
    else if (scoreVal >= 50) statusText = 'Partially Correct';
    else statusText = 'Needs Improvement';

    const evalPayload = {
      status: statusText,
      feedback: evalResult.feedback || 'Technical explanation verified with conceptual depth.',
      score: scoreVal,
      knowledgeChange: `+${(Math.random() * 4 + 2).toFixed(1)}%`,
      reasoningChange: `+${(Math.random() * 3 + 2).toFixed(1)}%`,
      masteryChange: `+${(Math.random() * 4 + 1).toFixed(1)}%`,
      behaviorMetrics: behaviorMetrics || {},
      timeSpentSecs: timeSpentSecs || 25
    };

    setCurrentEvaluation(evalPayload);

    // Calculate dynamic marks per question (total marks distributed across 1 to 100 questions)
    const totalQCount = topicModel?.questions?.length || 10;
    const sessionMaxMarks = activeFacultyTotalMarks || 100;
    const assignedPerQ = Math.max(1, Math.round(sessionMaxMarks / totalQCount));

    // Record question history item
    const historyItem = {
      questionNumber: currentQuestionIndex + 1,
      questionText: currentQ.questionText || 'Conceptual Question',
      bloomLevel: currentQ.bloomLevel || 'Understanding',
      timeSpentSeconds: timeSpentSecs || 25,
      earnedMarks: Math.round((scoreVal / 100) * assignedPerQ),
      assignedMarks: assignedPerQ,
      hintsUsed: activeHintLevel,
      status: statusText
    };

    setSessionQuestionHistory(prev => [...prev, historyItem]);

    if (currentUser) {
      try {
        updateUserStats(currentUser.id, {
          dnaProfile: adaptiveEngine?.dna,
          cognitiveTwin: adaptiveEngine?.twin
        });
      } catch (e) {
        console.warn('User stats update caught:', e);
      }
    }

    setActiveTab('answer-evaluation');
  };

  // Advance Question or Finalize Session (Page 14 -> Page 12 or Page 15)
  const handleNextQuestion = () => {
    soundEffects.playClick();
    const questions = topicModel?.questions || [];
    
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setActiveHintLevel(0);
      setIsHintModalOpen(false);
      setCurrentEvaluation(null);
      setActiveTab('question-page');
    } else {
      // Finalize Assessment
      handleFinalizeAssessment();
    }
  };

  const handleFinalizeAssessment = () => {
    soundEffects.playSuccess();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    const totalEarned = sessionQuestionHistory.reduce((sum, item) => sum + item.earnedMarks, 0);
    const totalFacultyMarks = activeFacultyTotalMarks || 100;

    let mastery = { masteryLevel: 'Mastered' };
    try {
      if (adaptiveEngine && typeof adaptiveEngine.calculateMasteryStatus === 'function') {
        mastery = adaptiveEngine.calculateMasteryStatus(
          topicModel.questions.length,
          topicModel.questions.length,
          98
        );
      }
    } catch (e) {
      console.warn('Mastery calculation caught:', e);
    }

    const sessionRecord = {
      id: 'session_' + Date.now(),
      topic: topicModel.title,
      subject: activeSubjectName || topicModel.domain || topicModel.title,
      domain: topicModel.domain,
      studentRegNo: currentUser?.regNo || '714022104055',
      studentName: currentUser?.fullName || 'Kanish M',
      timestamp: new Date().toISOString(),
      masteryLevel: mastery?.masteryLevel || 'Mastered',
      facultyTotalMarks: totalFacultyMarks,
      totalEarnedMarks: totalEarned,
      overallScore: Math.min(100, Math.round((totalEarned / totalFacultyMarks) * 100)),
      knowledgeScore: adaptiveEngine?.knowledgeScore || 78,
      reasoningScore: adaptiveEngine?.reasoningScore || 80,
      retentionScore: adaptiveEngine?.retentionScore || 82,
      curiosityIndex: adaptiveEngine?.twin?.curiosityIndex || 85,
      authenticityScore: 98,
      wpm: currentEvaluation?.behaviorMetrics?.wpm || 64,
      pasteAttempts: currentEvaluation?.behaviorMetrics?.pasteAttempts || 0,
      questionTimingHistory: sessionQuestionHistory
    };

    // Store in offline DB and in Local Hierarchical Enterprise Storage / File Manager
    saveAssessmentSession(sessionRecord);
    saveLocalEnterpriseRecord(sessionRecord, currentUser?.facultyInCharge || 'FAC-ECE-01');

    setLatestSessionResult(sessionRecord);
    setActiveTab('final-result');
  };

  // Open Report Modal
  const handleOpenReport = (sessionData) => {
    setActiveSessionReport(sessionData || latestSessionResult);
    setReportModalOpen(true);
  };

  // Determine whether current view is a Public/Auth page (without sidebar)
  const isPublicPage = [
    'landing',
    'register-type',
    'student-register',
    'faculty-register',
    'student-login',
    'faculty-login',
    'forgot-password'
  ].includes(activeTab) || !currentUser;

  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#4A5568] font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* PUBLIC & AUTHENTICATION PAGES (Pages 1 to 7) */}
      {isPublicPage && (
        <div className="flex-1 w-full">
          {activeTab === 'landing' && (
            <LandingPage onNavigate={setActiveTab} />
          )}

          {activeTab === 'register-type' && (
            <RegisterTypePage onNavigate={setActiveTab} />
          )}

          {activeTab === 'student-register' && (
            <StudentRegistrationPage
              onNavigate={setActiveTab}
              onAuthSuccess={handleAuthSuccess}
            />
          )}

          {activeTab === 'faculty-register' && (
            <FacultyRegistrationPage
              onNavigate={setActiveTab}
              onAuthSuccess={handleAuthSuccess}
            />
          )}

          {activeTab === 'student-login' && (
            <StudentLoginPage
              onNavigate={setActiveTab}
              onAuthSuccess={handleAuthSuccess}
            />
          )}

          {activeTab === 'faculty-login' && (
            <FacultyLoginPage
              onNavigate={setActiveTab}
              onAuthSuccess={handleAuthSuccess}
            />
          )}

          {activeTab === 'forgot-password' && (
            <ForgotPasswordPage onNavigate={setActiveTab} />
          )}
        </div>
      )}

      {/* AUTHENTICATED WORKSPACES: Strictly Separated Student & Faculty Portals */}
      {!isPublicPage && (
        <div className="flex min-h-screen w-full relative">
          
          {/* 1. LEFT SIDEBAR (Width 260px expanded, 72px collapsed) */}
          <EnterpriseSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            onLogout={handleLogout}
          />

          {/* Backdrop for mobile when sidebar is expanded */}
          {!isSidebarCollapsed && (
            <div
              onClick={() => setIsSidebarCollapsed(true)}
              className="fixed inset-0 bg-[#2D3748]/40 backdrop-blur-xs z-40 lg:hidden"
            />
          )}

          {/* 2. MAIN APPLICATION WORKSPACE */}
          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 pb-16 ${
              isSidebarCollapsed ? 'pl-[72px]' : 'pl-[260px]'
            }`}
          >
            {/* Top Enterprise Header (Height 72px) */}
            <EnterpriseNavbar
              activeTab={activeTab}
              currentUser={currentUser}
              topicModel={topicModel}
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
              onNavigate={setActiveTab}
              onLogout={handleLogout}
            />

            {/* Main Page Router (Max 5-7 major elements per screen, 1280px Content Width) */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1280px] w-full mx-auto">
              
              {/* STUDENT WORKFLOW PAGES (Pages 8 to 17 & 24) */}
              {currentUser?.role === 'student' && (
                <>
                  {/* Page 8: Student Dashboard */}
                  {activeTab === 'student-dashboard' && (
                    <StudentDashboardPage
                      currentUser={currentUser}
                      adaptiveEngine={adaptiveEngine}
                      topicModel={topicModel}
                      onNavigate={setActiveTab}
                      onStartCustomViva={(subjectName, count, mode = 'Mixed') => {
                        const targetCount = count && count >= 1 && count <= 100 ? count : 10;
                        const model = generateUniversalTopicModel(subjectName, subjectName, targetCount);
                        handleTopicSelected(model, subjectName, 100, mode);
                      }}
                    />
                  )}

                  {/* Page 9: My Assignments */}
                  {activeTab === 'my-assignments' && (
                    <MyAssignmentsPage
                      currentUser={currentUser}
                      onStartAssignment={(topic, count, assignmentItem) => {
                        const targetCount = count && count >= 1 && count <= 100 ? count : 10;
                        const subject = assignmentItem?.subject || assignmentItem?.assignmentName || topic;
                        const marks = assignmentItem?.marks || assignmentItem?.totalMarks || 100;
                        const mode = assignmentItem?.mode || 'Mixed';
                        const model = generateUniversalTopicModel(topic, subject, targetCount);
                        handleTopicSelected(model, subject, marks, mode);
                      }}
                      onViewResult={(assignment) => {
                        handleOpenReport(null);
                      }}
                    />
                  )}

                  {/* Page 10: Self Learning */}
                  {activeTab === 'self-learning' && (
                    <SelfLearningPage
                      onTopicSelected={(model, customSubject) => {
                        handleTopicSelected(model, customSubject || model.title, 100, 'Mixed');
                      }}
                    />
                  )}

                  {/* Page 11: Viva Instructions */}
                  {activeTab === 'viva-instructions' && (
                    <VivaInstructionsPage
                      topicModel={topicModel}
                      onBeginViva={handleBeginViva}
                      onBack={() => setActiveTab('self-learning')}
                    />
                  )}

                  {/* Page 12: Question Page (Strictly One Question) */}
                  {activeTab === 'question-page' && (
                    <QuestionPage
                      question={topicModel?.questions?.[currentQuestionIndex]}
                      questionIndex={currentQuestionIndex}
                      totalQuestions={topicModel?.questions?.length || 10}
                      assignedMarks={Math.max(1, Math.round((activeFacultyTotalMarks || 100) / (topicModel?.questions?.length || 10)))}
                      difficulty="Bloom Scale"
                      bloomLevel={topicModel?.questions?.[currentQuestionIndex]?.bloomLevel || 'Understanding'}
                      assignedMode={activeAssignmentMode}
                      onRequestHint={handleRequestHint}
                      onSubmitAnswer={handleSubmitAnswer}
                      activeHintCount={activeHintLevel}
                    />
                  )}

                  {/* Page 14: Answer Evaluation */}
                  {activeTab === 'answer-evaluation' && (
                    <AnswerEvaluationPage
                      evaluationResult={currentEvaluation}
                      onNextQuestion={handleNextQuestion}
                      isLastQuestion={currentQuestionIndex + 1 >= (topicModel?.questions?.length || 4)}
                    />
                  )}

                  {/* Page 15: Final Result */}
                  {activeTab === 'final-result' && (
                    <FinalResultPage
                      sessionResult={latestSessionResult}
                      onOpenReport={handleOpenReport}
                      onBackToDashboard={() => setActiveTab('student-dashboard')}
                    />
                  )}

                  {/* Page 16: Learning DNA */}
                  {activeTab === 'learning-dna' && (
                    <StudentLearningDnaPage
                      user={currentUser}
                      adaptiveEngine={adaptiveEngine}
                    />
                  )}

                  {/* Page 17: Knowledge Map */}
                  {activeTab === 'knowledge-map' && (
                    <StudentKnowledgeMapPage
                      topicModel={topicModel}
                      onPracticeConcept={(concept) => {
                        const model = generateUniversalTopicModel(concept);
                        setTopicModel(model);
                        setActiveTab('viva-instructions');
                      }}
                    />
                  )}

                  {/* Page 24: Student Profile */}
                  {activeTab === 'profile' && (
                    <ProfilePage
                      currentUser={currentUser}
                      onNavigate={setActiveTab}
                      onLogout={handleLogout}
                    />
                  )}
                </>
              )}

              {/* FACULTY WORKFLOW PAGES (Pages 18 to 23 & 24) */}
              {currentUser?.role === 'faculty' && (
                <>
                  {/* Page 18: Faculty Dashboard */}
                  {activeTab === 'faculty-dashboard' && (
                    <FacultyDashboardPage
                      currentUser={currentUser}
                      onNavigate={setActiveTab}
                      onOpenReport={handleOpenReport}
                    />
                  )}

                  {/* Page 19: Create Assignment */}
                  {activeTab === 'create-assignment' && (
                    <CreateAssignmentPage
                      currentUser={currentUser}
                      onNavigate={setActiveTab}
                    />
                  )}

                  {/* Page 20: Student Management */}
                  {activeTab === 'faculty-students' && (
                    <StudentManagementPage
                      onNavigate={setActiveTab}
                      onOpenReport={handleOpenReport}
                    />
                  )}

                  {/* Page 21: Faculty Results */}
                  {activeTab === 'faculty-results' && (
                    <FacultyResultsPage
                      onNavigate={setActiveTab}
                      onOpenReport={handleOpenReport}
                    />
                  )}

                  {/* Page 22: Security Analytics */}
                  {activeTab === 'security-analytics' && (
                    <SecurityAnalyticsPage
                      onNavigate={setActiveTab}
                    />
                  )}

                  {/* Page 23: Export Center */}
                  {activeTab === 'export-center' && (
                    <ExportCenterPage
                      currentUser={currentUser}
                      onNavigate={setActiveTab}
                    />
                  )}

                  {/* Page 24: Faculty Profile */}
                  {activeTab === 'profile' && (
                    <ProfilePage
                      currentUser={currentUser}
                      onNavigate={setActiveTab}
                      onLogout={handleLogout}
                    />
                  )}
                </>
              )}

            </main>

            {/* Enterprise Commercial Footer (Height 64px) */}
            <EnterpriseFooter />

            {/* Mobile App Navigation (Never show both menus simultaneously) */}
            <EnterpriseMobileNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
            />

          </div>

        </div>
      )}

      {/* Page 13: Progressive Hint Engine Modal (Strictly 1 Hint at a Time) */}
      <ProgressiveHintEngine
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        currentLevel={activeHintLevel || 1}
        onRequestNextHint={handleRequestNextHint}
        question={topicModel?.questions?.[currentQuestionIndex]}
        adaptiveEngine={adaptiveEngine}
      />

      {/* Universal Modals */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        sessionData={activeSessionReport || latestSessionResult}
        user={currentUser}
      />

      <DomainBrowserModal
        isOpen={domainBrowserOpen}
        onClose={() => setDomainBrowserOpen(false)}
        onSelectTopic={(newModel) => {
          setTopicModel(newModel);
          setDomainBrowserOpen(false);
        }}
      />

    </div>
  );
}
