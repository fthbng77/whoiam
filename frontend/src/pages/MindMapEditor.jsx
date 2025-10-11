import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, { 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges,
  addEdge,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../components/MindMap/CustomNode';
import EditorHeader from '../components/MindMap/EditorHeader';
import Modal from '../components/shared/Modal';
import { mindMapService } from '../services/api';
import { PlusIcon } from '@heroicons/react/24/outline';

const nodeTypes = {
  custom: CustomNode
};

const MindMapEditor = () => {
  const { id } = useParams();
  const [mindMap, setMindMap] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);

  useEffect(() => {
    fetchMindMap();
  }, [id]);

  const fetchMindMap = async () => {
    try {
      const response = await mindMapService.getMindMap(id);
      setMindMap(response.data);
      setNodes(response.data.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onEdit: () => handleEditNode(node),
          onDelete: () => handleDeleteNode(node.id)
        }
      })));
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

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, []);

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: 'Yeni Düşünce',
        content: '',
        onEdit: () => {},
        onDelete: () => {}
      }
    };

    newNode.data.onEdit = () => handleEditNode(newNode);
    newNode.data.onDelete = () => handleDeleteNode(newNode.id);

    setNodes((nds) => [...nds, newNode]);
  };

  const handleEditNode = (node) => {
    setEditingNode(node);
    setIsEditModalOpen(true);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const handleUpdateNode = (updatedData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === editingNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...updatedData,
                onEdit: node.data.onEdit,
                onDelete: node.data.onDelete
              }
            }
          : node
      )
    );
    setIsEditModalOpen(false);
  };

  const handleSave = async () => {
    try {
      await mindMapService.updateMindMap(id, {
        ...mindMap,
        nodes: nodes.map(({ data, ...node }) => ({
          ...node,
          data: {
            label: data.label,
            content: data.content
          }
        })),
        edges
      });
    } catch (error) {
      console.error('Error saving mind map:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <EditorHeader
        title={mindMap?.title}
        onSave={handleSave}
        onSettings={() => {}}
      />
      <div className="flex-grow relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="mindmap-container"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
        <button
          onClick={handleAddNode}
          className="absolute bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Düğümü Düzenle"
      >
        <div className="mt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Başlık
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingNode?.data.label || ''}
                onChange={(e) =>
                  setEditingNode({
                    ...editingNode,
                    data: { ...editingNode.data, label: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                İçerik
              </label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingNode?.data.content || ''}
                onChange={(e) =>
                  setEditingNode({
                    ...editingNode,
                    data: { ...editingNode.data, content: e.target.value }
                  })
                }
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              onClick={() => handleUpdateNode(editingNode.data)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MindMapEditor;
