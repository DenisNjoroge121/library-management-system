import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const isAvailable = (book.availableCopies ?? 0) > 0;

  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            {book.genre?.name || 'Uncategorized'}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isAvailable
              ? `${book.availableCopies} of ${book.totalCopies} available`
              : 'Checked out'}
          </span>
        </div>

        <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-slate-600 font-medium">{book.author}</p>

        {book.description && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>ISBN: {book.isbn}</span>
        <span className="font-medium text-indigo-600 group-hover:translate-x-0.5 transition-transform">
          View details &rarr;
        </span>
      </div>
    </Link>
  );
}
