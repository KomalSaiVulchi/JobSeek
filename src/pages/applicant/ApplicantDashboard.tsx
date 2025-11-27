import { useEffect, useState } from 'react';
import { API_URL } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, Clock, CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import { useToast } from '../../context/ToastContext';

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await fetch(`${API_URL}/jobs`);
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        }

        const token = localStorage.getItem('jobseek_token');
        if (token) {
          const appsRes = await fetch(`${API_URL}/applications`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (appsRes.ok) {
            const appsData = await appsRes.json();
            setApplications(appsData.applications || []);
          }
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to load dashboard data', 'error');
      }
    };

    fetchData();
  }, [API_URL, showToast]);

  const recentJobs = jobs.slice(0, 3);

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Track your job search progress</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{jobs.length}</span>
            </div>
            <h3 className="text-slate-600 font-medium">Available Jobs</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{applications.length}</span>
            </div>
            <h3 className="text-slate-600 font-medium">Pending Applications</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">0</span>
            </div>
            <h3 className="text-slate-600 font-medium">Profile Views</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Job Postings</h2>
            <button
              onClick={() => navigate('/applicant/jobs')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/applicant/jobs/${job._id}`)}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                    <p className="text-slate-600 mt-1">{job.company || 'Company'}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                      <span>•</span>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {job.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
              <p className="text-blue-100">
                Stand out to employers by adding more details to your profile
              </p>
            </div>
            <button
              onClick={() => navigate('/applicant/profile')}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
