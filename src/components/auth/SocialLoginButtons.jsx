import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLoginModule from 'react-facebook-login/dist/facebook-login-render-props';
const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFacebook } from 'react-icons/fa';

export default function SocialLoginButtons({ onError }) {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = (user) => {
    const from = location.state?.from?.pathname || '/profile';
    navigate(from, { replace: true });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    const { credential } = credentialResponse;
    const result = await loginWithGoogle(credential);
    setLoading(false);
    
    if (result.success) {
      handleSuccess(result.user);
    } else {
      onError(result.message || 'Google login failed');
    }
  };

  const handleFacebookSuccess = async (response) => {
    if (response.accessToken) {
      setLoading(true);
      const result = await loginWithFacebook(response.accessToken);
      setLoading(false);
      
      if (result.success) {
        handleSuccess(result.user);
      } else {
        onError(result.message || 'Facebook login failed');
      }
    } else {
      setLoading(false);
      onError('Facebook authentication failed or was cancelled');
    }
  };

  return (
    <div className="flex flex-col space-y-4 mt-6">
      <div className="relative mb-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-warm-gray-200 dark:border-warm-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-warm-gray-800 text-warm-gray-500 dark:text-warm-gray-300">Or continue with</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              onError('Google authentication failed');
            }}
            size="large"
            theme="outline"
            width="100%"
            text="continue_with"
            shape="rectangular"
          />
        </div>
        
        <div className="w-full flex justify-center">
          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID || ''}
            autoLoad={false}
            fields="name,email,picture"
            callback={handleFacebookSuccess}
            render={renderProps => (
              <button
                onClick={renderProps.onClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-warm-gray-300 dark:border-warm-gray-600 rounded-md bg-white dark:bg-warm-gray-800 text-charcoal dark:text-cream-100 hover:bg-cream-50 dark:hover:bg-warm-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-earth-500 focus:ring-offset-1 dark:focus:ring-offset-warm-gray-900"
              >
                <FaFacebook className="text-[#1877F2] text-xl" />
                <span className="font-medium text-sm font-roboto">Continue with Facebook</span>
              </button>
            )}
          />
        </div>
      </div>
    </div>
  );
}
