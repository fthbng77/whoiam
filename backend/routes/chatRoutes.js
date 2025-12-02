const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Chat mesajı gönder
router.post('/send', chatController.sendMessage);

// Konuşma geçmişi getir
router.get('/conversation/:conversationId', chatController.getConversation);

module.exports = router;
