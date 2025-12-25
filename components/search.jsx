'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({ onQueryChange }) {
  const [query, setQuery] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onQueryChange(value); 
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        {/* Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        {/* Input */}
        <input
          type="text"
          id="search"
          placeholder="Search..."
          value={query}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-gray-900 shadow-sm transition duration-200 ease-in-out"
        />
      </div>
    </div>
  );
}
