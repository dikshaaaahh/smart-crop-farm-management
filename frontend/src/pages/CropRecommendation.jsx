import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Sun,
  Droplets,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Info,
  Building2,
} from 'lucide-react';
import { api } from '../services/api';

export default function CropRecommendation({
  selectedFarm,
  setActiveTab,
  onSelectCropForGuides,
  showToast,
}) {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(selectedFarm?.id || '');

  const [formData, setFormData] = useState({
    farmId: selectedFarm?.id || null,
    soilType: selectedFarm?.soilType || 'LOAMY',
    season: 'RABI',
    landAreaAcres: selectedFarm?.totalAreaAcres || 2.0,
    irrigationSource: selectedFarm?.irrigationSource || 'BOREWELL',
    waterAvailability: selectedFarm?.waterAvailability || 'MODERATE',
    budgetLevel: 'MODERATE',
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  useEffect(() => {
    api.getFarms()
      .then((data) => setFarms(data))
      .catch((err) => console.error('Error fetching farms:', err));
  }, []);

  useEffect(() => {
    if (selectedFarm) {
      setSelectedFarmId(selectedFarm.id);
      setFormData((prev) => ({
        ...prev,
        farmId: selectedFarm.id,
        soilType: selectedFarm.soilType,
        landAreaAcres: selectedFarm.totalAreaAcres,
        irrigationSource: selectedFarm.irrigationSource,
        waterAvailability: selectedFarm.waterAvailability,
      }));
    }
  }, [selectedFarm]);

  const handleFarmSelect = (e) => {
    const fId = e.target.value;
    setSelectedFarmId(fId);
    if (!fId) {
      setFormData((prev) => ({ ...prev, farmId: null }));
      return;
    }

    const farm = farms.find((f) => f.id.toString() === fId.toString());
    if (farm) {
      setFormData({
        farmId: farm.id,
        soilType: farm.soilType,
        season: formData.season,
        landAreaAcres: farm.totalAreaAcres,
        irrigationSource: farm.irrigationSource,
        waterAvailability: farm.waterAvailability,
        budgetLevel: formData.budgetLevel,
      });
      showToast(`Loaded details from ${farm.name}`);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.getCropRecommendations(formData);
      setRecommendations(res);
      setHasEvaluated(true);
      showToast(`Evaluated ${res.length} crops using rule-based decision logic.`);
    } catch (err) {
      showToast(err.message || 'Failed to compute recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuideAction = (cropName, tab) => {
    if (onSelectCropForGuides) {
      onSelectCropForGuides({
        cropName,
        soilType: formData.soilType,
        season: formData.season,
        landAreaAcres: formData.landAreaAcres,
        irrigationSource: formData.irrigationSource,
        waterAvailability: formData.waterAvailability,
      });
    }
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Rule-Based Crop Decision Support</h1>
          <p className="page-subtitle">
            Enter your field conditions to receive explainable recommendations with yield and financial projections
          </p>
        </div>
      </div>

      {/* Input Parameters Form Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleEvaluate}>
          {/* Farm Preset Selector */}
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={16} color="#16a34a" />
              <span>Autofill from Registered Farm (Optional)</span>
            </label>
            <select
              className="form-select"
              value={selectedFarmId}
              onChange={handleFarmSelect}
              style={{ maxWidth: '400px' }}
            >
              <option value="">-- Choose Farm or Enter Custom Values --</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.totalAreaAcres} Acres &bull; {f.soilType} &bull; {f.irrigationSource})
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
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
                <option value="LATERITE">Laterite Soil (Acidic & Leached)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sowing Season *</label>
              <select
                className="form-select"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              >
                <option value="RABI">Rabi (Winter / Spring - Oct to March)</option>
                <option value="KHARIF">Kharif (Monsoon - June to Oct)</option>
                <option value="ZAID">Zaid (Summer - March to June)</option>
                <option value="ALL_SEASON">All Season / Perennial</option>
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
              <label className="form-label">Irrigation Source *</label>
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
              <label className="form-label">Farmer Budget Level</label>
              <select
                className="form-select"
                value={formData.budgetLevel}
                onChange={(e) => setFormData({ ...formData, budgetLevel: e.target.value })}
              >
                <option value="MODERATE">Moderate Budget</option>
                <option value="LOW">Low / Economical Input Budget</option>
                <option value="HIGH">High / Commercial Investment</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '200px' }}>
              <Sparkles size={18} />
              <span>{loading ? 'Evaluating Rules...' : 'Run Decision Engine'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '1.2rem', color: '#16a34a', fontWeight: 700 }}>
            Applying agronomic rules and generating explainable insights...
          </div>
        </div>
      ) : hasEvaluated && recommendations.length > 0 ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Recommended Crops for {formData.landAreaAcres} Acres ({formData.soilType}, {formData.season})
            </h2>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              {recommendations.length} Crops Evaluated
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {recommendations.map((crop) => {
              const isHigh = crop.suitabilityScore >= 80;
              const isMed = crop.suitabilityScore >= 65 && crop.suitabilityScore < 80;
              const scoreBadgeClass = isHigh ? 'badge-green' : isMed ? 'badge-blue' : 'badge-amber';

              return (
                <div
                  key={crop.cropId}
                  className="card"
                  style={{
                    borderLeft: `6px solid ${isHigh ? '#16a34a' : isMed ? '#0284c7' : '#f59e0b'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                          {crop.cropName}
                        </h3>
                        <span className={`badge ${scoreBadgeClass}`}>
                          {crop.matchGrade}
                        </span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                        <em>{crop.scientificName}</em> &bull; {crop.category} &bull; Growth Duration: {crop.durationDays}
                      </div>
                    </div>

                    <div className="suitability-score-box">
                      <div className="suitability-score-num">{crop.suitabilityScore}%</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#166534', lineHeight: 1.2 }}>
                        Suitability<br />Match
                      </div>
                    </div>
                  </div>

                  {/* Financial & Yield Estimates Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                      gap: '0.75rem',
                      background: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PROJECTED YIELD</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        {crop.estimatedYieldQuintals} Quintals
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>EST. GROSS REVENUE</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#166534' }}>
                        ₹{crop.estimatedGrossRevenue.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CULTIVATION COST</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#b91c1c' }}>
                        ₹{crop.estimatedCultivationCost.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PROJECTED NET PROFIT</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: crop.estimatedNetProfit >= 0 ? '#166534' : '#dc2626' }}>
                        ₹{crop.estimatedNetProfit.toLocaleString()} ({crop.profitMarginPercent}%)
                      </div>
                    </div>
                  </div>

                  {/* Explainable "Why this Crop is Recommended" */}
                  {crop.reasons && crop.reasons.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        <CheckCircle2 size={16} />
                        <span>Why this Crop is Recommended (Explainable Rationale):</span>
                      </div>
                      <ul className="explain-list">
                        {crop.reasons.map((r, idx) => (
                          <li key={idx} className="explain-item">
                            <span style={{ color: '#16a34a', fontWeight: 700 }}>&bull;</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings & Risk Alerts */}
                  {crop.warnings && crop.warnings.length > 0 && (
                    <div className="warning-box">
                      <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div className="warning-title">Agronomic Risk & Water Cautions</div>
                        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', fontSize: '0.85rem', color: '#78350f' }}>
                          {crop.warnings.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Quick Action Navigation Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleGuideAction(crop.cropName, 'fertilizer')}
                    >
                      <span>Fertilizer Dosage</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleGuideAction(crop.cropName, 'irrigation')}
                    >
                      <span>Water Schedule</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleGuideAction(crop.cropName, 'activities')}
                    >
                      <span>Track Activities</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : hasEvaluated ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          No suitable crops found for the exact criteria provided. Try adjusting the season or water availability.
        </div>
      ) : null}
    </div>
  );
}
