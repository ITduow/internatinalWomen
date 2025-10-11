import { useEffect, useRef, useState } from "react";
// 1. Import useNavigate để điều hướng
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Những người phụ nữ tuyệt vời",
    content: "Mẹ, chị, bạn bè, đồng nghiệp... Mỗi người là một bông hoa đặc biệt.",
    img: "https://poolspavietnam.com.vn/wp-content/uploads/2024/10/chuc-mung-ngay-phu-nu-viet-nam-20-10-loi-tri-an-tu-nam-thanh.jpg"
  },
  {
    title: "Trích dẫn truyền cảm hứng",
    content: '"Không có giới hạn cho những gì chúng ta có thể đạt được, với tư cách là phụ nữ." — Michelle Obama',
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtxHJVthDETbnwZz_VRS2V3g26epsMCxaJfg&s"
  },
  {
    title: "Cổ vũ tinh thần",
    content: "Hãy luôn mạnh mẽ, kiên cường và tiếp tục tỏa sáng theo cách của riêng bạn! ✨💪",
    img: "https://i.pinimg.com/736x/b3/35/57/b33557878f6a6ea9826cad993b7fe043.jpg"
  },
  {
    title: "Lời chúc riêng",
    content: "Mong em luôn bình yên, rực rỡ và gặp thật nhiều điều khiến tim mỉm cười! 😊🌸",
    img: `${import.meta.env.BASE_URL}congchua.jpg`
  },
  {
    title: "Chúc mừng Ngày Phụ nữ Việt Nam!",
    content: "💐 Hoa nở ngập tràn — dành tặng em, người phụ nữ tuyệt vời!",
    img: "https://elead.com.vn/wp-content/uploads/2020/04/anh-hoa-hong-sinh-nhat-2-1.jpg"
  },
];

export default function Idea4SlideStory() {
  const [idx, setIdx] = useState(0);
  const wrapperRef = useRef();
  // 2. Khởi tạo hook navigate
  const navigate = useNavigate();

  // Xử lý sự kiện cuộn chuột (giữ nguyên)
  useEffect(() => {
    function onWheel(e) {
      // Ngăn hành vi cuộn mặc định của trang
      e.preventDefault();
      if (e.deltaY > 0 && idx < slides.length - 1) setIdx(i => i + 1);
      if (e.deltaY < 0 && idx > 0) setIdx(i => i - 1);
    }
    const node = wrapperRef.current;
    if (node) {
      node.addEventListener("wheel", onWheel, { passive: false });
    }
    return () => {
      if (node) {
        node.removeEventListener("wheel", onWheel);
      }
    };
  }, [idx]);

  // Xử lý sự kiện bàn phím
  useEffect(() => {
      function onKeyDown(e) {
          if (e.key === 'ArrowRight' && idx < slides.length - 1) {
              setIdx(i => i + 1);
          }
          if (e.key === 'ArrowLeft' && idx > 0) {
              setIdx(i => i - 1);
          }
      }
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
  }, [idx]);

  return (
    <div ref={wrapperRef} tabIndex={-1} className="outline-none flex flex-col" style={{ minHeight: 400 }}>
      <div className="mb-4 text-center text-gray-600 text-xs">Dùng chuột cuộn hoặc phím ← → để xem</div>
      
      <div className="relative flex-grow flex flex-col items-center justify-center p-4 bg-pink-50 rounded-lg">
        {/* Sử dụng AnimatePresence để tạo hiệu ứng chuyển slide */}
        <div key={idx} className="w-full flex flex-col items-center justify-center animate-fadein">
            <img 
                src={slides[idx].img} 
                alt={slides[idx].title} 
                className="w-48 h-48 object-cover rounded-lg shadow-lg mb-4" 
                onError={(e) => { e.target.src = 'https://placehold.co/200x200/fce7f3/f472b6?text=Image' }}
            />
            <h3 className="text-lg font-bold text-pink-500 text-center">{slides[idx].title}</h3>
            <p className="text-center text-gray-700 mt-1 text-sm">{slides[idx].content}</p>
        </div>
        
        {idx === slides.length - 1 && (
          <div className="absolute inset-0 flex items-center justify-center animate-float pointer-events-none">
            <span className="text-5xl opacity-70">🌸🌺🌷🌻💐</span>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button key={i} className={`w-3 h-3 rounded-full transition-all ${i === idx ? "bg-pink-400 scale-125" : "bg-pink-200"}`} onClick={() => setIdx(i)} />
        ))}
      </div>

      <div className="flex justify-between mt-2 text-xs px-2">
        <button className="text-pink-400 disabled:opacity-50" disabled={idx === 0} onClick={() => setIdx(i => i > 0 ? i - 1 : 0)}>← Trước</button>
        <span>{idx + 1} / {slides.length}</span>
        <button className="text-pink-400 disabled:opacity-50" disabled={idx === slides.length - 1} onClick={() => setIdx(i => i < slides.length - 1 ? i + 1 : i)}>Sau →</button>
      </div>

      {/* 3. Thêm nút chuyển trang ở đây, chỉ hiển thị ở slide cuối */}
      <div className="mt-4 text-center h-12">
        {idx === slides.length - 1 && (
            <button
                onClick={() => navigate('/5')}
                className="animate-fadein bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition shadow-md flex items-center gap-2 mx-auto"
            >
                Khám phá Gương thần
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0_0_24_24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        )}
      </div>

      <style>{`
        .animate-float { animation: floatflower 2s infinite alternate ease-in-out; }
        @keyframes floatflower { to { transform: translateY(-16px); } }
        .animate-fadein { animation: fadein 0.5s ease-in-out; }
        @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
