const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost', user: 'root', password: 'Palak@123',
  database: 'university_erpsystem', waitForConnections: true, connectionLimit: 10
});

pool.getConnection().then(c => { console.log('✅ MySQL Connected'); c.release(); })
  .catch(e => console.error('❌ MySQL Error:', e.message));

// ========== AUTH ==========
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const [users] = await pool.query('SELECT * FROM Users WHERE Username=? AND Password=? AND Role=?', [username, password, role]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = users[0];
    res.json({ UserID: user.UserID, Username: user.Username, Role: user.Role, RefID: user.RefID, FullName: user.FullName, Email: user.Email });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { Username, Password, Role, RefID, FullName, Email } = req.body;
    await pool.query('INSERT INTO Users (Username,Password,Role,RefID,FullName,Email) VALUES (?,?,?,?,?,?)',
      [Username, Password, Role, RefID || null, FullName, Email]);
    res.json({ message: 'Registration successful' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== DASHBOARD STATS ==========
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const q = async (sql) => { const [r] = await pool.query(sql); return r[0]; };
    res.json({
      students: (await q('SELECT COUNT(*) as c FROM Student')).c,
      faculty: (await q('SELECT COUNT(*) as c FROM Faculty')).c,
      courses: (await q('SELECT COUNT(*) as c FROM Course')).c,
      departments: (await q('SELECT COUNT(*) as c FROM Department')).c,
      subjects: (await q('SELECT COUNT(*) as c FROM Subject')).c,
      enrollments: (await q('SELECT COUNT(*) as c FROM Enrollment')).c,
      exams: (await q('SELECT COUNT(*) as c FROM Exam')).c,
      avgGpa: (await q('SELECT ROUND(AVG(GPA),2) as v FROM Result')).v || 0
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== STUDENT-SPECIFIC ==========
app.get('/api/student/:id/profile', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT s.*,d.DeptName FROM Student s LEFT JOIN Department d ON s.DeptID=d.DeptID WHERE s.StudentID=?', [req.params.id]);
    res.json(r[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/student/:id/enrollments', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT e.*,sub.SubjectName,sub.Credits FROM Enrollment e JOIN Subject sub ON e.SubjectID=sub.SubjectID WHERE e.StudentID=?', [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/student/:id/results', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT r.*,e.ExamDate,sub.SubjectName FROM Result r JOIN Exam e ON r.ExamID=e.ExamID JOIN Subject sub ON e.SubjectID=sub.SubjectID WHERE r.StudentID=?', [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/student/:id/timetable', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT t.Day,t.TimeSlot,t.RoomNo,f.FacultyName,sub.SubjectName 
      FROM Enrollment en JOIN Subject sub ON en.SubjectID=sub.SubjectID 
      JOIN Timetable t ON sub.SubjectID=t.SubjectID 
      JOIN Faculty f ON t.FacultyID=f.FacultyID WHERE en.StudentID=? 
      ORDER BY FIELD(t.Day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), t.TimeSlot`, [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/student/:id/component-marks', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT cm.*,sub.SubjectName FROM ComponentMarks cm JOIN Subject sub ON cm.SubjectID=sub.SubjectID WHERE cm.StudentID=?', [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/student/:id/attendance', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT sub.SubjectName, sub.SubjectID,
      COUNT(*) as TotalClasses,
      SUM(CASE WHEN a.Status='Present' THEN 1 ELSE 0 END) as Present,
      SUM(CASE WHEN a.Status='Absent' THEN 1 ELSE 0 END) as Absent,
      SUM(CASE WHEN a.Status='Late' THEN 1 ELSE 0 END) as Late,
      ROUND(SUM(CASE WHEN a.Status='Present' THEN 1 ELSE 0 END)*100.0/COUNT(*),1) as Percentage
      FROM Attendance a JOIN Subject sub ON a.SubjectID=sub.SubjectID 
      WHERE a.StudentID=? GROUP BY sub.SubjectID, sub.SubjectName`, [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/student/:id/fees', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT fp.*,fs.FeeName,fs.Amount as TotalAmount,fs.Semester 
      FROM FeePayment fp JOIN FeeStructure fs ON fp.FeeID=fs.FeeID WHERE fp.StudentID=?`, [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== FACULTY-SPECIFIC ==========
app.get('/api/faculty-user/:id/profile', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT f.*,d.DeptName FROM Faculty f LEFT JOIN Department d ON f.DeptID=d.DeptID WHERE f.FacultyID=?', [req.params.id]);
    res.json(r[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/faculty-user/:id/subjects', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT DISTINCT sub.* FROM Timetable t JOIN Subject sub ON t.SubjectID=sub.SubjectID WHERE t.FacultyID=?', [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/faculty-user/:id/timetable', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT t.*,sub.SubjectName FROM Timetable t JOIN Subject sub ON t.SubjectID=sub.SubjectID 
      WHERE t.FacultyID=? ORDER BY FIELD(t.Day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), t.TimeSlot`, [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/faculty-user/:id/students', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT DISTINCT s.StudentID,s.Name,s.Email,s.Semester,sub.SubjectName 
      FROM Timetable t JOIN Subject sub ON t.SubjectID=sub.SubjectID 
      JOIN Enrollment en ON sub.SubjectID=en.SubjectID 
      JOIN Student s ON en.StudentID=s.StudentID WHERE t.FacultyID=?`, [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/faculty-user/:id/results', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT r.*,s.Name as StudentName,sub.SubjectName,e.ExamDate 
      FROM Timetable t JOIN Subject sub ON t.SubjectID=sub.SubjectID 
      JOIN Exam e ON sub.SubjectID=e.SubjectID JOIN Result r ON e.ExamID=r.ExamID 
      JOIN Student s ON r.StudentID=s.StudentID WHERE t.FacultyID=?`, [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Component Marks CRUD for faculty
app.get('/api/faculty-user/:id/component-marks', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT cm.*,s.Name as StudentName,sub.SubjectName 
      FROM ComponentMarks cm JOIN Student s ON cm.StudentID=s.StudentID 
      JOIN Subject sub ON cm.SubjectID=sub.SubjectID 
      WHERE sub.SubjectID IN (SELECT DISTINCT t.SubjectID FROM Timetable t WHERE t.FacultyID=?)`, [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/component-marks', async (req, res) => {
  try {
    const { StudentID, SubjectID, CT1, CT2, Assignment, Lab, MidSem, EndSem } = req.body;
    await pool.query(`INSERT INTO ComponentMarks (StudentID,SubjectID,CT1,CT2,Assignment,Lab,MidSem,EndSem) 
      VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE CT1=VALUES(CT1),CT2=VALUES(CT2),
      Assignment=VALUES(Assignment),Lab=VALUES(Lab),MidSem=VALUES(MidSem),EndSem=VALUES(EndSem)`,
      [StudentID, SubjectID, CT1||0, CT2||0, Assignment||0, Lab||0, MidSem||0, EndSem||0]);
    res.json({ message: 'Component marks saved!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/component-marks/:id', async (req, res) => {
  try {
    const { CT1, CT2, Assignment, Lab, MidSem, EndSem } = req.body;
    await pool.query('UPDATE ComponentMarks SET CT1=?,CT2=?,Assignment=?,Lab=?,MidSem=?,EndSem=? WHERE CompMarkID=?',
      [CT1||0, CT2||0, Assignment||0, Lab||0, MidSem||0, EndSem||0, req.params.id]);
    res.json({ message: 'Component marks updated!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Faculty Availability
app.get('/api/faculty-availability', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT fa.*,f.FacultyName,f.Specialization,d.DeptName 
      FROM FacultyAvailability fa JOIN Faculty f ON fa.FacultyID=f.FacultyID 
      LEFT JOIN Department d ON f.DeptID=d.DeptID ORDER BY f.FacultyName`);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/faculty-user/:id/availability', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT * FROM FacultyAvailability WHERE FacultyID=?', [req.params.id]);
    res.json(r[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/faculty-user/:id/availability', async (req, res) => {
  try {
    const { IsAvailable, CabinNumber, StatusMessage, AvailableFrom, AvailableTo } = req.body;
    await pool.query(`INSERT INTO FacultyAvailability (FacultyID,IsAvailable,CabinNumber,StatusMessage,AvailableFrom,AvailableTo) 
      VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE IsAvailable=VALUES(IsAvailable),CabinNumber=VALUES(CabinNumber),
      StatusMessage=VALUES(StatusMessage),AvailableFrom=VALUES(AvailableFrom),AvailableTo=VALUES(AvailableTo)`,
      [req.params.id, IsAvailable, CabinNumber||'', StatusMessage||'', AvailableFrom||null, AvailableTo||null]);
    res.json({ message: 'Availability updated!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Attendance
app.post('/api/attendance', async (req, res) => {
  try {
    const { StudentID, SubjectID, AttendanceDate, Status, MarkedBy } = req.body;
    await pool.query('INSERT INTO Attendance (StudentID,SubjectID,AttendanceDate,Status,MarkedBy) VALUES (?,?,?,?,?)',
      [StudentID, SubjectID, AttendanceDate, Status, MarkedBy]);
    res.json({ message: 'Attendance marked!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/attendance/bulk', async (req, res) => {
  try {
    const { records } = req.body;
    for (const r of records) {
      await pool.query('INSERT INTO Attendance (StudentID,SubjectID,AttendanceDate,Status,MarkedBy) VALUES (?,?,?,?,?)',
        [r.StudentID, r.SubjectID, r.AttendanceDate, r.Status, r.MarkedBy]);
    }
    res.json({ message: `${records.length} attendance records saved!` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/faculty-user/:id/attendance-summary', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT s.StudentID,s.Name,sub.SubjectName,sub.SubjectID,
      COUNT(*) as TotalClasses,
      SUM(CASE WHEN a.Status='Present' THEN 1 ELSE 0 END) as Present,
      ROUND(SUM(CASE WHEN a.Status='Present' THEN 1 ELSE 0 END)*100.0/COUNT(*),1) as Percentage
      FROM Attendance a JOIN Student s ON a.StudentID=s.StudentID 
      JOIN Subject sub ON a.SubjectID=sub.SubjectID
      WHERE a.MarkedBy=? GROUP BY s.StudentID,s.Name,sub.SubjectName,sub.SubjectID`, [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT * FROM Announcements WHERE IsActive=1 ORDER BY CreatedAt DESC');
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/announcements', async (req, res) => {
  try {
    const { Title, Content, PostedBy, PostedByRole, Priority, TargetAudience, DeptID } = req.body;
    await pool.query('INSERT INTO Announcements (Title,Content,PostedBy,PostedByRole,Priority,TargetAudience,DeptID) VALUES (?,?,?,?,?,?,?)',
      [Title, Content, PostedBy||null, PostedByRole||'admin', Priority||'Medium', TargetAudience||'All', DeptID||null]);
    res.json({ message: 'Announcement posted!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/announcements/:id', async (req, res) => {
  try {
    await pool.query('UPDATE Announcements SET IsActive=0 WHERE AnnouncementID=?', [req.params.id]);
    res.json({ message: 'Announcement removed!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Study Materials
app.get('/api/study-materials', async (req, res) => {
  try {
    const [r] = await pool.query(`SELECT sm.*,sub.SubjectName,f.FacultyName FROM StudyMaterial sm 
      JOIN Subject sub ON sm.SubjectID=sub.SubjectID JOIN Faculty f ON sm.FacultyID=f.FacultyID ORDER BY sm.UploadedAt DESC`);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/study-materials', async (req, res) => {
  try {
    const { SubjectID, FacultyID, Title, Description, MaterialType } = req.body;
    await pool.query('INSERT INTO StudyMaterial (SubjectID,FacultyID,Title,Description,MaterialType) VALUES (?,?,?,?,?)',
      [SubjectID, FacultyID, Title, Description||'', MaterialType||'Notes']);
    res.json({ message: 'Study material added!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/study-materials/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM StudyMaterial WHERE MaterialID=?', [req.params.id]);
    res.json({ message: 'Material deleted!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Faculty Leave
app.get('/api/faculty-user/:id/leaves', async (req, res) => {
  try {
    const [r] = await pool.query('SELECT * FROM FacultyLeave WHERE FacultyID=? ORDER BY AppliedAt DESC', [req.params.id]);
    res.json(r);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/faculty-leave', async (req, res) => {
  try {
    const { FacultyID, LeaveDate, Reason } = req.body;
    await pool.query('INSERT INTO FacultyLeave (FacultyID,LeaveDate,Reason) VALUES (?,?,?)', [FacultyID, LeaveDate, Reason]);
    res.json({ message: 'Leave request submitted!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== GENERIC CRUD HELPER ==========
function crud(endpoint, table, idField) {
  app.get(`/api/${endpoint}`, async (req, res) => {
    try { const [r] = await pool.query(`SELECT * FROM ${table} ORDER BY ${idField}`); res.json(r); }
    catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.post(`/api/${endpoint}`, async (req, res) => {
    try {
      const keys = Object.keys(req.body); const vals = Object.values(req.body);
      await pool.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map(()=>'?').join(',')})`, vals);
      res.json({ message: `${table} added successfully` });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.put(`/api/${endpoint}/:id`, async (req, res) => {
    try {
      const sets = Object.keys(req.body).filter(k=>k!==idField).map(k=>`${k}=?`).join(',');
      const vals = Object.keys(req.body).filter(k=>k!==idField).map(k=>req.body[k]);
      await pool.query(`UPDATE ${table} SET ${sets} WHERE ${idField}=?`, [...vals, req.params.id]);
      res.json({ message: `${table} updated successfully` });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.delete(`/api/${endpoint}/:id`, async (req, res) => {
    try { await pool.query(`DELETE FROM ${table} WHERE ${idField}=?`, [req.params.id]); res.json({ message: `${table} deleted` }); }
    catch (e) { res.status(500).json({ error: e.message }); }
  });
}

crud('departments', 'Department', 'DeptID');
crud('students', 'Student', 'StudentID');
crud('faculty', 'Faculty', 'FacultyID');
crud('courses', 'Course', 'CourseID');
crud('subjects', 'Subject', 'SubjectID');
crud('enrollments', 'Enrollment', 'EnrollID');
crud('timetable', 'Timetable', 'TTID');
crud('exams', 'Exam', 'ExamID');
crud('results', 'Result', 'ResultID');

// Override GETs with joins
app.get('/api/students', async (req, res) => {
  try { const [r] = await pool.query('SELECT s.*,d.DeptName FROM Student s LEFT JOIN Department d ON s.DeptID=d.DeptID ORDER BY s.StudentID'); res.json(r); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/faculty', async (req, res) => {
  try { const [r] = await pool.query('SELECT f.*,d.DeptName FROM Faculty f LEFT JOIN Department d ON f.DeptID=d.DeptID ORDER BY f.FacultyID'); res.json(r); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/courses', async (req, res) => {
  try { const [r] = await pool.query('SELECT c.*,d.DeptName FROM Course c LEFT JOIN Department d ON c.DeptID=d.DeptID ORDER BY c.CourseID'); res.json(r); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/subjects', async (req, res) => {
  try { const [r] = await pool.query('SELECT s.*,c.CourseName FROM Subject s LEFT JOIN Course c ON s.CourseID=c.CourseID ORDER BY s.SubjectID'); res.json(r); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/enrollments', async (req, res) => {
  try { const [r] = await pool.query('SELECT e.*,s.Name as StudentName,sub.SubjectName FROM Enrollment e LEFT JOIN Student s ON e.StudentID=s.StudentID LEFT JOIN Subject sub ON e.SubjectID=sub.SubjectID ORDER BY e.EnrollID'); res.json(r); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/timetable', async (req, res) => {
  try { const [r] = await pool.query("SELECT t.*,f.FacultyName,sub.SubjectName FROM Timetable t LEFT JOIN Faculty f ON t.FacultyID=f.FacultyID LEFT JOIN Subject sub ON t.SubjectID=sub.SubjectID ORDER BY FIELD(t.Day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), t.TimeSlot"); res.json(r); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/exams', async (req, res) => {
  try { const [r] = await pool.query('SELECT e.*,sub.SubjectName FROM Exam e LEFT JOIN Subject sub ON e.SubjectID=sub.SubjectID ORDER BY e.ExamDate'); res.json(r); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/results', async (req, res) => {
  try { const [r] = await pool.query('SELECT r.*,s.Name as StudentName,ex.ExamDate,sub.SubjectName FROM Result r LEFT JOIN Student s ON r.StudentID=s.StudentID LEFT JOIN Exam ex ON r.ExamID=ex.ExamID LEFT JOIN Subject sub ON ex.SubjectID=sub.SubjectID ORDER BY r.ResultID'); res.json(r); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ========== VIEWS & REPORTS ==========
app.get('/api/views/student-results', async (req, res) => {
  try { const [r] = await pool.query('SELECT * FROM Student_Result_View'); res.json(r); } catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/views/timetable', async (req, res) => {
  try { const [r] = await pool.query('SELECT * FROM Timetable_View ORDER BY Day'); res.json(r); } catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/views/department-summary', async (req, res) => {
  try { const [r] = await pool.query('SELECT * FROM Dept_Summary_View'); res.json(r); } catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/reports/enrollment-stats', async (req, res) => {
  try { const [r] = await pool.query('SELECT sub.SubjectName, COUNT(e.StudentID) AS Total_Enrolled FROM Subject sub LEFT JOIN Enrollment e ON sub.SubjectID=e.SubjectID GROUP BY sub.SubjectName ORDER BY Total_Enrolled DESC'); res.json(r); } catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/reports/faculty-count', async (req, res) => {
  try { const [r] = await pool.query('SELECT d.DeptName, COUNT(f.FacultyID) AS Faculty_Count FROM Department d LEFT JOIN Faculty f ON d.DeptID=f.DeptID GROUP BY d.DeptName'); res.json(r); } catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/reports/top-performers', async (req, res) => {
  try { const [r] = await pool.query('SELECT s.Name,r.Marks,r.Grade,r.GPA,sub.SubjectName FROM Student s JOIN Result r ON s.StudentID=r.StudentID JOIN Exam e ON r.ExamID=e.ExamID JOIN Subject sub ON e.SubjectID=sub.SubjectID ORDER BY r.Marks DESC'); res.json(r); } catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/reports/grade-distribution', async (req, res) => {
  try { const [r] = await pool.query('SELECT Grade, COUNT(*) as Count FROM Result GROUP BY Grade ORDER BY Grade'); res.json(r); } catch(e) { res.status(500).json({error:e.message}); }
});
app.get('/api/logs/enrollment', async (req, res) => {
  try { const [r] = await pool.query('SELECT * FROM Enrollment_Log ORDER BY ChangedAt DESC'); res.json(r); } catch(e) { res.status(500).json({error:e.message}); }
});

// SQL Console
app.post('/api/query', async (req, res) => {
  try {
    const { sql } = req.body;
    if (!sql.trim().toUpperCase().startsWith('SELECT')) return res.status(403).json({ error: 'Only SELECT queries allowed' });
    const [rows] = await pool.query(sql);
    res.json({ columns: rows.length > 0 ? Object.keys(rows[0]) : [], data: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========== CLASS & CLASS-WISE STUDENTS ==========
app.get('/api/classes', async (req, res) => {
  try { const [r] = await pool.query('SELECT c.*, d.DeptName FROM Class c JOIN Department d ON c.DeptID=d.DeptID'); res.json(r); } catch(e) { res.status(500).json({error:e.message}); }
});

// Get classes taught by a faculty (via timetable subjects -> enrolled students -> their classes)
app.get('/api/faculty/:id/classes', async (req, res) => {
  try {
    const [r] = await pool.query(`
      SELECT DISTINCT c.ClassID, c.ClassName, c.Section, c.Semester, d.DeptName,
        (SELECT COUNT(DISTINCT s2.StudentID) FROM Student s2 WHERE s2.ClassID=c.ClassID) AS StudentCount
      FROM Timetable t
      JOIN Enrollment e ON e.SubjectID = t.SubjectID AND e.Status='Active'
      JOIN Student s ON s.StudentID = e.StudentID
      JOIN Class c ON c.ClassID = s.ClassID
      JOIN Department d ON c.DeptID = d.DeptID
      WHERE t.FacultyID = ?
      ORDER BY c.ClassName`, [req.params.id]);
    res.json(r);
  } catch(e) { res.status(500).json({error:e.message}); }
});

// Get students in a class for a specific faculty's subjects
app.get('/api/faculty/:fid/class/:cid/students', async (req, res) => {
  try {
    const [r] = await pool.query(`
      SELECT DISTINCT s.StudentID, s.Name, s.Email, s.Phone, s.Semester, d.DeptName, c.ClassName
      FROM Student s
      JOIN Department d ON s.DeptID=d.DeptID
      JOIN Class c ON s.ClassID=c.ClassID
      WHERE s.ClassID = ?
      ORDER BY s.Name`, [req.params.cid]);
    res.json(r);
  } catch(e) { res.status(500).json({error:e.message}); }
});

// Get subjects taught by faculty to a specific class
app.get('/api/faculty/:fid/class/:cid/subjects', async (req, res) => {
  try {
    const [r] = await pool.query(`
      SELECT DISTINCT sub.SubjectID, sub.SubjectName, sub.Credits
      FROM Timetable t
      JOIN Subject sub ON t.SubjectID=sub.SubjectID
      JOIN Enrollment e ON e.SubjectID=sub.SubjectID AND e.Status='Active'
      JOIN Student s ON s.StudentID=e.StudentID AND s.ClassID=?
      WHERE t.FacultyID=?`, [req.params.cid, req.params.fid]);
    res.json(r);
  } catch(e) { res.status(500).json({error:e.message}); }
});

// Get a student's full profile with marks
app.get('/api/student-profile/:sid', async (req, res) => {
  try {
    const [student] = await pool.query(`
      SELECT s.*, d.DeptName, c.ClassName FROM Student s
      JOIN Department d ON s.DeptID=d.DeptID
      LEFT JOIN Class c ON s.ClassID=c.ClassID
      WHERE s.StudentID=?`, [req.params.sid]);
    if (!student.length) return res.status(404).json({error:'Student not found'});
    const [marks] = await pool.query(`
      SELECT cm.*, sub.SubjectName FROM ComponentMarks cm
      JOIN Subject sub ON cm.SubjectID=sub.SubjectID
      WHERE cm.StudentID=?`, [req.params.sid]);
    const [enrollments] = await pool.query(`
      SELECT e.*, sub.SubjectName, sub.Credits FROM Enrollment e
      JOIN Subject sub ON e.SubjectID=sub.SubjectID
      WHERE e.StudentID=? AND e.Status='Active'`, [req.params.sid]);
    res.json({ ...student[0], marks, enrollments });
  } catch(e) { res.status(500).json({error:e.message}); }
});

// Upsert component marks for a student in a subject
app.post('/api/component-marks/upsert', async (req, res) => {
  try {
    const { StudentID, SubjectID, CT1, CT2, Assignment, Lab, MidSem, EndSem } = req.body;
    await pool.query(`
      INSERT INTO ComponentMarks (StudentID, SubjectID, CT1, CT2, Assignment, Lab, MidSem, EndSem)
      VALUES (?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE CT1=VALUES(CT1), CT2=VALUES(CT2), Assignment=VALUES(Assignment),
        Lab=VALUES(Lab), MidSem=VALUES(MidSem), EndSem=VALUES(EndSem)`,
      [StudentID, SubjectID, CT1||0, CT2||0, Assignment||0, Lab||0, MidSem||0, EndSem||0]);
    res.json({ message: 'Marks saved successfully' });
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.listen(5000, () => console.log('🚀 NexusEDU ERP API on http://localhost:5000'));
