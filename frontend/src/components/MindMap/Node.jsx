import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const Node = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
      <Handle type="target" position={Position.Top} />
      <div className="font-bold">{data.label}</div>
      {data.content && (
        <div className="mt-2 text-sm text-gray-600">{data.content}</div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default Node;
