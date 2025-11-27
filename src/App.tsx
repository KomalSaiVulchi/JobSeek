import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

import ApplicantDashboard from './pages/applicant/ApplicantDashboard';
import ApplicantProfile from './pages/applicant/ApplicantProfile';
import JobsList from './pages/applicant/JobsList';
import JobDetails from './pages/applicant/JobDetails';
import MyApplications from './pages/applicant/MyApplications';

import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import PostJob from './pages/company/PostJob';
import CompanyJobs from './pages/company/CompanyJobs';
import Applicants from './pages/company/Applicants';

function ProtectedRoute({ children, roleRequired }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated
            ? user?.role === 'applicant'
              ? <Navigate to="/applicant/dashboard" />
              : <Navigate to="/company/dashboard" />
            : <Landing />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/applicant/dashboard" element={
        <ProtectedRoute roleRequired="applicant">
          <ApplicantDashboard />
        </ProtectedRoute>
      } />
      <Route path="/applicant/profile" element={
        <ProtectedRoute roleRequired="applicant">
          <ApplicantProfile />
        </ProtectedRoute>
      } />
      <Route path="/applicant/jobs" element={
        <ProtectedRoute roleRequired="applicant">
          <JobsList />
        </ProtectedRoute>
      } />
      <Route path="/applicant/jobs/:id" element={
        <ProtectedRoute roleRequired="applicant">
          <JobDetails />
        </ProtectedRoute>
      } />
      <Route path="/applicant/applications" element={
        <ProtectedRoute roleRequired="applicant">
          <MyApplications />
        </ProtectedRoute>
      } />

      <Route path="/company/dashboard" element={
        <ProtectedRoute roleRequired="company">
          <CompanyDashboard />
        </ProtectedRoute>
      } />
      <Route path="/company/profile" element={
        <ProtectedRoute roleRequired="company">
          <CompanyProfile />
        </ProtectedRoute>
      } />
      <Route path="/company/post-job" element={
        <ProtectedRoute roleRequired="company">
          <PostJob />
        </ProtectedRoute>
      } />
      <Route path="/company/jobs" element={
        <ProtectedRoute roleRequired="company">
          <CompanyJobs />
        </ProtectedRoute>
      } />
      <Route path="/company/jobs/:jobId/applicants" element={
        <ProtectedRoute roleRequired="company">
          <Applicants />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
