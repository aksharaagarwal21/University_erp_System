import { useState, useEffect } from 'react'
import { User, BookOpen, Users, Calendar, Award, Pencil, Save, X, Plus, Trash2, DoorOpen, ClipboardList, FileText, CalendarOff, LogOut, ArrowLeft, GraduationCap } from 'lucide-react'

const API = 'http://localhost:5000/api'

export default function FacultyDashboard({ user, toast, onLogout }) {
  const [profile, setProfile] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [timetable, setTimetable] = useState([])
  const [results, setResults] = useState([])
  const [compMarks, setCompMarks] = useState([])
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [availability, setAvailability] = useState({})
  const [leaves, setLeaves] = useState([])
  const [materials, setMaterials] = useState([])
  const [tab, setTab] = useState('overview')
  const id = user.RefID
  const notify = (m,t='success') => toast?.(m,t)

  // Marks editing
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [addMarkForm, setAddMarkForm] = useState({StudentID:'',SubjectID:'',CT1:'',CT2:'',Assignment:'',Lab:'',MidSem:'',EndSem:''})
  const [showAddMark, setShowAddMark] = useState(false)

  // Attendance
  const [attSubject, setAttSubject] = useState('')
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0])
  const [attRecords, setAttRecords] = useState({})
  const [attClass, setAttClass] = useState('')
  const [attClassStudents, setAttClassStudents] = useState([])

  // Materials
  const [matForm, setMatForm] = useState({SubjectID:'',Title:'',Description:'',MaterialType:'Notes'})
  const [showAddMat, setShowAddMat] = useState(false)

  // Leave
  const [leaveForm, setLeaveForm] = useState({LeaveDate:'',Reason:''})

  // Availability
  const [avForm, setAvForm] = useState({CabinNumber:'',StatusMessage:'',AvailableFrom:'',AvailableTo:''})

  // Class-wise students
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [classStudents, setClassStudents] = useState([])
  const [classSubs, setClassSubs] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentProfile, setStudentProfile] = useState(null)
  const [markForm, setMarkForm] = useState({SubjectID:'',CT1:'',CT2:'',Assignment:'',Lab:'',MidSem:'',EndSem:''})

  const fetchAll = () => {
    fetch(`${API}/faculty-user/${id}/profile`).then(r=>r.json()).then(setProfile)
    fetch(`${API}/faculty-user/${id}/subjects`).then(r=>r.json()).then(setSubjects)
    fetch(`${API}/faculty-user/${id}/students`).then(r=>r.json()).then(setStudents)
    fetch(`${API}/faculty-user/${id}/timetable`).then(r=>r.json()).then(setTimetable)
    fetch(`${API}/faculty-user/${id}/results`).then(r=>r.json()).then(setResults)
    fetch(`${API}/faculty-user/${id}/component-marks`).then(r=>r.json()).then(setCompMarks)
    fetch(`${API}/faculty-user/${id}/availability`).then(r=>r.json()).then(d=>{setAvailability(d);setAvForm({CabinNumber:d.CabinNumber||'',StatusMessage:d.StatusMessage||'',AvailableFrom:d.AvailableFrom||'',AvailableTo:d.AvailableTo||''})})
    fetch(`${API}/faculty-user/${id}/leaves`).then(r=>r.json()).then(setLeaves)
    fetch(`${API}/study-materials`).then(r=>r.json()).then(d=>setMaterials(d.filter(m=>subjects.some(s=>s.SubjectID===m.SubjectID)||m.FacultyID==id)))
  }

  useEffect(()=>{fetchAll()},[id])
  useEffect(()=>{
    if(profile?.FacultyID) fetch(`${API}/faculty/${profile.FacultyID}/classes`).then(r=>r.json()).then(setClasses).catch(()=>{})
  },[profile])
  useEffect(()=>{
    if(subjects.length) fetch(`${API}/study-materials`).then(r=>r.json()).then(d=>setMaterials(d.filter(m=>m.FacultyID==id)))
  },[subjects])

  if(!profile) return <div className="spinner" style={{marginTop:'20vh'}}></div>

  const tabs = [
    {id:'overview',label:'Overview',icon:User},
    {id:'classes',label:'My Classes',icon:GraduationCap},
    {id:'subjects',label:'My Subjects',icon:BookOpen},
    {id:'schedule',label:'My Schedule',icon:Calendar},
    {id:'cabin',label:'Cabin Availability',icon:DoorOpen},
    {id:'attendance',label:'Mark Attendance',icon:ClipboardList},
    {id:'materials',label:'Study Materials',icon:FileText},
    {id:'leaves',label:'Leave Requests',icon:CalendarOff},
  ]

  const saveCompMark = async (cmId) => {
    try {
      await fetch(`${API}/component-marks/${cmId}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(editForm)})
      notify('Marks updated!'); setEditId(null); fetchAll()
    } catch(e){notify(e.message,'error')}
  }

  const addCompMark = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API}/component-marks`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(addMarkForm)})
      notify('Component marks added!'); setShowAddMark(false); setAddMarkForm({StudentID:'',SubjectID:'',CT1:'',CT2:'',Assignment:'',Lab:'',MidSem:'',EndSem:''}); fetchAll()
    } catch(e){notify(e.message,'error')}
  }

  const toggleAvail = async (val) => {
    try {
      await fetch(`${API}/faculty-user/${id}/availability`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({IsAvailable:val,CabinNumber:avForm.CabinNumber,StatusMessage:avForm.StatusMessage,AvailableFrom:avForm.AvailableFrom||null,AvailableTo:avForm.AvailableTo||null})})
      notify(val?'Marked Available':'Marked Unavailable'); fetchAll()
    } catch(e){notify(e.message,'error')}
  }

  const saveAvail = async () => {
    try {
      await fetch(`${API}/faculty-user/${id}/availability`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({IsAvailable:availability.IsAvailable??true,...avForm,AvailableFrom:avForm.AvailableFrom||null,AvailableTo:avForm.AvailableTo||null})})
      notify('Availability updated!'); fetchAll()
    } catch(e){notify(e.message,'error')}
  }

  const submitAttendance = async () => {
    const records = Object.entries(attRecords).map(([sid,status])=>({StudentID:Number(sid),SubjectID:Number(attSubject),AttendanceDate:attDate,Status:status,MarkedBy:id}))
    if(!records.length){notify('Select students first','error');return}
    try {
      await fetch(`${API}/attendance/bulk`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({records})})
      notify(`${records.length} records saved!`); setAttRecords({}); fetchAll()
    } catch(e){notify(e.message,'error')}
  }

  const addMaterial = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API}/study-materials`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...matForm,FacultyID:id})})
      notify('Material added!'); setShowAddMat(false); setMatForm({SubjectID:'',Title:'',Description:'',MaterialType:'Notes'}); fetchAll()
    } catch(e){notify(e.message,'error')}
  }

  const deleteMaterial = async (mid) => {
    if(!confirm('Delete this material?')) return
    try { await fetch(`${API}/study-materials/${mid}`,{method:'DELETE'}); notify('Deleted!'); fetchAll() } catch(e){notify(e.message,'error')}
  }

  const submitLeave = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API}/faculty-leave`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({FacultyID:id,...leaveForm})})
      notify('Leave requested!'); setLeaveForm({LeaveDate:'',Reason:''}); fetchAll()
    } catch(e){notify(e.message,'error')}
  }

  const markClass = (v,max) => v >= max*0.75 ? 'high' : v >= max*0.4 ? 'mid' : 'low'
  const attStudents = attSubject ? students.filter(s=>String(s.SubjectID||'')===attSubject || subjects.some(sub=>String(sub.SubjectID)===attSubject)) : []
  const uniqueAttStudents = attSubject ? [...new Map(students.filter(s=>s.SubjectName===subjects.find(sub=>String(sub.SubjectID)===attSubject)?.SubjectName).map(s=>[s.StudentID,s])).values()] : []

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Welcome, {profile.FacultyName} 👋</h2>
          <p>Faculty ID: {profile.FacultyID} · {profile.DeptName} · {profile.Specialization}</p>
        </div>
        <div style={{position:'relative'}}>
          <button className="profile-avatar-btn-light" onClick={()=>setShowProfileMenu(!showProfileMenu)}>
            <div className="header-avatar" style={{background:'#10b981'}}>{profile.FacultyName?.charAt(0)}</div>
          </button>
          {showProfileMenu && (
            <>
              <div className="profile-overlay" onClick={()=>setShowProfileMenu(false)}/>
              <div className="profile-dropdown" style={{position:'absolute',top:'calc(100% + 8px)',right:0,zIndex:999}}>
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-avatar" style={{background:'#10b981'}}>{profile.FacultyName?.charAt(0)}</div>
                  <div>
                    <div className="profile-dropdown-name">{profile.FacultyName}</div>
                    <div className="profile-dropdown-role" style={{color:'#10b981'}}>Faculty</div>
                  </div>
                </div>
                <div className="profile-dropdown-body">
                  <div className="profile-dropdown-item"><User size={14}/> <span>ID: {profile.FacultyID}</span></div>
                  <div className="profile-dropdown-item"><span>🎓 {profile.Specialization}</span></div>
                  <div className="profile-dropdown-item"><span>🏫 {profile.DeptName}</span></div>
                  <div className="profile-dropdown-item"><span>🚪 Cabin: {availability.CabinNumber||'Not set'}</span></div>
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
              <div className="stat-card"><div className="stat-card-icon blue"><BookOpen size={22}/></div><div className="stat-card-info"><h3>{subjects.length}</h3><p>Subjects Teaching</p></div></div>
              <div className="stat-card"><div className="stat-card-icon green"><Users size={22}/></div><div className="stat-card-info"><h3>{students.length}</h3><p>Students Under Me</p></div></div>
              <div className="stat-card"><div className="stat-card-icon purple"><Calendar size={22}/></div><div className="stat-card-info"><h3>{timetable.length}</h3><p>Classes/Week</p></div></div>
              <div className="stat-card"><div className="stat-card-icon orange"><Award size={22}/></div><div className="stat-card-info"><h3>{compMarks.length}</h3><p>Marks Entries</p></div></div>
            </div>
            <div className="table-container">
              <div className="table-header"><h3>📋 Faculty Profile</h3></div>
              <div style={{padding:24}}>
                <div className="profile-grid">
                  <div className="profile-item"><span className="profile-label">Faculty ID</span><span className="profile-value">{profile.FacultyID}</span></div>
                  <div className="profile-item"><span className="profile-label">Name</span><span className="profile-value">{profile.FacultyName}</span></div>
                  <div className="profile-item"><span className="profile-label">Specialization</span><span className="profile-value">{profile.Specialization}</span></div>
                  <div className="profile-item"><span className="profile-label">Department</span><span className="profile-value">{profile.DeptName}</span></div>
                  <div className="profile-item"><span className="profile-label">Cabin</span><span className="profile-value">{availability.CabinNumber||'Not set'}</span></div>
                  <div className="profile-item"><span className="profile-label">Status</span><span className="profile-value">{availability.IsAvailable?'🟢 Available':'🔴 Unavailable'}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==='classes' && (
          <div className="fade-in-up">
            {!selectedClass && !selectedStudent && (
              <>
                <h3 style={{margin:'0 0 16px',fontSize:'1.1rem'}}>🎓 My Classes ({classes.length})</h3>
                <div className="stats-grid">
                  {classes.map(c=>(
                    <div className="stat-card" key={c.ClassID} style={{cursor:'pointer'}} onClick={()=>{
                      setSelectedClass(c)
                      fetch(`${API}/faculty/${profile.FacultyID}/class/${c.ClassID}/students`).then(r=>r.json()).then(setClassStudents)
                      fetch(`${API}/faculty/${profile.FacultyID}/class/${c.ClassID}/subjects`).then(r=>r.json()).then(setClassSubs)
                    }}>
                      <div className="stat-card-icon blue"><GraduationCap size={22}/></div>
                      <div className="stat-card-info">
                        <h3>{c.ClassName}</h3>
                        <p>{c.DeptName} · Sem {c.Semester}</p>
                        <span className="stat-sub">{c.StudentCount} students</span>
                      </div>
                    </div>
                  ))}
                </div>
                {classes.length===0 && <p style={{color:'#94a3b8',textAlign:'center',padding:40}}>No classes assigned yet</p>}
              </>
            )}

            {selectedClass && !selectedStudent && (
              <>
                <button className="btn btn-secondary" style={{marginBottom:16}} onClick={()=>{setSelectedClass(null);setClassStudents([])}}>
                  <ArrowLeft size={16}/> Back to Classes
                </button>
                <h3 style={{margin:'0 0 16px'}}>👥 {selectedClass.ClassName} — Students ({classStudents.length})</h3>
                <div className="table-container">
                  <div className="table-scroll"><table><thead><tr>
                    <th>#</th><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Action</th>
                  </tr></thead><tbody>
                    {classStudents.map((s,i)=>(
                      <tr key={s.StudentID}>
                        <td>{i+1}</td>
                        <td>{s.StudentID}</td>
                        <td style={{fontWeight:600}}>{s.Name}</td>
                        <td>{s.Email}</td>
                        <td>{s.Phone}</td>
                        <td>
                          <button className="btn btn-sm btn-primary" onClick={()=>{
                            setSelectedStudent(s)
                            fetch(`${API}/student-profile/${s.StudentID}`).then(r=>r.json()).then(d=>{
                              setStudentProfile(d)
                              setMarkForm({SubjectID:'',CT1:'',CT2:'',Assignment:'',Lab:'',MidSem:'',EndSem:''})
                            })
                          }}>
                            <User size={14}/> View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody></table></div>
                </div>
              </>
            )}

            {selectedStudent && studentProfile && (
              <>
                <button className="btn btn-secondary" style={{marginBottom:16}} onClick={()=>{setSelectedStudent(null);setStudentProfile(null)}}>
                  <ArrowLeft size={16}/> Back to {selectedClass?.ClassName}
                </button>
                <div className="table-container" style={{marginBottom:20}}>
                  <div className="table-header"><h3>👤 {studentProfile.Name}'s Profile</h3></div>
                  <div style={{padding:20}}>
                    <div className="profile-grid">
                      <div className="profile-item"><span className="profile-label">Student ID</span><span className="profile-value">{studentProfile.StudentID}</span></div>
                      <div className="profile-item"><span className="profile-label">Name</span><span className="profile-value">{studentProfile.Name}</span></div>
                      <div className="profile-item"><span className="profile-label">Email</span><span className="profile-value">{studentProfile.Email}</span></div>
                      <div className="profile-item"><span className="profile-label">Phone</span><span className="profile-value">{studentProfile.Phone}</span></div>
                      <div className="profile-item"><span className="profile-label">Department</span><span className="profile-value">{studentProfile.DeptName}</span></div>
                      <div className="profile-item"><span className="profile-label">Class</span><span className="profile-value">{studentProfile.ClassName}</span></div>
                      <div className="profile-item"><span className="profile-label">Semester</span><span className="profile-value">{studentProfile.Semester}</span></div>
                      <div className="profile-item"><span className="profile-label">Enrolled Subjects</span><span className="profile-value">{studentProfile.enrollments?.length || 0}</span></div>
                    </div>
                  </div>
                </div>

                {studentProfile.marks?.length > 0 && (
                  <div className="table-container" style={{marginBottom:20}}>
                    <div className="table-header"><h3>📊 Existing Marks</h3></div>
                    <div className="table-scroll"><table><thead><tr>
                      <th>Subject</th><th>CT1</th><th>CT2</th><th>Assignment</th><th>Lab</th><th>MidSem</th><th>EndSem</th><th>Total</th>
                    </tr></thead><tbody>
                      {studentProfile.marks.map((m,i)=>(
                        <tr key={i}>
                          <td style={{fontWeight:600}}>{m.SubjectName}</td>
                          <td>{m.CT1}</td><td>{m.CT2}</td><td>{m.Assignment}</td>
                          <td>{m.Lab}</td><td>{m.MidSem}</td><td>{m.EndSem}</td>
                          <td><span className="badge badge-success">{m.TotalMarks}</span></td>
                        </tr>
                      ))}
                    </tbody></table></div>
                  </div>
                )}

                <div className="table-container">
                  <div className="table-header"><h3>✏️ Add/Update Marks</h3></div>
                  <div style={{padding:20}}>
                    <div className="form-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12}}>
                      <div className="form-group" style={{gridColumn:'1/-1'}}>
                        <label>Subject</label>
                        <select className="form-input" value={markForm.SubjectID} onChange={e=>{
                          const sid = e.target.value
                          setMarkForm(f=>({...f,SubjectID:sid}))
                          const existing = studentProfile.marks?.find(m=>String(m.SubjectID)===sid)
                          if(existing) setMarkForm({SubjectID:sid,CT1:existing.CT1,CT2:existing.CT2,Assignment:existing.Assignment,Lab:existing.Lab,MidSem:existing.MidSem,EndSem:existing.EndSem})
                          else setMarkForm(f=>({...f,CT1:'',CT2:'',Assignment:'',Lab:'',MidSem:'',EndSem:''}))
                        }}>
                          <option value="">Select Subject</option>
                          {(classSubs.length ? classSubs : studentProfile.enrollments||[]).map(s=>(
                            <option key={s.SubjectID} value={s.SubjectID}>{s.SubjectName}</option>
                          ))}
                        </select>
                      </div>
                      {['CT1','CT2','Assignment','Lab','MidSem','EndSem'].map(f=>(
                        <div className="form-group" key={f}>
                          <label>{f}</label>
                          <input className="form-input" type="number" min="0" max="100" placeholder="0" value={markForm[f]} onChange={e=>setMarkForm(p=>({...p,[f]:e.target.value}))}/>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-primary" style={{marginTop:16}} disabled={!markForm.SubjectID} onClick={async()=>{
                      try {
                        await fetch(`${API}/component-marks/upsert`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({StudentID:studentProfile.StudentID,...markForm})})
                        notify('Marks saved successfully!')
                        const d = await fetch(`${API}/student-profile/${studentProfile.StudentID}`).then(r=>r.json())
                        setStudentProfile(d)
                        setMarkForm(f=>({...f,CT1:'',CT2:'',Assignment:'',Lab:'',MidSem:'',EndSem:''}))
                      } catch(e){notify(e.message,'error')}
                    }}>
                      <Save size={16}/> Save Marks
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab==='subjects' && (
          <div className="table-container fade-in-up">
            <div className="table-header"><h3>📚 Subjects I Teach</h3></div>
            <div className="table-scroll"><table><thead><tr><th>ID</th><th>Subject</th><th>Credits</th><th>Semester</th></tr></thead><tbody>
              {subjects.map((s,i)=>(
                <tr key={i}><td>{s.SubjectID}</td><td style={{fontWeight:600}}>{s.SubjectName}</td>
                <td><span className="badge badge-success">{s.Credits} Cr</span></td>
                <td><span className="badge badge-info">Sem {s.Semester}</span></td></tr>
              ))}
            </tbody></table></div>
          </div>
        )}


        {tab==='schedule' && (
          <div className="fade-in-up">
            <div className="timetable-visual">
              {['Monday','Tuesday','Wednesday','Thursday','Friday'].map((day,di)=>{
                const slots = timetable.filter(t=>t.Day===day).sort((a,b)=>a.TimeSlot.localeCompare(b.TimeSlot))
                if(!slots.length) return null
                return (
                <div className="tt-day-card stagger-item" key={day}>
                  <div className="tt-day-header" style={{background:{Monday:'#6366f1',Tuesday:'#10b981',Wednesday:'#f97316',Thursday:'#e11d48',Friday:'#8b5cf6'}[day]||'#6366f1'}}>Day {di+1} — {day}</div>
                  {slots.map((s,i)=>(
                    <div className="tt-slot" key={i}>
                      <div className="tt-slot-time">{s.TimeSlot}</div>
                      <div className="tt-slot-info"><strong>{s.SubjectName}</strong><span>Room {s.RoomNo}</span></div>
                    </div>
                  ))}
                </div>
                )
              })}
            </div>
          </div>
        )}


        {tab==='cabin' && (
          <div className="avail-section">
            <div className="avail-card">
              <div className="avail-status-row">
                <div className={`avail-indicator ${availability.IsAvailable?'on':'off'}`}/>
                <span className={`avail-status-label ${availability.IsAvailable?'available':'unavailable'}`}>
                  {availability.IsAvailable ? 'Available in Cabin' : 'Not Available'}
                </span>
                <label className="avail-toggle">
                  <input type="checkbox" checked={!!availability.IsAvailable} onChange={e=>toggleAvail(e.target.checked)}/>
                  <span className="avail-toggle-track"/>
                  <span className="avail-toggle-thumb"/>
                </label>
              </div>
              <div className="avail-form-grid">
                <div className="form-group"><label>Cabin Number</label><input value={avForm.CabinNumber} onChange={e=>setAvForm({...avForm,CabinNumber:e.target.value})} placeholder="e.g. CSE-301"/></div>
                <div className="form-group"><label>Available From</label><input type="time" value={avForm.AvailableFrom} onChange={e=>setAvForm({...avForm,AvailableFrom:e.target.value})}/></div>
                <div className="form-group"><label>Available To</label><input type="time" value={avForm.AvailableTo} onChange={e=>setAvForm({...avForm,AvailableTo:e.target.value})}/></div>
                <div className="form-group avail-msg-full"><label>Status Message</label><input value={avForm.StatusMessage} onChange={e=>setAvForm({...avForm,StatusMessage:e.target.value})} placeholder="e.g. Available for consultation"/></div>
              </div>
              <div style={{marginTop:16}}><button className="btn btn-primary" onClick={saveAvail}><Save size={16}/> Save Details</button></div>
            </div>
          </div>
        )}

        {tab==='attendance' && (
          <div className="fade-in-up">
            <div className="attendance-panel">
              <div className="attendance-toolbar">
                <select value={attClass} onChange={e=>{
                  setAttClass(e.target.value)
                  setAttRecords({})
                  if(e.target.value) {
                    fetch(`${API}/faculty/${profile.FacultyID}/class/${e.target.value}/students`).then(r=>r.json()).then(setAttClassStudents)
                  } else { setAttClassStudents([]) }
                }}>
                  <option value="">Select Class</option>
                  {classes.map(c=><option key={c.ClassID} value={c.ClassID}>{c.ClassName} ({c.DeptName})</option>)}
                </select>
                <select value={attSubject} onChange={e=>{setAttSubject(e.target.value);setAttRecords({})}}>
                  <option value="">Select Subject</option>
                  {subjects.map(s=><option key={s.SubjectID} value={s.SubjectID}>{s.SubjectName}</option>)}
                </select>
                <input type="date" value={attDate} onChange={e=>setAttDate(e.target.value)}/>
                <button className="btn btn-primary" onClick={submitAttendance} disabled={!attSubject || !attClass}><Save size={16}/> Submit Attendance</button>
              </div>
              {attSubject && attClass && attClassStudents.length > 0 && (
                <div className="table-scroll"><table><thead><tr><th>ID</th><th>Student Name</th><th>Class</th><th>Status</th></tr></thead><tbody>
                  {attClassStudents.map(s=>(
                    <tr key={s.StudentID}>
                      <td>{s.StudentID}</td><td style={{fontWeight:600}}>{s.Name}</td>
                      <td><span className="badge badge-info">{s.ClassName}</span></td>
                      <td><div style={{display:'flex',gap:6}}>
                        {['Present','Absent'].map(st=>(
                          <button key={st} className={`att-status-btn ${attRecords[s.StudentID]===st?st.toLowerCase():''}`} onClick={()=>setAttRecords({...attRecords,[s.StudentID]:st})}>{st}</button>
                        ))}
                      </div></td>
                    </tr>
                  ))}
                </tbody></table></div>
              )}
            </div>
          </div>
        )}

        {tab==='materials' && (
          <div className="fade-in-up">
            <div style={{marginBottom:16,display:'flex',justifyContent:'flex-end'}}>
              <button className="btn btn-primary" onClick={()=>setShowAddMat(true)}><Plus size={16}/> Add Material</button>
            </div>
            <div className="material-cards-grid">
              {materials.map((m,i)=>(
                <div className="material-card stagger-item" key={m.MaterialID}>
                  <div className="material-card-top">
                    <span className={`material-type-badge ${m.MaterialType?.toLowerCase()}`}>{m.MaterialType}</span>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>deleteMaterial(m.MaterialID)}><Trash2 size={14}/></button>
                  </div>
                  <h4>{m.Title}</h4>
                  <p className="material-card-desc">{m.Description||'No description'}</p>
                  <div className="material-card-footer">
                    <span>{m.SubjectName}</span>
                    <span>{m.UploadedAt?new Date(m.UploadedAt).toLocaleDateString('en-IN'):''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='leaves' && (
          <div className="fade-in-up">
            <div className="table-container" style={{marginBottom:20}}>
              <div className="table-header"><h3>📝 Request Leave</h3></div>
              <form onSubmit={submitLeave} style={{padding:24}}>
                <div className="form-row">
                  <div className="form-group"><label>Leave Date</label><input type="date" value={leaveForm.LeaveDate} onChange={e=>setLeaveForm({...leaveForm,LeaveDate:e.target.value})} required/></div>
                  <div className="form-group"><label>Reason</label><input value={leaveForm.Reason} onChange={e=>setLeaveForm({...leaveForm,Reason:e.target.value})} placeholder="Reason for leave" required/></div>
                  <button type="submit" className="btn btn-primary" style={{height:42}}><Plus size={16}/> Submit</button>
                </div>
              </form>
            </div>
            <div className="leave-cards">
              {leaves.map((l,i)=>{
                const d=new Date(l.LeaveDate)
                return (
                  <div className="leave-card stagger-item" key={l.LeaveID||i}>
                    <div className="leave-date-box"><span className="day">{d.getDate()}</span><span className="month">{d.toLocaleString('en',{month:'short'})}</span></div>
                    <div className="leave-info"><h4>{l.Reason}</h4><p>Applied: {l.AppliedAt?new Date(l.AppliedAt).toLocaleDateString('en-IN'):''}</p></div>
                    <span className={`leave-status ${l.Status?.toLowerCase()}`}>{l.Status}</span>
                  </div>
                )
              })}
              {leaves.length===0 && <div className="empty-state"><p>No leave requests yet</p></div>}
            </div>
          </div>
        )}
      </div>

      {showAddMark && (
        <div className="modal-overlay" onClick={()=>setShowAddMark(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>Add Component Marks</h3><button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setShowAddMark(false)}><X size={18}/></button></div>
            <form onSubmit={addCompMark}>
              <div className="modal-body">
                <div className="form-group"><label>Student</label><select value={addMarkForm.StudentID} onChange={e=>setAddMarkForm({...addMarkForm,StudentID:e.target.value})} required><option value="">Select</option>{students.map(s=><option key={s.StudentID} value={s.StudentID}>{s.Name} ({s.StudentID})</option>)}</select></div>
                <div className="form-group"><label>Subject</label><select value={addMarkForm.SubjectID} onChange={e=>setAddMarkForm({...addMarkForm,SubjectID:e.target.value})} required><option value="">Select</option>{subjects.map(s=><option key={s.SubjectID} value={s.SubjectID}>{s.SubjectName}</option>)}</select></div>
                {['CT1','CT2','Assignment','Lab','MidSem','EndSem'].map(f=>(
                  <div className="form-group" key={f}><label>{f}</label><input type="number" min="0" value={addMarkForm[f]} onChange={e=>setAddMarkForm({...addMarkForm,[f]:e.target.value})} placeholder="0"/></div>
                ))}
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={()=>setShowAddMark(false)}>Cancel</button><button type="submit" className="btn btn-primary"><Save size={16}/> Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showAddMat && (
        <div className="modal-overlay" onClick={()=>setShowAddMat(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>Add Study Material</h3><button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setShowAddMat(false)}><X size={18}/></button></div>
            <form onSubmit={addMaterial}>
              <div className="modal-body">
                <div className="form-group"><label>Subject</label><select value={matForm.SubjectID} onChange={e=>setMatForm({...matForm,SubjectID:e.target.value})} required><option value="">Select</option>{subjects.map(s=><option key={s.SubjectID} value={s.SubjectID}>{s.SubjectName}</option>)}</select></div>
                <div className="form-group"><label>Title</label><input value={matForm.Title} onChange={e=>setMatForm({...matForm,Title:e.target.value})} required placeholder="Material title"/></div>
                <div className="form-group"><label>Type</label><select value={matForm.MaterialType} onChange={e=>setMatForm({...matForm,MaterialType:e.target.value})}><option>Notes</option><option>PDF</option><option>PPT</option><option>Video</option><option>Link</option></select></div>
                <div className="form-group"><label>Description</label><textarea value={matForm.Description} onChange={e=>setMatForm({...matForm,Description:e.target.value})} rows={3} placeholder="Brief description"/></div>
              </div>
              <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={()=>setShowAddMat(false)}>Cancel</button><button type="submit" className="btn btn-primary"><Save size={16}/> Save</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
