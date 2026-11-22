import React, { useState, useEffect } from 'react';
import BookCard from './BookCard.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 w-24 rounded-full bg-slate-200" />
        <div className="h-5 w-20 rounded-full bg-slate-200" />
      </div>
      <div className="h-5 w-3/4 rounded bg-slate-200 mb-2" />
      <div className="h-4 w-1/2 rounded bg-slate-200 mb-4" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
      </div>
      <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between">
        <div className="h-3 w-28 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function BookGrid({ genreId, search, sortBy = 'title' }) {
  const [books, setBooks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [genreId, search, sortBy]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (genreId) params.set('genreId', genreId);
        if (search && search.trim()) params.set('search', search.trim());
        if (sortBy) params.set('sortBy', sortBy);
        params.set('page', String(page));
        params.set('limit', '12');

        const response = await fetch(`${API_URL}/books?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch catalog (HTTP ${response.status})`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload) ? payload : payload.data || [];
        setBooks(items);
        setMeta(payload.meta || null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load books from the server.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBooks();
    return () => controller.abort();
  }, [genreId, search, sortBy, page]);

  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading books"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center"
      >
        <h3 className="text-base font-semibold text-rose-800">
          Could not load the book catalog
        </h3>
        <p className="mt-1 text-sm text-rose-600">{error}</p>
        <p className="mt-2 text-xs text-rose-500">
          Make sure the NestJS backend is running at {API_URL}.
        </p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <h3 className="text-base font-semibold text-slate-900">No books found</h3>
        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your search query or clearing the selected genre filter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {meta && (
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium text-slate-700">{books.length}</span> of{' '}
          <span className="font-medium text-slate-700">{meta.total}</span> books
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
