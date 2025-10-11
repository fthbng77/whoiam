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
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [focusedIdx, setFocusedIdx] = useState(null);

  // Merkez ve düğüm pozisyonları
  const center = { x: 320, y: 220 };
  const radius = 180;
  const nodeSize = { w: 220, h: 80 };

  const handleAnswerChange = (idx, value) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  // Düğüm pozisyonlarını hesapla
  const nodePositions = defaultQuestions.map((_, idx) => {
    const angle = (idx / defaultQuestions.length) * 2 * Math.PI - Math.PI / 2;
    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;
    return { x, y };
  });

  // SVG çizgileri için path oluşturucu
  const getCurvePath = (from, to) => {
    // Kavisli bir bağlantı için kontrol noktası
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const mx = from.x + dx * 0.5;
    const my = from.y + dy * 0.5 - 60; // Kavis miktarı
    return `M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-700">Zihin Haritası: Who am I?</h1>
      <div className="relative w-[640px] h-[440px] flex items-center justify-center">
        {/* SVG bağlantı çizgileri */}
        <svg className="absolute left-0 top-0 w-full h-full pointer-events-none" width={640} height={440}>
          {nodePositions.map((pos, idx) => (
            <path
              key={idx}
              d={getCurvePath(center, pos)}
              stroke={hoveredIdx === idx ? '#2563eb' : '#60a5fa'}
              strokeWidth={hoveredIdx === idx ? 4 : 2}
              fill="none"
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
            />
          ))}
        </svg>
        {/* Merkezdeki ana düğüm */}
        <div
          className="absolute bg-white shadow-xl rounded-full border-4 border-blue-400 flex items-center justify-center z-10"
          style={{
            left: center.x - 70,
            top: center.y - 70,
            width: 140,
            height: 140
          }}
        >
          <span className="text-2xl font-semibold text-blue-700">Who am I?</span>
        </div>
        {/* Sorular ve cevap alanları çevrede */}
        {defaultQuestions.map((q, idx) => {
          const pos = nodePositions[idx];
          const isHovered = hoveredIdx === idx;
          const isFocused = focusedIdx === idx;
          return (
            <div
              key={idx}
              className={`absolute flex flex-col items-center justify-center transition-all duration-200 select-none`}
              style={{
                left: pos.x - nodeSize.w / 2,
                top: pos.y - nodeSize.h / 2,
                width: nodeSize.w,
                height: nodeSize.h
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                className={`w-full h-full flex flex-col items-center justify-center bg-white ${isHovered ? 'shadow-2xl border-blue-400' : 'shadow-lg border-blue-200'} ${isFocused ? 'ring-4 ring-blue-400' : ''} border-2 rounded-full transition-all duration-200`}
              >
                <div className="font-medium text-blue-600 mb-1 text-center px-2 text-sm">
                  {q}
                </div>
                <input
                  type="text"
                  className={`w-11/12 mt-1 px-2 py-1 rounded-full border-2 focus:outline-none transition-all duration-200 ${isFocused ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'} text-center text-gray-800 bg-blue-50 focus:bg-white`}
                  value={answers[idx]}
                  onChange={e => handleAnswerChange(idx, e.target.value)}
                  onFocus={() => setFocusedIdx(idx)}
                  onBlur={() => setFocusedIdx(null)}
                  placeholder="Cevabınızı yazın..."
                />
              </div>
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

export default App;
