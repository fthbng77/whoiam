const MindMap = require('../models/MindMap');

// Get all mind maps
const getAllMindMaps = async (req, res) => {
    try {
        const mindMaps = await MindMap.find().sort({ lastModified: -1 });
        res.json(mindMaps);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mind maps', error: error.message });
    }
};

// Get a specific mind map by ID
const getMindMapById = async (req, res) => {
    try {
        const mindMap = await MindMap.findById(req.params.id);
        if (!mindMap) {
            return res.status(404).json({ message: 'Mind map not found' });
        }
        res.json(mindMap);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mind map', error: error.message });
    }
};

// Create a new mind map
const createMindMap = async (req, res) => {
    try {
        const { title, description, nodes, edges } = req.body;
        const mindMap = new MindMap({
            title,
            description,
            nodes: nodes || [],
            edges: edges || []
        });
        
        const savedMindMap = await mindMap.save();
        res.status(201).json(savedMindMap);
    } catch (error) {
        res.status(400).json({ message: 'Error creating mind map', error: error.message });
    }
};

// Update a mind map
const updateMindMap = async (req, res) => {
    try {
        const { title, description, nodes, edges } = req.body;
        const mindMap = await MindMap.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                nodes,
                edges,
                lastModified: Date.now()
            },
            { new: true }
        );
        
        if (!mindMap) {
            return res.status(404).json({ message: 'Mind map not found' });
        }
        
        res.json(mindMap);
    } catch (error) {
        res.status(400).json({ message: 'Error updating mind map', error: error.message });
    }
};

// Delete a mind map
const deleteMindMap = async (req, res) => {
    try {
        const mindMap = await MindMap.findByIdAndDelete(req.params.id);
        
        if (!mindMap) {
            return res.status(404).json({ message: 'Mind map not found' });
        }
        
        res.json({ message: 'Mind map deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting mind map', error: error.message });
    }
};

module.exports = {
    getAllMindMaps,
    getMindMapById,
    createMindMap,
    updateMindMap,
    deleteMindMap
};