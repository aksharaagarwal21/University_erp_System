import { useState, useEffect } from 'react'
import { User, BookOpen, Award, Calendar, ClipboardList, TrendingUp, Star, Clock, DollarSign, Users, Megaphone, CheckCircle, LogOut } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar } from 'recharts'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const COLORS = ['#6366f1','#10b981','#f97316','#e11d48','#8b5cf6','#0ea5e9']

export default function StudentDashboard({ user, onLogout }) {
  const [profile, setProfile] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [results, setResults] = useState([])
  const [timetable, setTimetable] = useState([])
  const [attendance, setAttendance] = useState([])
  const [compMarks, setCompMarks] = useState([])
  const [fees, setFees] = useState([])
  const [facultyAvail, setFacultyAvail] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [tab, setTab] = useState('overview')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const id = user.RefID

  useEffect(() => {
    fetch(`${API}/student/${id}/profile`).then(r=>r.json()).then(setProfile)
    fetch(`${API}/student/${id}/enrollments`).then(r=>r.json()).then(setEnrollments)
    fetch(`${API}/student/${id}/results`).then(r=>r.json()).then(setResults)
    fetch(`${API}/student/${id}/timetable`).then(r=>r.json()).then(setTimetable)
    fetch(`${API}/student/${id}/attendance`).then(r=>r.json()).then(setAttendance)
    fetch(`${API}/student/${id}/component-marks`).then(r=>r.json()).then(setCompMarks)
    fetch(`${API}/student/${id}/fees`).then(r=>r.json()).then(setFees)
    fetch(`${API}/faculty-availability`).then(r=>r.json()).then(setFacultyAvail)
    fetch(`${API}/announcements`).then(r=>r.json()).then(setAnnouncements)
  }, [id])

  if (!profile) return <div className="spinner" style={{marginTop:'20vh'}}></div>

  const avgGpa = results.length ? (results.reduce((s,r)=>s+r.GPA,0)/results.length).toFixed(2) : '0'
  const avgMarks = results.length ? Math.round(results.reduce((s,r)=>s+r.Marks,0)/results.length) : 0
  const highestMarks = results.length ? Math.max(...results.map(r=>r.Marks)) : 0
  const totalCredits = enrollments.reduce((s,e)=>s+(e.Credits||0),0)
  const totalFees = fees.reduce((s,f)=>s+(Number(f.AmountPaid)||0),0)
  const avgAttendance = attendance.length ? Math.round(attendance.reduce((s,a)=>s+(Number(a.Percentage)||0),0)/attendance.length) : 0

  const gradeData = results.reduce((acc,r)=>{const e=acc.find(a=>a.name===r.Grade);if(e)e.value++;else acc.push({name:r.Grade,value:1});return acc},[])
  const marksData = results.map(r=>({name:r.SubjectName?.substring(0,12)||'Subj',Marks:r.Marks,GPA:r.GPA}))
  const gpaRadial = [{name:'GPA',value:Number(avgGpa),fill:Number(avgGpa)>=8?'#10b981':Number(avgGpa)>=6?'#f97316':'#ef4444'}]

  const tabs = [
    {id:'overview',label:'Overview',icon:User},
    {id:'subjects',label:'My Subjects',icon:BookOpen},
    {id:'results',label:'My Results',icon:Award},
    {id:'timetable',label:'My Timetable',icon:Calendar},
    {id:'attendance',label:'Attendance',icon:ClipboardList},
    {id:'compmarks',label:'Component Marks',icon:TrendingUp},
    {id:'fees',label:'Fee Payments',icon:DollarSign},
    {id:'faculty',label:'Faculty Availability',icon:Users},
    {id:'announcements',label:'Announcements',icon:Megaphone},
  ]

  const dayColors = {Monday:'#6366f1',Tuesday:'#10b981',Wednesday:'#f97316',Thursday:'#e11d48',Friday:'#8b5cf6',Saturday:'#0ea5e9'}
  const markClass = (v,max) => v>=max*0.75?'high':v>=max*0.4?'mid':'low'

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Welcome back, {profile.Name} 👋</h2>
          <p>Student ID: {profile.StudentID} · {profile.DeptName} · Semester {profile.Semester}</p>
        </div>
        <div style={{position:'relative'}}>
          <button className="profile-avatar-btn-light" onClick={()=>setShowProfileMenu(!showProfileMenu)}>
            <div className="header-avatar" style={{background:'#6366f1'}}>{profile.Name?.charAt(0)}</div>
          </button>
          {showProfileMenu && (
            <>
              <div className="profile-overlay" onClick={()=>setShowProfileMenu(false)}/>
              <div className="profile-dropdown" style={{position:'absolute',top:'calc(100% + 8px)',right:0,zIndex:999}}>
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-avatar" style={{background:'#6366f1'}}>{profile.Name?.charAt(0)}</div>
                  <div>
                    <div className="profile-dropdown-name">{profile.Name}</div>
                    <div className="profile-dropdown-role" style={{color:'#6366f1'}}>Student</div>
                  </div>
                </div>
                <div className="profile-dropdown-body">
                  <div className="profile-dropdown-item"><User size={14}/> <span>ID: {profile.StudentID}</span></div>
                  <div className="profile-dropdown-item"><span>📧 {profile.Email}</span></div>
                  <div className="profile-dropdown-item"><span>📱 {profile.Phone}</span></div>
                  <div className="profile-dropdown-item"><span>🏫 {profile.DeptName} · Sem {profile.Semester}</span></div>
                </div>
                <button className="profile-dropdown-logout" onClick={onLogout}><LogOut size={16}/> Sign Out</button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="page-body">
        <div className="dash-tabs">
          {tabs.map(t=>(
            <button key={t.id} className={`dash-tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>
              <t.icon size={16}/> {t.label}
            </button>
          ))}
        </div>

        {tab==='overview' && (
          <div className="fade-in-up">
            <div className="stats-grid">
              {[
                {label:'Enrolled Subjects',value:enrollments.length,icon:BookOpen,color:'blue',sub:`${totalCredits} total credits`},
                {label:'Avg Attendance',value:`${avgAttendance}%`,icon:ClipboardList,color:'green',sub:`${attendance.length} subjects tracked`},
                {label:'Classes/Week',value:timetable.length,icon:Calendar,color:'purple',sub:'Scheduled sessions'},
                {label:'Average GPA',value:avgGpa,icon:TrendingUp,color:'orange',sub:`Avg Marks: ${avgMarks}%`},
              ].map((card,i)=>(
                <div className="stat-card" key={i}>
                  <div className={`stat-card-icon ${card.color}`}><card.icon size={22}/></div>
                  <div className="stat-card-info"><h3>{card.value}</h3><p>{card.label}</p><span className="stat-sub">{card.sub}</span></div>
                </div>
              ))}
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>📊 Subject-wise Marks</h3>
                {marksData.length>0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={marksData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                      <XAxis dataKey="name" tick={{fontSize:11}}/>
                      <YAxis domain={[0,100]} tick={{fontSize:11}}/>
                      <Tooltip contentStyle={{borderRadius:10,border:'none',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}/>
                      <Bar dataKey="Marks" radius={[8,8,0,0]}>
                        {marksData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="empty-state"><p>No results yet</p></div>}
              </div>
              <div className="chart-card" style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <h3 style={{alignSelf:'flex-start',width:'100%'}}>🎯 GPA Overview</h3>
                <div style={{display:'flex',alignItems:'center',gap:30,flex:1}}>
                  <div style={{width:160,height:160}}>
                    <ResponsiveContainer>
                      <RadialBarChart innerRadius="70%" outerRadius="100%" data={gpaRadial} startAngle={90} endAngle={-270}>
                        <RadialBar background dataKey="value" cornerRadius={10} max={10}/>
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="gpa-center">{avgGpa}</div>
                  </div>
                  <div>
                    {gradeData.length>0 ? (
                      <div style={{display:'flex',flexDirection:'column',gap:8}}>
                        {gradeData.map((g,i)=>(
                          <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                            <span className={`grade-badge ${g.name==='A+'?'a-plus':g.name==='A'?'a':g.name==='B'?'b':g.name==='C'?'c':'f'}`}>{g.name}</span>
                            <span style={{fontSize:'0.85rem',color:'var(--gray-600)'}}>× {g.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p style={{color:'var(--gray-400)',fontSize:'0.85rem'}}>No grades yet</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header"><h3>📋 My Profile</h3></div>
              <div style={{padding:24}}>
                <div className="profile-grid">
                  {[
                    {l:'Student ID',v:profile.StudentID,icon:'🆔'},
                    {l:'Full Name',v:profile.Name,icon:'👤'},
                    {l:'Email',v:profile.Email,icon:'📧'},
                    {l:'Phone',v:profile.Phone,icon:'📱'},
                    {l:'Department',v:profile.DeptName,icon:'🏫'},
                    {l:'Semester',v:`Semester ${profile.Semester}`,icon:'📅'},
                  ].map((p,i)=>(
                    <div className="profile-item" key={i}>
                      <span className="profile-label">{p.icon} {p.l}</span>
                      <span className="profile-value">{p.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==='subjects' && (
          <div className="fade-in-up">
            <div className="subject-cards-grid">
              {enrollments.map((e,i)=>(
                <div className="subject-card stagger-item" key={i} style={{'--accent':COLORS[i%COLORS.length]}}>
                  <div className="subject-card-top">
                    <div className="subject-card-icon" style={{background:COLORS[i%COLORS.length]}}><BookOpen size={20} color="#fff"/></div>
                    <span className={`badge ${e.Status==='Active'?'badge-success':e.Status==='Completed'?'badge-info':'badge-warning'}`}>{e.Status}</span>
                  </div>
                  <h4>{e.SubjectName}</h4>
                  <div className="subject-card-meta">
                    <span><Star size={14}/> {e.Credits} Credits</span>
                    <span><Clock size={14}/> {e.AcademicYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='results' && (
          <div className="fade-in-up">
            {results.map((r,i)=>(
              <div className="result-card stagger-item" key={i}>
                <div className="result-card-left">
                  <span className={`grade-badge ${r.Grade==='A+'?'a-plus':r.Grade==='A'?'a':r.Grade==='B'?'b':r.Grade==='C'?'c':'f'}`} style={{width:48,height:48,fontSize:'1rem'}}>{r.Grade}</span>
                </div>
                <div className="result-card-info">
                  <h4>{r.SubjectName}</h4>
                  <p>{r.ExamDate?new Date(r.ExamDate).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'}):'—'}</p>
                </div>
                <div className="result-card-stats">
                  <div className="result-stat"><span className="result-stat-label">Marks</span><span className="result-stat-value" style={{color:r.Marks>=80?'#059669':r.Marks>=60?'#2563eb':'#dc2626'}}>{r.Marks}<span style={{fontSize:'0.75rem',color:'var(--gray-400)'}}>/100</span></span></div>
                  <div className="result-stat"><span className="result-stat-label">GPA</span><span className="result-stat-value">{r.GPA}</span></div>
                </div>
                <div className="result-card-bar"><div className="result-bar-bg"><div className="result-bar-fill" style={{width:`${r.Marks}%`,background:r.Marks>=80?'linear-gradient(90deg,#059669,#34d399)':r.Marks>=60?'linear-gradient(90deg,#2563eb,#60a5fa)':'linear-gradient(90deg,#dc2626,#f87171)'}}></div></div></div>
              </div>
            ))}
            {results.length===0 && <div className="empty-state"><p>No results published yet</p></div>}
          </div>
        )}

        {tab==='timetable' && (
          <div className="fade-in-up">
            <div className="timetable-visual">
              {['Monday','Tuesday','Wednesday','Thursday','Friday'].map((day,di)=>{
                const slots = timetable.filter(t=>t.Day===day).sort((a,b)=>a.TimeSlot.localeCompare(b.TimeSlot))
                if(!slots.length) return null
                return (
                <div className="tt-day-card stagger-item" key={day}>
                  <div className="tt-day-header" style={{background:dayColors[day]||'#6366f1'}}>Day {di+1} — {day}</div>
                  {slots.map((s,i)=>(
                    <div className="tt-slot" key={i}>
                      <div className="tt-slot-time">{s.TimeSlot}</div>
                      <div className="tt-slot-info"><strong>{s.SubjectName}</strong><span>{s.FacultyName} · {s.RoomNo}</span></div>
                    </div>
                  ))}
                </div>
                )
              })}
            </div>
          </div>
        )}

        {tab==='attendance' && (
          <div className="fade-in-up">
            <div className="attendance-cards-grid">
              {attendance.map((a,i)=>{
                const pct = Number(a.Percentage)||0
                const cls = pct>=75?'good':pct>=50?'okay':'low'
                const barColor = pct>=75?'linear-gradient(90deg,#059669,#34d399)':pct>=50?'linear-gradient(90deg,#d97706,#fbbf24)':'linear-gradient(90deg,#dc2626,#f87171)'
                return (
                  <div className="att-card stagger-item" key={i}>
                    <div className="att-card-header">
                      <h4>{a.SubjectName}</h4>
                      <span className={`att-percentage ${cls}`}>{pct}%</span>
                    </div>
                    <div className="att-bar"><div className="att-bar-fill" style={{width:`${pct}%`,background:barColor}}></div></div>
                    <div className="att-stats">
                      <span><span className="att-dot present"></span> Present: {a.Present}</span>
                      <span><span className="att-dot absent"></span> Absent: {a.Absent}</span>
                      <span><span className="att-dot late"></span> Late: {a.Late||0}</span>
                      <span>Total: {a.TotalClasses}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            {attendance.length===0 && <div className="empty-state"><p>No attendance records yet</p></div>}
          </div>
        )}

        {tab==='compmarks' && (
          <div className="fade-in-up">
            <div className="table-container">
              <div className="table-header"><h3>📝 Component-wise Marks</h3><span className="badge badge-info">{compMarks.length} subjects</span></div>
              <div className="table-scroll">
                <table className="comp-marks-table">
                  <thead><tr><th>Subject</th><th>CT1</th><th>CT2</th><th>Assignment</th><th>Lab</th><th>MidSem</th><th>EndSem</th><th>Total</th></tr></thead>
                  <tbody>
                    {compMarks.map((cm,i)=>(
                      <tr key={i}>
                        <td>{cm.SubjectName}</td>
                        <td><span className={`mark-cell ${markClass(cm.CT1,20)}`}>{cm.CT1}</span></td>
                        <td><span className={`mark-cell ${markClass(cm.CT2,20)}`}>{cm.CT2}</span></td>
                        <td><span className={`mark-cell ${markClass(cm.Assignment,10)}`}>{cm.Assignment}</span></td>
                        <td><span className={`mark-cell ${markClass(cm.Lab,25)}`}>{cm.Lab}</span></td>
                        <td><span className={`mark-cell ${markClass(cm.MidSem,40)}`}>{cm.MidSem}</span></td>
                        <td><span className={`mark-cell ${markClass(cm.EndSem,100)}`}>{cm.EndSem}</span></td>
                        <td style={{fontWeight:800,fontSize:'1rem'}}>{cm.TotalMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {compMarks.length===0 && <div className="empty-state"><p>No component marks available yet</p></div>}
          </div>
        )}

        {tab==='fees' && (
          <div className="fade-in-up">
            <div className="stats-grid" style={{marginBottom:24}}>
              <div className="stat-card"><div className="stat-card-icon green"><DollarSign size={22}/></div><div className="stat-card-info"><h3>₹{totalFees.toLocaleString('en-IN')}</h3><p>Total Paid</p></div></div>
              <div className="stat-card"><div className="stat-card-icon blue"><CheckCircle size={22}/></div><div className="stat-card-info"><h3>{fees.filter(f=>f.Status==='Paid').length}</h3><p>Payments Done</p></div></div>
              <div className="stat-card"><div className="stat-card-icon orange"><Clock size={22}/></div><div className="stat-card-info"><h3>{fees.filter(f=>f.Status!=='Paid').length}</h3><p>Pending</p></div></div>
            </div>
            <div className="fee-cards">
              {fees.map((f,i)=>(
                <div className="fee-card stagger-item" key={i}>
                  <div className={`fee-icon-box ${f.Status?.toLowerCase()}`}><DollarSign size={22}/></div>
                  <div className="fee-info">
                    <h4>{f.FeeName}</h4>
                    <p>Semester {f.Semester} · {f.PaymentMode} · {f.TransactionID||'—'}</p>
                    <p>Date: {f.PaymentDate?new Date(f.PaymentDate).toLocaleDateString('en-IN'):''}</p>
                  </div>
                  <div className="fee-amount">
                    <div className="amount">₹{Number(f.AmountPaid).toLocaleString('en-IN')}</div>
                    <div className={`status ${f.Status?.toLowerCase()}`}>{f.Status}</div>
                    {f.TotalAmount && <div style={{fontSize:'0.72rem',color:'var(--gray-400)'}}>of ₹{Number(f.TotalAmount).toLocaleString('en-IN')}</div>}
                  </div>
                </div>
              ))}
              {fees.length===0 && <div className="empty-state"><p>No fee records found</p></div>}
            </div>
          </div>
        )}

        {tab==='faculty' && (
          <div className="fade-in-up">
            <div className="section-divider"><h3>🏢 Faculty Cabin Status</h3></div>
            <div className="faculty-avail-grid">
              {facultyAvail.map((f,i)=>(
                <div className="faculty-avail-card stagger-item" key={i}>
                  <div className="faculty-avail-avatar" style={{background:f.IsAvailable?'#10b981':'#94a3b8'}}>
                    {f.FacultyName?.charAt(0)}
                  </div>
                  <div className="faculty-avail-info">
                    <h4>{f.FacultyName}</h4>
                    <p>{f.DeptName} · {f.Specialization}</p>
                    {f.CabinNumber && <div className="cabin">🚪 Cabin: {f.CabinNumber}</div>}
                    {f.StatusMessage && <p style={{fontSize:'0.75rem',color:f.IsAvailable?'#059669':'#dc2626',marginTop:2}}>{f.StatusMessage}</p>}
                    {f.AvailableFrom && f.AvailableTo && <p style={{fontSize:'0.72rem',color:'var(--gray-400)'}}>🕐 {f.AvailableFrom} - {f.AvailableTo}</p>}
                  </div>
                  <span className={`faculty-avail-badge ${f.IsAvailable?'available':'unavailable'}`}>
                    {f.IsAvailable?'Available':'Away'}
                  </span>
                </div>
              ))}
            </div>
            {facultyAvail.length===0 && <div className="empty-state"><p>No faculty availability data</p></div>}
          </div>
        )}

        {tab==='announcements' && (
          <div className="fade-in-up">
            <div className="section-divider"><h3>📢 Latest Announcements</h3></div>
            <div className="announcement-list">
              {announcements.map((a,i)=>(
                <div className={`announcement-card stagger-item priority-${a.Priority?.toLowerCase()}`} key={a.AnnouncementID||i}>
                  <div className="announcement-card-top">
                    <h4>{a.Title}</h4>
                    <span className={`badge ${a.Priority==='High'||a.Priority==='Urgent'?'badge-danger':a.Priority==='Low'?'badge-success':'badge-warning'}`}>{a.Priority}</span>
                  </div>
                  <p>{a.Content}</p>
                  <div className="announcement-meta">
                    <span>📅 {a.CreatedAt?new Date(a.CreatedAt).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'}):''}</span>
                    <span>👥 {a.TargetAudience}</span>
                    <span>📌 {a.PostedByRole}</span>
                  </div>
                </div>
              ))}
              {announcements.length===0 && <div className="empty-state"><p>No announcements</p></div>}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
