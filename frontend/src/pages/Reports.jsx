import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'

const COLORS = ['#6366f1', '#10b981', '#f97316', '#e11d48', '#8b5cf6', '#0ea5e9', '#14b8a6', '#d97706']

export default function Reports({ api }) {
  const [enrollStats, setEnrollStats] = useState([])
  const [facultyCount, setFacultyCount] = useState([])
  const [gradeStats, setGradeStats] = useState([])
  const [deptSummary, setDeptSummary] = useState([])
  const [topPerformers, setTopPerformers] = useState([])
  const [studentView, setStudentView] = useState([])
  const [timetableView, setTimetableView] = useState([])
  const [auditLogs, setAuditLogs] = useState([])

  useEffect(() => {
    fetch(`${api}/reports/enrollment-stats`).then(r => r.json()).then(setEnrollStats)
    fetch(`${api}/reports/faculty-count`).then(r => r.json()).then(setFacultyCount)
    fetch(`${api}/reports/grade-distribution`).then(r => r.json()).then(setGradeStats)
    fetch(`${api}/views/department-summary`).then(r => r.json()).then(setDeptSummary)
    fetch(`${api}/reports/top-performers`).then(r => r.json()).then(setTopPerformers)
    fetch(`${api}/views/student-results`).then(r => r.json()).then(setStudentView)
    fetch(`${api}/views/timetable`).then(r => r.json()).then(setTimetableView)
    fetch(`${api}/logs/enrollment`).then(r => r.json()).then(setAuditLogs)
  }, [api])

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Reports & Analytics</h2>
          <p>Comprehensive data views, charts, and audit logs</p>
        </div>
      </div>
      <div className="page-body">
        {/* Charts Row 1 */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>📊 Subject-wise Enrollment</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={enrollStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="SubjectName" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="Total_Enrolled" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>📈 Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={gradeStats} dataKey="Count" nameKey="Grade" cx="50%" cy="50%" outerRadius={100} label={({ Grade, Count }) => `${Grade}: ${Count}`}>
                  {gradeStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>👥 Faculty per Department</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={facultyCount}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="DeptName" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="Faculty_Count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>🏫 Department Summary</h3>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr><th>Department</th><th>Students</th><th>Avg GPA</th></tr>
                </thead>
                <tbody>
                  {deptSummary.map((d, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{d.DeptName}</td>
                      <td><span className="badge badge-info">{d.Total_Students}</span></td>
                      <td>
                        <span style={{ fontWeight: 700, color: d.Average_GPA >= 8 ? '#059669' : '#d97706' }}>
                          {d.Average_GPA}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Student Result View */}
        <div className="table-container" style={{ marginBottom: 20 }}>
          <div className="table-header">
            <h3>📋 Student Result View (Database View)</h3>
            <span className="badge badge-info">Student_Result_View</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Student ID</th><th>Name</th><th>Subject</th><th>Marks</th><th>Grade</th><th>GPA</th></tr>
              </thead>
              <tbody>
                {studentView.map((r, i) => (
                  <tr key={i}>
                    <td>{r.StudentID}</td>
                    <td style={{ fontWeight: 600 }}>{r.Student_Name}</td>
                    <td>{r.SubjectName}</td>
                    <td style={{ fontWeight: 700 }}>{r.Marks}</td>
                    <td>
                      <span className={`grade-badge ${r.Grade === 'A+' ? 'a-plus' : r.Grade === 'A' ? 'a' : r.Grade === 'B' ? 'b' : 'c'}`}>
                        {r.Grade}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{r.GPA}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timetable View */}
        <div className="table-container" style={{ marginBottom: 20 }}>
          <div className="table-header">
            <h3>📅 Timetable View (Database View)</h3>
            <span className="badge badge-info">Timetable_View</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Faculty</th><th>Subject</th><th>Day</th><th>Time Slot</th><th>Room</th></tr>
              </thead>
              <tbody>
                {timetableView.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.FacultyName}</td>
                    <td>{r.SubjectName}</td>
                    <td><span className="badge badge-success">{r.Day}</span></td>
                    <td><span className="badge badge-info">{r.TimeSlot}</span></td>
                    <td>{r.RoomNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="table-container">
          <div className="table-header">
            <h3>📝 Enrollment Audit Log (Trigger Log)</h3>
            <span className="badge badge-warning">Enrollment_Log</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Log ID</th><th>Enroll ID</th><th>Old Status</th><th>New Status</th><th>Changed At</th></tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--gray-400)' }}>No audit logs yet</td></tr>
                ) : auditLogs.map((l, i) => (
                  <tr key={i}>
                    <td>{l.LogID}</td>
                    <td>{l.EnrollID}</td>
                    <td><span className="badge badge-danger">{l.OldStatus}</span></td>
                    <td><span className="badge badge-success">{l.NewStatus}</span></td>
                    <td>{new Date(l.ChangedAt).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
