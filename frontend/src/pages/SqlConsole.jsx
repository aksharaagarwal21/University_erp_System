import { useState } from 'react'
import { Play, Trash2, Terminal, BookOpen } from 'lucide-react'

const SAMPLE_QUERIES = [
  { label: 'All Students', sql: 'SELECT * FROM Student' },
  { label: 'All Faculty', sql: 'SELECT * FROM Faculty' },
  { label: 'Student Results (View)', sql: 'SELECT * FROM Student_Result_View' },
  { label: 'Timetable (View)', sql: 'SELECT * FROM Timetable_View ORDER BY Day' },
  { label: 'Department Summary (View)', sql: 'SELECT * FROM Dept_Summary_View' },
  { label: 'Avg GPA & Max Marks', sql: 'SELECT AVG(GPA) AS Average_GPA, MAX(Marks) AS Highest_Marks, MIN(Marks) AS Lowest_Marks FROM Result' },
  { label: 'Students per Subject', sql: "SELECT s.SubjectName, COUNT(e.StudentID) AS Total_Enrolled FROM Subject s JOIN Enrollment e ON s.SubjectID = e.SubjectID GROUP BY s.SubjectName ORDER BY Total_Enrolled DESC" },
  { label: 'Faculty Count per Dept (HAVING)', sql: "SELECT d.DeptName, COUNT(f.FacultyID) AS Faculty_Count FROM Department d JOIN Faculty f ON d.DeptID = f.DeptID GROUP BY d.DeptName HAVING COUNT(f.FacultyID) > 1" },
  { label: 'UNION - Students & Faculty', sql: "SELECT Name AS Person_Name, 'Student' AS Role FROM Student UNION SELECT FacultyName, 'Faculty' FROM Faculty" },
  { label: 'Subquery - Above Avg Marks', sql: "SELECT s.Name, r.Marks FROM Student s JOIN Result r ON s.StudentID = r.StudentID WHERE r.Marks > (SELECT AVG(Marks) FROM Result)" },
  { label: 'INNER JOIN - Full Results', sql: "SELECT s.Name AS Student_Name, sub.SubjectName, en.AcademicYear, r.Marks, r.Grade FROM Student s INNER JOIN Enrollment en ON s.StudentID = en.StudentID INNER JOIN Subject sub ON en.SubjectID = sub.SubjectID INNER JOIN Exam ex ON sub.SubjectID = ex.SubjectID INNER JOIN Result r ON s.StudentID = r.StudentID AND ex.ExamID = r.ExamID" },
  { label: 'LEFT JOIN - Depts with Students', sql: "SELECT d.DeptName, s.Name AS Student_Name, s.Semester FROM Department d LEFT JOIN Student s ON d.DeptID = s.DeptID ORDER BY d.DeptName" },
  { label: 'Enrollment Audit Logs', sql: 'SELECT * FROM Enrollment_Log ORDER BY ChangedAt DESC' },
  { label: 'Faculty Schedule Summary', sql: 'SELECT * FROM Faculty_Schedule_Summary' },
  { label: 'INTERSECT - Common Subjects', sql: 'SELECT SubjectID FROM Enrollment INTERSECT SELECT SubjectID FROM Timetable' },
]

export default function SqlConsole({ api, toast }) {
  const [sql, setSql] = useState('SELECT * FROM Student')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [execTime, setExecTime] = useState(null)

  const runQuery = async () => {
    if (!sql.trim()) return
    setLoading(true)
    setError(null)
    const start = performance.now()
    try {
      const res = await fetch(`${api}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: sql.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setExecTime(Math.round(performance.now() - start))
      toast(`Query returned ${data.data.length} row(s)`, 'success')
    } catch (err) {
      setError(err.message)
      setResult(null)
      toast(err.message, 'error')
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      runQuery()
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>SQL Console</h2>
          <p>Execute SELECT queries directly on the University ERP database</p>
        </div>
      </div>
      <div className="page-body">
        {/* Sample Queries */}
        <div className="table-container" style={{ marginBottom: 20 }}>
          <div className="table-header">
            <h3>📚 Sample Queries (Click to Load)</h3>
          </div>
          <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SAMPLE_QUERIES.map((q, i) => (
              <button
                key={i}
                className="btn btn-ghost btn-sm"
                onClick={() => setSql(q.sql)}
                title={q.sql}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* SQL Editor */}
        <div className="sql-console">
          <textarea
            className="sql-editor"
            value={sql}
            onChange={e => setSql(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your SELECT query here... (Ctrl+Enter to run)"
            spellCheck={false}
          />
          <div className="sql-actions">
            <button className="btn btn-primary" onClick={runQuery} disabled={loading}>
              <Play size={15} /> {loading ? 'Running...' : 'Run Query'}
            </button>
            <button className="btn btn-ghost" onClick={() => { setSql(''); setResult(null); setError(null) }}>
              <Trash2 size={15} /> Clear
            </button>
            {execTime && (
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginLeft: 'auto' }}>
                ⚡ Executed in {execTime}ms
              </span>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: 16, background: '#fef2f2', color: '#dc2626', fontSize: '0.88rem', fontFamily: 'monospace' }}>
              ❌ Error: {error}
            </div>
          )}

          {/* Results Table */}
          {result && result.data.length > 0 && (
            <div className="sql-results">
              <div style={{ padding: '10px 18px', background: 'var(--gray-50)', fontSize: '0.8rem', color: 'var(--gray-500)', borderBottom: '1px solid var(--gray-100)' }}>
                {result.data.length} row(s) returned · {result.columns.length} column(s)
              </div>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    {result.columns.map(col => <th key={col}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((row, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--gray-400)', fontSize: '0.78rem' }}>{i + 1}</td>
                      {result.columns.map(col => (
                        <td key={col}>{row[col] !== null && row[col] !== undefined ? String(row[col]) : <span style={{ color: 'var(--gray-300)' }}>NULL</span>}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result && result.data.length === 0 && (
            <div className="empty-state">
              <p>Query executed successfully — 0 rows returned</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
