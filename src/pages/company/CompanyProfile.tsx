import { useEffect, useState } from 'react';
import { Mail, MapPin, Building2, Users, Globe, FileText } from 'lucide-react';
import Layout from '../../components/Layout';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function CompanyProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [profile, setProfile] = useState({
    companyName: '',
    industry: '',
    email: '',
    location: '',
    size: '',
    website: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jobseek_token');
        if (!token) return;

        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;
        const data = await res.json();
        const cp = data.companyProfile || {};
        setProfile({
          companyName: cp.companyName || data.name || '',
          industry: cp.industry || '',
          email: cp.email || data.email || '',
          location: cp.location || '',
          size: cp.size || '',
          website: cp.website || '',
          description: cp.description || '',
        });
      } catch (err) {
        console.error(err);
        showToast('Failed to load company profile', 'error');
      }
    };

    fetchProfile();
  }, [API_URL, showToast]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('jobseek_token');
      if (!token) return;

      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.companyName,
          companyProfile: profile,
        }),
      });

      if (!res.ok) {
        showToast('Failed to update profile', 'error');
        return;
      }

      setIsEditing(false);
      showToast('Company profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Something went wrong while updating profile', 'error');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Company Profile</h1>
            <p className="text-slate-600 mt-2">Manage your company information</p>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
              {profile.companyName.charAt(0)}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  className="text-2xl font-bold text-slate-900 border-b-2 border-blue-600 focus:outline-none w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-slate-900">{profile.companyName}</h2>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="text-slate-600 mt-1 border-b border-slate-300 focus:outline-none w-full"
                />
              ) : (
                <p className="text-slate-600 mt-1">{profile.industry}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900">{profile.location}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Users className="w-4 h-4" />
                Company Size
              </label>
              {isEditing ? (
                <select
                  value={profile.size}
                  onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-100 employees</option>
                  <option>100-500 employees</option>
                  <option>500+ employees</option>
                </select>
              ) : (
                <p className="text-slate-900">{profile.size}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Globe className="w-4 h-4" />
                Website
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              ) : (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  {profile.website}
                </a>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Building2 className="w-4 h-4" />
                Industry
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900">{profile.industry}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <FileText className="w-4 h-4" />
                About Company
              </label>
              {isEditing ? (
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  rows={4}
                />
              ) : (
                <p className="text-slate-900">{profile.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
