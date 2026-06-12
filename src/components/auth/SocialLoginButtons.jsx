import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SocialLoginButtons({ onError }) {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
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

  return (
    <div className="flex flex-col space-y-4 mt-6">
      <div className="relative mb-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-warm-gray-200 dark:border-warm-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-warm-gray-800 text-warm-gray-500 dark:text-warm-gray-400">Or continue with</span>
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
      </div>
    </div>
  );
}
