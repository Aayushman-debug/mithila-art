import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoAddOutline, IoTrashOutline, IoCheckmarkOutline, IoCloseOutline } from 'react-icons/io5';
import { adminAPI } from '../../api';

export default function CouponsManager({ showToast }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percent',
    value: '',
    freeShipping: false,
    singleUse: false
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCoupons();
      if (res.data.success) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      showToast('Failed to fetch coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      return showToast('Please provide code and value', 'error');
    }
    try {
      const res = await adminAPI.createCoupon({
        ...formData,
        value: Number(formData.value)
      });
      if (res.data.success) {
        showToast('Coupon created successfully');
        setIsAdding(false);
        setFormData({ code: '', type: 'percent', value: '', freeShipping: false, singleUse: false });
        fetchCoupons();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create coupon', 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await adminAPI.toggleCoupon(id);
      if (res.data.success) {
        showToast('Coupon status updated');
        fetchCoupons();
      }
    } catch (err) {
      showToast('Failed to toggle coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await adminAPI.deleteCoupon(id);
      if (res.data.success) {
        showToast('Coupon deleted');
        fetchCoupons();
      }
    } catch (err) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="heading-sm text-charcoal dark:text-cream-200">Coupons</h2>
          <p className="text-sm text-warm-gray-500 font-body">Manage discount codes and offers</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {isAdding ? <IoCloseOutline /> : <IoAddOutline />}
          {isAdding ? 'Cancel' : 'Add New'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAddCoupon}
            className="bg-white dark:bg-warm-gray-800 p-6 rounded-2xl border border-cream-200 dark:border-warm-gray-700 shadow-sm overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-warm-gray-600 dark:text-warm-gray-300 mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  name="code" 
                  value={formData.code} 
                  onChange={handleInputChange} 
                  placeholder="e.g. SUMMER20"
                  className="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-warm-gray-700 bg-cream-50 dark:bg-warm-gray-900 text-sm font-body uppercase"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-warm-gray-600 dark:text-warm-gray-300 mb-1">Discount Type</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-warm-gray-700 bg-cream-50 dark:bg-warm-gray-900 text-sm font-body"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-warm-gray-600 dark:text-warm-gray-300 mb-1">Value</label>
                  <input 
                    type="number" 
                    name="value" 
                    value={formData.value} 
                    onChange={handleInputChange} 
                    placeholder={formData.type === 'percent' ? "e.g. 15" : "e.g. 500"}
                    className="w-full px-3 py-2 rounded-lg border border-cream-200 dark:border-warm-gray-700 bg-cream-50 dark:bg-warm-gray-900 text-sm font-body"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="freeShipping" checked={formData.freeShipping} onChange={handleInputChange} className="rounded text-earth-500 focus:ring-earth-500" />
                <span className="text-sm font-body text-charcoal dark:text-cream-200">Includes Free Shipping</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="singleUse" checked={formData.singleUse} onChange={handleInputChange} className="rounded text-earth-500 focus:ring-earth-500" />
                <span className="text-sm font-body text-charcoal dark:text-cream-200">Single Use Per Customer</span>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full md:w-auto text-sm">Save Coupon</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-warm-gray-800 rounded-2xl border border-cream-200 dark:border-warm-gray-700 overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-cream-50 dark:bg-warm-gray-900/50 border-b border-cream-200 dark:border-warm-gray-700 font-display text-sm text-warm-gray-500 dark:text-warm-gray-400">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Perks</th>
                <th className="px-4 py-3 text-center">Usage</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-warm-gray-500">Loading coupons...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-warm-gray-500">No coupons found</td></tr>
              ) : coupons.map(c => (
                <tr key={c._id} className="border-b border-cream-50 dark:border-warm-gray-700/50 hover:bg-cream-50/50 dark:hover:bg-warm-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-charcoal dark:text-cream-200">{c.code}</td>
                  <td className="px-4 py-3 font-medium text-earth-600 dark:text-earth-400">
                    {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                  </td>
                  <td className="px-4 py-3 text-xs text-warm-gray-500 dark:text-warm-gray-400 space-y-1">
                    {c.freeShipping && <div className="text-mithila-green">Free Shipping</div>}
                    {c.singleUse && <div>Single Use</div>}
                  </td>
                  <td className="px-4 py-3 text-center text-charcoal dark:text-cream-200">{c.usageCount}</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => handleToggle(c._id)}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${c.isActive ? 'bg-mithila-green/10 text-mithila-green' : 'bg-warm-gray-200 text-warm-gray-500 dark:bg-warm-gray-700'}`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 text-warm-gray-400 hover:text-mithila-red transition-colors">
                      <IoTrashOutline size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-4 p-4">
          {loading ? (
            <p className="text-center text-warm-gray-500 py-4 font-body text-sm">Loading coupons...</p>
          ) : coupons.length === 0 ? (
            <p className="text-center text-warm-gray-500 py-4 font-body text-sm">No coupons found</p>
          ) : coupons.map(c => (
            <div key={c._id} className="bg-cream-50 dark:bg-warm-gray-900 p-4 rounded-xl border border-cream-100 dark:border-warm-gray-700 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-display font-bold text-lg text-charcoal dark:text-cream-100 uppercase">{c.code}</p>
                  <p className="text-sm font-medium text-earth-600 dark:text-earth-400">
                    {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                  </p>
                </div>
                <button 
                  onClick={() => handleToggle(c._id)}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${c.isActive ? 'bg-mithila-green/10 text-mithila-green' : 'bg-warm-gray-200 text-warm-gray-500 dark:bg-warm-gray-700'}`}
                >
                  {c.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-xs text-warm-gray-500 dark:text-warm-gray-400 font-body">
                <span>Usage: <strong className="text-charcoal dark:text-cream-200">{c.usageCount}</strong></span>
                {(c.freeShipping || c.singleUse) && <span>•</span>}
                {c.freeShipping && <span className="text-mithila-green font-medium">Free Shipping</span>}
                {c.freeShipping && c.singleUse && <span>•</span>}
                {c.singleUse && <span className="text-earth-600 dark:text-earth-400 font-medium">Single Use</span>}
              </div>

              <div className="flex justify-end mt-2 pt-2 border-t border-cream-200 dark:border-warm-gray-700">
                <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg bg-white dark:bg-warm-gray-800 border border-cream-200 dark:border-warm-gray-700 text-warm-gray-500 hover:text-mithila-red transition-colors flex items-center gap-1 text-xs font-medium">
                  <IoTrashOutline size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
