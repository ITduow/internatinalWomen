import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Component
import MainLayout from "./components/MainLayout";
import Welcome from "./components/Welcome";
import AudioPlayer from "./components/AudioPlayer";
import SpecialPage from "./components/SpecialPage"; // Trang đặc biệt
import FireworkDisplay from "./components/FireworkDisplay";
// Các trang ý tưởng
import Idea1Surprise from "./components/Idea1Surprise";
import Idea2Letter from "./components/Idea2Letter";
import Idea3FindFlower from "./components/Idea3FindFlower";
import Idea4SlideStory from "./components/Idea4SlideStory";
import Idea5MagicMirror from "./components/Idea5MagicMirror";
import Idea6SecretCard from "./components/Idea6SecretCard";
import Idea7Minimal from "./components/Idea7Minimal";
import Idea8BloomOnClick from "./components/Idea8BloomOnClick";

export default function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Hàm này được gọi từ trang Welcome để bắt đầu chơi nhạc
  const handleStart = () => {
    setIsMusicPlaying(true);
  };

  return (
    <>
      <AudioPlayer isPlaying={isMusicPlaying} />
      <Routes>
        {/* Route 1: Trang chào mừng, không có sidebar */}
        <Route path="/" element={<Welcome onStart={handleStart} />} />

        {/* Route 2: Layout chính chứa sidebar và các trang con */}
        <Route element={<MainLayout />}>
          <Route path="/1" element={<Idea1Surprise />} />
          <Route path="/2" element={<Idea2Letter />} />
          <Route path="/3" element={<Idea3FindFlower />} />
          <Route path="/4" element={<Idea4SlideStory />} />
          <Route path="/5" element={<Idea5MagicMirror />} />
          <Route path="/6" element={<Idea6SecretCard />} />
          <Route path="/7" element={<Idea7Minimal />} />
          <Route path="/8" element={<Idea8BloomOnClick />} />
          <Route path="/special" element={<SpecialPage />} />
          <Route path="/fireworks" element={<FireworkDisplay />} />
        </Route>
        
        {/* Nếu người dùng vào một đường dẫn không tồn tại, chuyển về trang chào mừng */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

