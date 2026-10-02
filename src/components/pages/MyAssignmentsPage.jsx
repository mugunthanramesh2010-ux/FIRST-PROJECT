import React, { useState } from 'react';
import { Clock, Award, Play, Eye, RotateCw } from 'lucide-react';
import { getCohortAssignments } from '../../services/db';

export default function MyAssignmentsPage({ currentUser, onStartAssignment, onViewResult }) {
  const [assignments] = useState(() => {
    const list = getCohortAssignments();
    if (!list || list.length === 0) {
      return [
        {
          id: 'asg-1',
          assignmentName: 'Semiconductor Inversion & MOSFET Viva',
          subject: 'Solid State Semiconductor Devices',
          topic: 'MOSFET',
          faculty: 'Dr. S. Ramanathan',
          deadline: 'Today, 5:00 PM',
          marks: 100,
          questionCount: 10,
          status: 'ACTIVE'
        },
        {
          id: 'asg-2',
          assignmentName: 'Deep Learning Convolutions & Backprop',
          subject: 'Artificial Intelligence & Neural Networks',
          topic: 'CNN',
          faculty: 'Dr. K. Jayanthi',
          deadline: 'Tomorrow, 11:59 PM',
          marks: 100,
          questionCount: 20,
          status: 'IN_PROGRESS'
        },
        {
          id: 'asg-3',
          assignmentName: 'Constitutional Basic Structure Oral Review',
          subject: 'Constitutional Law & Jurisprudence',
          topic: 'Law',
          faculty: 'Prof. M. S. Narayana',
          deadline: 'Completed on 28 Sep',
          marks: 100,
          questionCount: 5,
          status: 'COMPLETED'
        }
      ];
    }
    return list.map((a, idx) => ({
      id: a.id || `asg-${idx}`,
      assignmentName: a.subjectName || a.assignmentName || 'Adaptive Viva Assessment',
      subject: a.subject || 'Electronics and Communication',
      topic: a.topic || 'MOSFET',
      faculty: a.facultyName || a.faculty || 'Faculty In-Charge',
      deadline: a.deadlineMinutes ? `${a.deadlineMinutes} mins session` : (a.deadline || 'Active Deadline'),
      marks: a.totalMarks || 100,
      questionCount: a.questionCount || (idx === 1 ? 20 : 10),
      status: a.status || (idx === 0 ? 'ACTIVE' : (idx === 1 ? 'IN_PROGRESS' : 'COMPLETED'))
    }));
  });

  return (
    <div className="space-y-[32px] animate-fade-in max-w-[1280px] mx-auto text-left py-4">
      
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
