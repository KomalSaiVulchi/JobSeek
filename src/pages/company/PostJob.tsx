import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../lib/api';

export default function PostJob() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    type: 'Full-time',
    location: '',
    salary: '',
    experience: '',
    category: 'Engineering'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location || !formData.salary) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('jobseek_token');
      if (!token) {
        showToast('You must be logged in to post a job', 'error');
        return;
      }

      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          salary: formData.salary,
          type: formData.type,
          category: formData.category,
          company: user?.name || 'Company',
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        showToast(error.error || 'Failed to post job', 'error');
        return;
      }

      showToast('Job posted successfully!', 'success');
      setTimeout(() => navigate('/company/jobs'), 1000);
    } catch (err) {
      console.error(err);
      showToast('Something went wrong while posting job', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Post a New Job</h1>
          <p className="text-slate-600 mt-2">Fill in the details to attract the right candidates</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-slate-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Job Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>Product</option>
                <option>Data Science</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="e.g. San Francisco, CA or Remote"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Salary Range *
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="e.g. $100,000 - $130,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Experience Level *
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="e.g. 3-5 years"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Describe the role, responsibilities, and what makes this position exciting..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Requirements *
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter each requirement on a new line..."
            />
            <p className="text-sm text-slate-500 mt-2">Enter one requirement per line</p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/company/dashboard')}
              className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
