import { useState, useEffect } from 'react'
import { GraduationCap, Users, ShieldCheck, Eye, EyeOff, LogIn, UserPlus, ArrowLeft, Sparkles } from 'lucide-react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const roles = [
  { id: 'student', label: 'Student', icon: Users, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { id: 'faculty', label: 'Faculty', icon: GraduationCap, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'admin', label: 'Super Admin', icon: ShieldCheck, color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
]

const campusImages = [
  '/images/campus_hero.png',
  '/images/library.png',
  '/images/lecture_hall.png',
  '/images/graduation.png',
  '/images/campus_garden.png'
]

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regRefID, setRegRefID] = useState('')
  const [bgIdx, setBgIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setBgIdx(i => (i + 1) % campusImages.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onLogin(data)
    } catch (err) { setError(err.message || 'Login failed') }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Username: username, Password: password, Role: role,
          RefID: regRefID || null, FullName: regName, Email: regEmail
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess('Registration successful! You can now sign in.')
      setTimeout(() => { setMode('login'); setSuccess('') }, 2000)
    } catch (err) { setError(err.message || 'Registration failed') }
    setLoading(false)
  }

  const activeRole = roles.find(r => r.id === role)

  const resetForm = () => {
    setUsername(''); setPassword(''); setRegName(''); setRegEmail(''); setRegRefID('')
    setError(''); setSuccess('')
  }

  return (
    <div className="login-page">
      <div className="login-bg-slideshow">
        {campusImages.map((img, i) => (
          <div key={i} className={`login-bg-slide ${i === bgIdx ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}/>
        ))}
        <div className="login-bg-overlay"/>
      </div>

      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <div className="login-logo-svg">
              <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
                <defs><linearGradient id="lgGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#6366f1"/><stop offset="50%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs>
                <rect width="40" height="40" rx="10" fill="url(#lgGrad)"/>
                <path d="M10 28V12l8 10 8-10v16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="30" cy="12" r="3" fill="#34d399"/>
              </svg>
            </div>
            <h1>NexusEDU</h1>
            <p>Next-Gen University ERP Platform</p>
          </div>
          <div className="login-features">
            <div className="login-feature"><span className="login-feature-dot blue"></span>Student Registration & Enrollment</div>
            <div className="login-feature"><span className="login-feature-dot green"></span>Faculty & Course Management</div>
            <div className="login-feature"><span className="login-feature-dot orange"></span>Component Marks & Grading</div>
            <div className="login-feature"><span className="login-feature-dot purple"></span>Attendance & Timetable Tracking</div>
            <div className="login-feature"><span className="login-feature-dot teal"></span>Faculty Cabin Availability</div>
            <div className="login-feature"><span className="login-feature-dot cyan"></span>Reports & Analytics Dashboard</div>
          </div>
          <div className="login-campus-gallery">
            {['/images/computer_lab.png','/images/research_lab.png','/images/sports.png'].map((img,i)=>(
              <div key={i} className="login-gallery-thumb" style={{backgroundImage:`url(${img})`}}/>
            ))}
          </div>
          <div className="login-credits">
            <p>21CSC205P — Database Management Systems</p>
            <p>SRM Institute of Science & Technology</p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            {mode === 'login' ? (
              <>
                <div className="login-card-header">
                  <Sparkles size={20} className="sparkle-icon"/>
                  <h2>Welcome Back</h2>
                </div>
                <p className="login-subtitle">Select your role and enter credentials</p>

                <div className="role-selector">
                  {roles.map(r => (
                    <button key={r.id} type="button"
                      className={`role-btn ${role === r.id ? 'active' : ''}`}
                      onClick={() => { setRole(r.id); setError('') }}
                      style={role === r.id ? { background: r.gradient, borderColor: 'transparent' } : {}}>
                      <r.icon size={18} /><span>{r.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleLogin}>
                  <div className="login-field">
                    <label>Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                      placeholder={role === 'admin' ? 'admin' : role === 'student' ? 'e.g. rahul' : 'e.g. drsingh'}
                      required autoFocus />
                  </div>
                  <div className="login-field">
                    <label>Password</label>
                    <div className="login-pw-wrapper">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password" required />
                      <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {error && <div className="login-error">⚠ {error}</div>}
                  <button type="submit" className="login-submit" disabled={loading} style={{ background: activeRole.gradient }}>
                    <LogIn size={18} /> {loading ? 'Signing in...' : `Sign in as ${activeRole.label}`}
                  </button>
                </form>

                <div className="login-switch">
                  Don't have an account?{' '}
                  <button onClick={() => { setMode('register'); resetForm() }}>Register here</button>
                </div>

                <div className="login-demo-creds">
                  <p><strong>Demo Credentials:</strong></p>
                  <div className="cred-grid">
                    <span className="cred-tag blue">Student: rahul / rahul123</span>
                    <span className="cred-tag green">Faculty: drsingh / singh123</span>
                    <span className="cred-tag orange">Admin: admin / admin123</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button className="login-back" onClick={() => { setMode('login'); resetForm() }}>
                  <ArrowLeft size={16} /> Back to Sign In
                </button>
                <h2>Create Account</h2>
                <p className="login-subtitle">Register as a Student or Faculty member</p>

                <div className="role-selector">
                  {roles.filter(r => r.id !== 'admin').map(r => (
                    <button key={r.id} type="button"
                      className={`role-btn ${role === r.id ? 'active' : ''}`}
                      onClick={() => { setRole(r.id); setError('') }}
                      style={role === r.id ? { background: r.gradient, borderColor: 'transparent' } : {}}>
                      <r.icon size={18} /><span>{r.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleRegister}>
                  <div className="login-field">
                    <label>Full Name</label>
                    <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Enter your full name" required />
                  </div>
                  <div className="login-field">
                    <label>Email</label>
                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Enter email address" required />
                  </div>
                  <div className="login-field">
                    <label>{role === 'student' ? 'Student ID (from university records)' : 'Faculty ID (from university records)'}</label>
                    <input type="number" value={regRefID} onChange={e => setRegRefID(e.target.value)}
                      placeholder={role === 'student' ? 'e.g. 105' : 'e.g. 205'} required />
                  </div>
                  <div className="login-field">
                    <label>Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" required />
                  </div>
                  <div className="login-field">
                    <label>Password</label>
                    <div className="login-pw-wrapper">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required />
                      <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {error && <div className="login-error">⚠ {error}</div>}
                  {success && <div className="login-success">✓ {success}</div>}
                  <button type="submit" className="login-submit" disabled={loading} style={{ background: activeRole.gradient }}>
                    <UserPlus size={18} /> {loading ? 'Registering...' : `Register as ${activeRole.label}`}
                  </button>
                </form>

                <div className="login-switch">
                  Already have an account?{' '}
                  <button onClick={() => { setMode('login'); resetForm() }}>Sign in here</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
