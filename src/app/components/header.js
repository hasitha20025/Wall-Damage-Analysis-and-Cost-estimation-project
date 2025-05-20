import React from 'react';

export default function Header() {
  return (
    <header className="bg-primary fixed top-0 left-0 w-full text-white py-3 px-4 shadow-md z-50">
      <div className="relative flex items-center justify-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
          Wall Damage Analysis and Cost Estimation
        </h1>
        <a
          href="#settings"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-xl sm:text-2xl cursor-pointer"
          aria-label="Settings"
        >
          ⚙️
        </a>
      </div>
    </header>
  );
}
