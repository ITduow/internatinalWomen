import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { pages } from "../pagesConfig";

// Component MainLayout đóng vai trò là khung chính cho ứng dụng,
// chứa Sidebar và khu vực hiển thị nội dung của các trang con.
export default function MainLayout() {
  // State để quản lý việc đóng/mở sidebar trên giao diện mobile/tablet.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Hook của React Router để lấy thông tin về URL hiện tại.
  const location = useLocation();

  // Tìm thông tin của trang hiện tại (ví dụ: tên trang) từ file config
  // để hiển thị trên header của mobile.
  const currentPage = pages.find(p => p.path === location.pathname);

  return (
    // Layout chính sử dụng Flexbox trên màn hình lớn (lg).
    <div className="relative min-h-screen bg-pink-50 lg:flex">
      {/* Lớp phủ (overlay) màu đen mờ, chỉ hiển thị khi sidebar mở trên mobile. */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)} // Nhấn vào đây để đóng sidebar
        ></div>
      )}

      {/* Component Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Khu vực nội dung chính, chiếm hết không gian còn lại. */}
      <main className="flex-1">
        {/* Header chỉ hiển thị trên mobile/tablet (ẩn trên màn hình lg trở lên). */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-pink-100/80 p-2 shadow lg:hidden">
          <span className="font-semibold text-pink-600 truncate">
            {currentPage?.name || "Menu"}
          </span>
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Vùng đệm và container cho nội dung trang con. */}
        <div className="p-2 sm:p-6">
          <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4 min-h-[60vh]">
            {/* <Outlet /> là một component đặc biệt của React Router.
                Nó sẽ render component tương ứng với route con hiện tại.
                Ví dụ: nếu URL là /1, <Idea1Surprise /> sẽ được render ở đây. */}
            <Outlet />
          </div>
          <p className="text-xs text-center text-gray-400 mt-8">
            Made for International Women's Day 20-10 ✨  | <a href="https://github.com/" className="underline hover:text-pink-500">Source</a>
          </p>
        </div>
      </main>
    </div>
  );
}

