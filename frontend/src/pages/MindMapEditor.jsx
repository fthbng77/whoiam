import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  Controls,
  Background
} from 'react-flow-renderer';
import Header from '../components/Layout/Header';
import Button from '../components/shared/Button';
import Node from '../components/MindMap/Node';
import Edge from '../components/MindMap/Edge';
import { mindMapService } from '../services/api';

const nodeTypes = {
  custom: Node,
};

const edgeTypes = {
  custom: Edge,
};

const MindMapEditor = () => {
  const { id } = useParams();
  const [mindMap, setMindMap] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetchMindMap();
  }, [id]);

  const fetchMindMap = async () => {
    try {
      const response = await mindMapService.getMindMap(id);
      setMindMap(response.data);
      setNodes(response.data.nodes);
      setEdges(response.data.edges);
    } catch (error) {
      console.error('Error fetching mind map:', error);
    }
  };

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const addNode = () => {
    const newNode = {
      id: `${Date.now()}`,
      type: 'custom',
      data: { label: 'Yeni Düşünce' },
      position: { x: 100, y: 100 }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = async () => {
    try {
      await mindMapService.updateMindMap(id, {
        ...mindMap,
        nodes,
        edges
      });
    } catch (error) {
      console.error('Error saving mind map:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold">{mindMap?.title}</h2>
        <div className="space-x-4">
          <Button onClick={addNode} variant="secondary">
            Düğüm Ekle
          </Button>
          <Button onClick={handleSave}>
            Kaydet
          </Button>
        </div>
      </div>
      <div className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default MindMapEditor;
