import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import BookDetail from './pages/BookDetail.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-indigo-950 hover:text-indigo-700 transition-colors"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-serif text-base">
              L
            </span>
            <span>Athenaeum Library Catalog</span>
          </Link>
          <nav className="text-sm text-slate-600">
            <Link to="/" className="hover:text-indigo-600 font-medium">
              Browse Catalog
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        Athenaeum Library Management System &bull; Patron Catalog
      </footer>
    </div>
  );
}
