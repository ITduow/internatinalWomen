import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Welcome({ onStart }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  function handleClick() {
    if (!hasAgreed) {
      alert("🌸 Vui lòng đọc và đồng ý bản xin bản quyền hình ảnh trước khi mở quà nhé!");
      return;
    }
    onStart();
    navigate("/1");
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

        {/* 💡 Hướng dẫn động */}
        {!hasAgreed && (
          <motion.p
            className="mt-6 text-base text-pink-600 font-medium flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            👉 Hãy đọc bản quyền trước khi mở quà nhé!
          </motion.p>
        )}

        {/* Nút mở bản quyền */}
        <motion.div
          className="relative inline-block mt-4"
          animate={
            !hasAgreed
              ? { scale: [1, 1.05, 1], y: [0, -3, 0] }
              : {}
          }
          transition={{
            duration: 1.8,
            repeat: hasAgreed ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 rounded-full text-pink-700 font-medium border border-pink-300 
                     bg-gradient-to-r from-pink-50/70 to-white/60 backdrop-blur-sm 
                     shadow-md hover:shadow-lg hover:from-pink-100/80 hover:to-white/80
                     transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📜</span>
            <span>Đọc bản xin bản quyền hình ảnh</span>
          </motion.button>

          {/* Hiệu ứng mũi tên chỉ xuống nút bản quyền */}
          {!hasAgreed && (
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-pink-500 text-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ⬇️
            </motion.div>
          )}
        </motion.div>

        {/* 📌 Ghi chú */}
        <p className="mt-3 text-sm text-pink-600 italic">
          📌 Vui lòng đọc và đồng ý bản quyền trước khi mở quà nhé!
        </p>

        {/* Nút mở quà */}
        <motion.button
          onClick={handleClick}
          className={`mt-8 px-8 py-4 rounded-full font-semibold shadow-lg transform transition-all duration-300
            ${
              hasAgreed
                ? "bg-white text-pink-500 hover:shadow-xl hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          whileHover={hasAgreed ? { scale: 1.1 } : {}}
          whileTap={hasAgreed ? { scale: 0.95 } : {}}
          disabled={!hasAgreed}
          title={
            !hasAgreed
              ? "📜 Bạn cần đọc bản quyền trước khi mở quà nha!"
              : ""
          }
        >
          🎁 Nhấn để mở quà 🎁
        </motion.button>
      </motion.div>

      {/* Modal xin bản quyền */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-left text-pink-700 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-3 text-center text-pink-600">
                📜 Thư xin bản quyền hình ảnh
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                Kính gửi Nguyễn Thị Kim Ngân,  
                <br />
                Trang web này chỉ sử dụng hình ảnh với mục đích <b>phi thương mại</b>,
                nhằm lan tỏa thông điệp tích cực và tri ân ngày đặc biệt.  
                <br />
              </p>

              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  id="agree"
                  checked={hasAgreed}
                  onChange={(e) => setHasAgreed(e.target.checked)}
                  className="w-4 h-4 accent-pink-500"
                />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  Tôi đã đọc và đồng ý với nội dung bản xin bản quyền hình ảnh.
                </label>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
