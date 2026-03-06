import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { resetPassword } from '../../services/authService';

function ResetPassword() {
  const { isDark } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const panelClass = isDark
    ? 'border-slate-700 bg-slate-900 text-slate-100'
    : 'border-slate-200 bg-white text-slate-900';

  const inputClass = isDark
    ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      const msg = 'Passwords do not match';
      setMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const data = await resetPassword(token, { newPassword: password });
      setMessage(data.message || 'Password reset successful!');
      toast.success('Password reset successfully');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.message || 'Server error. Try again later.';
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`reset-password-page min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-8">
        <div className={`w-full rounded-3xl border p-6 shadow-sm md:p-8 ${panelClass}`}>
          <h1 className="text-2xl font-bold">New password</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Enter your new credentials below.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
            />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-center text-sm font-medium ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline">
              Cancel and back to sign in
            </Link>
          </div>
        </div>
      </main>
    </div>

  );
}

export default ResetPassword;