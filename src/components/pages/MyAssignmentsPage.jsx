import React, { useState } from 'react';
import { Clock, Award, Play, Eye, RotateCw } from 'lucide-react';
import { getCohortAssignments } from '../../services/db';

export default function MyAssignmentsPage({ currentUser, onStartAssignment, onViewResult }) {
  const [assignments] = useState(() => {
    const list = getCohortAssignments();
    const userYear = currentUser?.year || 'III';
    const userSection = currentUser?.section || 'A';
    const userDept = currentUser?.department || '';

    // Filter to ensure only this student's class and section assignments are shown
    const matching = (list && list.length > 0 ? list : [
      {
        id: 'asg-1',
        assignmentName: 'Strength of Materials & Stress Analysis Viva',
        subject: 'Solid Mechanics & Strength of Materials',
        topic: 'Stress in Strength of Materials',
        targetYear: userYear,
        targetSection: userSection,
        faculty: 'Dr. S. Ramanathan',
        deadline: 'Active Session',
        marks: 100,
        questionCount: 10,
        status: 'ACTIVE'
      }
    ]).filter(a => {
      const yearMatch = !a.targetYear || a.targetYear === 'All Years' || a.targetYear === userYear;
      const secMatch = !a.targetSection || a.targetSection === 'All Sections' || a.targetSection === userSection;
      return yearMatch && secMatch;
    });

    return matching.map((a, idx) => ({
      id: a.id || `asg-${idx}`,
      assignmentName: a.subjectName || a.assignmentName || 'Adaptive Viva Assessment',
      subject: a.subject || 'Strength of Materials',
      topic: a.topic || 'Stress in Strength of Materials',
      faculty: a.facultyName || a.faculty || 'Faculty In-Charge',
      deadline: a.deadlineMinutes ? `${a.deadlineMinutes} mins session` : (a.deadline || 'Active Deadline'),
      marks: a.totalMarks || 100,
      questionCount: a.questionCount || 10,
      mode: a.mode || 'Mixed',
      targetYear: a.targetYear || userYear,
      targetSection: a.targetSection || userSection,
      status: a.status || (idx === 0 ? 'ACTIVE' : 'IN_PROGRESS')
    }));
  });

  return (
    <div className="space-y-[32px] animate-fade-in w-full text-left py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2D3A7] pb-4">
        <div>
          <span className="text-xs font-mono text-[#718096]">Page 9 • Student Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            My Assignments
          </h1>
          <p className="text-xs text-[#718096]">
            Inbuilt academic coursework assigned by faculty with adaptive question counts (1 to 100)
          </p>
        </div>
      </div>

      {/* Card Layout for Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
        {assignments.map((item) => {
          const isCompleted = item.status === 'COMPLETED';
          const isInProgress = item.status === 'IN_PROGRESS';
          const isActive = item.status === 'ACTIVE' || !item.status;

          return (
            <div
              key={item.id}
              className="ent-card flex flex-col justify-between hover:border-[#B7791F] transition-all bg-[#FFFCF4] border-[#E2D3A7]"
            >
              <div className="space-y-4">
                
                {/* Status Badge & Question Count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">
                    {item.subject}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF3D6] border border-[#E2D3A7] text-[11px] font-bold text-[#8B5E34]">
                      {item.questionCount || 10} Questions
                    </span>
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-md bg-[#E6F4EA] border border-[#A8DAB5] text-[11px] font-bold text-[#2F855A]">
                        Completed
                      </span>
                    )}
                    {isInProgress && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FFF3D6] border border-[#E2D3A7] text-[11px] font-bold text-[#C05621]">
                        In Progress
                      </span>
                    )}
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FFF8E8] border border-[#B7791F] text-[11px] font-bold text-[#B7791F]">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Assignment Name */}
                <div>
                  <h3 className="text-lg font-bold text-[#2D3748] leading-snug">
                    {item.assignmentName}
                  </h3>
                  <p className="text-xs text-[#718096] mt-1">
                    Faculty: <strong className="text-[#4A5568]">{item.faculty}</strong>
                  </p>
                </div>

                {/* Details Grid: Deadline, Marks */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-[12px] bg-[#FFF8E8] border border-[#E2D3A7] text-xs">
                  <div>
                    <span className="text-[#718096] block text-[11px]">Deadline</span>
                    <strong className="text-[#2D3748] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#C05621]" />
                      <span>{item.deadline}</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#718096] block text-[11px]">Marks</span>
                    <strong className="text-[#2D3748] flex items-center gap-1 mt-0.5">
                      <Award className="w-3.5 h-3.5 text-[#2F855A]" />
                      <span>{item.marks} Total</span>
                    </strong>
                  </div>
                </div>

              </div>

              {/* Action Buttons: Start, Continue, View Result */}
              <div className="pt-4 border-t border-[#E2D3A7]/60 mt-4 flex items-center gap-2">
                {isActive && (
                  <button
                    onClick={() => onStartAssignment(item.topic || item.assignmentName || 'Engineering Viva', item.questionCount || 10, item)}
                    className="btn-primary w-full text-xs h-[46px]"
                  >
                    <Play className="w-4 h-4 mr-1 text-[#FFF3D6]" />
                    Start ({item.questionCount || 10} Qs)
                  </button>
                )}

                {isInProgress && (
                  <button
                    onClick={() => onStartAssignment(item.topic || item.assignmentName || 'Engineering Viva', item.questionCount || 10, item)}
                    className="btn-warning w-full text-xs h-[46px]"
                  >
                    <RotateCw className="w-4 h-4 mr-1" />
                    Continue ({item.questionCount || 10} Qs)
                  </button>
                )}

                {isCompleted && (
                  <button
                    onClick={() => onViewResult(item)}
                    className="btn-outline w-full text-xs h-[46px]"
                  >
                    <Eye className="w-4 h-4 mr-1 text-[#8B5E34]" />
                    View Result
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
