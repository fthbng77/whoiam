import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'react-flow-renderer';

const Edge = ({ id, sourceX, sourceY, targetX, targetY, label, ...props }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge path={edgePath} {...props} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: '#ffffff',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default Edge;
