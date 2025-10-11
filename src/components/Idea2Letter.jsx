import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import motion và AnimatePresence từ framer-motion
import { motion, AnimatePresence } from "framer-motion";

// 2. Định nghĩa các "variant" animation để code gọn gàng hơn
const envelopeVariants = {
  initial: { y: 0, opacity: 1 },
  opened: {
    y: 80,
    opacity: 0,
    transition: { duration: 0.7, ease: "easeInOut" },
  },
};

const paperVariants = {
  initial: { y: 20, opacity: 0, scale: 0.8 },
  visible: {
    y: -40, // Nâng lá thư lên cao hơn một chút
    opacity: 1,
    scale: 1,
    transition: { delay: 0.5, duration: 0.7, ease: "circOut" },
  },
};

export default function Idea2Letter() {
  const [isOpened, setIsOpened] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  function handleOpenEnvelope() {
    if (isOpened) return; // Chặn việc click nhiều lần
    setIsOpened(true);
    // Âm thanh sẽ phát gần như ngay lập tức khi animation bắt đầu
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 300);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] overflow-hidden">
      <div
        className="relative w-64 h-64 flex items-center justify-center"
        style={{ perspective: "1000px" }} // Thêm perspective để hiệu ứng 3D đẹp hơn
      >
        {/* --- Phong bì --- */}
        <motion.div
          variants={envelopeVariants}
          animate={isOpened ? "opened" : "initial"}
          onClick={handleOpenEnvelope}
          className="absolute w-48 h-32 cursor-pointer z-10"
        >
          <div className="absolute inset-0 bg-pink-300 rounded-lg shadow-lg"></div>
          <div 
            className="absolute inset-x-0 top-0 h-16 bg-pink-400 rounded-t-lg transform origin-bottom transition-transform duration-500 ease-in-out"
            style={{ transform: isOpened ? "rotateX(180deg)" : "rotateX(0deg)" }}
          ></div>
          <div className="absolute inset-0 bg-pink-200" style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 50%)" }}></div>
        </motion.div>

        {/* --- Tờ giấy (Lá thư) --- */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              variants={paperVariants}
              initial="initial"
              animate="visible"
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute w-44 h-56 z-20"
              style={{ transformStyle: "preserve-3d" }} // Cần cho hiệu ứng lật
            >
              <motion.div
                className="absolute w-full h-full bg-white rounded-lg shadow-xl p-4 flex flex-col items-center justify-center text-center"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ backfaceVisibility: "hidden" }} // Ẩn mặt sau khi không lật
              >
                <div className="text-2xl">💌</div>
                <p className="mt-2 text-sm font-semibold text-gray-700">
                  Chúc mừng Ngày Quốc tế Phụ nữ!
                  <br />
                  Chúc em luôn xinh đẹp, hạnh phúc và thành công!
                </p>
                <button
                  className="mt-3 text-xs font-bold text-pink-500 hover:text-pink-700 transition-colors"
                  onClick={() => setIsFlipped(true)}
                >
                  (Lật thư)
                </button>
              </motion.div>

              <motion.div
                className="absolute w-full h-full bg-white rounded-lg shadow-xl p-4 flex flex-col items-center justify-center text-center"
                initial={{ rotateY: 180 }}
                animate={{ rotateY: isFlipped ? 0 : 180 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ backfaceVisibility: "hidden" }} // Ẩn mặt trước khi lật
              >
                <img src={`${import.meta.env.BASE_URL}nang.jpg`} alt="Bouquet" className="w-45 h-35" />
                <p className="text-sm mt-2 text-gray-600">Em là bông hoa đẹp nhất!</p>
                <button
                  className="mt-3 text-xs font-bold text-pink-500 hover:text-pink-700 transition-colors"
                  onClick={() => setIsFlipped(false)}
                >
                  (Lật lại)
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500 h-10">
          <AnimatePresence>
              {!isOpened && (
                  <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                      Nhấn vào phong bì để mở thư nhé!
                  </motion.p>
              )}
          </AnimatePresence>
      </div>

      {/* --- Nút chuyển trang --- */}
      <AnimatePresence>
        {isOpened && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.2 } }} // Xuất hiện sau khi thư mở xong
            exit={{ opacity: 0, y: 20 }}
            onClick={() => navigate('/3')}
            className="mt-4 bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition shadow-md flex items-center gap-2"
          >
            Xem điều bất ngờ tiếp theo
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
