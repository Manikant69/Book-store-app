import React from 'react';

export function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="px-4 py-2 text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400 transition-colors duration-200"
    >
      {children}
    </a>
  );
}
