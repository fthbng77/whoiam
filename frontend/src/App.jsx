import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBot from "./components/Chat/ChatBot";
import { MessageCircle, Home } from "lucide-react";

const questions = [
  "En çok gurur duyduğun özelliğin nedir?",
  "Hayattaki en büyük hedefin nedir?",
  "Seni en mutlu eden şey nedir?",
  "Kendini üç kelimeyle nasıl tanımlarsın?",
  "Hayatında değiştirmek istediğin bir alışkanlık var mı?"
];

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [page, setPage] = useState("home"); // "home" veya "chat"

  const handleStartOver = () => {
    setIsStarted(false);
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(""));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden 
    bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#8b5cf6]">      
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">WhoIAm</h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                page === "home"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              <Home size={20} />
              <span className="hidden sm:inline">Home</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage("chat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                page === "chat"
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              <MessageCircle size={20} />
              <span className="hidden sm:inline">ChatBot</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full h-screen p-6 pt-20">
        <AnimatePresence mode="wait">
          {page === "chat" ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <ChatBot />
            </motion.div>
          ) : !isStarted ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center w-full max-w-2xl text-center"
            >
              <motion.div className="w-full rounded-3xl bg-white/10 p-8 backdrop-blur-xl ring-1 ring-white/20 
              shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] mb-10">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent 
                bg-clip-text bg-gradient-to-br from-white via-blue-100 to-violet-200 drop-shadow-sm">
                  Who am I ?
                </h1>
                <p className="mt-4 text-base md:text-lg text-blue-50/90">
                  Kendini Tanı.
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsStarted(true)}
                className="group relative overflow-hidden rounded-2xl px-10 py-5 text-lg md:text-xl 
                font-semibold text-white bg-white/20 backdrop-blur-xl border border-white/30 
                shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]
                transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-blue-400 to-fuchsia-400 
                opacity-30 group-hover:opacity-60 transition-opacity duration-300"></span>
                <span className="relative z-10">Discover Yourself</span>
              </motion.button>

            </motion.div>
          ) : (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl"
            >
              <div className="w-full rounded-3xl bg-white/10 p-8 backdrop-blur-xl ring-1 ring-white/20 
              shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-semibold text-white/90 mb-2">
                    Soru {currentQuestion + 1}/{questions.length}
                  </h2>
                  <p className="text-xl text-white mb-6">{questions[currentQuestion]}</p>

                  <textarea
                    value={answers[currentQuestion]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[currentQuestion] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    className="w-full h-32 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 
                    text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 
                    resize-none shadow-inner text-center"
                    placeholder="Cevabınızı buraya yazın..."
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartOver}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white 
                    backdrop-blur-sm border border-white/20 transition-all duration-200"
                  >
                    Baştan Başla
                  </motion.button>

                  {currentQuestion < questions.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentQuestion((prev) => prev + 1)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-400 to-fuchsia-400 
                      hover:brightness-110 text-white font-medium backdrop-blur-md transition-all duration-200"
                    >
                      Sonraki Soru
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentQuestion(0)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 
                      hover:brightness-110 text-white font-medium backdrop-blur-md transition-all duration-200"
                    >
                      Cevapları Gözden Geçir
                    </motion.button>
                  )}
                </div>

                {currentQuestion === questions.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Tüm Cevaplarınız
                    </h3>
                    <div className="space-y-4">
                      {questions.map((question, idx) => (
                        <div
                          key={idx}
                          className="border-b border-white/10 last:border-0 pb-4"
                        >
                          <p className="text-white/80 mb-2">{question}</p>
                          <p className="text-white">
                            {answers[idx] || (
                              <span className="italic text-white/50">
                                Henüz cevaplanmadı
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
