import React from 'react';
import ReactFlow, { 
  Background,
  Controls,
  MiniMap
} from 'react-flow-renderer';

const MindMapCanvas = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default MindMapCanvas;
