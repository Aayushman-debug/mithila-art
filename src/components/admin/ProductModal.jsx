import React, { useState, useEffect } from 'react';
import { IoCloudUploadOutline, IoTrashOutline } from 'react-icons/io5';
import { uploadAPI, productAPI } from '../../api';
import FloatingWindow from '../ui/FloatingWindow';

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
    variants: [],
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
          variants: productToEdit.variants || [],
        });
      } else {
        setFormData({
          title: '', productId: '', description: '', category: 'all', size: '', medium: '', style: '',
          price: '', originalPrice: '', featured: false, stock: 1, availabilityStatus: 'available', images: [], variants: [],
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

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        variantId: `v-${Date.now()}`,
        variantName: '',
        price: '',
        size: '',
        medium: '',
        stock: 1,
        availabilityStatus: 'available',
        image: null
      }]
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      const res = await uploadAPI.uploadImage(formDataUpload);
      if (res.data.success) {
        setFormData(prev => {
          const newVariants = [...prev.variants];
          newVariants[index] = { 
            ...newVariants[index], 
            image: { url: res.data.url, public_id: res.data.public_id } 
          };
          return { ...prev, variants: newVariants };
        });
      } else {
        setError(res.data.message || 'Failed to upload image');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
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
    <FloatingWindow 
      isOpen={isOpen} 
      onClose={onClose} 
      title={productToEdit ? 'Edit Variant' : 'New Variant'} 
      size="2xl"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
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

              {/* Base/Gallery Images Upload */}
              <div>
                <label className="block text-sm font-medium text-warm-gray-600 dark:text-warm-gray-300 mb-2">Base / Gallery Images</label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-cream-200 dark:border-warm-gray-700">
                      <img src={img.url} className="w-full h-full object-cover" alt="Product" />
                      <button type="button" aria-label="Remove image" onClick={() => removeImage(i, img.public_id)} className="absolute top-1 right-1 min-w-[44px] min-h-[44px] flex justify-center items-center bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"><IoTrashOutline size={16} /></button>
                    </div>
                  ))}

                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-cream-200 dark:border-warm-gray-700 flex flex-col items-center justify-center text-warm-gray-500 dark:text-warm-gray-400 hover:text-earth-500 hover:border-earth-500 transition-colors cursor-pointer bg-cream-50 dark:bg-warm-gray-900">
                    <IoCloudUploadOutline size={24} />
                    <span className="text-xs mt-1 font-medium">{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>

              {/* Variants Section */}
              <div className="border-t border-cream-200 dark:border-warm-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-lg font-display font-semibold text-charcoal dark:text-cream-100">Purchasable Variants</label>
                  <button type="button" onClick={handleAddVariant} className="px-3 py-1 bg-earth-500/10 text-earth-600 dark:text-earth-400 rounded-lg text-sm font-medium hover:bg-earth-500/20 transition-colors">
                    + Add Variant
                  </button>
                </div>
                
                <div className="space-y-6">
                  {formData.variants.map((v, i) => (
                    <div key={i} className="p-4 bg-cream-50 dark:bg-warm-gray-800 rounded-xl border border-cream-200 dark:border-warm-gray-700 relative">
                      <button type="button" onClick={() => removeVariant(i)} className="absolute top-4 right-4 text-mithila-red hover:text-red-700">
                        <IoTrashOutline size={20} />
                      </button>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Variant Image */}
                        <div className="shrink-0">
                          {v.image ? (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-cream-200 dark:border-warm-gray-700">
                              <img src={v.image.url} className="w-full h-full object-cover" alt="Variant" />
                              <button type="button" onClick={() => handleVariantChange(i, 'image', null)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><IoTrashOutline size={12} /></button>
                            </div>
                          ) : (
                            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-cream-200 dark:border-warm-gray-700 flex flex-col items-center justify-center text-warm-gray-500 cursor-pointer bg-white dark:bg-warm-gray-900">
                              <IoCloudUploadOutline size={24} />
                              <span className="text-[10px] mt-1 text-center px-1">Variant Image</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleVariantImageUpload(e, i)} disabled={isUploading} />
                            </label>
                          )}
                        </div>
                        
                        {/* Variant Fields */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-warm-gray-500 mb-1">Variant Name</label>
                            <input type="text" value={v.variantName} onChange={e => handleVariantChange(i, 'variantName', e.target.value)} placeholder="e.g. Red Border" className="w-full p-2 text-sm border border-cream-200 dark:border-warm-gray-700 rounded-lg outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs text-warm-gray-500 mb-1">Price (₹)</label>
                            <input type="number" required value={v.price} onChange={e => handleVariantChange(i, 'price', e.target.value)} className="w-full p-2 text-sm border border-cream-200 dark:border-warm-gray-700 rounded-lg outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs text-warm-gray-500 mb-1">Size</label>
                            <input type="text" value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)} className="w-full p-2 text-sm border border-cream-200 dark:border-warm-gray-700 rounded-lg outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs text-warm-gray-500 mb-1">Medium</label>
                            <input type="text" value={v.medium} onChange={e => handleVariantChange(i, 'medium', e.target.value)} className="w-full p-2 text-sm border border-cream-200 dark:border-warm-gray-700 rounded-lg outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs text-warm-gray-500 mb-1">Stock</label>
                            <input type="number" required value={v.stock} onChange={e => handleVariantChange(i, 'stock', e.target.value)} className="w-full p-2 text-sm border border-cream-200 dark:border-warm-gray-700 rounded-lg outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs text-warm-gray-500 mb-1">Status</label>
                            <select value={v.availabilityStatus} onChange={e => handleVariantChange(i, 'availabilityStatus', e.target.value)} className="w-full p-2 text-sm border border-cream-200 dark:border-warm-gray-700 rounded-lg outline-none">
                              <option value="available">Available</option>
                              <option value="only_1_left">Only 1 Left</option>
                              <option value="out_of_stock">Out of Stock</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.variants.length === 0 && (
                    <p className="text-sm text-warm-gray-500 dark:text-warm-gray-400 italic">No variants added. The main product details above will be used.</p>
                  )}
                </div>
              </div>

          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          </form>
        </div>

        <div className="p-4 border-t border-cream-200 dark:border-warm-gray-700/50 flex justify-end gap-3 mt-auto shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 min-h-[44px] rounded-xl font-medium text-warm-gray-600 dark:text-warm-gray-300 hover:bg-cream-100 dark:hover:bg-warm-gray-800 transition-colors">Cancel</button>
          <button type="submit" form="productForm" disabled={isSaving || isUploading} className="px-6 py-2 min-h-[44px] flex items-center justify-center rounded-xl bg-gradient-gold text-white font-medium hover:shadow-gold transition-all disabled:opacity-50 min-w-[120px]">
            {isSaving ? 'Saving...' : 'Save Variant'}
          </button>
        </div>
      </div>
    </FloatingWindow>
  );
}
