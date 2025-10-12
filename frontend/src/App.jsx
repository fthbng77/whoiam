import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  'En çok gurur duyduğun özelliğin nedir?',
  'Hayattaki en büyük hedefin nedir?',
  'Seni en mutlu eden şey nedir?',
  'Kendini üç kelimeyle nasıl tanımlarsın?',
  'Hayatında değiştirmek istediğin bir alışkanlık var mı?'
];

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));

  const handleStartOver = () => {
    setIsStarted(false);
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(''));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#7dd3fc] via-[#a78bfa] to-[#c084fc] animate-gradient-flow">

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full h-screen p-6">
        <AnimatePresence mode="wait">
          {!isStarted ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center w-full max-w-2xl text-center"

            >
              {/* Glassy header container */}
              <motion.div
                className="w-full rounded-3xl bg-white/10 p-8 backdrop-blur-xl ring-1 ring-white/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] mb-10"
              >
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-violet-200 drop-shadow-sm">
                  Who am I ?
                </h1>
                <p className="mt-4 text-base md:text-lg text-blue-50/90">
                  Kendini Tanı.
                </p>
              </motion.div>

              {/* Start button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsStarted(true)}
                className="group relative flex items-center justify-center rounded-2xl px-10 py-5 text-lg md:text-xl font-semibold text-white/95"

              >
                <span className="relative">Discover Your Self</span>

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
              <div className="w-full rounded-3xl bg-white/10 p-8 backdrop-blur-xl ring-1 ring-white/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-semibold text-white/90 mb-2">
                    Soru {currentQuestion + 1}/{questions.length}
                  </h2>
                  <p className="text-xl text-white mb-6">
                    {questions[currentQuestion]}
                  </p>
                  <textarea
                    value={answers[currentQuestion]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[currentQuestion] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    className="w-full h-32 p-4 rounded-xl bg-white/10 backdrop-blur-sm
                             border border-white/20 text-white placeholder-white/40
                             focus:outline-none focus:ring-2 focus:ring-white/30
                             resize-none shadow-inner text-center"
                    placeholder="Cevabınızı buraya yazın..."
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartOver}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20
                             text-white/90 hover:text-white backdrop-blur-sm
                             border border-white/20 transition-all duration-200"
                  >
                    Baştan Başla
                  </motion.button>

                  {currentQuestion < questions.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentQuestion(prev => prev + 1)}
                      className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30
                               text-white font-medium backdrop-blur-sm
                               border border-white/20 transition-all duration-200"
                    >
                      Sonraki Soru
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentQuestion(0)}
                      className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30
                               text-white font-medium backdrop-blur-sm
                               border border-white/20 transition-all duration-200"
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
                        <div key={idx} className="border-b border-white/10 last:border-0 pb-4">
                          <p className="text-white/80 mb-2">{question}</p>
                          <p className="text-white">
                            {answers[idx] || <span className="italic text-white/50">Henüz cevaplanmadı</span>}
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

      {/* Decorative dotted grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px), radial-gradient(currentColor 1px, transparent 1px)",
          backgroundPosition: "0 0, 25px 25px",
          backgroundSize: "50px 50px",
          color: "rgba(255,255,255,0.08)",
        }}
      />
    </div>
  );
}
