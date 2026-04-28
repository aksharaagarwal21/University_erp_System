import CrudPage from '../components/CrudPage'

export default function Students({ api, toast }) {
  return (
    <CrudPage
      api={api} toast={toast}
      title="Students"
      subtitle="Manage student registrations and profiles"
      endpoint="students"
      idField="StudentID"
      columns={[
        { key: 'StudentID', label: 'ID' },
        { key: 'Name', label: 'Name', render: row => <span style={{ fontWeight: 600 }}>{row.Name}</span> },
        { key: 'Email', label: 'Email' },
        { key: 'Phone', label: 'Phone' },
        { key: 'Semester', label: 'Semester', render: row => <span className="badge badge-info">Sem {row.Semester}</span> },
        { key: 'DeptName', label: 'Department' },
      ]}
      formFields={[
        { key: 'StudentID', label: 'Student ID', type: 'number', placeholder: 'e.g. 105' },
        { key: 'Name', label: 'Full Name', placeholder: 'e.g. John Doe' },
        { key: 'Email', label: 'Email Address', type: 'email', placeholder: 'e.g. john@gmail.com' },
        { key: 'Phone', label: 'Phone Number', placeholder: 'e.g. 9876543210' },
        { key: 'Semester', label: 'Semester', type: 'number', placeholder: '1-8' },
        { key: 'DeptID', label: 'Department', options: 'departments', optionValue: 'DeptID', optionLabel: 'DeptName' },
      ]}
    />
  )
}
