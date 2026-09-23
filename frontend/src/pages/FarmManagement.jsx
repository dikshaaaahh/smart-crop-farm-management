import React, { useState, useEffect } from 'react';
import {
  Trees,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  MapPin,
  Droplets,
  Layers,
  User,
  X,
} from 'lucide-react';
import { api } from '../services/api';

export default function FarmManagement({ setActiveTab, onSelectFarmForRecommendation, showToast }) {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  const initialFormState = {
    name: '',
    ownerName: '',
    location: '',
    totalAreaAcres: 1.0,
    soilType: 'LOAMY',
    irrigationSource: 'BOREWELL',
    waterAvailability: 'MODERATE',
    activeCrops: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const data = await api.getFarms();
      setFarms(data);
    } catch (err) {
      showToast('Failed to load farms', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const openAddModal = () => {
    setEditingFarm(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      ownerName: farm.ownerName,
      location: farm.location || '',
      totalAreaAcres: farm.totalAreaAcres,
      soilType: farm.soilType,
      irrigationSource: farm.irrigationSource,
      waterAvailability: farm.waterAvailability,
      activeCrops: farm.activeCrops || '',
      notes: farm.notes || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFarm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFarm) {
        await api.updateFarm(editingFarm.id, formData);
        showToast('Farm updated successfully!');
      } else {
        await api.createFarm(formData);
        showToast('Farm registered successfully!');
      }
      closeModal();
      loadFarms();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.deleteFarm(id);
      showToast('Farm deleted successfully.');
      loadFarms();
    } catch (err) {
      showToast('Failed to delete farm', 'error');
    }
  };

  const handleRecommendForFarm = (farm) => {
    if (onSelectFarmForRecommendation) {
      onSelectFarmForRecommendation(farm);
    }
    setActiveTab('crop-recommendation');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Farm Holdings & Land Details</h1>
          <p className="page-subtitle">
            Manage your land parcels, soil profiles, and irrigation infrastructures
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Register New Farm</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading farm profiles...</div>
      ) : farms.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Trees size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b' }}>No farms registered yet</h3>
          <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
            Register your land area and soil type to get tailored crop decisions and track activities.
          </p>
          <button className="btn btn-primary" onClick={openAddModal}>
            Register Your First Farm
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {farms.map((farm) => (
            <div key={farm.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                      {farm.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                      <User size={14} />
                      <span>{farm.ownerName}</span>
                      {farm.location && (
                        <>
                          <span>&bull;</span>
                          <MapPin size={14} />
                          <span>{farm.location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => openEditModal(farm)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', color: '#64748b' }}
                      title="Edit Farm"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(farm.id, farm.name)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.35rem', color: '#ef4444' }}
                      title="Delete Farm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Badges / Specifications */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
                  <span className="badge badge-green">
                    {farm.totalAreaAcres} Acres
                  </span>
                  <span className="badge badge-blue">
                    <Layers size={12} />
                    {farm.soilType}
                  </span>
                  <span className="badge badge-amber">
                    <Droplets size={12} />
                    {farm.irrigationSource}
                  </span>
                  <span className="badge badge-purple">
                    {farm.waterAvailability}
                  </span>
                </div>

                {farm.activeCrops && (
                  <div style={{ fontSize: '0.85rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Active Crops: </span>
                    <span style={{ color: '#166534', fontWeight: 700 }}>{farm.activeCrops}</span>
                  </div>
                )}

                {farm.notes && (
                  <p style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic', marginBottom: '1rem' }}>
                    "{farm.notes}"
                  </p>
                )}
              </div>

              <div style={{ paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleRecommendForFarm(farm)}
                  style={{ width: '100%' }}
                >
                  <Sparkles size={15} />
                  <span>Get Crop Recommendations</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Farm Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editingFarm ? 'Edit Farm Profile' : 'Register New Farm'}
              </div>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Farm / Holding Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Green Valley Plot A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Farmer / Owner Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Location / Village / District</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Nashik, Maharashtra"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Land Area (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    className="form-control"
                    value={formData.totalAreaAcres}
                    onChange={(e) => setFormData({ ...formData, totalAreaAcres: parseFloat(e.target.value) || 0.1 })}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Soil Type *</label>
                  <select
                    className="form-select"
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  >
                    <option value="LOAMY">Loamy Soil (Fertile & Well-Drained)</option>
                    <option value="BLACK">Black / Regur Soil (Cotton & Moisture Retentive)</option>
                    <option value="ALLUVIAL">Alluvial Soil (River Plains & High Silt)</option>
                    <option value="CLAY">Clayey Soil (Heavy & High Water Holding)</option>
                    <option value="SANDY">Sandy Soil (Fast Draining & Arid)</option>
                    <option value="RED">Red & Yellow Soil (Iron Rich)</option>
                    <option value="SILT">Silt Soil</option>
                    <option value="LATERITE">Laterite Soil (Leached Acidic)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Irrigation Source *</label>
                  <select
                    className="form-select"
                    value={formData.irrigationSource}
                    onChange={(e) => setFormData({ ...formData, irrigationSource: e.target.value })}
                  >
                    <option value="BOREWELL">Borewell / Tube Well</option>
                    <option value="CANAL">Canal Irrigation</option>
                    <option value="DRIP">Drip Irrigation System</option>
                    <option value="SPRINKLER">Sprinkler System</option>
                    <option value="RIVER_OR_POND">River / Farm Pond</option>
                    <option value="RAINFED">Rainfed (No Permanent Irrigation)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Water Availability Level *</label>
                  <select
                    className="form-select"
                    value={formData.waterAvailability}
                    onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                  >
                    <option value="HIGH">High / Ample (Year-round assured)</option>
                    <option value="MODERATE">Moderate (Seasonal / Intermittent)</option>
                    <option value="LOW">Low / Scarce</option>
                    <option value="RAINFED_ONLY">Rainfed Only (Monsoon dependent)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Crops Currently Cultivated</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Wheat, Mustard"
                    value={formData.activeCrops}
                    onChange={(e) => setFormData({ ...formData, activeCrops: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Plot Notes / Soil Observations</label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. Pipeline layout installed, field sloped towards east, rich in organic matter."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFarm ? 'Save Changes' : 'Save Farm Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
