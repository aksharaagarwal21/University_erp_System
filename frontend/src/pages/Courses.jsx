import CrudPage from '../components/CrudPage'

export default function Courses({ api, toast }) {
  return (
    <CrudPage
      api={api} toast={toast}
      title="Courses"
      subtitle="Manage academic courses and programs"
      endpoint="courses"
      idField="CourseID"
      columns={[
        { key: 'CourseID', label: 'ID' },
        { key: 'CourseName', label: 'Course Name', render: row => <span style={{ fontWeight: 600 }}>{row.CourseName}</span> },
        { key: 'Duration', label: 'Duration', render: row => <span className="badge badge-info">{row.Duration} Years</span> },
        { key: 'DeptName', label: 'Department' },
      ]}
      formFields={[
        { key: 'CourseID', label: 'Course ID', type: 'number', placeholder: 'e.g. 303' },
        { key: 'CourseName', label: 'Course Name', placeholder: 'e.g. BTech IT' },
        { key: 'Duration', label: 'Duration (Years)', type: 'number', placeholder: 'e.g. 4' },
        { key: 'DeptID', label: 'Department', options: 'departments', optionValue: 'DeptID', optionLabel: 'DeptName' },
      ]}
    />
  )
}
