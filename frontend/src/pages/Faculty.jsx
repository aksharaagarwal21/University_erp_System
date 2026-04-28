import CrudPage from '../components/CrudPage'

export default function Faculty({ api, toast }) {
  return (
    <CrudPage
      api={api} toast={toast}
      title="Faculty"
      subtitle="Manage faculty members and specializations"
      endpoint="faculty"
      idField="FacultyID"
      columns={[
        { key: 'FacultyID', label: 'ID' },
        { key: 'FacultyName', label: 'Name', render: row => <span style={{ fontWeight: 600 }}>{row.FacultyName}</span> },
        { key: 'Specialization', label: 'Specialization', render: row => <span className="badge badge-info">{row.Specialization}</span> },
        { key: 'DeptName', label: 'Department' },
      ]}
      formFields={[
        { key: 'FacultyID', label: 'Faculty ID', type: 'number', placeholder: 'e.g. 204' },
        { key: 'FacultyName', label: 'Faculty Name', placeholder: 'e.g. Dr. Sharma' },
        { key: 'Specialization', label: 'Specialization', placeholder: 'e.g. Machine Learning' },
        { key: 'DeptID', label: 'Department', options: 'departments', optionValue: 'DeptID', optionLabel: 'DeptName' },
      ]}
    />
  )
}
