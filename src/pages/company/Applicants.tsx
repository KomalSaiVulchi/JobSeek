import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Briefcase, FileText, CheckCircle, XCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import { useToast } from '../../context/ToastContext';

export default function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      try {
        const token = localStorage.getItem('jobseek_token');
        if (!token) return;

        const [jobsRes, appsRes] = await Promise.all([
          fetch(`${API_URL}/jobs`),
          fetch(`${API_URL}/applications/company`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          const foundJob = jobsData.find((j) => j._id === jobId);
          setJob(foundJob || null);
        }

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          const allApplications = appsData.applications || [];
          const filtered = allApplications.filter(
            (app) => app.job && String(app.job._id) === String(jobId)
          );
          setApplications(filtered);
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to load applicants', 'error');
      }
    };

    fetchData();
  }, [API_URL, jobId, showToast]);

  if (!job) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900">Job not found</h2>
        </div>
      </Layout>
    );
  }

  const handleStatusUpdate = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      const token = localStorage.getItem('jobseek_token');
      if (!token) {
        showToast('You must be logged in', 'error');
        return;
      }

      const res = await fetch(`${API_URL}/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to update status', 'error');
        return;
      }

      setApplications((prev) =>
        prev.map((app) =>
          String(app._id) === String(applicationId) ? { ...app, status } : app
        )
      );
      setSelectedApplicationId(null);
      showToast(`Application ${status}!`, status === 'accepted' ? 'success' : 'info');
    } catch (err) {
      console.error(err);
      showToast('Something went wrong while updating status', 'error');
    }
  };

  const selectedApp = applications.find(
    (app) => String(app._id) === String(selectedApplicationId)
  );

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div>
          <button
            onClick={() => navigate('/company/jobs')}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Jobs</span>
          </button>

          <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
          <p className="text-slate-600 mt-2">{applications.length} applications received</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Applicants</h2>

            {applications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No applications yet</p>
              </div>
            ) : (
              applications.map((application) => (
                <div
                  key={application._id}
                  onClick={() => setSelectedApplicationId(application._id)}
                  className={`bg-white rounded-xl shadow-md border p-4 cursor-pointer transition-all hover:shadow-lg ${
                    String(selectedApplicationId) === String(application._id)
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {application.applicant?.name || 'Applicant'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {application.applicant?.role === 'applicant' ? 'Job Seeker' : 'User'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Applied {new Date(application.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedApp ? (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 animate-fadeIn">
                <div className="flex items-start justify-between mb-6 pb-6 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {selectedApp.applicant?.name || 'Applicant'}
                    </h2>
                    <p className="text-slate-600 mb-3">
                      {selectedApp.applicant?.role === 'applicant' ? 'Job Seeker' : 'User'}
                    </p>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4" />
                      {selectedApp.applicant?.email && (
                        <a
                          href={`mailto:${selectedApp.applicant.email}`}
                          className="hover:text-blue-600"
                        >
                          {selectedApp.applicant.email}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-medium ${
                    selectedApp.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    selectedApp.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    selectedApp.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedApp.status}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                      <FileText className="w-5 h-5" />
                      Cover Letter
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700 leading-relaxed">
                        {selectedApp.coverLetter || 'No cover letter provided.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3">
                      <Briefcase className="w-5 h-5" />
                      Application Details
                    </h3>
                    <div className="space-y-2 text-slate-600">
                      <p>
                        Applied for:{' '}
                        <span className="font-medium text-slate-900">{job.title}</span>
                      </p>
                      <p>
                        Date Applied:{' '}
                        <span className="font-medium text-slate-900">
                          {new Date(selectedApp.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {selectedApp.status === 'pending' && (
                    <div className="flex gap-4 pt-6 border-t">
                      <button
                        onClick={() => handleStatusUpdate(selectedApp._id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApp._id, 'accepted')}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Select an applicant</h3>
                <p className="text-slate-600">Choose an applicant from the list to view their details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
