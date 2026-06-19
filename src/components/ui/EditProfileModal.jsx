import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoAlertCircle, IoCheckmarkCircle } from 'react-icons/io5';
import FloatingWindow from './FloatingWindow';
import { useAuth } from '../../context/AuthContext';

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  
  const [editData, setEditData] = useState({ name: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
      });
      setError('');
      setSuccess('');
    }
  }, [isOpen, user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!editData.name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    const result = await updateProfile({
      name: editData.name,
      phone: editData.phone,
    });

    setIsSaving(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } else {
      setError(result.error || 'Failed to update profile');
    }
  };

  return (
    <FloatingWindow isOpen={isOpen} onClose={onClose} title="Edit Profile" size="md">
      <div className="p-4 sm:p-6">
        {/* Error & Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-mithila-red/10 border border-mithila-red/30"
          >
            <IoAlertCircle className="text-mithila-red flex-shrink-0" size={20} />
            <p className="text-mithila-red text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
          >
            <IoCheckmarkCircle className="text-emerald-500 flex-shrink-0" size={20} />
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">{success}</p>
          </motion.div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal dark:text-cream-200">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 dark:border-warm-gray-600 bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-earth-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal dark:text-cream-200">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={editData.phone}
              onChange={handleEditChange}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 dark:border-warm-gray-600 bg-cream-50/50 dark:bg-warm-gray-700/50 text-warm-gray-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-earth-500 transition-colors"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-cream-200 dark:border-warm-gray-700/50">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl font-body font-medium text-warm-gray-500 hover:bg-warm-gray-100 dark:hover:bg-warm-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-gold text-white font-medium hover:shadow-gold transition-all disabled:opacity-50 min-w-[120px]"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </FloatingWindow>
  );
}
