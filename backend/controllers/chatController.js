const ChatMessage = require('../models/ChatMessage');

// Eğer lokal model kullanmak istiyorsanız, initialize edin
let chatModel = null;

// Transformers.js kullanmak için (alternatif olarak)
async function initializeModel() {
    try {
        // Node.js'de onnx runtime kullanarak model yükleyin
        // Veya Ollama ile lokal sunucuya bağlanın
        console.log('Chat model initialized');
    } catch (error) {
        console.error('Model initialization error:', error);
    }
}

// Chat endpoint
exports.sendMessage = async (req, res) => {
    try {
        const { message, conversationId, mindMapId } = req.body;

        if (!message || !conversationId) {
            return res.status(400).json({ error: 'Message and conversationId are required' });
        }

        // Kullanıcı mesajını kaydedin
        const userMessage = new ChatMessage({
            conversationId,
            role: 'user',
            content: message,
            mindMapId: mindMapId || null
        });
        await userMessage.save();

        // Lokal modelden yanıt alın
        let aiResponse = await generateResponse(message, conversationId, mindMapId);

        // AI yanıtını kaydedin
        const assistantMessage = new ChatMessage({
            conversationId,
            role: 'assistant',
            content: aiResponse,
            mindMapId: mindMapId || null
        });
        await assistantMessage.save();

        res.json({
            success: true,
            response: aiResponse,
            message: assistantMessage
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message', details: error.message });
    }
};

// Geçmiş mesajları getir
exports.getConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await ChatMessage.find({ conversationId })
            .sort({ timestamp: 1 })
            .limit(100);

        res.json({ success: true, messages });
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Lokal modelden yanıt oluştur
async function generateResponse(userMessage, conversationId, mindMapId) {
    try {
        // SEÇENEK 1: Ollama kullanarak (önerilen)
        // Eğer Ollama kurulu ise, buna bağlanın
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'mistral', // veya neural-chat, phi, etc.
                prompt: userMessage,
                stream: false
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data.response;
        }

        // SEÇENEK 2: Fallback - simple template-based response
        return generateTemplateResponse(userMessage);

    } catch (error) {
        console.error('Generation error:', error);
        return generateTemplateResponse(userMessage);
    }
}

// Template-based yanıt (fallback)
function generateTemplateResponse(userMessage) {
    const responses = {
        'merhaba': 'Merhaba! Mind map oluşturma konusunda size nasıl yardımcı olabilirim?',
        'yapılar': 'Mind map\'ler karmaşık fikirleri görselleştirmek için harika bir yoldur.',
        'yardım': 'Bir mind map oluşturmak için "Yeni Proje" düğmesine tıklayabilirsiniz.',
        'default': `"${userMessage}" hakkında daha fazla bilgi verebilir misiniz? Lokal AI modeli şu anda yapılandırılıyor.`
    };

    for (const [key, response] of Object.entries(responses)) {
        if (key !== 'default' && userMessage.toLowerCase().includes(key)) {
            return response;
        }
    }

    return responses.default;
}

module.exports = {
    initializeModel,
    sendMessage: exports.sendMessage,
    getConversation: exports.getConversation
};
