import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function FireworkDisplay() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showInstruction, setShowInstruction] = useState(true);
  // 1. Thêm state để quản lý hộp quà và lá thư
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  // Hàm xử lý khi nhấn vào hộp quà
  const handleOpenGift = () => {
      if (isGiftOpened) return;
      setIsGiftOpened(true);
      // Sau khi hộp quà mở, lá thư sẽ hiện ra
      setTimeout(() => {
          setShowLetter(true);
      }, 1000); // Đợi 1 giây cho hiệu ứng mở quà
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let fireworks = [];
    let particles = [];
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const instructionTimer = setTimeout(() => {
      setShowInstruction(false);
    }, 5000);

    const colors = ["255,99,132", "255,182,193", "255,215,0", "255,105,180", "135,206,250", "152,251,152", "221,160,221"];

    // --- Các class Firework và Particle (giữ nguyên) ---
    class Firework {
      constructor(x, y, targetX, targetY, color) {
        this.x = x; this.y = y; this.startX = x; this.startY = y; this.targetX = targetX; this.targetY = targetY;
        this.color = color; this.distance = Math.sqrt(Math.pow(targetX - x, 2) + Math.pow(targetY - y, 2));
        this.speed = 2 + Math.random() * 3; this.angle = Math.atan2(targetY - y, targetX - x);
        this.dx = Math.cos(this.angle) * this.speed; this.dy = Math.sin(this.angle) * this.speed;
        this.currentDistance = 0; this.brightness = Math.random() * 0.5 + 0.5; this.alpha = 1;
      }
      update() {
        this.currentDistance = Math.sqrt(Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2));
        if (this.currentDistance < this.distance) { this.x += this.dx; this.y += this.dy; } 
        else { for (let i = 0; i < 80; i++) { particles.push(new Particle(this.targetX, this.targetY, this.color)); } return true; }
        return false;
      }
      draw() {
        ctx.save(); ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha * this.brightness})`; ctx.fill(); ctx.restore();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color; this.dx = Math.random() * 8 - 4; this.dy = Math.random() * 8 - 4;
        this.alpha = 1; this.decay = Math.random() * 0.03 + 0.01; this.gravity = 0.05;
      }
      update() {
        this.dx *= 0.98; this.dy += this.gravity; this.x += this.dx; this.y += this.dy; this.alpha -= this.decay;
      }
      draw() {
        ctx.save(); ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`; ctx.fill(); ctx.restore();
      }
    }

    const handleInteraction = (e) => {
        const isTouchEvent = e.touches && e.touches.length > 0;
        const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;
        const startX = canvas.width / 2; const startY = canvas.height;
        const targetX = clientX; const targetY = clientY;
        const color = colors[Math.floor(Math.random() * colors.length)];
        fireworks.push(new Firework(startX, startY, targetX, targetY, color));
    }

    canvas.addEventListener('click', handleInteraction);
    canvas.addEventListener('touchstart', handleInteraction);

    const loop = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      fireworks = fireworks.filter(fw => !fw.update());
      fireworks.forEach(fw => fw.draw());
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => { p.update(); p.draw(); });

      if (Math.random() < 0.02) {
        const startX = canvas.width / 2; const startY = canvas.height;
        const targetX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        const targetY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        fireworks.push(new Firework(startX, startY, targetX, targetY, color));
      }

      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleInteraction);
      canvas.removeEventListener('touchstart', handleInteraction);
      clearTimeout(instructionTimer);
    };
  }, []);


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-indigo-900 text-center p-4">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 cursor-pointer" />

      {/* 2. Thêm logic hiển thị quà và thư */}
      <div className="relative z-20 flex flex-col items-center justify-center">
          <AnimatePresence>
              {/* Ban đầu hiển thị hộp quà */}
              {!isGiftOpened && (
                  <motion.div
                      key="gift"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring' }}
                      className="flex flex-col items-center"
                  >
                      <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Một món quà cuối cùng...</h1>
                      <motion.div 
                          className="text-8xl cursor-pointer" 
                          whileHover={{ scale: 1.1 }} 
                          whileTap={{ scale: 0.9 }}
                          onClick={handleOpenGift}
                      >
                          🎁
                      </motion.div>
                  </motion.div>
              )}

              {/* Sau khi mở quà, hiển thị lá thư */}
              {showLetter && (
                  <motion.div
                      key="letter"
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ duration: 0.8, type: 'spring' }}
                      className="bg-white/90 p-8 rounded-lg shadow-2xl max-w-md"
                  >
                      <h2 className="text-2xl font-bold text-pink-600 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>Gửi Nguyễn Thị Kim Ngân</h2>
                      <p className="text-gray-700 text-left mb-6">
                          Tặng em món quà nhỏ 20/10 💐. Mong rằng nó sẽ mang lại niềm vui nho nhỏ cho em... <br></br>"đang trên đường tới nơi vui lòng đợi ..."
                      </p>
                      <div className="text-right text-pink-500 font-semibold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            - Người ấy ✨
                      </div>
                      <button
                          onClick={() => navigate("/1")}
                          className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition transform hover:scale-105"
                      >
                          Quay về trang đầu
                      </button>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {showInstruction && !isGiftOpened && (
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-10 text-white/70 text-sm z-20 pointer-events-none"
            >
                Nhấn hoặc chạm vào bất cứ đâu để bắn pháo hoa
            </motion.p>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </div>
  );
}

