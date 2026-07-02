import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword({ phone });
      toast.success('Password reset link generated successfully.');
      setResetUrl(response.data.resetUrl || '');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to generate reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="auth-card max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-gray-500 text-sm">
            Enter your registered mobile number and we will send a reset link.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="input-field"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending reset link...' : 'Send reset link'}
          </button>
        </form>

        {resetUrl && (
          <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
            <p className="font-semibold">Reset link:</p>
            <a href={resetUrl} className="text-primary-700 underline break-all">
              {resetUrl}
            </a>
            <p className="mt-2 text-gray-600">Use this link to reset your password.</p>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
