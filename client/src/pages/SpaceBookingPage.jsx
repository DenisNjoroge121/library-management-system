import React, { useState } from 'react';
import { useReadingList } from '../context/ReadingListContext.jsx';

export default function SpaceBookingPage() {
  const [form, setForm] = useState({
    spaceId: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  const [submitted, setSubmitted] = useState(null);
  const { readingList, removeBook, clearList } = useReadingList();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted({
      ...form,
      booksCount: readingList.length,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Request Space Booking</h1>
        <p className="mt-1 text-sm text-slate-600">
          Choose a study space and pick your date and time slot.
        </p>

        {submitted && (
          <div
            role="status"
            className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            Booking requested for space <strong>{submitted.spaceId}</strong> on{' '}
            <strong>{submitted.date}</strong> ({submitted.startTime} -{' '}
            {submitted.endTime}).
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="spaceId" className="block text-sm font-medium text-slate-700">
              Study Space
            </label>
            <select
              id="spaceId"
              name="spaceId"
              value={form.spaceId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Select a study space</option>
              <option value="1">Room A (4 seats)</option>
              <option value="2">Room B (6 seats)</option>
              <option value="3">Quiet Study Booth (1 seat)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">
                Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-slate-700">
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-slate-700">
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Request Booking
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-900">
            Reading List ({readingList.length})
          </h2>
          {readingList.length > 0 && (
            <button
              type="button"
              onClick={clearList}
              className="text-xs font-medium text-rose-600 hover:text-rose-800"
            >
              Clear List
            </button>
          )}
        </div>

        {readingList.length === 0 ? (
          <p className="text-sm text-slate-500">No books in your reading list yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {readingList.map((book) => (
              <li key={book.id} className="py-2.5 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">{book.title}</span>
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