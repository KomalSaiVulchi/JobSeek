import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Eye, PlusCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { API_URL } from '../../lib/api';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
          const appsRes = await fetch(`${API_URL}/applications/company`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (appsRes.ok) {
            const appsData = await appsRes.json();
            setApplications(appsData.applications || []);
          }
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to load company dashboard', 'error');
      }
    };

    fetchData();
  }, [showToast]);

  const companyJobs = jobs.filter(
    (job) => job.createdBy === user?.id || job.createdBy === user?._id
  );
  const totalApplications = applications.filter((app) =>
    companyJobs.some((job) => String(app.job?._id) === String(job._id))
  );
  const totalViews = companyJobs.reduce((sum, job) => sum + (job.views || 0), 0);

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Company Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your job postings and applications</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{companyJobs.length}</span>
            </div>
            <h3 className="text-slate-600 font-medium">Active Jobs</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{totalApplications.length}</span>
            </div>
            <h3 className="text-slate-600 font-medium">Total Applications</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{totalViews}</span>
            </div>
            <h3 className="text-slate-600 font-medium">Profile Views</h3>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-md text-white hover:shadow-lg transition-all cursor-pointer"
               onClick={() => navigate('/company/post-job')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <PlusCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-semibold">Post New Job</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Job Postings</h2>
            <button
              onClick={() => navigate('/company/jobs')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {companyJobs.slice(0, 3).map((job) => {
              const jobApplications = totalApplications.filter(
                (app) => String(app.job?._id) === String(job._id)
              );
              return (
                <div
                  key={job._id}
                  onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
                  className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                        <span>•</span>
                        <span>
                          Posted{' '}
                          {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{jobApplications.length}</p>
                      <p className="text-sm text-slate-600">Applications</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {companyJobs.length === 0 && (
              <div className="text-center py-8">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No job postings yet</h3>
                <p className="text-slate-600 mb-6">Create your first job posting to start receiving applications</p>
                <button
                  onClick={() => navigate('/company/post-job')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Post Your First Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
