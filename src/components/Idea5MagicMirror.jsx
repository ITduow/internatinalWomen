import { useEffect, useRef, useState } from "react";
// 1. Import useNavigate để điều hướng
import { useNavigate } from "react-router-dom";


export default function Idea5MagicMirror() {
  const videoRef = useRef();
  const captureCanvasRef = useRef();
  const combineCanvasRef = useRef();
  const audioRef = useRef();
  // 2. Khởi tạo hook navigate
  const navigate = useNavigate();
  const [facingMode, setFacingMode] = useState("user");
  const [fadeIn, setFadeIn] = useState(false);
  const [flash, setFlash] = useState(false);
  const [photos, setPhotos] = useState([]); // collected mini shots (dataURLs)
  const [finalPhoto, setFinalPhoto] = useState(null);
  const [mode, setMode] = useState("single"); // "single" | "vertical" | "grid"
  const [filter, setFilter] = useState("softpink");
  const [frame, setFrame] = useState("frame1");
  const [caption, setCaption] = useState("Nụ cười của bạn thật đẹp!");
  const [randomCaption, setRandomCaption] = useState(false);
  const boothCount = 4; // fixed 4 for booth modes

  // Filters & frames
  const filters = {
    softpink: { name: "Soft Pink 💗", css: "brightness(1.08) contrast(1.03) saturate(1.15)", overlay: "rgba(255,182,193,0.12)" },
    coolblue: { name: "Cool Blue 💙", css: "brightness(1.05) contrast(1.03) saturate(1.05)", overlay: "rgba(173,216,230,0.10)" },
    warmglow: { name: "Warm Glow ☀️", css: "brightness(1.12) contrast(1.06) saturate(1.18)", overlay: "rgba(255,200,150,0.11)" },
  };

  const frames = {
    frame1: { name: "Khung Hoa 🌸", border: "rgba(244,114,182,0.9)", deco: "🌸" },
    frame2: { name: "Khung Tim 💖", border: "rgba(255,105,180,0.9)", deco: "💖" },
    frame3: { name: "Khung Ánh Sáng ✨", border: "rgba(255,215,0,0.9)", deco: "✨" },
    frame4: { name: "Khung Biển 🌊", border: "rgba(100,149,237,0.9)", deco: "🌊" },
    frame5: { name: "Khung Lá 🌿", border: "rgba(60,179,113,0.9)", deco: "🌿" },
    frame6: { name: "Khung Ảo Diệu 🪞", border: "rgba(186,85,211,0.9)", deco: "🪞" },
  };

  // caption pool (one set used for booth 4)
  const boothCaptions = [
    "Nụ cười đẹp nhất hôm nay 🌸",
    "Cười tươi nhaaaa ~ 💕",
    "Một ngày xinh đẹp bắt đầu bằng nụ cười của bạn!",
    "Love Yourself Every Day 💖",
    "Keep Smiling, Shine Bright! ✨",
  ];

  // inject CSS for fade animation once
  useEffect(() => {
    const id = "mm-pro-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.innerHTML = `
        @keyframes mm-fadeOut { from { opacity: 1 } to { opacity: 0 } }
        .mm-animate-fade { animation: mm-fadeOut 0.35s ease-out forwards; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setTimeout(() => setFadeIn(true), 160);
      }
    } catch (err) {
      console.error("Không mở được camera:", err);
      alert("Không thể truy cập camera. Vui lòng cấp quyền truy cập camera trong cài đặt trình duyệt của bạn.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const toggleCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    setFadeIn(false);
    setFacingMode((p) => (p === "user" ? "environment" : "user"));
  };

  // utility: random caption
  const pickRandomCaption = () => boothCaptions[Math.floor(Math.random() * boothCaptions.length)];

  // draw rounded rect helper
  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // capture logic for one mini shot (used for single and each booth shot)
  const captureOne = () => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;

    // flash + audio
    setFlash(true);
    setTimeout(() => setFlash(false), 220);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // mirror for front camera visually - draw flipped so looks like selfie
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // apply filter while drawing video
    ctx.filter = filters[filter].css;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // overlay color tint for filter
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = filters[filter].overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.filter = "none";

    // draw frame border
    const border = Math.floor(Math.min(canvas.width, canvas.height) * 0.045);
    ctx.lineWidth = border;
    ctx.strokeStyle = frames[frame].border;
    ctx.strokeRect(border / 2, border / 2, canvas.width - border, canvas.height - border);

    // deco emojis on corners
    const deco = frames[frame].deco;
    const decoSize = Math.floor(Math.min(canvas.width, canvas.height) * 0.07);
    ctx.font = `${decoSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(deco, decoSize, decoSize);
    ctx.fillText(deco, canvas.width - decoSize, decoSize);
    ctx.fillText(deco, decoSize, canvas.height - decoSize);
    ctx.fillText(deco, canvas.width - decoSize, canvas.height - decoSize);

    // reset transform to draw caption upright
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // caption box inside each shot
    const boxW = Math.floor(canvas.width * 0.72);
    const boxH = Math.floor(canvas.height * 0.12);
    const boxX = (canvas.width - boxW) / 2;
    const boxY = canvas.height - boxH - Math.floor(canvas.height * 0.03);
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    roundRect(ctx, boxX, boxY, boxW, boxH, 18);
    ctx.fill();

    // text caption
    const useCaption = mode === "single" ? caption : (randomCaption ? pickRandomCaption() : caption);
    ctx.fillStyle = "#ec4899";
    ctx.font = `bold ${Math.floor(boxH * 0.55)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(useCaption, canvas.width / 2, boxY + boxH / 2);

    // export mini-shot
    const dataUrl = canvas.toDataURL("image/png");

    if (mode === "single") {
      setFinalPhoto(dataUrl);
    } else {
      // booth mode: push into photos array
      const next = [...photos, dataUrl];
      setPhotos(next);
      // if enough shots -> combine
      if (next.length >= boothCount) {
        // small delay for UX
        setTimeout(() => combinePhotos(next.slice(0, boothCount)), 200);
        setPhotos([]);
      }
    }
  };

  // combine photos into final (vertical or grid)
  const combinePhotos = async (imgsDataUrls) => {
    // create Image objects & wait load
    const imgEls = await Promise.all(
      imgsDataUrls.map((d) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = d; }))
    );

    // use natural size of first image
    const w = imgEls[0].width;
    const h = imgEls[0].height;
    // final canvas size depends on layout (vertical or grid)
    const layout = mode === "vertical" ? "vertical" : "grid";
    let canvasW, canvasH;
    if (layout === "vertical") {
      canvasW = w;
      canvasH = h * 4;
    } else {
      canvasW = w * 2;
      canvasH = h * 2;
    }

    const canvas = combineCanvasRef.current || document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d");

    // background white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasW, canvasH);

    // draw each small image to correct cell
    if (layout === "vertical") {
      for (let i = 0; i < 4; i++) {
        const img = imgEls[i];
        ctx.drawImage(img, 0, i * h, w, h);
      }
    } else {
      // grid 2x2 order: 0 TL, 1 TR, 2 BL, 3 BR
      ctx.drawImage(imgEls[0], 0, 0, w, h);
      ctx.drawImage(imgEls[1], w, 0, w, h);
      ctx.drawImage(imgEls[2], 0, h, w, h);
      ctx.drawImage(imgEls[3], w, h, w, h);
    }

    // draw decorative border around final
    const totalBorder = Math.floor(Math.min(canvasW, canvasH) * 0.03);
    ctx.lineWidth = totalBorder;
    ctx.strokeStyle = frames[frame].border;
    roundRect(ctx, totalBorder / 2, totalBorder / 2, canvasW - totalBorder, canvasH - totalBorder, 30);
    ctx.stroke();

    // small footer: filter+frame label
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.font = `${Math.floor(Math.min(canvasW, canvasH) * 0.03)}px sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`${filters[filter].name} • ${frames[frame].name}`, totalBorder + 8, totalBorder + 18);

    // big caption in center bottom
    ctx.fillStyle = "#ec4899";
    ctx.font = `bold ${Math.floor(Math.min(canvasW, canvasH) * 0.045)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Nụ cười đẹp nhất hôm nay 🌸", canvasW / 2, canvasH - Math.floor(Math.min(canvasW, canvasH) * 0.03));

    const finalData = canvas.toDataURL("image/png");
    setFinalPhoto(finalData);
  };

  const resetAll = () => {
    setPhotos([]);
    setFinalPhoto(null);
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      {/* Camera + preview */}
      <div className={`relative w-full max-w-sm h-96 rounded-xl overflow-hidden border-4 transition-all duration-400 ${fadeIn ? "border-pink-300 shadow-[0_0_20px_#f9a8d4]" : "border-transparent"}`} style={{ borderColor: frames[frame].border }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-400 ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
          style={{ filter: filters[filter].css }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: filters[filter].overlay }} />

        {/* decoration emojis */}
        <div className="absolute inset-0 pointer-events-none text-3xl">
          <div className="absolute top-2 left-2 animate-bounce">{frames[frame].deco}</div>
          <div className="absolute top-2 right-2 animate-pulse">{frames[frame].deco}</div>
          <div className="absolute bottom-3 left-4 animate-bounce">{frames[frame].deco}</div>
          <div className="absolute bottom-3 right-6 animate-pulse">{frames[frame].deco}</div>
        </div>

        {/* bottom caption overlay */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center pointer-events-none">
          <div className="px-3 py-2 bg-white/85 rounded-lg shadow text-pink-500 font-bold text-sm sm:text-lg text-center">{caption}</div>
        </div>

        {/* flash white overlay */}
        {flash && <div className="absolute inset-0 bg-white mm-animate-fade pointer-events-none" />}
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <div className="flex gap-2">
          <button onClick={() => setMode("single")} className={`px-3 py-2 rounded-lg ${mode === "single" ? "bg-pink-400 text-white" : "bg-gray-200"}`}>Chế độ đơn</button>
          <button onClick={() => setMode("vertical")} className={`px-3 py-2 rounded-lg ${mode === "vertical" ? "bg-pink-400 text-white" : "bg-gray-200"}`}>4 khung dọc</button>
          <button onClick={() => setMode("grid")} className={`px-3 py-2 rounded-lg ${mode === "grid" ? "bg-pink-400 text-white" : "bg-gray-200"}`}>2×2 vuông</button>
        </div>

        <button onClick={toggleCamera} className="px-3 py-2 bg-pink-400 text-white rounded-lg">🔄 Đổi camera</button>
        <button onClick={captureOne} className="px-3 py-2 bg-green-500 text-white rounded-lg">📸 Chụp {mode === "single" ? "" : `(${photos.length}/${boothCount})`}</button>
        <button onClick={resetAll} className="px-3 py-2 bg-gray-100 rounded-lg">♻️ Reset</button>
      </div>

      {/* filters, frames, caption settings */}
      <div className="flex flex-col gap-2 items-center w-full">
        {/* filters */}
        <div className="flex gap-2 flex-wrap justify-center">
          {Object.entries(filters).map(([k, f]) => (
            <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-sm ${filter === k ? "bg-pink-400 text-white" : "bg-gray-200"}`}>{f.name}</button>
          ))}
        </div>

        {/* frames */}
        <div className="flex gap-2 flex-wrap justify-center">
          {Object.entries(frames).map(([k, fr]) => (
            <button key={k} onClick={() => setFrame(k)} className={`px-3 py-1.5 rounded-full text-sm ${frame === k ? "bg-pink-400 text-white" : "bg-gray-200"}`}>{fr.name}</button>
          ))}
        </div>

        {/* caption controls */}
        <div className="flex gap-2 items-center">
          <input value={caption} onChange={(e) => setCaption(e.target.value)} className="px-3 py-2 rounded-lg border w-60" placeholder="Nhập lời chúc..." />
          <button onClick={() => setCaption(pickRandomCaption())} className="px-3 py-2 bg-gray-200 rounded-lg">Ngẫu nhiên</button>
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={randomCaption} onChange={() => setRandomCaption((s) => !s)} /> Tự động (chụp nhiều ảnh)
          </label>
        </div>
      </div>

      {/* thumbnails during booth capture */}
      {photos.length > 0 && (
        <div className="flex gap-2 items-center">
          {photos.map((p, i) => <img key={i} src={p} alt={`mini-${i}`} className="w-20 h-28 object-cover rounded-md border border-pink-200 shadow" />)}
        </div>
      )}

      {/* final result */}
      {finalPhoto && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="text-gray-600 text-sm">Ảnh của bạn đã sẵn sàng!</div>
          <img src={finalPhoto} alt="final" className="w-64 rounded-lg shadow border border-pink-200" />
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <a href={finalPhoto} download={`gương-ao-dieu-${mode}.png`} className="px-4 py-2 bg-pink-400 text-white rounded-lg">⬇️ Tải xuống</a>
            <button onClick={() => setFinalPhoto(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Đóng</button>
            {/* 3. Thêm nút chuyển trang tại đây */}
            <button
              onClick={() => navigate('/6')}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg flex items-center gap-2"
            >
              Tiếp theo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* hidden canvases & audio */}
      <canvas ref={captureCanvasRef} className="hidden" />
      <canvas ref={combineCanvasRef} className="hidden" />
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/camera/camera_click.ogg" preload="auto" />
    </div>
  );
}
