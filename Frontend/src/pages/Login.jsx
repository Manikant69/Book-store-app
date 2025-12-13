import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constants.js';
import Toast from '../utils/toast';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, formData);
      if (res.data.success || res.data.message) {
        Toast.success(res.data.message || 'Login successful!');
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('userName', res.data.user.fullname);
        localStorage.setItem('userEmail', res.data.user.email);
        localStorage.setItem('userRole', res.data.user.role);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Login failed');
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 dark:text-white">Welcome Back!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Log in to access your account and continue exploring your favorite books
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
                           dark:border-gray-700 dark:bg-gray-700 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-200 
                           dark:border-gray-700 dark:bg-gray-700 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                           hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
                       transition-colors duration-200 font-medium disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-teal-600 hover:text-teal-700 dark:text-teal-400 
                         dark:hover:text-teal-300 font-medium"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
