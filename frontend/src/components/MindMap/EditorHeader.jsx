import React from 'react';
import { ChevronLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const EditorHeader = ({ title, onSave, onSettings }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-gray-500 hover:text-gray-700">
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Geri Dön
            </Link>
            <h1 className="ml-8 text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kaydet
            </button>
            <button
              onClick={onSettings}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;