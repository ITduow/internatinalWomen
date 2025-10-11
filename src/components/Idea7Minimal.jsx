import React from "react";
import { useNavigate } from "react-router-dom";

export default function Idea7LovePredictor() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-[340px] relative overflow-hidden p-4">
      {/* Hiệu ứng ánh sáng lướt qua */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-200/40 to-transparent animate-shine"></div>

      {/* Câu chính */}
      <div className="text-xl sm:text-2xl font-bold text-pink-500 text-center animate-fadein relative z-10">
        “Dành tặng tất cả những người phụ nữ –<br />
        những bông hoa mạnh mẽ nhất trong khu vườn cuộc sống.”
      </div>

      {/* Câu chúc phụ */}
      <div className="mt-3 text-sm sm:text-base text-gray-600 italic relative z-10 animate-fadein delay-500">
        Hãy luôn tỏa sáng theo cách riêng của bạn 💫
      </div>
      
      {/* Nút chuyển trang */}
      <button
        onClick={() => navigate('/8')}
        className="relative z-10 mt-8 bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition shadow-md flex items-center gap-2 animate-fadein delay-1500"
      >
        Tới trang cuối
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      {/* Tim bay */}
      <div className="absolute bottom-0 animate-floating-hearts text-pink-400 text-2xl">💖</div>
      <div className="absolute bottom-1 left-1/3 animate-floating-hearts delay-1000 text-pink-400 text-xl">💗</div>
      <div className="absolute bottom-2 right-1/4 animate-floating-hearts delay-2000 text-pink-400 text-lg">💞</div>

      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 1s ease-in-out forwards;
          opacity: 0; /* Bắt đầu với trạng thái ẩn */
        }

        @keyframes shine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 3s linear infinite;
        }

        @keyframes floating-hearts {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-160px) scale(0.8); opacity: 0; }
        }
        .animate-floating-hearts {
          animation: floating-hearts 4s ease-in-out infinite;
        }

        .delay-500 { animation-delay: 0.5s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1500 { animation-delay: 1.5s; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}

