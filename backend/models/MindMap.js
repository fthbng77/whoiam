const mongoose = require('mongoose');

const mindMapSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    nodes: [{
        id: String,
        type: String,
        data: {
            label: String,
            content: String
        },
        position: {
            x: Number,
            y: Number
        }
    }],
    edges: [{
        id: String,
        source: String,
        target: String,
        type: String,
        label: String
    }],
    lastModified: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('MindMap', mindMapSchema);