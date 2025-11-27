import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, SlidersHorizontal } from 'lucide-react';
import Layout from '../../components/Layout';
import { useToast } from '../../context/ToastContext';

export default function JobsList() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/jobs`);
        if (!res.ok) {
          showToast('Failed to load jobs', 'error');
          return;
        }
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
        showToast('Something went wrong while loading jobs', 'error');
      }
    };

    fetchJobs();
  }, [API_URL, showToast]);

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = !typeFilter || job.type === typeFilter;
      const matchesCategory = !categoryFilter || job.category === categoryFilter;
      return matchesSearch && matchesLocation && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Browse Jobs</h1>
          <p className="text-slate-600 mt-2">Find your next opportunity from {jobs.length} available positions</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filters:</span>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
            >
              <option value="">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="Data Science">Data Science</option>
              <option value="Marketing">Marketing</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm ml-auto"
            >
              <option value="recent">Most Recent</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              onClick={() => navigate(`/applicant/jobs/${job._id}`)}
              className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                  <p className="text-lg text-slate-700 font-medium">{job.company || 'Company'}</p>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {job.category}
                </span>
              </div>

              <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>

              <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-slate-500">
                  Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
