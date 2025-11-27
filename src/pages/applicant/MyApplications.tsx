import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import { useToast } from '../../context/ToastContext';

export default function MyApplications() {
  const { showToast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState<'ongoing' | 'completed' | 'all'>('ongoing');
  const handleWithdraw = async (id: string) => {
    try {
      const token = localStorage.getItem('jobseek_token');
      if (!token) return;

      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        showToast('Failed to withdraw application', 'error');
        return;
      }

      setApplications((prev) => prev.filter((a) => a._id !== id));
      showToast('Application withdrawn', 'success');
    } catch (err) {
      console.error(err);
      showToast('Something went wrong while withdrawing application', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'reviewed': return <Eye className="w-5 h-5" />;
      case 'accepted': return <CheckCircle className="w-5 h-5" />;
      case 'rejected': return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const isOngoing = (status: string) => status === 'pending' || status === 'reviewed';
  const isCompleted = (status: string) => status === 'accepted' || status === 'rejected';

  const visibleApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    if (filter === 'ongoing') return isOngoing(app.status);
    if (filter === 'completed') return isCompleted(app.status);
    return true;
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('jobseek_token');
        if (!token) {
          return;
        }

        const res = await fetch(`${API_URL}/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          showToast('Failed to load applications', 'error');
          return;
        }

        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
        showToast('Something went wrong while loading applications', 'error');
      }
    };

    fetchApplications();
  }, [API_URL, showToast]);

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
            <p className="text-slate-600 mt-2">Track your job application status</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                filter === 'ongoing'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                filter === 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              All
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
            <p className="text-slate-600 text-sm">Total Applications</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <p className="text-2xl font-bold text-yellow-600">
              {applications.filter((a) => isOngoing(a.status)).length}
            </p>
            <p className="text-slate-600 text-sm">Ongoing</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <p className="text-2xl font-bold text-blue-600">
              {applications.filter((a) => a.status === 'reviewed').length}
            </p>
            <p className="text-slate-600 text-sm">Under Review</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <p className="text-2xl font-bold text-green-600">
              {applications.filter((a) => isCompleted(a.status)).length}
            </p>
            <p className="text-slate-600 text-sm">Completed</p>
          </div>
        </div>

        <div className="space-y-4">
          {visibleApplications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
              <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h3>
              <p className="text-slate-600 mb-6">Start applying to jobs to see them here</p>
              <button
                onClick={() => window.location.href = '/applicant/jobs'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            visibleApplications.map((application) => {
              const job = application.job;
              if (!job) return null;

              return (
                <div
                  key={application._id}
                  className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                      <p className="text-slate-600">{job.company || 'Company'}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="font-medium capitalize">{application.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                    <span>Applied: {new Date(application.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-2">Cover Letter:</p>
                    <p className="text-slate-600 text-sm line-clamp-2">{application.coverLetter}</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleWithdraw(application._id)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Withdraw Application
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
