import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';

export default function SearchBar() {
  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('toggle-command-palette'));
  };

  return (
    <button
      onClick={handleOpenSearch}
      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-300 hover:bg-earth-500/10 text-cream-200 hover:text-white dark:text-cream-300 dark:hover:text-white"
      aria-label="Search"
      title="Search (Ctrl+K)"
    >
      <IoSearchOutline size={22} />
    </button>
  );
}
