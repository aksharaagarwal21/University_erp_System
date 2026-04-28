import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, Building2, BookOpen, Library,
  ClipboardList, Calendar, FileSpreadsheet, Award, BarChart3,
  Terminal, LogOut, Bell, DoorOpen, Megaphone, FileText, User
} from 'lucide-react'
import './index.css'

import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import StudentDashboard from './pages/StudentDashboard'
import FacultyDashboard from './pages/FacultyDashboard'
import Students from './pages/Students'
import Faculty from './pages/Faculty'
import Departments from './pages/Departments'
import Courses from './pages/Courses'
import Subjects from './pages/Subjects'
import Enrollments from './pages/Enrollments'
import Timetable from './pages/Timetable'
import Exams from './pages/Exams'
import Results from './pages/Results'
import Reports from './pages/Reports'
import SqlConsole from './pages/SqlConsole'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function useToast() {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])
  return { toasts, addToast }
}

const adminNav = [
  { section: 'Overview' },
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'Management' },
  { path: '/departments', label: 'Departments', icon: Building2 },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/faculty', label: 'Faculty', icon: GraduationCap },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/subjects', label: 'Subjects', icon: Library },
  { section: 'Academics' },
  { path: '/enrollments', label: 'Enrollments', icon: ClipboardList },
  { path: '/timetable', label: 'Timetable', icon: Calendar },
  { path: '/exams', label: 'Exams', icon: FileSpreadsheet },
  { path: '/results', label: 'Results', icon: Award },
  { section: 'Analytics' },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/sql-console', label: 'SQL Console', icon: Terminal },
]

function NexusLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="nexGrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="50%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#nexGrad)"/>
      <path d="M10 28V12l8 10 8-10v16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="30" cy="12" r="3" fill="#34d399"/>
    </svg>
  )
}

function Sidebar({ user, onLogout }) {
  const isAdmin = user.Role === 'admin'
  const nav = isAdmin ? adminNav : [{ path: '/', label: 'My Dashboard', icon: LayoutDashboard }]
  const roleLabel = user.Role === 'admin' ? 'Super Admin' : user.Role === 'faculty' ? 'Faculty' : 'Student'
  const roleColor = user.Role === 'admin' ? '#f97316' : user.Role === 'faculty' ? '#10b981' : '#6366f1'

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <NexusLogo size={38}/>
          <div className="sidebar-logo-text">
            <h1>NexusEDU</h1>
            <p>Smart ERP Platform</p>
          </div>
        </div>
      </div>
      <div className="sidebar-user-box">
        <div className="sidebar-avatar" style={{ background: roleColor }}>{user.FullName?.charAt(0) || 'U'}</div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{user.FullName}</span>
          <span className="sidebar-user-role" style={{ color: roleColor }}>{roleLabel}</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {nav.map((item, i) =>
          item.section ? (
            <div key={i} className="sidebar-section-label">{item.section}</div>
          ) : (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <item.icon /> <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}><LogOut size={16} /> <span>Sign Out</span></button>
      </div>
    </aside>
  )
}

function InlineHeader({ user, onLogout }) {
  const [showProfile, setShowProfile] = useState(false)
  const roleLabel = user.Role === 'admin' ? 'Super Admin' : user.Role === 'faculty' ? 'Faculty' : 'Student'
  const roleColor = user.Role === 'admin' ? '#f97316' : user.Role === 'faculty' ? '#10b981' : '#6366f1'
  const btnRef = useState(null)

  return (
    <>
      <div className="inline-header">
        <div className="inline-header-left">
          <NexusLogo size={30}/>
          <span className="inline-header-brand">NexusEDU</span>
        </div>
        <div className="inline-header-right">
          <button className="profile-avatar-btn" onClick={() => setShowProfile(!showProfile)} title="Profile & Logout">
            <div className="profile-avatar-circle" style={{ background: roleColor }}>
              {user.FullName?.charAt(0) || 'U'}
            </div>
            <span className="profile-avatar-name">{user.FullName}</span>
          </button>
        </div>
      </div>

      {showProfile && (
        <>
          <div className="profile-overlay" onClick={() => setShowProfile(false)}/>
          <div className="profile-dropdown">
            <div className="profile-dropdown-header">
              <div className="profile-dropdown-avatar" style={{ background: roleColor }}>
                {user.FullName?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="profile-dropdown-name">{user.FullName}</div>
                <div className="profile-dropdown-role" style={{ color: roleColor }}>{roleLabel}</div>
              </div>
            </div>
            <div className="profile-dropdown-body">
              <div className="profile-dropdown-item"><User size={14}/> <span>ID: {user.RefID || user.UserID}</span></div>
              <div className="profile-dropdown-item"><span>📧 {user.Email}</span></div>
              <div className="profile-dropdown-item"><span>👤 {user.Username}</span></div>
            </div>
            <button className="profile-dropdown-logout" onClick={onLogout}>
              <LogOut size={16}/> Sign Out
            </button>
          </div>
        </>
      )}
    </>
  )
}

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'} {t.message}
        </div>
      ))}
    </div>
  )
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('erp_user')
    return saved ? JSON.parse(saved) : null
  })
  const { toasts, addToast } = useToast()

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('erp_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('erp_user')
  }

  if (!user) return <LoginPage onLogin={handleLogin} />

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <InlineHeader user={user} onLogout={handleLogout} />
          <ToastContainer toasts={toasts} />
          {user.Role === 'student' && <StudentDashboard user={user} onLogout={handleLogout} />}
          {user.Role === 'faculty' && <FacultyDashboard user={user} toast={addToast} onLogout={handleLogout} />}
          {user.Role === 'admin' && (
            <Routes>
              <Route path="/" element={<Dashboard api={API} />} />
              <Route path="/departments" element={<Departments api={API} toast={addToast} />} />
              <Route path="/students" element={<Students api={API} toast={addToast} />} />
              <Route path="/faculty" element={<Faculty api={API} toast={addToast} />} />
              <Route path="/courses" element={<Courses api={API} toast={addToast} />} />
              <Route path="/subjects" element={<Subjects api={API} toast={addToast} />} />
              <Route path="/enrollments" element={<Enrollments api={API} toast={addToast} />} />
              <Route path="/timetable" element={<Timetable api={API} toast={addToast} />} />
              <Route path="/exams" element={<Exams api={API} toast={addToast} />} />
              <Route path="/results" element={<Results api={API} toast={addToast} />} />
              <Route path="/reports" element={<Reports api={API} />} />
              <Route path="/sql-console" element={<SqlConsole api={API} toast={addToast} />} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
