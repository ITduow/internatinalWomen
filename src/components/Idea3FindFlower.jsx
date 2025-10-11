import { useState } from "react";
// 1. Import hook useNavigate để điều hướng
import { useNavigate } from "react-router-dom";

const flowers = [
  { emoji: "🌸", msg: "Chúc em luôn vui vẻ, trẻ trung như hoa này!🌸" },
  { emoji: "🌷", msg: "Chúc em hạnh phúc rực rỡ!🌷" },
  { emoji: "💐", msg: "Chúc em thành công, tỏa sáng!💐" },
  { emoji: "🌺", msg: "Chúc em luôn yêu đời!🌺" },
  { emoji: "🌼", msg: "Chúc em nhận được thật nhiều yêu thương!🌼" },
  { emoji: "🌻", msg: "Em chẳng cần cố tỏa sáng, vì em vốn dĩ đã là ánh mặt trời rực rỡ nhất!🌻" },
  { emoji: "🥀", msg: "Chúc em luôn mạnh mẽ vượt qua thử thách!🥀" },
  { emoji: "🌹", msg: "Chúc em xinh đẹp, duyên dáng!🌹" },
];

function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Idea3FindFlower() {
  const [state, setState] = useState({ opened: -1, flowers: shuffle(flowers) });
  // 2. Khởi tạo hàm navigate
  const navigate = useNavigate();

  function handleClick(idx) {
    setState((s) => ({ ...s, opened: idx }));
  }

  function reset() {
    setState({ opened: -1, flowers: shuffle(flowers) });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center font-semibold text-pink-600">
        Hãy chọn một bông hoa để nhận lời chúc bất ngờ 🎁
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 mb-3">
        {state.flowers.map((f, idx) => (
          <button
            key={idx}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md transition-all duration-300 bg-pink-50 hover:bg-pink-200
              ${state.opened === idx ? "scale-110 ring-2 ring-pink-400" : ""}
              ${state.opened !== -1 ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
            onClick={() => handleClick(idx)}
            disabled={state.opened !== -1}
            aria-label="Chọn hoa"
          >
            {f.emoji}
          </button>
        ))}
      </div>
      {state.opened !== -1 && (
        <div className="text-center text-pink-500 font-medium mt-4 animate-fadein">
          <div className="text-2xl">{state.flowers[state.opened].emoji}</div>
          <div>{state.flowers[state.opened].msg}</div>
          
          {/* 3. Thêm khu vực chứa 2 nút bấm */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-pink-100 hover:bg-pink-200 transition"
              onClick={reset}
            >
              Chơi lại
            </button>
            <button
              onClick={() => navigate('/4')}
              className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition shadow-md flex items-center gap-2"
            >
              Tiếp theo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
