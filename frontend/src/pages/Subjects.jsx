import CrudPage from '../components/CrudPage'

export default function Subjects({ api, toast }) {
  return (
    <CrudPage
      api={api} toast={toast}
      title="Subjects"
      subtitle="Manage subjects under each course"
      endpoint="subjects"
      idField="SubjectID"
      columns={[
        { key: 'SubjectID', label: 'ID' },
        { key: 'SubjectName', label: 'Subject Name', render: row => <span style={{ fontWeight: 600 }}>{row.SubjectName}</span> },
        { key: 'Credits', label: 'Credits', render: row => <span className="badge badge-success">{row.Credits} Cr</span> },
        { key: 'Semester', label: 'Semester', render: row => <span className="badge badge-info">Sem {row.Semester}</span> },
        { key: 'CourseName', label: 'Course' },
      ]}
      formFields={[
        { key: 'SubjectID', label: 'Subject ID', type: 'number', placeholder: 'e.g. 404' },
        { key: 'SubjectName', label: 'Subject Name', placeholder: 'e.g. Computer Networks' },
        { key: 'Credits', label: 'Credits', type: 'number', placeholder: 'e.g. 4' },
        { key: 'Semester', label: 'Semester', type: 'number', placeholder: 'e.g. 3' },
        { key: 'CourseID', label: 'Course', options: 'courses', optionValue: 'CourseID', optionLabel: 'CourseName' },
      ]}
    />
  )
}
