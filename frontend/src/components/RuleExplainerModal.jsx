import React from 'react';
import { X, CheckCircle, ShieldAlert, Cpu, Database, Droplets, FlaskConical } from 'lucide-react';

export default function RuleExplainerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={24} color="#16a34a" />
            <div className="modal-title">Rule-Based Decision Logic Architecture</div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.92rem' }}>
          <p style={{ color: '#475569', lineHeight: 1.6 }}>
            This system implements <strong>deterministic, explainable rule-based algorithms</strong> instead of black-box machine learning. Every recommendation comes with clear agricultural rationale, water-deficit risk alerts, and transparent math.
          </p>

          {/* Module 1: Crop Selection Logic */}
          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
              <CheckCircle size={18} />
              <span>1. Crop Suitability Scoring Engine (0 - 100 Points)</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#334155' }}>
              <li><strong>Soil Compatibility (+35 pts):</strong> Direct match with agronomic soil requirements (Loamy, Clay, Alluvial, Black, Sandy). Secondary soil types receive +25 pts.</li>
              <li><strong>Season Match (+35 pts):</strong> Compares target season (Kharif, Rabi, Zaid, All-Season) with photoperiod and temperature requirements.</li>
              <li><strong>Water Availability & Deficit Penalty (+30 pts / -20 pts):</strong>
                <ul>
                  <li>If Crop is water-intensive (Rice/Sugarcane) and Farm water is LOW/RAINFED &rarr; <strong>-20 pt penalty</strong> + Critical Water Stress Warning.</li>
                  <li>If Crop is drought-hardy (Millets/Chickpea) in dry soils &rarr; <strong>+5 pt bonus</strong> for climate resilience.</li>
                </ul>
              </li>
              <li><strong>Economic Projections:</strong> Calculates <code>Yield = avgYieldPerAcre &times; acres</code>, <code>Revenue = Yield &times; MSP</code>, and <code>Net Profit = Revenue - Costs</code>.</li>
            </ul>
          </div>

          {/* Module 2: Fertilizer Guidance Logic */}
          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#075985', marginBottom: '0.5rem' }}>
              <FlaskConical size={18} />
              <span>2. Fertilizer Stoichiometry & Split Application</span>
            </div>
            <p style={{ color: '#334155', marginBottom: '0.5rem' }}>
              Converts recommended NPK ratios (kg/ha) into exact 50kg bags of commercial fertilizers tailored to the farm area:
            </p>
            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem', border: '1px solid #cbd5e1' }}>
              DAP kg = (P_req / 0.46)<br />
              Urea kg = (N_req - (DAP &times; 0.18)) / 0.46<br />
              MOP kg = (K_req / 0.60)<br />
              Sandy soils: Nitrogen split into 3-4 doses to eliminate leaching losses.
            </div>
          </div>

          {/* Module 3: Irrigation Guidance Logic */}
          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0369a1', marginBottom: '0.5rem' }}>
              <Droplets size={18} />
              <span>3. Water Scheduling & Phenological Critical Windows</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#334155' }}>
              <li><strong>Interval Dynamics:</strong> Sandy soils reduce intervals by 3 days due to fast percolation; Clay/Black soils hold water 3 days longer.</li>
              <li><strong>Evapotranspiration:</strong> Summer (Zaid) water demands increase by +25%; Winter (Rabi) drops by 10%.</li>
              <li><strong>Critical Windows:</strong> Highlights the sensitive phenological stages (Crown Root Initiation, Flowering, Anthesis, Fruit Filling) where moisture stress causes permanent yield loss.</li>
            </ul>
          </div>

          {/* Module 4: Spring Boot Architecture & MySQL Schema */}
          <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#7e22ce', marginBottom: '0.5rem' }}>
              <Database size={18} />
              <span>4. Technical Stack & Relational Database Design</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#334155' }}>
              <li><strong>Backend:</strong> Java 21, Spring Boot 3.4.3, Spring Data JPA, Hibernate, Bean Validation.</li>
              <li><strong>Relational Tables:</strong> <code>farms</code> (1) &harr; (N) <code>crop_activities</code>, <code>farms</code> (1) &harr; (N) <code>farm_expenses</code>, and reference catalog <code>crops</code>.</li>
              <li><strong>Profiles:</strong> Auto-configured for MySQL (<code>smart_crop_db</code>) with embedded H2 fallback for instant presentation.</li>
            </ul>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={onClose}>
              Got It, Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
