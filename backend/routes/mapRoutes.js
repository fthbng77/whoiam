const express = require('express');
const router = express.Router();
const { 
    getAllMindMaps,
    getMindMapById,
    createMindMap,
    updateMindMap,
    deleteMindMap
} = require('../controllers/mapController');

// Get all mind maps
router.get('/', getAllMindMaps);

// Get a specific mind map
router.get('/:id', getMindMapById);

// Create a new mind map
router.post('/', createMindMap);

// Update a mind map
router.put('/:id', updateMindMap);

// Delete a mind map
router.delete('/:id', deleteMindMap);

module.exports = router;