import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import * as FacebookLoginModule from 'react-facebook-login/dist/facebook-login-render-props';
import { IoLogoFacebook } from 'react-icons/io5';

const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

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

  const handleFacebookResponse = async (response) => {
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
      onError('Facebook login was cancelled or failed.');
    }
  };

  return (
    <div className="flex flex-col space-y-4 mt-6">
      <div className="relative mb-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-warm-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-warm-gray-500">Or continue with</span>
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

        <FacebookLogin
          appId={import.meta.env.VITE_FACEBOOK_APP_ID || 'dummy-app-id'}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleFacebookResponse}
          render={renderProps => (
            <button
              onClick={renderProps.onClick}
              disabled={loading || renderProps.isDisabled}
              className="w-full flex items-center justify-center space-x-2 bg-[#1877F2] text-white px-4 py-2.5 rounded hover:bg-[#166FE5] transition-colors"
            >
              <IoLogoFacebook className="w-5 h-5" />
              <span className="font-medium text-sm">Continue with Facebook</span>
            </button>
          )}
        />
      </div>
    </div>
  );
}
