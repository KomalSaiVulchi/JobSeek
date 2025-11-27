import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, Mail, Lock, User as UserIcon } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant');
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    const success = await signup(email, password, name, role);
    if (success) {
      showToast('Account created successfully!', 'success');
      setTimeout(() => {
        navigate(role === 'applicant' ? '/applicant/dashboard' : '/company/dashboard');
      }, 500);
    } else {
      showToast('Signup failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Briefcase className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-600 mt-2">Join JobSeek today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('applicant')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    role === 'applicant'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="font-medium">Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('company')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    role === 'company'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  <span className="font-medium">Employer</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {role === 'applicant' ? 'Full Name' : 'Company Name'}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder={role === 'applicant' ? 'John Doe' : 'Your Company'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 shadow-md"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
