import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBook() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/books/${id}`, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          throw new Error('Book not found.');
        }
        if (!res.ok) {
          throw new Error(`Failed to fetch book details (HTTP ${res.status})`);
        }

        const data = await res.json();
        setBook(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error loading book details.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBook();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto rounded-xl border border-slate-200 bg-white p-8 shadow-sm animate-pulse space-y-4">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="h-5 w-1/3 rounded bg-slate-200" />
        <div className="h-24 w-full rounded bg-slate-100 mt-6" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-3xl mx-auto rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-rose-800">
          {error || 'Book not found'}
        </h2>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          &larr; Back to Catalog
        </Link>
      </div>
    );
  }

  const isAvailable = (book.availableCopies ?? 0) > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        &larr; Back to Catalog
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {book.genre?.name || 'Uncategorized'}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isAvailable
              ? `Available (${book.availableCopies} of ${book.totalCopies} copies)`
              : 'Currently Checked Out'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {book.title}
        </h1>
        <p className="mt-1 text-lg text-slate-600 font-medium">
          by {book.author}
        </p>

        <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-slate-100 py-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-400">
              ISBN
            </dt>
            <dd className="mt-1 font-mono font-medium text-slate-800">
              {book.isbn}
            </dd>
          </div>
          {book.publishedYear && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">
                Published
              </dt>
              <dd className="mt-1 font-medium text-slate-800">
                {book.publishedYear}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-400">
              Total Copies
            </dt>
            <dd className="mt-1 font-medium text-slate-800">
              {book.totalCopies}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Synopsis
          </h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            {book.description || 'No description provided for this title.'}
          </p>
        </div>

        {book.reviews && book.reviews.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Reader Reviews ({book.reviews.length})
            </h2>
            <div className="space-y-3">
              {book.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg bg-slate-50 p-4 border border-slate-100"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {review.user?.name || 'Patron'}
                    </span>
                    <span>Rating: {review.rating} / 5</span>
                  </div>
                  {review.comment && (
                    <p className="mt-1.5 text-sm text-slate-700">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
