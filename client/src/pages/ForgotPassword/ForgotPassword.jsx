import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { forgotPassword } from '../../services/authService';

function ForgotPassword() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
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
    setLoading(true);
    setMessage('');

    try {
      const data = await forgotPassword({ email: email.trim().toLowerCase() });
      setMessage(data.message || 'Reset link sent successfully. Check your email.');
      toast.success('Reset link sent successfully');
    } catch (err) {
      const errorMsg = err.message || 'Server error. Try again later.';
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`forgot-password-page min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-8">
        <div className={`w-full rounded-3xl border p-6 shadow-sm md:p-8 ${panelClass}`}>
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Enter your email to receive a reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-center text-sm font-medium ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;