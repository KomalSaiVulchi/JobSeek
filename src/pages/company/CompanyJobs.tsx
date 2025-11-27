import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Users } from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { API_URL } from '../../lib/api';

export default function CompanyJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
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
        showToast('Failed to load company jobs', 'error');
      }
    };

    fetchData();
  }, [showToast]);

  const companyJobs = jobs.filter((job) => job.createdBy === user?.id || job.createdBy === user?._id);

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Job Postings</h1>
            <p className="text-slate-600 mt-2">Manage your active job listings</p>
          </div>
          <button
            onClick={() => navigate('/company/post-job')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105"
          >
            Post New Job
          </button>
        </div>

        <div className="space-y-4">
          {companyJobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
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
          ) : (
            companyJobs.map((job) => {
              const jobApplications = applications.filter((app) => String(app.job?._id) === String(job._id));

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                      <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {job.category}
                    </span>
                  </div>

                  <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">{jobApplications.length}</span>
                      <span className="text-slate-600">applications</span>
                    </div>
                    <button
                      onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Applicants
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
