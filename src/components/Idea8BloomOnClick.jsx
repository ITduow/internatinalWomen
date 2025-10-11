import { useState } from "react";
// 1. Import useNavigate để điều hướng
import { useNavigate } from "react-router-dom";
const flowers = ['🌸','🌷','💐','🌺','🌼','🌻','🥀','🌹'];

export default function Idea8BloomOnClick() {
  const [blooms, setBlooms] = useState([]);
  const [count, setCount] = useState(0);
  // 2. Khởi tạo hook navigate
  const navigate = useNavigate();

  function handleClick(e) {
    if (count >= 10) return; // Dừng lại khi đã đủ 10 hoa
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const emoji = flowers[Math.floor(Math.random() * flowers.length)];
    setBlooms(b => [...b, { x, y, emoji, id: Date.now() + Math.random() }]);
    setCount(c => c + 1);
  }

  function reset(e) {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
    setBlooms([]);
    setCount(0);
  }

  return (
    <div className="relative min-h-[300px] cursor-pointer" onClick={handleClick}>
      <div className="absolute inset-0 w-full h-full">
        {blooms.map((f) => (
          <span
            key={f.id}
            className="absolute text-2xl pointer-events-none animate-pop"
            style={{ left: f.x - 16, top: f.y - 16 }}
          >
            {f.emoji}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {count < 10 ? (
          <div className="text-gray-500 text-sm select-none p-4 text-center">
            Nhấn vào bất kỳ đâu để nở hoa 🌸 ({count}/10)
          </div>
        ) : (
          <div className="text-pink-500 font-bold text-xl animate-fadein text-center p-4">
            ❤️ Chúc mừng ngày Phụ nữ Việt Nam 20-10 ❤️!
          </div>
        )}
      </div>
      
      {/* 3. Thêm nút mới và gom các nút lại */}
      {count >= 10 && (
        <div className="absolute bottom-2 right-2 flex flex-col sm:flex-row gap-2 items-end sm:items-center">
            <button 
                className="bg-pink-100 px-3 py-1 rounded-full text-xs shadow hover:bg-pink-200 transition" 
                onClick={reset}
            >
                Chơi lại
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); navigate('/special'); }}
                className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm shadow-lg hover:bg-pink-600 transition animate-fadein"
            >
                Món quà đặc biệt ✨
            </button>
        </div>
      )}

      <style>{`
        .animate-pop { animation: popflower .7s cubic-bezier(.5,1.5,.5,1); }
        @keyframes popflower { 0%{transform:scale(0);} 60%{transform:scale(1.2);} 100%{transform:scale(1);} }
        .animate-fadein { animation: fadein 1.2s; }
        @keyframes fadein { from{opacity:0;} to{opacity:1;} }
      `}</style>
    </div>
  );
}
