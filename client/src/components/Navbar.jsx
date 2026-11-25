import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const { readingList, clearList } = useReadingList();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearList();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-indigo-950 hover:text-indigo-700 transition-colors"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-serif text-base">
            L
          </span>
          <span>Athenaeum Library Catalog</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="font-medium text-slate-700 hover:text-indigo-600">
            Catalog
          </Link>
          <Link to="/booking" className="font-medium text-slate-700 hover:text-indigo-600">
            Book a Space
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <span>Reading List</span>
            <span
              data-testid="reading-list-count"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 text-white w-5 h-5 text-[11px]"
            >
              {readingList.length}
            </span>
          </span>

          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}