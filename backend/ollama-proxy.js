#!/usr/bin/env node

/**
 * Simple Ollama API Proxy for Testing
 * Ollama serve mode'u varsa bunu kullanır, yoksa template yanıtlar verir
 */

const http = require('http');
const https = require('https');

const PORT = 11434;
const OLLAMA_HOST = 'localhost:11434';

// Test cevapları
const testResponses = {
    'merhaba': 'Merhaba! Size nasıl yardımcı olabilirim? Ben bir AI asistanıyım ve mind map oluşturma konusunda veya diğer sorularınızda yardımcı olabilirim.',
    'kim': 'Ben bir yapay zeka asistanıyım. Mind map oluşturmanızda ve sorularınızı yanıtlamakta size yardımcı olmak için buradayım.',
    'yardım': 'Size nasıl yardımcı olabilirim? Aşağıdaki konularda destek verebilirim:\n- Mind map oluşturma\n- Problem çözme\n- Öğrenme ve geliştirme\n- Danışmanlık',
    'default': 'Sorunuz için teşekkür ederim. Bununla ilgili daha fazla bilgi verebilir misiniz?'
};

function getResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    for (const [key, response] of Object.entries(testResponses)) {
        if (key !== 'default' && lowerPrompt.includes(key)) {
            return response;
        }
    }
    return testResponses.default;
}

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/api/generate') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1e6) {
                res.writeHead(413);
                res.end();
                req.connection.destroy();
            }
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const response = {
                    model: data.model || 'neural-chat',
                    created_at: new Date().toISOString(),
                    response: getResponse(data.prompt),
                    done: true
                };
                res.writeHead(200);
                res.end(JSON.stringify(response));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else if (req.url === '/api/tags') {
        res.writeHead(200);
        res.end(JSON.stringify({
            models: [
                { name: 'neural-chat:latest', modified_at: new Date().toISOString(), size: 0 }
            ]
        }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Ollama API Proxy running on http://localhost:${PORT}`);
    console.log('Using template responses (Ollama not detected)');
});
