import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mindMapService } from '../services/api';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import Header from '../components/Layout/Header';

const Home = () => {
  const [mindMaps, setMindMaps] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMindMap, setNewMindMap] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchMindMaps();
  }, []);

  const fetchMindMaps = async () => {
    try {
      const response = await mindMapService.getAllMindMaps();
      setMindMaps(response.data);
    } catch (error) {
      console.error('Error fetching mind maps:', error);
    }
  };

  const handleCreateMindMap = async () => {
    try {
      await mindMapService.createMindMap({
        ...newMindMap,
        nodes: [{
          id: '1',
          type: 'default',
          data: { label: 'Ben Kimim?' },
          position: { x: 0, y: 0 }
        }],
        edges: []
      });
      setIsCreateModalOpen(false);
      setNewMindMap({ title: '', description: '' });
      fetchMindMaps();
    } catch (error) {
      console.error('Error creating mind map:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Zihin Haritalarım</h2>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Yeni Zihin Haritası
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mindMaps.map((mindMap) => (
              <Link
                key={mindMap._id}
                to={`/mindmap/${mindMap._id}`}
                className="block"
              >
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {mindMap.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {mindMap.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      Son güncelleme: {new Date(mindMap.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Yeni Zihin Haritası Oluştur"
      >
        <div className="mt-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Başlık
              </label>
              <input
                type="text"
                id="title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={newMindMap.title}
                onChange={(e) => setNewMindMap({ ...newMindMap, title: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={newMindMap.description}
                onChange={(e) => setNewMindMap({ ...newMindMap, description: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleCreateMindMap}>
              Oluştur
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
