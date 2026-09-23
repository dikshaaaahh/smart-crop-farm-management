import React, { useState, useEffect } from 'react';
import {
  WalletCards,
  Plus,
  Trash2,
  TrendingUp,
  Filter,
  DollarSign,
  PieChart,
  Calendar,
  X,
  CreditCard,
} from 'lucide-react';
import { api } from '../services/api';

export default function ExpenseManager({ showToast }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialFormState = {
    farmId: '',
    farmName: '',
    cropName: 'General Farm',
    category: 'SEEDS',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    description: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expData, sumData, farmData, cropData] = await Promise.all([
        api.getExpenses(),
        api.getExpenseSummary(),
        api.getFarms(),
        api.getCrops(),
      ]);
      setExpenses(expData);
      setSummary(sumData);
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
      showToast('Failed to load expense records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setFormData({
      ...initialFormState,
      farmId: farms[0]?.id || '',
      farmName: farms[0]?.name || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedFarm = farms.find((f) => f.id.toString() === formData.farmId.toString());
      const payload = {
        ...formData,
        farmName: selectedFarm ? selectedFarm.name : formData.farmName,
        amount: parseFloat(formData.amount) || 0,
      };

      await api.createExpense(payload);
      showToast('Expense recorded successfully!');
      closeModal();
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save expense', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense record?')) return;
    try {
      await api.deleteExpense(id);
      showToast('Expense record deleted.');
      loadData();
    } catch (err) {
      showToast('Failed to delete expense', 'error');
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (selectedFarmId && exp.farmId?.toString() !== selectedFarmId.toString()) return false;
    if (selectedCategory && exp.category !== selectedCategory) return false;
    return true;
  });

  const categoryEntries = summary?.categoryBreakdown ? Object.entries(summary.categoryBreakdown) : [];
  const totalAmount = summary?.totalExpenses || 0;
  const maxCategoryAmt = categoryEntries.reduce((max, [, val]) => Math.max(max, val), 1);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Farm Expense & Input Cost Management</h1>
          <p className="page-subtitle">
            Track input expenditures, seed purchases, labor charges, and machinery rentals
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <WalletCards size={26} />
          </div>
          <div>
            <div className="stat-value">₹{totalAmount.toLocaleString()}</div>
            <div className="stat-label">Total Cumulative Expenses</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">
            <TrendingUp size={26} />
          </div>
          <div>
            <div className="stat-value">{summary?.topCategory || 'N/A'}</div>
            <div className="stat-label">Highest Expense Category</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <CreditCard size={26} />
          </div>
          <div>
            <div className="stat-value">{expenses.length}</div>
            <div className="stat-label">Recorded Outlay Transactions</div>
          </div>
        </div>
      </div>

      {/* Visual Category Distribution */}
      {categoryEntries.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-title">
              <PieChart size={20} color="#16a34a" />
              <span>Category Outlay Breakdown</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {categoryEntries.map(([cat, amt]) => {
              const percent = totalAmount > 0 ? Math.round((amt / totalAmount) * 100) : 0;
              const barWidth = Math.round((amt / maxCategoryAmt) * 100);

              return (
                <div key={cat} style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{cat.replace('_', ' ')}</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>
                      ₹{amt.toLocaleString()} ({percent}%)
                    </span>
                  </div>
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${barWidth}%`,
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Table Card */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div className="card-title">
            <WalletCards size={20} color="#0284c7" />
            <span>Transaction Ledger</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              style={{ width: '180px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            >
              <option value="">All Farms</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '180px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            >
              <option value="">All Categories</option>
              <option value="SEEDS">Seeds</option>
              <option value="FERTILIZERS">Fertilizers</option>
              <option value="PESTICIDES">Pesticides</option>
              <option value="IRRIGATION">Irrigation</option>
              <option value="LABOUR">Labour</option>
              <option value="MACHINERY">Machinery</option>
              <option value="TRANSPORT">Transport</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading expenses...</div>
        ) : filteredExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
            No expenses found matching the selected filters.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Farm & Crop</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Payment</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td style={{ whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.85rem' }}>
                      {exp.expenseDate}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{exp.farmName || 'General Farm'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>{exp.cropName}</div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{exp.category?.replace('_', ' ')}</span>
                    </td>
                    <td style={{ color: '#334155', maxWidth: '300px' }}>
                      {exp.description || '—'}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                        {exp.paymentMethod || 'Cash'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                      ₹{exp.amount.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        title="Delete expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Record Farm Expense</div>
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
                  <label className="form-label">Associated Crop</label>
                  <select
                    className="form-select"
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  >
                    <option value="General Farm">General Farm (Non-crop specific)</option>
                    {crops.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="SEEDS">Seeds & Seedlings</option>
                    <option value="FERTILIZERS">Fertilizers & Nutrients</option>
                    <option value="PESTICIDES">Pesticides & Bio-agents</option>
                    <option value="IRRIGATION">Irrigation & Electricity/Fuel</option>
                    <option value="LABOUR">Farm Labour Wages</option>
                    <option value="MACHINERY">Machinery & Tractor Rental</option>
                    <option value="TRANSPORT">Transport & Logistics</option>
                    <option value="OTHER">Miscellaneous & Tools</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    placeholder="e.g. 3500"
                    className="form-control"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Expense Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online/UPI">Online / UPI</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Credit / Cheque">Credit / Dealer Cheque</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Vendor / Item Details</label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. 2 bags of DAP fertilizer bought from Kishan Seva Kendra."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Expense Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
