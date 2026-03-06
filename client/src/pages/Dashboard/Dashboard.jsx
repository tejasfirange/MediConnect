import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className={`dashboard-page min-h-screen pb-24 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <div className={`rounded-3xl border p-6 md:p-8 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Welcome to MediConnect.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
              <p className="text-xs uppercase tracking-wide text-blue-600">Email</p>
              <p className="mt-1 font-medium">{user?.email || '-'}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
              <p className="text-xs uppercase tracking-wide text-blue-600">Role</p>
              <p className="mt-1 font-medium capitalize">{user?.role || '-'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/assessment" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Start Assessment
            </Link>
            <Link to="/history" className="rounded-xl border border-blue-300 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              Past History
            </Link>
            <button
              onClick={handleLogout}
              className={`rounded-xl border px-5 py-3 text-sm font-semibold ${isDark ? 'border-slate-600 text-slate-100' : 'border-slate-300 text-slate-700'}`}
            >
              Logout
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
