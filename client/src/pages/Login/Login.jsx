import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';
import './Login.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function decodeTokenUser(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

function Login() {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const panelClass = isDark
    ? 'border-slate-700 bg-slate-900 text-slate-100'
    : 'border-slate-200 bg-white text-slate-900';

  const inputClass = isDark
    ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      const message = 'Please enter a valid email address.';
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email: normalizedEmail, password });
      const user = decodeTokenUser(data.token);
      login({ token: data.token, user });
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4 py-8 md:px-6">
        <div className={`rounded-3xl border p-6 shadow-sm md:p-8 ${panelClass}`}>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Access your MediConnect dashboard.
          </p>

          {error ? <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 flex flex-col space-y-4">
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              No account yet?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
            <p className="text-sm">
              <Link to="/forgot-password" title="Forgot Password" id="forgot-password-link" className="font-semibold text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
