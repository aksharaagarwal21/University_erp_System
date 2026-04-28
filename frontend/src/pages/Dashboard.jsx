import { useState, useEffect } from 'react'
import { Users, GraduationCap, BookOpen, Building2, Library, ClipboardList, FileSpreadsheet, Award, TrendingUp, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts'

const COLORS = ['#6366f1', '#10b981', '#f97316', '#e11d48', '#8b5cf6', '#0ea5e9', '#14b8a6', '#d97706']

export default function Dashboard({ api }) {
  const [stats, setStats] = useState(null)
  const [enrollStats, setEnrollStats] = useState([])
  const [gradeStats, setGradeStats] = useState([])
  const [deptSummary, setDeptSummary] = useState([])
  const [topPerformers, setTopPerformers] = useState([])
  const [facultyCount, setFacultyCount] = useState([])

  useEffect(() => {
    fetch(`${api}/dashboard/stats`).then(r => r.json()).then(setStats)
    fetch(`${api}/reports/enrollment-stats`).then(r => r.json()).then(setEnrollStats)
    fetch(`${api}/reports/grade-distribution`).then(r => r.json()).then(setGradeStats)
    fetch(`${api}/views/department-summary`).then(r => r.json()).then(setDeptSummary)
    fetch(`${api}/reports/top-performers`).then(r => r.json()).then(setTopPerformers)
    fetch(`${api}/reports/faculty-count`).then(r => r.json()).then(setFacultyCount)
  }, [api])

  if (!stats) return <div className="spinner" style={{ marginTop: '20vh' }}></div>

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: Users, color: 'blue', trend: '+12%', sub: 'Active enrollments' },
    { label: 'Faculty Members', value: stats.faculty, icon: GraduationCap, color: 'green', trend: '+3', sub: 'Across departments' },
    { label: 'Departments', value: stats.departments, icon: Building2, color: 'purple', trend: '2 active', sub: 'CSE & ECE' },
    { label: 'Active Courses', value: stats.courses, icon: BookOpen, color: 'orange', trend: `${stats.subjects} subjects`, sub: 'Full curriculum' },
    { label: 'Enrollments', value: stats.enrollments, icon: ClipboardList, color: 'rose', trend: 'This year', sub: '2025-2026' },
    { label: 'Exams Conducted', value: stats.exams, icon: FileSpreadsheet, color: 'teal', trend: 'Completed', sub: 'All graded' },
    { label: 'Average GPA', value: stats.avgGpa, icon: TrendingUp, color: 'amber', trend: '↑ Good', sub: 'University avg' },
    { label: 'System Status', value: '●', icon: Activity, color: 'indigo', trend: 'Online', sub: 'All services up' },
  ]

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Admin Dashboard</h2>
          <p>University ERP System — Complete Overview</p>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', textAlign: 'right' }}>
          <div style={{ fontWeight: 600, color: 'var(--gray-700)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
          </div>
          {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      <div className="page-body">
        {/* Stat Cards */}
        <div className="stats-grid">
          {statCards.map((card, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-card-icon ${card.color}`}><card.icon size={22} /></div>
              <div className="stat-card-info">
                <h3>{card.value}</h3>
                <p>{card.label}</p>
                <span className="stat-sub">{card.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>📊 Subject Enrollment Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={enrollStats} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="SubjectName" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} />
                <Bar dataKey="Total_Enrolled" radius={[8, 8, 0, 0]} name="Students Enrolled">
                  {enrollStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>🎯 Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={gradeStats} dataKey="Count" nameKey="Grade" cx="50%" cy="50%" innerRadius={55} outerRadius={100}
                  label={({ Grade, Count }) => `${Grade}: ${Count}`} labelLine={false}>
                  {gradeStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>🏫 Department Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '10px 0' }}>
              {deptSummary.map((d, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.DeptName}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{d.Total_Students} students · GPA {d.Average_GPA}</span>
                  </div>
                  <div className="result-bar-bg" style={{ height: 10 }}>
                    <div className="result-bar-fill" style={{
                      width: `${(d.Average_GPA / 10) * 100}%`,
                      background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}aa)`,
                      height: 10, borderRadius: 5
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>👥 Faculty per Department</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={facultyCount} layout="vertical" barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="DeptName" type="category" tick={{ fontSize: 12 }} width={60} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} />
                <Bar dataKey="Faculty_Count" radius={[0, 8, 8, 0]} name="Faculty">
                  {facultyCount.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="table-container" style={{ marginTop: 4 }}>
          <div className="table-header">
            <h3>🏆 Top Performers</h3>
            <span className="badge badge-success">Ranked by marks</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Rank</th><th>Student</th><th>Subject</th><th>Marks</th><th>Grade</th><th>Performance</th></tr></thead>
              <tbody>
                {topPerformers.slice(0, 6).map((r, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '50%',
                        background: i === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : i === 1 ? 'linear-gradient(135deg,#94a3b8,#64748b)' : i === 2 ? 'linear-gradient(135deg,#d97706,#92400e)' : 'var(--gray-100)',
                        color: i < 3 ? '#fff' : 'var(--gray-500)', fontWeight: 800, fontSize: '0.78rem' }}>
                        {i + 1}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.Name}</td>
                    <td>{r.SubjectName}</td>
                    <td style={{ fontWeight: 800, fontSize: '1.05rem' }}>{r.Marks}</td>
                    <td><span className={`grade-badge ${r.Grade === 'A+' ? 'a-plus' : r.Grade === 'A' ? 'a' : r.Grade === 'B' ? 'b' : 'c'}`}>{r.Grade}</span></td>
                    <td style={{ width: 150 }}>
                      <div className="result-bar-bg" style={{ height: 8 }}>
                        <div className="result-bar-fill" style={{
                          width: `${r.Marks}%`, height: 8, borderRadius: 4,
                          background: r.Marks >= 90 ? 'linear-gradient(90deg,#059669,#34d399)' : r.Marks >= 80 ? 'linear-gradient(90deg,#0d9488,#5eead4)' : 'linear-gradient(90deg,#2563eb,#60a5fa)'
                        }}></div>
                      </div>
                    </td>
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
