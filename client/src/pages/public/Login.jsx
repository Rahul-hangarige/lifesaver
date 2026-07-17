import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHeartbeat } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate(`/${response.user.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="auth-card">
        <div className="text-center mb-8">
          <div className="bg-primary-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaHeartbeat className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-500 text-sm">
            Sign in to your LifeSaver account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="new-email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center justify-end text-sm">
            <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Create one
            </Link>
          </p>
          <Link to="/" className="inline-block mt-4 text-gray-400 hover:text-gray-600 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
