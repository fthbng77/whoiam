import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Ben Kimim?</h2>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link
            to="/"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Ana Sayfa
          </Link>
          {/* Diğer menü öğeleri buraya eklenebilir */}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;