import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Waves,
  Sun,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';

export default function IrrigationGuidance({ cropContext, showToast }) {
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    cropName: cropContext?.cropName || 'Wheat (Gehun)',
    soilType: cropContext?.soilType || 'LOAMY',
    season: cropContext?.season || 'RABI',
    irrigationSource: cropContext?.irrigationSource || 'BOREWELL',
    waterAvailability: cropContext?.waterAvailability || 'MODERATE',
    landAreaAcres: cropContext?.landAreaAcres || 2.0,
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
        season: cropContext.season || prev.season,
        irrigationSource: cropContext.irrigationSource || prev.irrigationSource,
        waterAvailability: cropContext.waterAvailability || prev.waterAvailability,
        landAreaAcres: cropContext.landAreaAcres || prev.landAreaAcres,
      }));
    }
  }, [cropContext]);

  const handleFetchGuidance = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await api.getIrrigationGuidance(formData);
      setGuidance(res);
      showToast('Irrigation schedule and water plan updated.');
    } catch (err) {
      showToast(err.message || 'Failed to fetch irrigation plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchGuidance();
  }, [formData.cropName, formData.soilType, formData.season, formData.irrigationSource, formData.waterAvailability]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Water & Irrigation Guidance</h1>
          <p className="page-subtitle">
            Scientific rule-based watering intervals, critical growth windows, and water-saving methods
          </p>
        </div>
      </div>

      {/* Input Selector Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleFetchGuidance}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Crop *</label>
              <select
                className="form-select"
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

            <div className="form-group">
              <label className="form-label">Soil Type *</label>
              <select
                className="form-select"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              >
                <option value="LOAMY">Loamy Soil</option>
                <option value="BLACK">Black / Regur Soil</option>
                <option value="ALLUVIAL">Alluvial Soil</option>
                <option value="CLAY">Clayey Soil</option>
                <option value="SANDY">Sandy Soil</option>
                <option value="RED">Red & Yellow Soil</option>
                <option value="SILT">Silt Soil</option>
                <option value="LATERITE">Laterite Soil</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Season *</label>
              <select
                className="form-select"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              >
                <option value="RABI">Rabi (Winter / Spring)</option>
                <option value="KHARIF">Kharif (Monsoon)</option>
                <option value="ZAID">Zaid (Summer)</option>
                <option value="ALL_SEASON">All Season</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Irrigation System *</label>
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
                <option value="RAINFED">Rainfed Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Water Availability *</label>
              <select
                className="form-select"
                value={formData.waterAvailability}
                onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
              >
                <option value="HIGH">High / Assured</option>
                <option value="MODERATE">Moderate / Seasonal</option>
                <option value="LOW">Low / Scarce</option>
                <option value="RAINFED_ONLY">Rainfed Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Land Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                className="form-control"
                value={formData.landAreaAcres}
                onChange={(e) => setFormData({ ...formData, landAreaAcres: parseFloat(e.target.value) || 0.1 })}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Results Presentation */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Computing water schedules...</div>
      ) : guidance ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Key Metric Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-blue">
                <Droplets size={26} />
              </div>
              <div>
                <div className="stat-value">{guidance.recommendedIntervalDays}</div>
                <div className="stat-label">Recommended Irrigation Interval</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-green">
                <Waves size={26} />
              </div>
              <div>
                <div className="stat-value">{guidance.waterRequirementCategory}</div>
                <div className="stat-label">Crop Water Demand Category</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-amber">
                <Sun size={26} />
              </div>
              <div>
                <div className="stat-value">{guidance.totalWaterMm}</div>
                <div className="stat-label">Total Seasonal Depth</div>
              </div>
            </div>
          </div>

          {/* Warning or Status Callout */}
          {guidance.waterStressWarning && (
            <div
              className={guidance.waterStressWarning.includes('Critical') ? 'alert-danger-box' : 'warning-box'}
              style={{ margin: 0 }}
            >
              <ShieldAlert
                size={22}
                color={guidance.waterStressWarning.includes('Critical') ? '#dc2626' : '#d97706'}
                style={{ flexShrink: 0, marginTop: '2px' }}
              />
              <div>
                <div className="warning-title">Water Security Assessment</div>
                <div className="warning-desc">{guidance.waterStressWarning}</div>
              </div>
            </div>
          )}

          {/* Recommended Irrigation Technique */}
          <div className="card" style={{ borderLeft: '6px solid #0284c7' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              Optimal Application Method:
            </h3>
            <p style={{ color: '#0369a1', fontWeight: 600, fontSize: '0.95rem' }}>
              {guidance.bestIrrigationMethod}
            </p>
          </div>

          {/* Critical Growth Stages */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Calendar size={20} color="#0284c7" />
                <span>Critical Moisture-Sensitive Growth Stages</span>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
              Water stress during these specific phenological windows causes permanent yield reduction. Never allow the soil to crack or dry out during these milestones:
            </p>
            <ul className="explain-list">
              {guidance.criticalGrowthStages.map((stage, idx) => (
                <li key={idx} className="explain-item" style={{ borderLeftColor: '#0284c7' }}>
                  <span style={{ color: '#0284c7', fontWeight: 700 }}>&bull;</span>
                  <span>{stage}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Conservation Tips & Soil Advice Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {/* Water Conservation Tips */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Droplets size={20} color="#16a34a" />
                  <span>Water Conservation Best Practices</span>
                </div>
              </div>
              <ul className="explain-list">
                {guidance.conservationTips.map((tip, idx) => (
                  <li key={idx} className="explain-item">
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>&bull;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Soil-Specific Moisture Advice */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Sun size={20} color="#d97706" />
                  <span>Soil Moisture Dynamics ({guidance.soilType})</span>
                </div>
              </div>
              <ul className="explain-list">
                {guidance.soilSpecificGuidance.map((tip, idx) => (
                  <li key={idx} className="explain-item" style={{ borderLeftColor: '#d97706' }}>
                    <span style={{ color: '#d97706', fontWeight: 700 }}>&bull;</span>
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
