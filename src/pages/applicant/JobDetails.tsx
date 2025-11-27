import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Building2, ArrowLeft, X } from 'lucide-react';
import Layout from '../../components/Layout';
import { useToast } from '../../context/ToastContext';
import { API_URL } from '../../lib/api';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API_URL}/jobs`);
        if (!res.ok) {
          showToast('Failed to load job', 'error');
          return;
        }
        const data = await res.json();
        const found = data.find((j) => j._id === id);
        setJob(found || null);

        // Increment views for this job when opened
        if (id) {
          fetch(`${API_URL}/jobs/${id}/view`, { method: 'POST' }).catch(() => {});
        }
      } catch (err) {
        console.error(err);
        showToast('Something went wrong while loading job', 'error');
      }
    };

    if (id) {
      fetchJob();
    }
  }, [API_URL, id, showToast]);

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      showToast('Please write a cover letter', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('jobseek_token');
      if (!token) {
        showToast('You must be logged in to apply', 'error');
        return;
      }

      const res = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: id, coverLetter }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        showToast(error.error || 'Failed to submit application', 'error');
        return;
      }

      showToast('Application submitted successfully!', 'success');
      setShowApplyModal(false);
      setCoverLetter('');
      setTimeout(() => navigate('/applicant/applications'), 1000);
    } catch (err) {
      console.error(err);
      showToast('Something went wrong while submitting application', 'error');
    }
  };

  if (!job) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-900">Job not found</h2>
          <button
            onClick={() => navigate('/applicant/jobs')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to jobs
          </button>
        </div>
      </Layout>
    );
  }
  const requirementsRaw = job && job.requirements !== undefined ? job.requirements : [];
  const requirements = Array.isArray(requirementsRaw)
    ? requirementsRaw
    : typeof requirementsRaw === 'string' && requirementsRaw.trim()
      ? requirementsRaw.split('\n')
      : [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <button
          onClick={() => navigate('/applicant/jobs')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Jobs</span>
        </button>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
              <p className="text-xl text-slate-700 font-medium">{job.company || 'Company'}</p>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {job.category}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8 pb-8 border-b">
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="w-5 h-5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Briefcase className="w-5 h-5" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <DollarSign className="w-5 h-5" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="w-5 h-5" />
              <span>Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Job Description</h2>
              <p className="text-slate-700 leading-relaxed">{job.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Requirements</h2>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                    <span className="text-slate-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Experience Level</h2>
              <p className="text-slate-700">{job.experience || 'Not specified'}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105"
            >
              Apply for this Position
            </button>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 animate-slideIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Apply for {job.title}</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">{job.company || 'Company'}</span>
                </div>
                <p className="text-slate-600">{job.location} • {job.type}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Tell us why you're a great fit for this position..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
