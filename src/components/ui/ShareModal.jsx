import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoLogoWhatsapp, IoLogoFacebook, IoLogoInstagram, IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { useState } from 'react';

export default function ShareModal({ isOpen, onClose, painting }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !painting) return null;

  const shareUrl = `${window.location.origin}/painting/${painting.id}`;
  const shareText = `🎨 ${painting.title}\nTraditional Mithila Painting\nCreated by Lalita Pathak\n\nView Artwork: ${shareUrl}\n\n#MithilaArt #MadhubaniArt #LalitaPathak`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleInstagram = () => {
    navigator.clipboard.writeText(shareText);
    alert('Caption copied to clipboard! Open Instagram to paste and share.');
    window.open('https://instagram.com', '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-warm-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm bg-white dark:bg-warm-gray-800 rounded-2xl shadow-xl overflow-hidden p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-cream-50 dark:bg-warm-gray-700 text-warm-gray-500 hover:text-charcoal dark:hover:text-white transition-colors"
        >
          <IoCloseOutline size={20} />
        </button>
        
        <h3 className="font-display font-semibold text-xl text-charcoal dark:text-cream-100 mb-6">Share Artwork</h3>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button onClick={handleWhatsApp} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
              <IoLogoWhatsapp size={24} />
            </div>
            <span className="text-xs font-body text-warm-gray-600 dark:text-warm-gray-400">WhatsApp</span>
          </button>
          <button onClick={handleFacebook} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
              <IoLogoFacebook size={24} />
            </div>
            <span className="text-xs font-body text-warm-gray-600 dark:text-warm-gray-400">Facebook</span>
          </button>
          <button onClick={handleInstagram} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center group-hover:bg-[#E1306C] group-hover:text-white transition-colors">
              <IoLogoInstagram size={24} />
            </div>
            <span className="text-xs font-body text-warm-gray-600 dark:text-warm-gray-400">Instagram</span>
          </button>
          <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-earth-500/10 text-earth-500 flex items-center justify-center group-hover:bg-earth-500 group-hover:text-white transition-colors">
              {copied ? <IoCheckmarkOutline size={24} /> : <IoCopyOutline size={24} />}
            </div>
            <span className="text-xs font-body text-warm-gray-600 dark:text-warm-gray-400">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-3 bg-cream-50 dark:bg-warm-gray-700 rounded-xl">
          <p className="text-xs text-warm-gray-500 font-body text-center">
            Credit to <strong>Lalita Pathak</strong> will be included automatically.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
