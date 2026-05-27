import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoArrowBackOutline, IoClipboardOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { userAPI } from '../api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const statusStyles = {
  submitted: 'bg-cream-100 text-earth-700',
  approved: 'bg-earth-100 text-earth-800',
  'in-progress': 'bg-mithila-green/10 text-mithila-green',
  completed: 'bg-mithila-green/10 text-mithila-green',
  rejected: 'bg-mithila-red/10 text-mithila-red',
};

export default function CommissionTrackingPage() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCommissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userAPI.getCommissions();
      if (response.data.success) {
        setCommissions(response.data.commissions || []);
      } else {
        setError(response.data.message || 'Could not load commissions');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load commissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommissions();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Checking commission status..." />;
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      <Helmet>
        <title>Commission Tracking — Lalita Pathak Mithila Art</title>
        <meta name="description" content="Track the status of your commissioned art." />
      </Helmet>

      <div className="container-custom section-padding">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-earth-500 font-semibold">Commission tracking</p>
            <h1 className="heading-xl text-charcoal mt-3">My Commissions</h1>
          </div>
          <Link to="/commission" className="btn-secondary inline-flex items-center gap-2">
            <IoArrowBackOutline size={18} /> New Commission
          </Link>
        </div>

        {error && (
          <div className="rounded-3xl bg-mithila-red/10 border border-mithila-red/20 p-6 mb-8">
            <p className="text-mithila-red">{error}</p>
          </div>
        )}

        {commissions.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-14 text-center">
            <IoClipboardOutline className="mx-auto text-earth-500 mb-6" size={64} />
            <h2 className="heading-md text-charcoal mb-3">No commission activity yet</h2>
            <p className="text-body text-warm-gray-500 mb-6">Submit a commission request and track it here.</p>
            <Link to="/commission" className="btn-primary inline-flex items-center gap-2">
              Request Art
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {commissions.map((commission) => (
              <motion.div
                key={commission._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-card p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-warm-gray-500 text-sm">Reference ID</p>
                    <p className="font-semibold text-charcoal">{commission.referenceId}</p>
                  </div>
                  <div>
                    <p className="text-warm-gray-500 text-sm">Status</p>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[commission.status] || 'bg-cream-100 text-earth-700'}`}>
                      {commission.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-cream-50 p-4">
                    <p className="text-sm text-warm-gray-500 mb-2">Style</p>
                    <p className="text-charcoal text-sm">{commission.style}</p>
                  </div>
                  <div className="rounded-3xl bg-cream-50 p-4">
                    <p className="text-sm text-warm-gray-500 mb-2">Timeline</p>
                    <p className="text-charcoal text-sm">{commission.timeline || 'Flexible'}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-cream-50 p-4">
                  <p className="text-sm text-warm-gray-500 mb-2">Description</p>
                  <p className="text-charcoal text-sm leading-relaxed">{commission.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
