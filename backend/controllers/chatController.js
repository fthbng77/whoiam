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

        // Lokal modelden yanıt alın
        let aiResponse = await generateResponse(message, conversationId, mindMapId);

        // Başarılı yanıt dönün
        res.json({
            success: true,
            response: aiResponse
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
        // MongoDB olmadan boş array dön
        res.json({ success: true, messages: [] });
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Lokal modelden yanıt oluştur
async function generateResponse(userMessage, conversationId, mindMapId) {
    try {
        console.log('Ollama API\'ye istek gönderiliyor...');
        
        // Ollama API'ye istek gönder
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 saniye timeout
        
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'neural-chat',
                prompt: userMessage,
                stream: false,
                temperature: 0.7,
                top_k: 40,
                top_p: 0.9,
                num_predict: 256
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error('Ollama API error:', response.status, response.statusText);
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        // Ollama / local model API may return different shapes depending on version.
        // Try several common fields to extract the assistant text.
        let aiText = '';

        if (typeof data === 'string') {
            aiText = data;
        } else if (data.response && typeof data.response === 'string') {
            aiText = data.response;
        } else if (data.output && typeof data.output === 'string') {
            aiText = data.output;
        } else if (data.results && Array.isArray(data.results) && data.results[0]) {
            // e.g. { results: [ { content: '...' } ] }
            aiText = data.results[0].content || data.results[0].text || '';
        } else if (data.outputs && Array.isArray(data.outputs) && data.outputs[0]) {
            aiText = data.outputs[0].content || data.outputs[0].text || '';
        } else if (data.choices && Array.isArray(data.choices) && data.choices[0]) {
            // OpenAI-like shape
            const ch = data.choices[0];
            aiText = ch.message?.content || ch.text || '';
        }

        if (!aiText) {
            console.error('Invalid response from Ollama / model API:', data);
            throw new Error('Empty response from model');
        }

        console.log('Ollama yanıtı alındı');
        return String(aiText).trim();

    } catch (error) {
        console.error('Generation error:', error.message);
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
