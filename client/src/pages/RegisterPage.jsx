import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mergeGuestListOnLogin } = useReadingList();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
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
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Create Patron Account</h1>
      <p className="mt-1 text-sm text-slate-600">
        Register to save books to your reading list and book study rooms.
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
          <label htmlFor="register-name" className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="register-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ada@library.local"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}