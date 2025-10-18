import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SpecialPage() {
    const navigate = useNavigate();
    const [fillPercent, setFillPercent] = useState(0);
    const [isFilled, setIsFilled] = useState(false); // Trạng thái khi tim đã đầy
    const [showButton, setShowButton] = useState(false); // Trạng thái để hiện nút cuối

    const handleFillHeart = () => {
        if (fillPercent >= 100) return;

        // Lấp đầy nhanh hơn, chỉ cần 4 lần nhấn
        const newPercent = fillPercent + 25;
        setFillPercent(newPercent);

        if (newPercent >= 100) {
            // Khi tim đầy, kích hoạt hiệu ứng nổ tung
            setTimeout(() => {
                setIsFilled(true);
            }, 500); // Đợi 0.5s sau lần nhấn cuối

            // Hiển thị nút bấm sau khi hiệu ứng kết thúc
            setTimeout(() => {
                setShowButton(true);
            }, 2000); // Đợi 2s để hiệu ứng diễn ra
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[60vh] text-center p-4 bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden">
            
            <AnimatePresence>
                {!isFilled && (
                    <motion.div
                        key="heart-filler"
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <motion.h1 
                            className="text-2xl font-bold text-pink-600 mb-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Một món quà cuối cùng...
                        </motion.h1>
                        <motion.p 
                            className="text-gray-600 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.3 } }}
                        >
                            Hãy chạm để lấp đầy trái tim yêu thương nhé!
                        </motion.p>
                        
                        <div className="relative w-32 h-32 cursor-pointer mb-6" onClick={handleFillHeart}>
                            <span className="absolute inset-0 text-gray-300 text-8xl flex items-center justify-center">♡</span>
                            <div className="absolute bottom-0 left-0 w-full overflow-hidden transition-all duration-300 ease-linear" style={{ height: `${fillPercent}%` }}>
                                <motion.span 
                                    className="text-red-500 text-8xl flex items-center justify-center"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    ❤️
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hiệu ứng trái tim nổ tung */}
            <AnimatePresence>
                {isFilled && !showButton && (
                    <motion.div
                        key="heart-filled"
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 20, 15], opacity: [1, 1, 0] }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="absolute text-red-500 text-8xl z-20"
                    >
                        ❤️
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nút bấm cuối cùng xuất hiện */}
            <AnimatePresence>
                {showButton && (
                    <motion.div
                        key="final-button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                        className="z-10 flex flex-col items-center"
                    >
                        <h2 className="text-2xl font-bold text-pink-600">Và đây là điều bất ngờ...</h2>
                        <button
                            onClick={() => navigate('/fireworks')}
                            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition shadow-lg flex items-center gap-2 transform hover:scale-105"
                        >
                            Dành cho bạn ✨
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}