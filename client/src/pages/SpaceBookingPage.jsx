import React, { useState } from 'react';
import { useReadingList } from '../context/ReadingListContext.jsx';

const SPACES = [
  { id: 'quiet-study-a', label: 'Quiet Study Room A (Up to 4 people)' },
  { id: 'collaborative-pod-1', label: 'Collaborative Pod 1 (Up to 6 people)' },
  { id: 'research-carrel-3', label: 'Research Carrel 3 (Solo)' },
  { id: 'media-lab', label: 'Digital & Media Lab (Up to 8 people)' },
];

export default function SpaceBookingPage() {
  const { items: readingListBooks, removeBook, clearList } = useReadingList();

  const [space, setSpace] = useState(SPACES[0].id);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setConfirmation(null);

    if (!date || !startTime || !endTime) {
      setError('Please select a date, start time, and end time.');
      return;
    }

    if (endTime <= startTime) {
      setError('End time must be later than start time.');
      return;
    }

    const selectedSpace = SPACES.find((s) => s.id === space);
    setConfirmation({
      space: selectedSpace ? selectedSpace.label : space,
      date,
      startTime,
      endTime,
      borrowedBooksCount: readingListBooks.length,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Space Booking &amp; Borrow Request</h1>
        <p className="mt-1 text-sm text-slate-600">
          Reserve a study space and review books currently in your reading list.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </div>
        )}

        {confirmation && (
          <div
            role="status"
            className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            Booked <strong>{confirmation.space}</strong> on{' '}
            <strong>{confirmation.date}</strong> from{' '}
            <strong>{confirmation.startTime}</strong> to{' '}
            <strong>{confirmation.endTime}</strong> ({confirmation.borrowedBooksCount}{' '}
            reading list item(s) noted).
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="space-select" className="block text-sm font-medium text-slate-700">
              Study Space
            </label>
            <select
              id="space-select"
              value={space}
              onChange={(e) => setSpace(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {SPACES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="booking-date" className="block text-sm font-medium text-slate-700">
                Date
              </label>
              <input
                id="booking-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="start-time" className="block text-sm font-medium text-slate-700">
                Start Time
              </label>
              <input
                id="start-time"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="end-time" className="block text-sm font-medium text-slate-700">
                End Time
              </label>
              <input
                id="end-time"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Confirm Booking
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-900">
            Reading List ({readingListBooks.length})
          </h2>
          {readingListBooks.length > 0 && (
            <button
              type="button"
              onClick={clearList}
              className="text-xs font-medium text-rose-600 hover:text-rose-800"
            >
              Clear List
            </button>
          )}
        </div>

        {readingListBooks.length === 0 ? (
          <p className="text-sm text-slate-500">Your reading list is currently empty.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {readingListBooks.map((book) => (
              <li key={book.id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{book.title}</p>
                  {book.author && <p className="text-xs text-slate-500">{book.author}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => removeBook(book.id)}
                  className="text-xs font-medium text-slate-600 hover:text-rose-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}