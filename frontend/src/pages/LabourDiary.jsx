import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

function LabourDiary() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    labourerName: '',
    workDate: '',
    workDescription: '',
    amount: '',
    notes: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await api.getLabourRecords();
      setRecords(data);
    } catch (error) {
      setMessage(error.message || 'Failed to load labour records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      labourerName: '',
      workDate: '',
      workDescription: '',
      amount: '',
      notes: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const record = {
        labourerName: form.labourerName,
        workDate: form.workDate,
        workDescription: form.workDescription,
        amount: Number(form.amount),
        notes: form.notes,
      };

      if (editingId) {
        await api.updateLabourRecord(editingId, record);
        setMessage('Labour record updated successfully.');
      } else {
        await api.createLabourRecord(record);
        setMessage('Labour record added successfully.');
      }

      resetForm();
      await loadRecords();
    } catch (error) {
      setMessage(error.message || 'Failed to save labour record.');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setForm({
      labourerName: record.labourerName || '',
      workDate: record.workDate || '',
      workDescription: record.workDescription || '',
      amount: record.amount ?? '',
      notes: record.notes || '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this labour record?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteLabourRecord(id);
      setMessage('Labour record deleted successfully.');
      await loadRecords();
    } catch (error) {
      setMessage(error.message || 'Failed to delete labour record.');
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      if (searchName.trim()) {
        const data = await api.searchLabourByName(searchName.trim());
        setRecords(data);
      } else if (searchDate) {
        const data = await api.searchLabourByDate(searchDate);
        setRecords(data);
      } else {
        await loadRecords();
      }
    } catch (error) {
      setMessage(error.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setSearchName('');
    setSearchDate('');
    await loadRecords();
  };

  const totalAmount = useMemo(() => {
    return records.reduce(
      (total, record) => total + Number(record.amount || 0),
      0
    );
  }, [records]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Labour Diary</h1>
          <p>
            Keep a simple digital record of labour work and payments.
          </p>
        </div>
      </div>

      {message && (
        <div className="alert">
          {message}
          <button
            type="button"
            onClick={() => setMessage('')}
            className="alert-close"
          >
            ×
          </button>
        </div>
      )}

      <div className="card">
        <h2>{editingId ? 'Edit Labour Record' : 'Add Labour Record'}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Labourer Name *</label>
            <input
              type="text"
              name="labourerName"
              value={form.labourerName}
              onChange={handleChange}
              placeholder="e.g. Ramesh"
              required
            />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="workDate"
              value={form.workDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Work *</label>
            <input
              type="text"
              name="workDescription"
              value={form.workDescription}
              onChange={handleChange}
              placeholder="e.g. Harvesting"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount Paid (₹) *</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 600"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes, e.g. Paid in cash"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId ? 'Update Record' : 'Add Record'}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Search Labour Records</h2>
            <p>Search by labourer name or date.</p>
          </div>
        </div>

        <div className="search-grid">
          <div className="form-group">
            <label>Labourer Name</label>
            <input
              type="text"
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
              placeholder="Search name"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={searchDate}
              onChange={(event) => setSearchDate(event.target.value)}
            />
          </div>

          <div className="search-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleSearch}
            >
              Search
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={clearSearch}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Labour Records</h2>
            <p>{records.length} record(s) found.</p>
          </div>

          <div className="total-amount">
            Total: ₹{totalAmount.toLocaleString('en-IN')}
          </div>
        </div>

        {loading ? (
          <p>Loading labour records...</p>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <p>No labour records found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Labourer</th>
                  <th>Date</th>
                  <th>Work</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.labourerName}</td>
                    <td>{record.workDate}</td>
                    <td>{record.workDescription}</td>
                    <td>₹{Number(record.amount).toLocaleString('en-IN')}</td>
                    <td>{record.notes || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => handleEdit(record)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(record.id)}
                        >
                          Delete
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
  );
}

export default LabourDiary;