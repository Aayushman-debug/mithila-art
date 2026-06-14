import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoCloudUploadOutline, IoTrashOutline } from 'react-icons/io5';
import { uploadAPI, productAPI } from '../../api';

export default function ProductModal({ isOpen, onClose, productToEdit, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    productId: '',
    description: '',
    category: 'all',
    size: '',
    medium: '',
    style: '',
    price: '',
    originalPrice: '',
    featured: false,
    stock: 1,
    availabilityStatus: 'available',
    images: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setFormData({
          title: productToEdit.title || '',
          productId: productToEdit.productId || productToEdit.id || '',
          description: productToEdit.description || '',
          category: productToEdit.category || 'all',
          size: productToEdit.size || '',
          medium: productToEdit.medium || '',
          style: productToEdit.style || '',
          price: productToEdit.price || '',
          originalPrice: productToEdit.originalPrice || '',
          featured: productToEdit.featured || false,
          stock: productToEdit.stock !== undefined ? productToEdit.stock : 1,
          availabilityStatus: productToEdit.availabilityStatus || 'available',
          images: productToEdit.images && productToEdit.images.length > 0 
            ? productToEdit.images.map(img => typeof img === 'string' ? { url: img, public_id: '' } : img)
            : (productToEdit.image ? [{ url: productToEdit.image, public_id: '' }] : []),
        });
      } else {
        setFormData({
          title: '', productId: '', description: '', category: 'all', size: '', medium: '', style: '',
          price: '', originalPrice: '', featured: false, stock: 1, availabilityStatus: 'available', images: [],
        });
      }
      setError('');
    }
  }, [isOpen, productToEdit]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadAPI.uploadImage(formData);
      if (res.data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { url: res.data.url, public_id: res.data.public_id }]
        }));
      } else {
        setError(res.data.message || 'Failed to upload image');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (index, publicId) => {
    if (publicId) {
      try {
        await uploadAPI.deleteImage(publicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary', err);
      }
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      let res;
      const payload = { ...formData };
      if (payload.images && payload.images.length > 0) {
        payload.image = payload.images[0].url; // Ensure backward compatibility
      }
      
      if (productToEdit) {
        res = await productAPI.updateProduct(productToEdit._id, payload);
      } else {
        res = await productAPI.createProduct(payload);
      }

      if (res.data.success) {
        onSave();
        onClose();
      } else {
        setError(res.data.message || 'Failed to save product');
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
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-warm-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-cream-200 dark:border-warm-gray-700 flex justify-between items-center bg-cream-50 dark:bg-warm-gray-900">
            <h3 className="font-display font-bold text-lg text-charcoal dark:text-cream-100">{productToEdit ? 'Edit Variant' : 'New Variant'}</h3>
            <button onClick={onClose} className="p-2 text-warm-gray-500 dark:text-warm-gray-400 hover:text-mithila-red transition-colors bg-white dark:bg-warm-gray-800 rounded-full shadow-sm"><IoCloseOutline size={24} /></button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <form id="productForm" onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border border-cream-200 dark:border-warm-gray-700 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Product ID (Unique SKU)</label>
                  <input required type="text" value={formData.productId} onChange={e => setFormData({ ...formData, productId: e.target.value })} className="w-full p-2 border border-cream-200 dark:border-warm-gray-700 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 text-earth-500 rounded border-cream-200 dark:border-warm-gray-700 focus:ring-earth-500" />
                  <span className="text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300">Featured Artwork (Show on homepage/top of gallery)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border border-cream-200 dark:border-warm-gray-700 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full p-2 border border-cream-200 dark:border-warm-gray-700 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border border-cream-200 dark:border-warm-gray-700 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Size</label>
                  <input type="text" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} className="w-full p-2 border border-cream-200 dark:border-warm-gray-700 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Medium</label>
                  <input type="text" value={formData.medium} onChange={e => setFormData({ ...formData, medium: e.target.value })} className="w-full p-2 border border-cream-200 dark:border-warm-gray-700 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Stock</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full p-2 border border-cream-200 dark:border-warm-gray-700 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-1">Availability</label>
                  <select value={formData.availabilityStatus} onChange={e => setFormData({ ...formData, availabilityStatus: e.target.value })} className="w-full p-2 border border-cream-200 dark:border-warm-gray-700 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none">
                    <option value="available">Available</option>
                    <option value="only_1_left">Only 1 Left</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="commission_available">Commission Available</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-2">Variant Images</label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-cream-200 dark:border-warm-gray-700">
                      <img src={img.url} className="w-full h-full object-cover" alt="Product" />
                      <button type="button" onClick={() => removeImage(i, img.public_id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors"><IoTrashOutline size={14} /></button>
                    </div>
                  ))}

                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-cream-200 dark:border-warm-gray-700 flex flex-col items-center justify-center text-warm-gray-500 dark:text-warm-gray-400 hover:text-earth-500 hover:border-earth-500 transition-colors cursor-pointer bg-cream-50 dark:bg-warm-gray-900">
                    <IoCloudUploadOutline size={24} />
                    <span className="text-xs mt-1 font-medium">{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            </form>
          </div>

          <div className="p-4 border-t border-cream-200 dark:border-warm-gray-700 bg-cream-50 dark:bg-warm-gray-900 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium text-warm-gray-600 dark:text-warm-gray-300 hover:bg-cream-200 transition-colors">Cancel</button>
            <button type="submit" form="productForm" disabled={isSaving || isUploading} className="btn-primary flex items-center justify-center min-w-[100px]">
              {isSaving ? 'Saving...' : 'Save Variant'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
