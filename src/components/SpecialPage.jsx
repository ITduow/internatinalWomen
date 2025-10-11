import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function FireworkDisplay() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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

    const colors = ["255,99,132", "255,182,193", "255,215,0", "255,105,180", "135,206,250", "152,251,152", "221,160,221"];

    class Firework {
      constructor(x, y, targetX, targetY, color) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.distance = Math.sqrt(Math.pow(targetX - x, 2) + Math.pow(targetY - y, 2));
        this.speed = 2 + Math.random() * 3; // Tốc độ ban đầu
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.dx = Math.cos(this.angle) * this.speed;
        this.dy = Math.sin(this.angle) * this.speed;
        this.currentDistance = 0;
        this.brightness = Math.random() * 0.5 + 0.5;
        this.alpha = 1;
      }

      update() {
        this.currentDistance = Math.sqrt(Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2));

        if (this.currentDistance < this.distance) {
          this.x += this.dx;
          this.y += this.dy;
        } else {
          // Explode
          for (let i = 0; i < 80; i++) {
            particles.push(new Particle(this.targetX, this.targetY, this.color));
          }
          return true; // Indicates it should be removed
        }
        return false;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha * this.brightness})`;
        ctx.fill();
        ctx.restore();
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.dx = Math.random() * 8 - 4;
        this.dy = Math.random() * 8 - 4;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.01;
        this.gravity = 0.05;
      }

      update() {
        this.dx *= 0.98; // Air resistance
        this.dy += this.gravity;
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
      }
    }

    const loop = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const done = fireworks[i].update();
        fireworks[i].draw();
        if (done) {
          fireworks.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      if (Math.random() < 0.1) { // Tần suất bắn pháo hoa
        const startX = canvas.width / 2;
        const startY = canvas.height;
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
    };
  }, []);


  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100vh] overflow-hidden bg-gradient-to-br from-gray-900 to-indigo-900 text-center p-4">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="relative z-20">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-white mb-8 drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          Chúc mừng ngày đặc biệt!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <button
            onClick={() => navigate("/1")}
            className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300 ease-in-out shadow-xl transform hover:scale-105"
          >
            Quay về trang đầu
          </button>
        </motion.div>
      </div>
    </div>
  );
}