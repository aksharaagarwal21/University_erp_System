import CrudPage from '../components/CrudPage'

export default function Enrollments({ api, toast }) {
  return (
    <CrudPage
      api={api} toast={toast}
      title="Enrollments"
      subtitle="Manage student subject enrollments"
      endpoint="enrollments"
      idField="EnrollID"
      columns={[
        { key: 'EnrollID', label: 'ID' },
        { key: 'StudentName', label: 'Student', render: row => <span style={{ fontWeight: 600 }}>{row.StudentName}</span> },
        { key: 'SubjectName', label: 'Subject' },
        { key: 'AcademicYear', label: 'Year' },
        { key: 'Status', label: 'Status' },
      ]}
      badges={{
        Status: {
          Active: 'badge-success',
          Completed: 'badge-info',
          Inactive: 'badge-warning',
          Archived: 'badge-neutral',
        }
      }}
      formFields={[
        { key: 'EnrollID', label: 'Enrollment ID', type: 'number', placeholder: 'e.g. 506' },
        { key: 'StudentID', label: 'Student', options: 'students', optionValue: 'StudentID', optionLabel: 'Name' },
        { key: 'SubjectID', label: 'Subject', options: 'subjects', optionValue: 'SubjectID', optionLabel: 'SubjectName' },
        { key: 'AcademicYear', label: 'Academic Year', placeholder: 'e.g. 2026' },
        { key: 'Status', label: 'Status', options: [
          { value: 'Active', label: 'Active' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Inactive', label: 'Inactive' },
          { value: 'Archived', label: 'Archived' },
        ]},
      ]}
    />
  )
}
