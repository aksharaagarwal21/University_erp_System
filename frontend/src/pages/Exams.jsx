import CrudPage from '../components/CrudPage'

export default function Exams({ api, toast }) {
  return (
    <CrudPage
      api={api} toast={toast}
      title="Exams"
      subtitle="Manage examination schedules"
      endpoint="exams"
      idField="ExamID"
      columns={[
        { key: 'ExamID', label: 'Exam ID' },
        { key: 'SubjectName', label: 'Subject', render: row => <span style={{ fontWeight: 600 }}>{row.SubjectName}</span> },
        { key: 'ExamDate', label: 'Date', render: row => {
          const d = row.ExamDate ? new Date(row.ExamDate) : null
          return d ? d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
        }},
        { key: 'MaxMarks', label: 'Max Marks', render: row => <span className="badge badge-warning">{row.MaxMarks}</span> },
      ]}
      formFields={[
        { key: 'ExamID', label: 'Exam ID', type: 'number', placeholder: 'e.g. 705' },
        { key: 'ExamDate', label: 'Exam Date', type: 'date' },
        { key: 'MaxMarks', label: 'Maximum Marks', type: 'number', placeholder: 'e.g. 100' },
        { key: 'SubjectID', label: 'Subject', options: 'subjects', optionValue: 'SubjectID', optionLabel: 'SubjectName' },
      ]}
    />
  )
}
