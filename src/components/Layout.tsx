import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">{children}</div>;
  }

  const isApplicant = user?.role === 'applicant';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-800">JobSeek</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(isApplicant ? '/applicant/dashboard' : '/company/dashboard')}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>

              {isApplicant ? (
                <>
                  <button
                    onClick={() => navigate('/applicant/jobs')}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">Jobs</span>
                  </button>
                  <button
                    onClick={() => navigate('/applicant/applications')}
                    className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    My Applications
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/company/jobs')}
                    className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    My Jobs
                  </button>
                  <button
                    onClick={() => navigate('/company/post-job')}
                    className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Post Job
                  </button>
                </>
              )}

              <button
                onClick={() => navigate(isApplicant ? '/applicant/profile' : '/company/profile')}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
