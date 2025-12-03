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
            const serverDetail = error?.response?.data?.details || error?.response?.data?.error || error.message;
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: serverDetail ? `Üzgünüm, bir hata oluştu: ${serverDetail}` : 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-gray-400 text-lg">Hoş geldiniz! 👋</p>
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

            {/* Input Area (fixed footer with gradient) */}
            <div className="fixed bottom-0 left-0 w-full z-50 backdrop-blur-sm bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-t border-white/10 px-4 py-4">
                <div className="w-full flex items-center justify-center">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-7 w-full max-w-4xl">
                        {/* Input Field - Pill shaped */}
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Sorunuzu yazın..."
                            disabled={loading}
                            className="flex-1 appearance-none bg-gradient-to-r from-purple-600/10 to-blue-600/10 text-white placeholder-white/50 px-5 py-3 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-70 transition-all disabled:opacity-60 hover:bg-gradient-to-r hover:from-purple-600/15 hover:to-blue-600/15"
                        />
                        {/* Send Button - Circular */}
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 disabled:opacity-50 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all"
                            aria-label="Send"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
