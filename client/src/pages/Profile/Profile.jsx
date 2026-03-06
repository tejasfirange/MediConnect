import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, UserCircle, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function Profile() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    dob: '',
    gender: '',
    contact_no: '',
    registration_no: '',
    qualification: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [user?.role]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'doctor' ? '/doctor/me' : '/patient/me';
      const response = await api.get(endpoint);
      const data = user?.role === 'doctor' ? response.data.doctor : response.data.patient;
      
      setProfile({
        name: data.name || '',
        dob: data.dob ? data.dob.split('T')[0] : '',
        gender: data.gender || '',
        contact_no: data.contact_no || '',
        registration_no: data.registration_no || '',
        qualification: data.qualification || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
      toast.error('Could not load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const endpoint = user?.role === 'doctor' ? '/doctor/update' : '/patient/update';
      await api.put(endpoint, profile);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Manage your personal information and account security.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100 border shadow-sm'
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className={`overflow-hidden rounded-3xl border shadow-xl ${isDark ? 'border-slate-800 bg-slate-900 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/50'}`}>
          <div className="p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="relative">
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {profile.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold">{profile.name || 'Set your name'}</h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user?.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {user?.role === 'doctor' ? 'Medical Professional' : 'Patient Account'}
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="mt-12 space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold ml-1">
                    <User size={16} className="text-blue-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10 ${
                      isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold ml-1">
                    <Phone size={16} className="text-blue-500" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={profile.contact_no}
                    onChange={(e) => setProfile({ ...profile, contact_no: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10 ${
                      isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder="+91 00000 00000"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold ml-1">
                    <Calendar size={16} className="text-blue-500" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10 ${
                      isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold ml-1">
                    <UserCircle size={16} className="text-blue-500" />
                    Gender
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10 ${
                      isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Doctor Specific Fields */}
                {user?.role === 'doctor' && (
                  <>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold ml-1">
                        Medical License / Reg No.
                      </label>
                      <input
                        type="text"
                        value={profile.registration_no}
                        onChange={(e) => setProfile({ ...profile, registration_no: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10 ${
                          isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                        }`}
                        placeholder="e.g. MMC-2024-X12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold ml-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        value={profile.qualification}
                        onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-blue-500/10 ${
                          isDark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                        }`}
                        placeholder="e.g. M.B.B.S, M.D."
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:opacity-70 active:scale-[0.98]"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Profile;
