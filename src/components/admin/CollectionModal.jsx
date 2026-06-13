import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoCloudUploadOutline, IoTrashOutline } from 'react-icons/io5';
import { uploadAPI, collectionAPI } from '../../api';

export default function CollectionModal({ isOpen, onClose, collectionToEdit, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    titleHindi: '',
    description: '',
    category: 'all',
    coverImage: '',
    orderIndex: 0,
    isFeatured: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (collectionToEdit) {
        setFormData({
          title: collectionToEdit.title || '',
          titleHindi: collectionToEdit.titleHindi || '',
          description: collectionToEdit.description || '',
          category: collectionToEdit.category || 'all',
          coverImage: collectionToEdit.coverImage || '',
          orderIndex: collectionToEdit.orderIndex || 0,
          isFeatured: collectionToEdit.isFeatured || false,
        });
      } else {
        setFormData({
          title: '', titleHindi: '', description: '', category: 'all', coverImage: '', orderIndex: 0, isFeatured: false,
        });
      }
      setError('');
    }
  }, [isOpen, collectionToEdit]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    const form = new FormData();
    form.append('image', file);

    try {
      const res = await uploadAPI.uploadImage(form);
      if (res.data.success) {
        setFormData(prev => ({ ...prev, coverImage: res.data.url }));
      } else {
        setError('Image upload failed.');
      }
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      let res;
      if (collectionToEdit) {
        res = await collectionAPI.updateCollection(collectionToEdit._id, formData);
      } else {
        res = await collectionAPI.createCollection(formData);
      }

      if (res.data.success) {
        onSave();
        onClose();
      } else {
        setError(res.data.message || 'Failed to save collection');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-earth-900/90 p-4">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-cream-200 flex justify-between items-center bg-cream-50">
            <h3 className="font-display font-bold text-lg text-charcoal">{collectionToEdit ? 'Edit Collection' : 'New Collection'}</h3>
            <button onClick={onClose} className="p-2 text-warm-gray-400 hover:text-mithila-red transition-colors bg-white rounded-full shadow-sm"><IoCloseOutline size={24} /></button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <form id="collectionForm" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 mb-1">Title (Hindi)</label>
                  <input type="text" value={formData.titleHindi} onChange={e => setFormData({...formData, titleHindi: e.target.value})} className="w-full p-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-gray-600 mb-1">Description</label>
                <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 mb-1">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 mb-1">Order Index (Lower shows first)</label>
                  <input type="number" value={formData.orderIndex} onChange={e => setFormData({...formData, orderIndex: e.target.value})} className="w-full p-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 text-earth-600 rounded border-gray-300 focus:ring-earth-500" />
                <label htmlFor="isFeatured" className="text-sm font-medium text-warm-gray-600">Feature this collection</label>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-warm-gray-600 mb-2">Cover Image</label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {formData.coverImage ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-cream-200 group">
                      <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                      <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><IoTrashOutline size={14}/></button>
                    </div>
                  ) : (
                    <label className="w-32 h-32 rounded-xl border-2 border-dashed border-cream-200 flex flex-col items-center justify-center text-warm-gray-400 hover:text-earth-500 hover:border-earth-500 transition-colors cursor-pointer bg-cream-50">
                      <IoCloudUploadOutline size={32} />
                      <span className="text-sm mt-2 font-medium">{isUploading ? 'Uploading...' : 'Upload Cover'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                  )}
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
              
            </form>
          </div>

          <div className="p-4 border-t border-cream-200 bg-cream-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium text-warm-gray-600 hover:bg-cream-200 transition-colors">Cancel</button>
            <button type="submit" form="collectionForm" disabled={isSaving || isUploading} className="btn-primary flex items-center justify-center min-w-[100px]">
              {isSaving ? 'Saving...' : 'Save Collection'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
