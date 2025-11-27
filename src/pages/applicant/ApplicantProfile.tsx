import { useEffect, useState } from 'react';
import { API_URL } from '../../lib/api';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, FileText } from 'lucide-react';
import Layout from '../../components/Layout';
import { useToast } from '../../context/ToastContext';

export default function ApplicantProfile() {
  const { showToast } = useToast();
  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    experience: '',
    education: '',
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
        const ap = data.applicantProfile || {};
        setProfile({
          name: data.name || '',
          title: ap.title || '',
          email: ap.email || data.email || '',
          phone: ap.phone || '',
          location: ap.location || '',
          skills: Array.isArray(ap.skills) ? ap.skills : [],
          experience: ap.experience || '',
          education: ap.education || '',
        });
      } catch (err) {
        console.error(err);
        showToast('Failed to load profile', 'error');
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
          name: profile.name,
          applicantProfile: {
            title: profile.title,
            email: profile.email,
            phone: profile.phone,
            location: profile.location,
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
          },
        }),
      });

      if (!res.ok) {
        showToast('Failed to update profile', 'error');
        return;
      }

      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
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
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-600 mt-2">Manage your professional information</p>
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
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="text-2xl font-bold text-slate-900 border-b-2 border-blue-600 focus:outline-none w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="text-slate-600 mt-1 border-b border-slate-300 focus:outline-none w-full"
                />
              ) : (
                <p className="text-slate-600 mt-1">{profile.title}</p>
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
                <Phone className="w-4 h-4" />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900">{profile.phone}</p>
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
                <Briefcase className="w-4 h-4" />
                Skills
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.skills.join(', ')}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Separate skills with commas"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <FileText className="w-4 h-4" />
                Experience
              </label>
              {isEditing ? (
                <textarea
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  rows={3}
                />
              ) : (
                <p className="text-slate-900">{profile.experience}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <GraduationCap className="w-4 h-4" />
                Education
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.education}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900">{profile.education}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
