import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { registerStepOne, registerStepTwo } from '../../services/authService';
import './Register.css';

const initialStepOne = { email: '', password: '', confirmPassword: '' };
const initialDetails = {
  name: '',
  dob: '',
  gender: '',
  contact_no: '',
  registration_no: '',
  qualification: '',
};

function Register() {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stepOne, setStepOne] = useState(initialStepOne);
  const [role, setRole] = useState('patient');
  const [details, setDetails] = useState(initialDetails);
  const [registrationToken, setRegistrationToken] = useState('');

  const panelClass = isDark
    ? 'border-slate-700 bg-slate-900 text-slate-100'
    : 'border-slate-200 bg-white text-slate-900';

  const inputClass = isDark
    ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400';

  const handleStepOneSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (stepOne.password.length < 6) {
      const message = 'Password must be at least 6 characters.';
      setError(message);
      toast.error(message);
      return;
    }

    if (stepOne.password !== stepOne.confirmPassword) {
      const message = 'Password and confirm password do not match.';
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);
      const data = await registerStepOne({
        email: stepOne.email.trim(),
        password: stepOne.password,
      });

      setRegistrationToken(data.registrationToken);
      setStep(2);
      toast.success('Step 1 complete. Please add your profile details.');
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStepTwoSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!details.name.trim()) {
      const message = 'Name is required.';
      setError(message);
      toast.error(message);
      return;
    }

    if (role === 'doctor' && !details.registration_no.trim()) {
      const message = 'Doctor registration number is required.';
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        registrationToken,
        role,
        details: {
          name: details.name.trim(),
          dob: details.dob || null,
          gender: details.gender || null,
          contact_no: details.contact_no || null,
          ...(role === 'doctor'
            ? {
                registration_no: details.registration_no || null,
                qualification: details.qualification || null,
              }
            : {}),
        },
      };

      const data = await registerStepTwo(payload);
      login({ token: data.token, user: data.user });
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`register-page min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-8 md:px-6">
        <div className={`rounded-3xl border p-6 shadow-sm md:p-8 ${panelClass}`}>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {step === 1 ? 'Step 1: Email and password' : 'Step 2: Role and profile details'}
          </p>

          <div className="mt-4 flex gap-2 text-xs font-semibold">
            <span className={`rounded-full px-3 py-1 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
            <span className={`rounded-full px-3 py-1 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
          </div>

          {error ? <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          {step === 1 ? (
            <form onSubmit={handleStepOneSubmit} className="mt-6 space-y-4">
              <input
                type="email"
                required
                value={stepOne.email}
                onChange={(e) => setStepOne((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
              />
              <input
                type="password"
                required
                value={stepOne.password}
                onChange={(e) => setStepOne((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
              />
              <input
                type="password"
                required
                value={stepOne.confirmPassword}
                onChange={(e) => setStepOne((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm password"
                className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Please wait...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleStepTwoSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                    role === 'patient'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : isDark
                        ? 'border-slate-600 text-slate-200'
                        : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                    role === 'doctor'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : isDark
                        ? 'border-slate-600 text-slate-200'
                        : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Doctor
                </button>
              </div>

              <input
                type="text"
                required
                value={details.name}
                onChange={(e) => setDetails((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Full name"
                className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  type="date"
                  value={details.dob}
                  onChange={(e) => setDetails((prev) => ({ ...prev, dob: e.target.value }))}
                  className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
                />
                <select
                  value={details.gender}
                  onChange={(e) => setDetails((prev) => ({ ...prev, gender: e.target.value }))}
                  className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <input
                type="text"
                value={details.contact_no}
                onChange={(e) => setDetails((prev) => ({ ...prev, contact_no: e.target.value }))}
                placeholder="Contact number"
                className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
              />

              {role === 'doctor' ? (
                <>
                  <input
                    type="text"
                    value={details.registration_no}
                    onChange={(e) => setDetails((prev) => ({ ...prev, registration_no: e.target.value }))}
                    placeholder="Medical registration number"
                    className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
                  />
                  <input
                    type="text"
                    value={details.qualification}
                    onChange={(e) => setDetails((prev) => ({ ...prev, qualification: e.target.value }))}
                    placeholder="Qualification"
                    className={`w-full rounded-xl border px-4 py-3 outline-none ring-blue-300 focus:ring ${inputClass}`}
                  />
                </>
              ) : null}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`w-1/3 rounded-xl border px-4 py-3 font-semibold ${isDark ? 'border-slate-600 text-slate-100' : 'border-slate-300 text-slate-700'}`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Creating account...' : 'Complete registration'}
                </button>
              </div>
            </form>
          )}

          <p className={`mt-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
