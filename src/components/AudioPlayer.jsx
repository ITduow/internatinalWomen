import { useEffect, useRef } from 'react';

export default function AudioPlayer({ isPlaying }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Bắt đầu chơi nhạc và xử lý lỗi nếu trình duyệt chặn tự động phát
      audio.play().catch(error => {
        console.warn("Audio autoplay was prevented by browser policy:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]); // Effect này sẽ chạy lại mỗi khi `isPlaying` thay đổi

  return (
    <audio 
      ref={audioRef} 
      src="/chamhoa.mp3" // Một bản nhạc nền nhẹ nhàng, lặp lại
      loop 
    />
  );
}
