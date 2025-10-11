import { useEffect, useRef, useState } from "react";
// 1. Import useNavigate để điều hướng
import { useNavigate } from "react-router-dom";

export default function Idea1Surprise() {
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState("");
  // 2. Thêm state để kiểm tra khi nào gõ chữ xong
  const [isTypingDone, setIsTypingDone] = useState(false);
  const musicRef = useRef(null);
  // 3. Khởi tạo hook useNavigate
  const navigate = useNavigate();

  // Typing Effect
  useEffect(() => {
    if (!show) return;
    const msg = "🌸 “20/10 vui vẻ nhé! Mong em luôn rực rỡ và hạnh phúc, bởi em xứng đáng với tất cả những điều tuyệt vời nhất.”!";
    let i = 0;
    function typing() {
      setTyped(msg.slice(0, i));
      if (i < msg.length) {
        setTimeout(() => { i++; typing(); }, 55 + Math.random() * 40);
      } else {
        // 4. Khi gõ xong, cập nhật state
        setIsTypingDone(true);
      }
    }
    typing();
    // Play music
    if (musicRef.current) musicRef.current.play().catch(() => { });
  }, [show]);

  // Hoa rơi bằng canvas (giữ nguyên, không thay đổi)
  const canvasRef = useRef();
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = 300;
    canvas.width = W; canvas.height = H;

    const emojis = ['🌸', '🌷', '💐', '🌺', '🌼', '🌻'];
    const flowers = [];
    for (let i = 0; i < 25; i++) {
      flowers.push({
        x: Math.random() * W,
        y: Math.random() * -H,
        size: 28 + Math.random() * 20,
        speed: 1.1 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 0.5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotate: Math.random() * Math.PI * 2,
        rotateSpeed: (Math.random() - 0.5) * 0.015
      });
    }
    let running = true;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      flowers.forEach(f => {
        ctx.save();
        ctx.font = f.size + "px serif";
        ctx.globalAlpha = 0.93;
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotate);
        ctx.fillText(f.emoji, 0, 0);
        ctx.restore();

        f.y += f.speed;
        f.x += f.drift + Math.sin(f.y / 48) * 1.1;
        f.rotate += f.rotateSpeed;
        if (f.y > H + 40) {
          f.y = Math.random() * -60;
          f.x = Math.random() * W;
        }
        if (f.x < -30) f.x = W + 30;
        if (f.x > W + 30) f.x = -30;
      });
      if (running) requestAnimationFrame(draw);
    }
    draw();
    return () => { running = false; };
  }, [show]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      {!show ? (
        <div className="animate-fadein">
          <h2 className="font-bold text-xl mb-2">Khảo sát nhanh</h2>
          <form className="space-y-3 w-full max-w-xs mx-auto" onSubmit={(e) => { e.preventDefault(); setShow(true); }}>
            <div>
              <label className="font-medium">Ai là bông hoa đẹp nhất nào ?</label><br />
              <label><input type="radio" name="like" value="yes" defaultChecked /> Có </label>
              <label className="ml-4"><input type="radio" name="like" value="no" /> Không</label>
            </div>
            <div>
              <label className="block">Nhập tên của em :</label>
              <input className="border rounded px-2 py-1 mt-1 w-full" placeholder="Nhập tên..." />
            </div>
            {/* Thêm onSubmit để người dùng có thể bấm gửi và chuyển cảnh ngay */}
            <button type="submit" className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition">Gửi</button>
          </form>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center" style={{ background: "linear-gradient(120deg,#fff0f6 60%,#ffe1ec 100%)" }}>
          <canvas ref={canvasRef} width={window.innerWidth} height={300} className="w-full h-[180px] sm:h-[300px] pointer-events-none" />
          <div className="mt-4 bg-white/80 rounded-2xl px-6 py-6 shadow text-center">
            <div className="font-bold text-pink-500 text-lg sm:text-2xl min-h-[2.5em]">
              {typed}
            </div>
          </div>
          

          {/* 5. Nút chuyển trang, chỉ hiện khi gõ chữ xong */}
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
    </div>
  );
}
