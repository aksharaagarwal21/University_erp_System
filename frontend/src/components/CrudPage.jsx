import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, X, Download } from 'lucide-react'

export default function CrudPage({
  api, toast, title, subtitle, endpoint,
  columns, formFields, idField, icon: Icon,
  formatRow, badges
}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [search, setSearch] = useState('')
  const [dropdownData, setDropdownData] = useState({})

  const fetchData = () => {
    setLoading(true)
    fetch(`${api}/${endpoint}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    // Fetch dropdown data for foreign key fields
    const fkFields = formFields.filter(f => f.options)
    fkFields.forEach(f => {
      if (typeof f.options === 'string') {
        fetch(`${api}/${f.options}`)
          .then(r => r.json())
          .then(d => setDropdownData(prev => ({ ...prev, [f.key]: d })))
      }
    })
  }, [])

  const openAdd = () => {
    const empty = {}
    formFields.forEach(f => empty[f.key] = f.default || '')
    setForm(empty)
    setEditing(null)
    setShowModal(true)
  }

  const openEdit = (row) => {
    const vals = {}
    formFields.forEach(f => {
      let v = row[f.key]
      if (f.type === 'date' && v) v = v.split('T')[0]
      vals[f.key] = v ?? ''
    })
    setForm(vals)
    setEditing(row[idField])
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editing ? `${api}/${endpoint}/${editing}` : `${api}/${endpoint}`
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      toast(result.message || (editing ? 'Updated!' : 'Added!'), 'success')
      setShowModal(false)
      fetchData()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    try {
      const res = await fetch(`${api}/${endpoint}/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      toast(result.message || 'Deleted!', 'success')
      fetchData()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const filtered = data.filter(row =>
    columns.some(col => {
      const val = row[col.key]
      return val && String(val).toLowerCase().includes(search.toLowerCase())
    })
  )

  const renderCell = (row, col) => {
    if (col.render) return col.render(row)
    if (badges && badges[col.key]) {
      const badgeMap = badges[col.key]
      const val = row[col.key]
      const cls = badgeMap[val] || 'badge-neutral'
      return <span className={`badge ${cls}`}>{val}</span>
    }
    return row[col.key] ?? '—'
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add {title.replace(/s$/, '').replace(/ies$/, 'y')}
        </button>
      </div>
      <div className="page-body">
        <div className="table-container">
          <div className="table-header">
            <h3>{data.length} record{data.length !== 1 ? 's' : ''} found</h3>
            <div className="table-actions">
              <div className="search-wrapper">
                <Search />
                <input
                  type="text" className="search-input"
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={search} onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          {loading ? <div className="spinner"></div> : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {columns.map(col => <th key={col.key}>{col.label}</th>)}
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={columns.length + 1} className="empty-state"><p>No records found</p></td></tr>
                  ) : filtered.map((row, i) => (
                    <tr key={row[idField] || i}>
                      {columns.map(col => <td key={col.key}>{renderCell(row, col)}</td>)}
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(row)} title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(row[idField])} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit' : 'Add'} {title.replace(/s$/, '').replace(/ies$/, 'y')}</h3>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formFields.map(f => (
                  <div className="form-group" key={f.key}>
                    <label>{f.label}</label>
                    {f.options ? (
                      typeof f.options === 'string' ? (
                        <select
                          value={form[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          required={f.required !== false}
                        >
                          <option value="">Select {f.label}</option>
                          {(dropdownData[f.key] || []).map(opt => (
                            <option key={opt[f.optionValue]} value={opt[f.optionValue]}>
                              {opt[f.optionLabel]} (ID: {opt[f.optionValue]})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={form[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          required={f.required !== false}
                        >
                          <option value="">Select {f.label}</option>
                          {f.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      )
                    ) : (
                      <input
                        type={f.type || 'text'}
                        value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder || ''}
                        required={f.required !== false}
                        disabled={editing && f.key === idField}
                        step={f.type === 'number' ? (f.step || 'any') : undefined}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
