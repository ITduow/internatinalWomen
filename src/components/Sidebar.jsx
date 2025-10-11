import { NavLink } from "react-router-dom";
import { pages } from "../pagesConfig"; // Import từ file config

export default function Sidebar({ isOpen, onClose }) {
  // Thay đổi tất cả các tiền tố `md:` thành `lg:`
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30
    w-64 bg-pink-100/95 p-4 shadow-lg
    transform transition-transform duration-300 ease-in-out
    lg:sticky lg:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex flex-col gap-2">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-2 text-pink-600 lg:hidden" // Thay đổi md:hidden thành lg:hidden
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-pink-700 mb-4 mt-8 lg:mt-0">8:Thông điệp 20-10</h2>
        
        {pages.map(page => (
          <NavLink
            key={page.path}
            to={page.path}
            onClick={onClose} 
            className={({ isActive }) =>
              "w-full px-4 py-2 rounded-lg text-sm font-semibold transition text-left " +
              (isActive
                ? "bg-pink-400 text-white shadow"
                : "bg-white text-pink-600 hover:bg-pink-200")
            }
            end
          >
            {page.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}