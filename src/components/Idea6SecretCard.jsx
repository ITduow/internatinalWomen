import { useState } from "react";
// 1. Import hook để điều hướng và animation
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Idea7LovePredictor() {
  const [you, setYou] = useState("");
  const [crush, setCrush] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hearts, setHearts] = useState([]);
  // 2. Khởi tạo hàm navigate
  const navigate = useNavigate();

  const loveMessages = [
    "Hai bạn sinh ra để dành cho nhau 💞",
    "Định mệnh đã gọi tên hai bạn rồi 💘",
    "Cặp đôi hoàn hảo, tim đập cùng nhịp 💓",
    "Một ánh nhìn – vạn điều yêu 💫",
    "Trời sinh một cặp, khỏi phải bàn 😍",
  ];

  function handlePredict(e) {
    e.preventDefault();
    if (!you.trim() || !crush.trim()) return;
    setLoading(true);
    setResult(null);
    setHearts([]);

    setTimeout(() => {
      const compatibility = Math.floor(Math.random() * 16) + 85; // Tăng tỉ lệ cao hơn: 85–100%
      const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
      setResult({ compatibility, message });
      setLoading(false);

      // Bắt đầu hiệu ứng tim bay
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          setHearts((prev) => [
            ...prev,
            {
              id: Date.now() + i, // Dùng id duy nhất hơn
              left: Math.random() * 100,
              size: 16 + Math.random() * 20,
              duration: 3 + Math.random() * 2,
            },
          ]);
        }, i * 200);
      }
    }, 1500);
  }
  
  function reset() {
      setResult(null);
      setHearts([]);
      setYou("");
      setCrush("");
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 relative overflow-hidden min-h-[50vh]">
      <motion.h1
        className="text-2xl font-bold text-pink-600 mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💘 Máy Dự Đoán Tình Cảm 💘
      </motion.h1>

      <form
        onSubmit={handlePredict}
        className="flex flex-col gap-3 items-center"
      >
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input
            className="border rounded px-3 py-1 text-center w-36 focus:ring-2 focus:ring-pink-300"
            placeholder="Tên bạn"
            value={you}
            onChange={(e) => setYou(e.target.value)}
          />
          <span className="text-xl text-red-500 animate-pulse">❤️</span>
          <input
            className="border rounded px-3 py-1 text-center w-36 focus:ring-2 focus:ring-pink-300"
            placeholder="Tên người ấy"
            value={crush}
            onChange={(e) => setCrush(e.target.value)}
          />
        </div>
        <button
          className="bg-pink-500 text-white px-4 py-1 rounded-full hover:bg-pink-600 transition-all shadow-md active:scale-95"
          type="submit"
        >
          Xem kết quả 💞
        </button>
      </form>

      <div className="h-48 flex items-center justify-center">
        {loading && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-4xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              💓
            </motion.div>
            <div className="text-gray-500 text-sm mt-2">
              Đang đo nhịp tim...
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              className="text-center bg-pink-50 border border-pink-200 p-4 rounded-lg shadow-sm relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-xl font-semibold text-pink-600 truncate">
                {you} ❤️ {crush}
              </div>
              <motion.div
                className="mt-2 text-4xl font-bold text-pink-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
              >
                {result.compatibility}%
              </motion.div>
              <div className="text-gray-600 mt-2 italic">{result.message}</div>
              <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={reset}
                    className="text-xs text-pink-500 underline hover:text-pink-700"
                  >
                    🔄 Thử lại
                  </button>
                  {/* 3. Thêm nút chuyển trang */}
                  <button
                    onClick={() => navigate('/8')}
                    className="bg-pink-500 text-white px-4 py-1 text-sm rounded-full hover:bg-pink-600 transition shadow"
                  >
                    Tiếp theo →
                  </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Tim bay animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              className="absolute text-pink-400 select-none"
              style={{
                left: `${heart.left}%`,
                fontSize: `${heart.size}px`,
                bottom: "-20px",
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0.8, 1, 0], y: -500 }}
              exit={{ opacity: 0 }}
              transition={{ duration: heart.duration, ease: "easeOut" }}
            >
              💖
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
