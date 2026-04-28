import CrudPage from '../components/CrudPage'

export default function Results({ api, toast }) {
  return (
    <CrudPage
      api={api} toast={toast}
      title="Results"
      subtitle="Manage student exam results and grades"
      endpoint="results"
      idField="ResultID"
      columns={[
        { key: 'ResultID', label: 'ID' },
        { key: 'StudentName', label: 'Student', render: row => <span style={{ fontWeight: 600 }}>{row.StudentName}</span> },
        { key: 'SubjectName', label: 'Subject' },
        { key: 'Marks', label: 'Marks', render: row => (
          <span style={{ fontWeight: 700, color: row.Marks >= 80 ? '#059669' : row.Marks >= 60 ? '#2563eb' : '#dc2626' }}>
            {row.Marks}
          </span>
        )},
        { key: 'Grade', label: 'Grade', render: row => {
          const g = row.Grade
          const cls = g === 'A+' ? 'a-plus' : g === 'A' ? 'a' : g === 'B' ? 'b' : g === 'C' ? 'c' : 'f'
          return <span className={`grade-badge ${cls}`}>{g}</span>
        }},
        { key: 'GPA', label: 'GPA', render: row => (
          <span style={{ fontWeight: 700 }}>{row.GPA}</span>
        )},
      ]}
      formFields={[
        { key: 'ResultID', label: 'Result ID', type: 'number', placeholder: 'e.g. 808' },
        { key: 'Marks', label: 'Marks (0-100)', type: 'number', placeholder: 'e.g. 85' },
        { key: 'Grade', label: 'Grade', placeholder: 'Auto-assigned by trigger (leave empty)', required: false },
        { key: 'GPA', label: 'GPA', type: 'number', step: '0.1', placeholder: 'e.g. 8.5' },
        { key: 'StudentID', label: 'Student', options: 'students', optionValue: 'StudentID', optionLabel: 'Name' },
        { key: 'ExamID', label: 'Exam', options: 'exams', optionValue: 'ExamID', optionLabel: 'SubjectName' },
      ]}
    />
  )
}
