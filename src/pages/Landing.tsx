import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Building2, TrendingUp } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-800">JobSeek</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-slate-700 font-medium hover:text-blue-600 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Find Your Dream Job or Perfect Candidate
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Connect talented professionals with leading companies. Your next career move
            or ideal hire is just a click away.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105"
            >
              Explore Jobs
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Job Seekers</h3>
            <p className="text-slate-600">
              Browse thousands of opportunities, apply with ease, and track your applications in one place.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Employers</h3>
            <p className="text-slate-600">
              Post jobs, reach qualified candidates, and build your dream team with our powerful platform.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Matching</h3>
            <p className="text-slate-600">
              Our intelligent system helps connect the right talent with the right opportunities efficiently.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
