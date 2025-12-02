import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import api from '../../services/api';

export default function ChatBot({ mindMapId = null }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId] = useState(Date.now().toString());
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Önceki konuşmayı yükle
        loadConversation();
    }, [conversationId]);

    useEffect(() => {
        // Mesajları en alta kaydır
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadConversation = async () => {
        try {
            const response = await api.get(`/chat/conversation/${conversationId}`);
            if (response.data.success) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        // Optimistic update
        const userMsg = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/chat/send', {
                message: input,
                conversationId,
                mindMapId
            });

            if (response.data.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.data.response,
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            // Hata mesajı ekle
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 shadow-lg">
                <h1 className="text-2xl font-bold">Mind Map AI Assistant</h1>
                <p className="text-sm text-gray-200">Soruları sorabilir ve mind map oluşturma konusunda yardım alabilirsiniz</p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-gray-400 text-lg">Hoş geldiniz! 👋</p>
                            <p className="text-gray-500 text-sm mt-2">Mind map oluşturma konusunda size yardımcı olmak için buradayım</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-700 text-gray-100 rounded-bl-none'
                                }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-xs opacity-70 mt-1 block">
                                    {new Date(msg.timestamp).toLocaleTimeString('tr-TR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 px-4 py-2 rounded-lg">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Sorunuzu yazın..."
                        disabled={loading}
                        className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
