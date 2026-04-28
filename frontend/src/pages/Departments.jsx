import CrudPage from '../components/CrudPage'

export default function Departments({ api, toast }) {
  return (
    <CrudPage
      api={api} toast={toast}
      title="Departments"
      subtitle="Manage university departments"
      endpoint="departments"
      idField="DeptID"
      columns={[
        { key: 'DeptID', label: 'Dept ID' },
        { key: 'DeptName', label: 'Department Name', render: row => <span style={{ fontWeight: 600 }}>{row.DeptName}</span> },
        { key: 'HOD', label: 'Head of Department' },
        { key: 'Phone', label: 'Phone' },
      ]}
      formFields={[
        { key: 'DeptID', label: 'Department ID', type: 'number', placeholder: 'e.g. 3' },
        { key: 'DeptName', label: 'Department Name', placeholder: 'e.g. Mechanical Engineering' },
        { key: 'HOD', label: 'Head of Department', placeholder: 'e.g. Dr. Sharma' },
        { key: 'Phone', label: 'Phone Number', placeholder: 'e.g. 9876543210' },
      ]}
    />
  )
}
