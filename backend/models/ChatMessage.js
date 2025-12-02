const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    mindMapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MindMap',
        default: null
    }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
