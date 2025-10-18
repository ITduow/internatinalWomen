import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Idea1Surprise() {
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [warning, setWarning] = useState("");
  // 1. Thêm state để kiểm soát hiệu ứng lỗi trên input
  const [inputError, setInputError] = useState(false);

  // Hàm xử lý khi người dùng gửi form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Chuẩn hóa tên: xóa khoảng trắng thừa và chuyển thành chữ thường
    const processedName = name.trim().replace(/\s+/g, ' ').toLowerCase();
    const correctName = "nguyễn thị kim ngân";

    if (processedName === correctName) {
      setShow(true);
      setWarning("");
      setInputError(false);
    } else if (processedName === "") {
      setWarning("Ủa, chưa nhập tên mà! 😮");
      setInputError(true);
      setTimeout(() => setInputError(false), 500);
    } else {
      // 2. Cập nhật thông điệp cảnh báo đặc biệt hơn
      setWarning("🚨 Cảnh báo! Hệ thống phát hiện truy cập trái phép! Chỉ chủ nhân thật sự mới có thể mở món quà này! 🚨");
      setInputError(true);
      // Xóa hiệu ứng lỗi sau 0.5s để có thể kích hoạt lại
      setTimeout(() => setInputError(false), 500);
    }
  };

  // Typing Effect (giữ nguyên)
  useEffect(() => {
    if (!show) return;
    const msg = "🌸 “20/10 vui vẻ nhé! Mong em luôn rực rỡ và hạnh phúc, bởi em xứng đáng với tất cả những điều tuyệt vời nhất.”!";
    let i = 0;
    function typing() {
      setTyped(msg.slice(0, i));
      if (i < msg.length) {
        setTimeout(() => { i++; typing(); }, 55 + Math.random() * 40);
      } else {
        setIsTypingDone(true);
      }
    }
    typing();
  }, [show]);

  // Hoa rơi bằng canvas (giữ nguyên)
  const canvasRef = useRef();
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    let W = rect.width, H = rect.height;

    const emojis = ['🌸', '🌷', '💐', '🌺', '🌼', '🌻'];
    const flowers = [];
    for (let i = 0; i < 25; i++) {
      flowers.push({
        x: Math.random() * W, y: Math.random() * -H,
        size: 28 + Math.random() * 20, speed: 1.1 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 0.5, emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotate: Math.random() * Math.PI * 2, rotateSpeed: (Math.random() - 0.5) * 0.015
      });
    }
    let running = true;
    function draw() {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flowers.forEach(f => {
        ctx.save(); ctx.font = f.size + "px serif"; ctx.globalAlpha = 0.93;
        ctx.translate(f.x, f.y); ctx.rotate(f.rotate); ctx.fillText(f.emoji, 0, 0);
        ctx.restore();
        f.y += f.speed; f.x += f.drift + Math.sin(f.y / 48) * 1.1; f.rotate += f.rotateSpeed;
        if (f.y > H + 40) { f.y = Math.random() * -60; f.x = Math.random() * W; }
        if (f.x < -30) f.x = W + 30; if (f.x > W + 30) f.x = -30;
      });
      requestAnimationFrame(draw);
    }
    draw();
    return () => { running = false; };
  }, [show]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      {!show ? (
        <div className="animate-fadein w-full max-w-xs mx-auto">
          <h2 className="font-bold text-xl mb-2 text-center">Xác nhận chủ nhân 👑</h2>
          <form className="space-y-3" onSubmit={handleFormSubmit}>
            <div>
              <label className="font-medium">Ai là bông hoa đẹp nhất nào?</label><br />
              <label><input type="radio" name="like" value="yes" defaultChecked /> Là em </label>
              <label className="ml-4"><input type="radio" name="like" value="no" /> Không phải em</label>
            </div>
            <div>
              <label className="block font-medium">Nhập Họ và tên của em:</label>
              {/* 3. Thêm hiệu ứng đặc biệt cho input */}
              <input
                className={`border rounded px-2 py-1 mt-1 w-full transition-all duration-300 ${inputError ? 'border-red-500 animate-shake shadow-lg shadow-red-500/50' : 'focus:ring-2 focus:ring-pink-300'}`}
                placeholder="Nhập tên..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition w-full">Mở quà</button>

            {warning && (
                <p className={`text-sm mt-2 text-center animate-shake font-semibold ${inputError ? 'text-red-500' : 'text-yellow-600'}`}>{warning}</p>
            )}
          </form>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center" style={{ background: "linear-gradient(120deg,#fff0f6 60%,#ffe1ec 100%)" }}>
          <canvas ref={canvasRef} className="w-full h-[180px] sm:h-[300px] pointer-events-none" />
          <div className="mt-4 bg-white/80 rounded-2xl px-6 py-6 shadow text-center">
            <div className="font-bold text-pink-500 text-lg sm:text-2xl min-h-[5em] flex items-center justify-center">
              {typed}
            </div>
          </div>
          {isTypingDone && (
            <button
              onClick={() => navigate('/2')}
              className="mt-6 animate-fadein bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition shadow-md flex items-center gap-2"
            >
              Khám phá tiếp
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>
      )}
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}

