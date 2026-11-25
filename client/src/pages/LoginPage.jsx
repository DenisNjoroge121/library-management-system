import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mergeGuestListOnLogin } = useReadingList();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      const token = data.access_token || data.token;
      if (token) {
        localStorage.setItem('token', token);
      }

      const userEmail = data.user?.email || email;
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      mergeGuestListOnLogin(userEmail);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
      <p className="mt-1 text-sm text-slate-600">
        Log in to manage your reading list and reserve library study spaces.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="patron@library.local"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-800">
          Register here
        </Link>
      </p>
    </div>
  );
}