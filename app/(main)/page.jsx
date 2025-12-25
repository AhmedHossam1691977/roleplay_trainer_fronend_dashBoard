'use client';
import React, { useState, useEffect } from 'react';
import SearchInput from '../../components/search.jsx';

export default function Home() {
  const [text, setText] = useState('');

  useEffect(() => {
    console.log('Parent received text:', text);
  }, [text]);

  return (
    <div className='p-6'>
      <SearchInput  onQueryChange={setText} />
    </div>
  );
}
