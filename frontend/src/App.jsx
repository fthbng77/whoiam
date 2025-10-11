import { useState } from 'react';

const defaultQuestions = [
  'En çok gurur duyduğun özelliğin nedir?',
  'Hayattaki en büyük hedefin nedir?',
  'Seni en mutlu eden şey nedir?',
  'Kendini üç kelimeyle nasıl tanımlarsın?',
  'Hayatında değiştirmek istediğin bir alışkanlık var mı?'
];

function App() {
  const [answers, setAnswers] = useState(Array(defaultQuestions.length).fill(''));

  const handleAnswerChange = (idx, value) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-700">Zihin Haritası: Who am I?</h1>
      <div className="relative w-full max-w-3xl h-[500px] flex items-center justify-center">
        {/* Merkezdeki ana düğüm */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-40 h-40 flex items-center justify-center border-4 border-blue-400 z-10">
          <span className="text-2xl font-semibold text-blue-700">Who am I?</span>
        </div>
        {/* Sorular ve cevap alanları çevrede */}
        {defaultQuestions.map((q, idx) => {
          const angle = (idx / defaultQuestions.length) * 2 * Math.PI;
          const radius = 180;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div
              key={idx}
              className="absolute w-64 p-4 bg-white rounded-xl shadow-md border border-blue-200"
              style={{
                left: `calc(50% + ${x}px - 128px)`,
                top: `calc(50% + ${y}px - 48px)`
              }}
            >
              <div className="font-medium text-blue-600 mb-2">{q}</div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={answers[idx]}
                onChange={e => handleAnswerChange(idx, e.target.value)}
                placeholder="Cevabınızı yazın..."
              />
            </div>
          );
        })}
      </div>
      <div className="mt-10 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Cevaplarınız</h2>
        <ul className="space-y-2">
          {defaultQuestions.map((q, idx) => (
            <li key={idx} className="bg-white rounded-lg shadow p-3">
              <span className="font-medium text-blue-600">{q}</span>
              <div className="mt-1 text-gray-800">{answers[idx] || <span className="italic text-gray-400">(Henüz cevaplanmadı)</span>}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App
