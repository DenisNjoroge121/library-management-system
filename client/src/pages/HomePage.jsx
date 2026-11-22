import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import BookGrid from '../components/BookGrid.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function HomePage() {
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    async function loadGenres() {
      try {
        const res = await fetch(`${API_URL}/genres`);
        if (res.ok) {
          const data = await res.json();
          setGenres(data);
        }
      } catch {
        // Genre filter degrades gracefully if genres fail to load
      }
    }
    loadGenres();
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Library Book Catalog</h1>
        <p className="mt-1 text-sm text-slate-600">
          Browse our collection, filter by genre, or search by title and author.
        </p>

        <div className="mt-5 flex flex-col md:flex-row gap-3">
          <SearchBar initialValue={searchTerm} onSearch={handleSearch} />

          <div className="flex flex-col sm:flex-row gap-3">
            <div>
              <label htmlFor="genre-filter" className="sr-only">
                Filter by Genre
              </label>
              <select
                id="genre-filter"
                value={selectedGenreId}
                onChange={(e) => setSelectedGenreId(e.target.value)}
                className="w-full sm:w-48 rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort-select" className="sr-only">
                Sort books by
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-44 rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="title">Sort: Title (A–Z)</option>
                <option value="author">Sort: Author (A–Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <BookGrid
        genreId={selectedGenreId}
        search={searchTerm}
        sortBy={sortBy}
      />
    </div>
  );
}
