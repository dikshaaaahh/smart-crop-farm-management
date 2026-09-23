import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Edit2,
  X,
  Filter,
  Layers,
  Sprout,
  DollarSign,
} from 'lucide-react';
import { api } from '../services/api';

export default function ActivityTracker({ showToast }) {
  const [activities, setActivities] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const initialFormState = {
    farmId: '',
    farmName: '',
    cropName: 'Wheat (Gehun)',
    activityName: '',
    category: 'SOWING',
    activityDate: new Date().toISOString().split('T')[0],
    status: 'PLANNED',
    cost: 0,
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadData = async () => {
    try {
      setLoading(true);
      const [actData, farmData, cropData] = await Promise.all([
        api.getActivities(),
        api.getFarms(),
        api.getCrops(),
      ]);
      setActivities(actData);
      setFarms(farmData);
      setCrops(cropData);

      if (farmData.length > 0 && !formData.farmId) {
        setFormData((prev) => ({
          ...prev,
          farmId: farmData[0].id,
          farmName: farmData[0].name,
        }));
      }
    } catch (err) {
      showToast('Failed to load activities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingActivity(null);
    setFormData({
      ...initialFormState,
      farmId: farms[0]?.id || '',
      farmName: farms[0]?.name || '',
      cropName: crops[0]?.name || 'Wheat (Gehun)',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (act) => {
    setEditingActivity(act);
    setFormData({
      farmId: act.farmId || '',
      farmName: act.farmName || '',
      cropName: act.cropName,
      activityName: act.activityName,
      category: act.category,
      activityDate: act.activityDate,
      status: act.status,
      cost: act.cost || 0,
      description: act.description || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedFarm = farms.find((f) => f.id.toString() === formData.farmId.toString());
      const payload = {
        ...formData,
        farmName: selectedFarm ? selectedFarm.name : formData.farmName,
      };

      if (editingActivity) {
        await api.updateActivity(editingActivity.id, payload);
        showToast('Activity updated successfully!');
      } else {
        await api.createActivity(payload);
        showToast('Activity scheduled successfully!');
      }
      closeModal();
      loadData();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PLANNED' : 'COMPLETED';
    try {
      await api.updateActivityStatus(id, nextStatus);
      showToast(`Status updated to ${nextStatus}`);
      loadData();
    } catch (err) {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete activity "${title}"?`)) return;
    try {
      await api.deleteActivity(id);
      showToast('Activity deleted successfully.');
      loadData();
    } catch (err) {
      showToast('Failed to delete activity', 'error');
    }
  };

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (selectedFarmId && act.farmId?.toString() !== selectedFarmId.toString()) return false;
    if (selectedStatus !== 'ALL' && act.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Crop Activity Tracking & Schedule</h1>
          <p className="page-subtitle">
            Plan, monitor, and record all farming operations from field prep to harvest
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Schedule New Activity</span>
        </button>
      </div>

      {/* Filter Tabs & Selectors */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['ALL', 'PLANNED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              className={`btn btn-sm ${selectedStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedStatus(st)}
            >
              {st === 'ALL' ? 'All Activities' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#64748b" />
          <select
            className="form-select"
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            style={{ width: '220px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
          >
            <option value="">All Farms</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading activities...</div>
      ) : filteredActivities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <CalendarCheck2 size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b' }}>No activities found</h3>
          <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
            Schedule farming milestones like sowing, irrigation, or top dressing to stay on track.
          </p>
          <button className="btn btn-primary" onClick={openAddModal}>
            Schedule an Activity
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredActivities.map((act) => {
            const isCompleted = act.status === 'COMPLETED';
            const isPlanned = act.status === 'PLANNED';

            return (
              <div
                key={act.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderLeft: `5px solid ${isCompleted ? '#16a34a' : isPlanned ? '#3b82f6' : '#f59e0b'}`,
                  background: isCompleted ? '#fafafa' : '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                  <button
                    onClick={() => handleToggleStatus(act.id, act.status)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isCompleted ? '#16a34a' : '#94a3b8',
                      marginTop: '2px',
                    }}
                    title={isCompleted ? 'Mark as Planned' : 'Mark as Completed'}
                  >
                    {isCompleted ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: isCompleted ? '#64748b' : '#0f172a',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                        }}
                      >
                        {act.activityName}
                      </h3>
                      <span className="badge badge-slate" style={{ fontSize: '0.72rem' }}>
                        {act.category?.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.82rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>{act.cropName}</span>
                      <span>&bull;</span>
                      <span>{act.farmName || 'General Farm'}</span>
                      <span>&bull;</span>
                      <span>Date: {act.activityDate}</span>
                      {act.cost > 0 && (
                        <>
                          <span>&bull;</span>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>Cost: ₹{act.cost.toLocaleString()}</span>
                        </>
                      )}
                    </div>

                    {act.description && (
                      <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.4rem' }}>
                        {act.description}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge ${isCompleted ? 'badge-green' : isPlanned ? 'badge-blue' : 'badge-amber'}`}>
                    {act.status}
                  </span>

                  <button
                    onClick={() => openEditModal(act)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', color: '#64748b' }}
                    title="Edit Activity"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(act.id, act.activityName)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', color: '#ef4444' }}
                    title="Delete Activity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Activity Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editingActivity ? 'Edit Farming Activity' : 'Schedule Farming Activity'}
              </div>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Farm Holding *</label>
                  <select
                    className="form-select"
                    required
                    value={formData.farmId}
                    onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Crop Name *</label>
                  <select
                    className="form-select"
                    required
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Activity Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. First Crown Root Irrigation (CRI)"
                  value={formData.activityName}
                  onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="LAND_PREPARATION">Land Preparation & Tillage</option>
                    <option value="SOWING">Sowing & Planting</option>
                    <option value="IRRIGATION">Irrigation</option>
                    <option value="FERTILIZATION">Fertilizer Application</option>
                    <option value="WEEDING">Weeding & Intercultural</option>
                    <option value="PEST_CONTROL">Pest & Disease Control</option>
                    <option value="HARVESTING">Harvesting</option>
                    <option value="POST_HARVEST">Post-Harvest Processing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.activityDate}
                    onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated / Incurred Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    className="form-control"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Details / Instructions</label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. Ensure line spacing of 22.5 cm, apply with seed drill."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingActivity ? 'Save Changes' : 'Schedule Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
