import { Component } from 'react';

/**
 * GlobalErrorBoundary
 * 
 * Catches two critical failure modes:
 * 1. Chunk load failures – when a lazy-loaded route fails to download
 *    (network blip, Vercel redeployment, etc.)
 * 2. Runtime crashes – any unhandled JS error inside a component tree
 * 
 * Without this, both cases cause a blank white screen with zero feedback.
 */
export default class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    // Detect chunk load failures (dynamic import failures)
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      /loading chunk/i.test(error?.message || '') ||
      /dynamically imported module/i.test(error?.message || '') ||
      /failed to fetch/i.test(error?.message || '');

    return { hasError: true, isChunkError };
  }

  componentDidCatch(error, errorInfo) {
    // Log for debugging – this will appear in the browser console
    console.error('[GlobalErrorBoundary] Caught error:', error, errorInfo);
  }

  handleRetry = () => {
    if (this.state.isChunkError) {
      // For chunk errors, a hard reload fetches the latest deployment
      window.location.reload();
    } else {
      // For runtime errors, reset the boundary and let React re-render
      this.setState({ hasError: false, isChunkError: false });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream-50 dark:bg-warm-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-earth-500/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-earth-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>

            {/* Message */}
            <h2 className="font-display text-2xl font-bold text-earth-700 dark:text-cream-200 mb-3">
              {this.state.isChunkError
                ? 'Page failed to load'
                : 'Something went wrong'}
            </h2>
            <p className="text-warm-gray-600 dark:text-warm-gray-300 mb-8 leading-relaxed">
              {this.state.isChunkError
                ? 'A newer version of the website may be available. Please reload to get the latest version.'
                : 'An unexpected error occurred. Please try again.'}
            </p>

            {/* Action */}
            <button
              onClick={this.handleRetry}
              className="px-8 py-3 rounded-xl bg-gradient-gold text-white font-medium hover:shadow-gold transition-all duration-300"
            >
              {this.state.isChunkError ? 'Reload Page' : 'Try Again'}
            </button>

            {/* Home link */}
            <p className="mt-6">
              <a
                href="/"
                className="text-earth-500 hover:text-earth-600 underline underline-offset-4 text-sm transition-colors"
              >
                Return to Home
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
