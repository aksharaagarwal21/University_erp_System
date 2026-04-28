import CrudPage from '../components/CrudPage'

export default function Timetable({ api, toast }) {
  return (
    <CrudPage
      api={api} toast={toast}
      title="Timetable"
      subtitle="Manage class scheduling and room assignments"
      endpoint="timetable"
      idField="TTID"
      columns={[
        { key: 'TTID', label: 'ID' },
        { key: 'Day', label: 'Day', render: row => <span style={{ fontWeight: 600 }}>{row.Day}</span> },
        { key: 'TimeSlot', label: 'Time Slot', render: row => <span className="badge badge-info">{row.TimeSlot}</span> },
        { key: 'RoomNo', label: 'Room' },
        { key: 'FacultyName', label: 'Faculty' },
        { key: 'SubjectName', label: 'Subject' },
      ]}
      formFields={[
        { key: 'TTID', label: 'Timetable ID', type: 'number', placeholder: 'e.g. 604' },
        { key: 'Day', label: 'Day', options: [
          { value: 'Monday', label: 'Monday' },
          { value: 'Tuesday', label: 'Tuesday' },
          { value: 'Wednesday', label: 'Wednesday' },
          { value: 'Thursday', label: 'Thursday' },
          { value: 'Friday', label: 'Friday' },
          { value: 'Saturday', label: 'Saturday' },
        ]},
        { key: 'TimeSlot', label: 'Time Slot', placeholder: 'e.g. 10:00-11:00' },
        { key: 'RoomNo', label: 'Room Number', placeholder: 'e.g. A101' },
        { key: 'FacultyID', label: 'Faculty', options: 'faculty', optionValue: 'FacultyID', optionLabel: 'FacultyName' },
        { key: 'SubjectID', label: 'Subject', options: 'subjects', optionValue: 'SubjectID', optionLabel: 'SubjectName' },
      ]}
    />
  )
}
