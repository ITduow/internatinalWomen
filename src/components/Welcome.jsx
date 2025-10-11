import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Welcome({ onStart }) {
  const navigate = useNavigate();

  function handleClick() {
    // Gọi hàm onStart được truyền từ App.jsx để bắt đầu chơi nhạc
    onStart();
    // Chuyển hướng đến trang ý tưởng đầu tiên
    navigate('/1');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-pink-600 tracking-tight">
          Một món quà bất ngờ
        </h1>
        <p className="mt-4 text-lg text-pink-500">
          Dành riêng cho bạn nhân ngày đặc biệt.
        </p>
        <motion.button
          onClick={handleClick}
          className="mt-10 bg-white text-pink-500 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          🎁 Nhấn để mở quà 🎁
        </motion.button>
      </motion.div>
    </div>
  );
}
