import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Package,
  Layers,
  Leaf,
  ShieldCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { api } from '../services/api';

export default function FertilizerGuidance({ cropContext, showToast }) {
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    cropName: cropContext?.cropName || 'Wheat (Gehun)',
    soilType: cropContext?.soilType || 'LOAMY',
    landAreaAcres: cropContext?.landAreaAcres || 2.0,
    growthStage: 'Basal / Sowing',
    organicPreference: false,
  });

  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCrops()
      .then((data) => {
        setCrops(data);
        if (!cropContext && data.length > 0) {
          setFormData((prev) => ({ ...prev, cropName: data[0].name }));
        }
      })
      .catch((err) => console.error('Error fetching crops:', err));
  }, []);

  useEffect(() => {
    if (cropContext) {
      setFormData((prev) => ({
        ...prev,
        cropName: cropContext.cropName || prev.cropName,
        soilType: cropContext.soilType || prev.soilType,
        landAreaAcres: cropContext.landAreaAcres || prev.landAreaAcres,
      }));
    }
  }, [cropContext]);

  const handleFetchGuidance = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await api.getFertilizerGuidance(formData);
      setGuidance(res);
      showToast('Fertilizer schedule calculated successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to fetch fertilizer plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchGuidance();
  }, [formData.cropName, formData.soilType, formData.landAreaAcres]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Rule-Based Fertilizer & Nutrient Guidance</h1>
          <p className="page-subtitle">
            Scientific stoichiometric NPK calculation and stage-wise application schedules for your land area
          </p>
        </div>
      </div>

      {/* Input Selector Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleFetchGuidance}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Target Crop *</label>
              <select
                className="form-select"
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Soil Type *</label>
              <select
                className="form-select"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              >
                <option value="LOAMY">Loamy Soil (Fertile & Well-Drained)</option>
                <option value="BLACK">Black / Regur Soil (Moisture Retentive)</option>
                <option value="ALLUVIAL">Alluvial Soil (River Plains)</option>
                <option value="CLAY">Clayey Soil (Heavy)</option>
                <option value="SANDY">Sandy Soil (Fast Leaching)</option>
                <option value="RED">Red & Yellow Soil</option>
                <option value="SILT">Silt Soil</option>
                <option value="LATERITE">Laterite Soil</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Land Area (Acres) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                className="form-control"
                value={formData.landAreaAcres}
                onChange={(e) => setFormData({ ...formData, landAreaAcres: parseFloat(e.target.value) || 0.1 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Growth Stage</label>
              <select
                className="form-select"
                value={formData.growthStage}
                onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
              >
                <option value="Basal / Sowing">Basal / Sowing (Field Preparation)</option>
                <option value="Vegetative / Tillering">Vegetative / Tillering (20-35 DAS)</option>
                <option value="Flowering / Panicle Initiation">Flowering / Panicle Initiation (50-65 DAS)</option>
                <option value="Maturity / Grain Filling">Maturity / Grain Filling</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Results Presentation */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Computing nutrient dosage...</div>
      ) : guidance ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Summary */}
          <div className="card" style={{ borderLeft: '6px solid #0d9488' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  Nutrient Plan for {guidance.cropName}
                </h3>
                <div style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                  Area: <strong>{guidance.landAreaAcres} Acres</strong> &bull; Soil: <strong>{guidance.soilType}</strong>
                </div>
              </div>

              <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                {guidance.recommendedNpk}
              </span>
            </div>

            {/* Commercial Fertilizer Bags Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              <div style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Package size={18} />
                  <span>UREA (46% N)</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#15803d', marginTop: '0.35rem' }}>
                  {guidance.ureaKg} kg
                </div>
                <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>
                  &asymp; {guidance.ureaBags50kg} bags (50 kg each)
                </div>
              </div>

              <div style={{ background: '#eff6ff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Package size={18} />
                  <span>DAP (18-46-0)</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1d4ed8', marginTop: '0.35rem' }}>
                  {guidance.dapKg} kg
                </div>
                <div style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: 600 }}>
                  &asymp; {guidance.dapBags50kg} bags (50 kg each)
                </div>
              </div>

              <div style={{ background: '#fef3c7', padding: '1.25rem', borderRadius: '10px', border: '1px solid #fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400e', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Package size={18} />
                  <span>MOP / POTASH (60% K)</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#b45309', marginTop: '0.35rem' }}>
                  {guidance.mopKg} kg
                </div>
                <div style={{ fontSize: '0.82rem', color: '#92400e', fontWeight: 600 }}>
                  &asymp; {guidance.mopBags50kg} bags (50 kg each)
                </div>
              </div>
            </div>

            {/* Micronutrient Advice */}
            {guidance.micronutrientsAdvice && (
              <div style={{ marginTop: '1.25rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>Micronutrient & Soil Balancing: </span>
                <span style={{ color: '#475569' }}>{guidance.micronutrientsAdvice}</span>
              </div>
            )}
          </div>

          {/* Stage-wise Split Application Schedule */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Calendar size={20} color="#16a34a" />
                <span>Stage-Wise Split Application Schedule</span>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Growth Stage</th>
                    <th>Fertilizer & Ratio</th>
                    <th>Calculated Dosage</th>
                    <th>Application Method</th>
                  </tr>
                </thead>
                <tbody>
                  {guidance.applicationSchedule.map((s, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{s.stage}</td>
                      <td style={{ color: '#166534', fontWeight: 600 }}>{s.fertilizer}</td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{s.dosage}</td>
                      <td style={{ color: '#475569' }}>{s.applicationMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Organic Alternatives & Safety Best Practices */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {/* Organic Alternatives */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Leaf size={20} color="#16a34a" />
                  <span>Eco-Friendly & Organic Alternatives</span>
                </div>
              </div>
              <ul className="explain-list">
                {guidance.organicAlternatives.map((org, idx) => (
                  <li key={idx} className="explain-item">
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>&bull;</span>
                    <span>{org}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety & Agronomic Best Practices */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <ShieldCheck size={20} color="#0284c7" />
                  <span>Agronomic Safety & Precautions</span>
                </div>
              </div>
              <ul className="explain-list">
                {guidance.safetyAndBestPractices.map((tip, idx) => (
                  <li key={idx} className="explain-item" style={{ borderLeftColor: '#0284c7' }}>
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>&bull;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
