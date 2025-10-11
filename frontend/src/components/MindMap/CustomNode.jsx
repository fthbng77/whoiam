import React, { useState } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const NodeToolbar = ({ onEdit, onDelete }) => {
  return (
    <div className="node-toolbar">
      <button className="toolbar-button" onClick={onEdit}>
        <PencilIcon className="w-4 h-4" />
      </button>
      <button className="toolbar-button" onClick={onDelete}>
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const CustomNode = ({ data, selected }) => {
  const [showToolbar, setShowToolbar] = useState(false);

  return (
    <div
      className={`custom-node ${selected ? 'node-selected' : ''}`}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
    >
      {showToolbar && (
        <NodeToolbar
          onEdit={() => data.onEdit()}
          onDelete={() => data.onDelete()}
        />
      )}
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="font-medium text-gray-800">{data.label}</div>
        {data.content && (
          <div className="mt-2 text-sm text-gray-500">{data.content}</div>
        )}
      </div>
    </div>
  );
};

export default CustomNode;