import React, { useState, useEffect } from 'react';
import {
  Trees,
  Sprout,
  CalendarCheck,
  Wallet,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard({ setActiveTab, showToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      showToast('Could not fetch latest stats from backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleActivityStatus = async (activityId, currentStatus) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PLANNED' : 'COMPLETED';
    try {
      await api.updateActivityStatus(activityId, newStatus);
      showToast(`Activity status updated to ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      showToast('Failed to update activity status', 'error');
    }
  };

  if (loading && !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '1.25rem', color: '#16a34a', fontWeight: 600 }}>
          Loading farm dashboard...
        </div>
      </div>
    );
  }

  const categoryEntries = stats?.expensesByCategory ? Object.entries(stats.expensesByCategory) : [];
  const maxExpense = categoryEntries.reduce((max, [, amt]) => Math.max(max, amt), 1);

  return (
    <div>
      {/* Top Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Farm Overview Dashboard</h1>
          <p className="page-subtitle">
            Explainable decision support and unified management for your agricultural holdings
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('crop-recommendation')}>
            <Sparkles size={16} />
            <span>New Crop Decision</span>
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('expenses')}>
            <PlusCircle size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">
            <Trees size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalFarms || 0}</div>
            <div className="stat-label">Registered Farms ({stats?.totalFarmAreaAcres || 0} Acres)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <Sprout size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.activeCrops?.length || 0}</div>
            <div className="stat-label">Active Crops in Cultivation</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">
            <CalendarCheck size={26} />
          </div>
          <div>
            <div className="stat-value">{stats?.pendingActivities || 0}</div>
            <div className="stat-label">Pending / Scheduled Tasks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <Wallet size={26} />
          </div>
          <div>
            <div className="stat-value">₹{(stats?.totalExpenses || 0).toLocaleString()}</div>
            <div className="stat-label">Total Recorded Expenses</div>
          </div>
        </div>
      </div>

      {/* Seasonal Advisory Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #15803d, #166534)',
          borderRadius: '12px',
          color: '#ffffff',
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(22, 101, 52, 0.25)',
        }}
      >
        <div style={{ maxWidth: '750px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ background: '#22c55e', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Seasonal Advisory
            </span>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Optimal Sowing & Moisture Windows</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#bbf7d0', lineHeight: 1.4 }}>
            For Rabi season crops (Wheat, Mustard, Chickpea), prepare soil with basal DAP and zinc. Ensure crown root irrigation (CRI) at 20-25 days after sowing to protect spikelet development.
          </p>
        </div>
        <button
          className="btn"
          style={{ background: '#ffffff', color: '#166534', fontWeight: 700 }}
          onClick={() => setActiveTab('irrigation')}
        >
          Check Water Guide
        </button>
      </div>

      {/* Main Grid: Activities & Expenses */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <CalendarCheck size={20} color="#16a34a" />
              <span>Upcoming & Recent Activities</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('activities')}>
              View All
            </button>
          </div>

          {stats?.upcomingActivities && stats.upcomingActivities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats.upcomingActivities.map((act) => {
                const isDone = act.status === 'COMPLETED';
                return (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: isDone ? '#f8fafc' : '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleToggleActivityStatus(act.id, act.status)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: isDone ? '#16a34a' : '#94a3b8',
                        }}
                        title={isDone ? 'Mark as Planned' : 'Mark as Completed'}
                      >
                        {isDone ? <CheckCircle2 size={22} /> : <Clock size={22} />}
                      </button>

                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: '0.92rem',
                            color: isDone ? '#64748b' : '#1e293b',
                            textDecoration: isDone ? 'line-through' : 'none',
                          }}
                        >
                          {act.activityName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          <span style={{ fontWeight: 600, color: '#16a34a' }}>{act.cropName}</span> &bull; {act.farmName || 'General Farm'} &bull; {act.activityDate}
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${isDone ? 'badge-green' : 'badge-amber'}`}>
                      {act.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
              No activities scheduled yet.{' '}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('activities')}
                style={{ marginTop: '0.5rem' }}
              >
                Schedule an Activity
              </button>
            </div>
          )}
        </div>

        {/* Expense Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={20} color="#0284c7" />
              <span>Expense Distribution by Category</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('expenses')}>
              Manage
            </button>
          </div>

          {categoryEntries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              {categoryEntries.map(([cat, amount]) => {
                const percent = Math.round((amount / (stats?.totalExpenses || 1)) * 100);
                const barWidth = Math.min(100, Math.round((amount / maxExpense) * 100));
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{cat}</span>
                      <span style={{ color: '#0f172a', fontWeight: 700 }}>
                        ₹{amount.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${barWidth}%`,
                          background: 'linear-gradient(90deg, #10b981, #059669)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#64748b' }}>Top Outlay Category:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{stats?.topExpenseCategory}</span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
              No expenses recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Decision Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div
          className="card"
          style={{ cursor: 'pointer', borderLeft: '4px solid #16a34a' }}
          onClick={() => setActiveTab('crop-recommendation')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#166534' }}>
              Rule-Based Crop Selection
            </div>
            <ArrowRight size={18} color="#16a34a" />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Input your soil type, season, and irrigation availability to receive verified, explainable crop suggestions with yield & profit forecasts.
          </p>
        </div>

        <div
          className="card"
          style={{ cursor: 'pointer', borderLeft: '4px solid #0284c7' }}
          onClick={() => setActiveTab('fertilizer')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0369a1' }}>
              NPK & Fertilizer Dosage
            </div>
            <ArrowRight size={18} color="#0284c7" />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Calculate exact 50kg bags of Urea, DAP, and MOP tailored to your land area, plus stage-wise schedules and organic alternatives.
          </p>
        </div>

        <div
          className="card"
          style={{ cursor: 'pointer', borderLeft: '4px solid #d97706' }}
          onClick={() => setActiveTab('irrigation')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#b45309' }}>
              Water & Irrigation Scheduling
            </div>
            <ArrowRight size={18} color="#d97706" />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Find out optimal watering frequency, critical growth windows, and water-saving methods to protect your crops against moisture stress.
          </p>
        </div>
      </div>
    </div>
  );
}
