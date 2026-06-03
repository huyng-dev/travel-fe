"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Phone, Compass, ChevronRight, Menu, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // States cho Sidebar 2 Lớp (Nested Sidebars)
  // activeMenu: Menu chính được chọn ("cruise" | "hotel" | "combo" | "blog" hoặc null)
  const [activeMenu, setActiveMenu] = useState<"cruise" | "hotel" | "combo" | "blog" | null>(null);
  // activeOption: Option của lớp 1 được chọn (ví dụ: "Điểm đến", "Hạng sao" hoặc null)
  const [activeOption, setActiveOption] = useState<string | null>(null);

  // States cho Dropdown ngôn ngữ
  const [currentLang, setCurrentLang] = useState<"vi" | "en">("vi");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (activeMenu !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeMenu]);

  // Đóng toàn bộ Sidebars
  const closeSidebars = () => {
    setActiveMenu(null);
    setActiveOption(null);
  };

  // Định nghĩa nội dung cấu trúc Lọc lớp 1 và lớp 2
  const menuStructures = {
    cruise: {
      title: "Du Thuyền Hạ Long",
      options: [
        {
          name: "Tuyến điểm du ngoạn",
          subValues: [
            { label: "Vịnh Hạ Long", query: "/cruises?destination=Vịnh Hạ Long" },
            { label: "Vịnh Lan Hạ", query: "/cruises?destination=Vịnh Lan Hạ" },
            { label: "Đảo Cát Bà", query: "/cruises?destination=Đảo Cát Bà" }
          ]
        },
        {
          name: "Hạng sao",
          subValues: [
            { label: "Siêu du thuyền 6 sao", query: "/cruises?stars=5" },
            { label: "Du thuyền hạng sang 5 sao", query: "/cruises?stars=5" }
          ]
        }
      ]
    },
    hotel: {
      title: "Khách Sạn & Resort Hạ Long",
      options: [
        {
          name: "Khu vực địa lý",
          subValues: [
            { label: "Bãi Cháy (Trung tâm)", query: "/hotels?location=Bãi Cháy" },
            { label: "Đảo Rều (Biệt lập)", query: "/hotels?location=Đảo Rều" },
            { label: "Quang Hanh (Khoáng nóng)", query: "/hotels?location=Quang Hanh" }
          ]
        },
        {
          name: "Hạng sao",
          subValues: [
            { label: "Resort 5 sao cao cấp", query: "/hotels?stars=5" },
            { label: "Villa & Khách sạn Boutique", query: "/hotels?stars=5" }
          ]
        }
      ]
    },
    combo: {
      title: "Combo Nghỉ Dưỡng Đặc Quyền",
      options: [
        {
          name: "Hạng sao",
          subValues: [
            { label: "Combo 5 sao cao cấp", query: "/combos?stars=5" }
          ]
        },
        {
          name: "Hạn mức ngân sách",
          subValues: [
            { label: "Dưới 8 Triệu VNĐ", query: "/combos?price=low" },
            { label: "Trên 8 Triệu VNĐ", query: "/combos?price=high" }
          ]
        }
      ]
    },
    blog: {
      title: "Tạp Chí Du Lịch TRAVEL Hạ Long",
      options: [
        {
          name: "Danh mục tạp chí",
          subValues: [
            { label: "Cẩm nang du lịch", query: "/blogs?category=du-lich" },
            { label: "Trải nghiệm du thuyền", query: "/blogs?category=du-thuyen" },
            { label: "Khách sạn nghỉ dưỡng", query: "/blogs?category=khach-san" },
            { label: "Kinh nghiệm du hành", query: "/blogs?category=kinh-nghiem" },
            { label: "Thông tin ưu đãi đặc quyền", query: "/blogs?category=uu-dai" }
          ]
        }
      ]
    }
  };

  const handleSubValueClick = (query: string) => {
    closeSidebars();
    router.push(query);
  };

  const navMenus = [
    { key: "cruise" as const, label: "Du thuyền" },
    { key: "hotel" as const, label: "Khách sạn" },
    { key: "combo" as const, label: "Combo du lịch" },
    { key: "blog" as const, label: "Blog" }
  ];

  const allLinks = {
    cruise: { label: "Xem tất cả du thuyền", path: "/cruises" },
    hotel: { label: "Xem tất cả khách sạn", path: "/hotels" },
    combo: { label: "Xem tất cả combo", path: "/combos" },
    blog: { label: "Xem tất cả bài viết", path: "/blogs" }
  };

  return (
    <>
      {/* HEADER NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-500 ${
          isScrolled || activeMenu !== null
            ? "bg-white py-4 shadow-md text-slate-800"
            : "bg-transparent py-6 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Menu chính bên trái (Du thuyền, Khách sạn...) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navMenus.map((menu) => (
              <button
                key={menu.key}
                onClick={() => {
                  setActiveMenu(activeMenu === menu.key ? null : menu.key);
                  setActiveOption(null);
                }}
                className={`text-xs uppercase tracking-[0.15em] font-semibold py-1 transition-colors duration-300 relative group flex items-center gap-1 cursor-pointer ${
                  activeMenu === menu.key
                    ? "text-accent-dark"
                    : isScrolled || activeMenu !== null
                    ? "text-slate-800 hover:text-accent-dark"
                    : "text-white hover:text-accent"
                }`}
              >
                {menu.label}
                <span className={`absolute bottom-0 left-0 h-[1.5px] bg-accent transition-all duration-300 ${
                  activeMenu === menu.key ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </button>
            ))}
          </nav>

          {/* Logo TRAVEL ở trung tâm */}
          <Link href="/" onClick={closeSidebars} className="flex items-center gap-2 group absolute left-1/2 -translate-x-1/2">
            <Compass className="w-7 h-7 text-accent group-hover:rotate-45 transition-transform duration-500" />
            <div className="flex flex-col text-center">
              <span className={`font-serif text-lg tracking-[0.25em] font-bold ${
                isScrolled || activeMenu !== null ? "text-slate-900" : "text-white"
              }`}>
                TRAVEL
              </span>
            </div>
          </Link>

          {/* Hotline, Ngôn ngữ & Liên hệ bên phải */}
          <div className="flex items-center space-x-6 z-10 ml-auto">
            {/* Bộ chọn Ngôn ngữ */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`flex items-center gap-1.5 text-xs font-semibold py-1 transition-colors duration-300 cursor-pointer ${
                  isScrolled || activeMenu !== null ? "text-slate-800 hover:text-[#001226]" : "text-white hover:text-slate-200"
                }`}
                aria-label="Chọn ngôn ngữ"
              >
                <Globe className="w-4 h-4 text-accent" />
                <span className="uppercase tracking-[0.05em]">{currentLang === "vi" ? "VI" : "EN"}</span>
              </button>
              
              <AnimatePresence>
                {showLangDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-xl border border-slate-100 py-1.5 z-50 text-slate-800"
                    >
                      <button
                        onClick={() => {
                          setCurrentLang("vi");
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                          currentLang === "vi" ? "text-[#001226] bg-slate-50" : "text-slate-650"
                        }`}
                      >
                        Tiếng Việt
                        {currentLang === "vi" && <span className="w-1.5 h-1.5 rounded-full bg-[#001226]" />}
                      </button>
                      <button
                        onClick={() => {
                          setCurrentLang("en");
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                          currentLang === "en" ? "text-[#001226] bg-slate-50" : "text-slate-650"
                        }`}
                      >
                        English
                        {currentLang === "en" && <span className="w-1.5 h-1.5 rounded-full bg-[#001226]" />}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Số điện thoại */}
            <a
              href="tel:19001234"
              className={`hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.12em] font-semibold ${
                isScrolled || activeMenu !== null ? "text-slate-800 hover:text-[#001226]" : "text-white hover:text-slate-200"
              }`}
            >
              <Phone className="w-4 h-4 text-accent" />
              <span>1900 1234</span>
            </a>

            {/* Nút Liên hệ trên desktop */}
            <Link
              href="/contact"
              onClick={closeSidebars}
              className={`hidden lg:block px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold rounded-full border transition-all duration-300 ${
                isScrolled || activeMenu !== null
                  ? "bg-[#001226] text-white hover:bg-accent hover:text-[#001226] border-[#001226] hover:border-accent"
                  : "bg-white text-slate-800 hover:bg-accent hover:text-[#001226] border-white hover:border-accent"
              }`}
            >
              Liên hệ tư vấn
            </Link>

            {/* Mobile Hamburger Icon */}
            <button
              onClick={() => {
                if (activeMenu) {
                  closeSidebars();
                } else {
                  setActiveMenu("cruise");
                }
              }}
              className="lg:hidden p-1.5 rounded-full border border-slate-200 text-slate-800 bg-white shadow-sm hover:bg-slate-50 cursor-pointer"
              aria-label="Mở menu di động"
            >
              {activeMenu !== null ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* NESTED SIDEBARS FLAT STRUCTURE */}
      <AnimatePresence>
        {/* 1. Backdrop */}
        {activeMenu !== null && (
          <motion.div
            key="navbar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebars}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
          />
        )}

        {/* 2. Sidebar Lớp 1 (Trượt từ trái) */}
        {activeMenu !== null && (
          <motion.div
            key="navbar-sidebar-1"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full lg:w-80 bg-white border-r border-slate-200 pt-24 lg:pt-28 px-6 pb-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            {/* Nút X đóng nhanh trên di động */}
            <button
              onClick={closeSidebars}
              className="absolute top-6 right-6 p-2 rounded-full border border-slate-200 text-slate-800 bg-white shadow-sm hover:bg-slate-50 lg:hidden cursor-pointer"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Tabs chuyển nhanh danh mục trên di động */}
              <div className="flex border-b border-slate-100 lg:hidden overflow-x-auto gap-4 pb-2 -mx-2 scrollbar-none">
                {navMenus.map((menu) => (
                  <button
                    key={menu.key}
                    onClick={() => {
                      setActiveMenu(menu.key);
                      setActiveOption(null);
                    }}
                    className={`whitespace-nowrap px-3 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold border-b-2 transition-all duration-300 cursor-pointer ${
                      activeMenu === menu.key
                        ? "border-accent text-accent-dark"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {menu.label}
                  </button>
                ))}
              </div>

              {/* Tiêu đề Menu chính */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                  Danh mục tìm kiếm
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 leading-tight">
                  {menuStructures[activeMenu].title}
                </h3>
              </div>

              {/* Các tùy chọn lọc chính */}
              <div className="space-y-4">
                {activeMenu && (
                  <button
                    onClick={() => handleSubValueClick(allLinks[activeMenu].path)}
                    className="w-full flex items-center justify-between py-4 border-b border-accent-dark/20 text-left text-sm uppercase tracking-wider font-bold text-accent-dark hover:text-slate-900 transition-colors duration-300 cursor-pointer"
                  >
                    <span>{allLinks[activeMenu].label}</span>
                    <ChevronRight className="w-4 h-4 text-accent-dark" />
                  </button>
                )}

                {activeMenu === "blog" ? (
                  menuStructures.blog.options[0].subValues.map((val) => (
                    <button
                      key={val.label}
                      onClick={() => handleSubValueClick(val.query)}
                      className="w-full flex items-center justify-between py-4 border-b border-slate-100 text-left text-sm uppercase tracking-wider font-semibold text-slate-700 hover:text-accent-dark transition-colors duration-300 cursor-pointer"
                    >
                      <span>{val.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))
                ) : (
                  menuStructures[activeMenu].options.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setActiveOption(activeOption === opt.name ? null : opt.name)}
                      className={`w-full flex items-center justify-between py-4 border-b border-slate-100 text-left text-sm uppercase tracking-wider font-semibold transition-colors duration-300 cursor-pointer ${
                        activeOption === opt.name
                          ? "text-accent-dark border-accent-dark/30"
                          : "text-slate-700 hover:text-accent-dark"
                      }`}
                    >
                      <span>{opt.name}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                        activeOption === opt.name ? "rotate-90 text-accent-dark" : "text-slate-400"
                      }`} />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Hỗ trợ & Liên hệ dưới cùng */}
            <div className="border-t border-slate-100 pt-6 space-y-4 text-xs text-slate-500">
              <p>Cần hỗ trợ đặt vé du thuyền hoặc phòng?</p>
              <div className="flex items-center gap-4">
                <a href="tel:19001234" className="flex items-center gap-2 font-semibold text-slate-800 hover:text-accent">
                  <Phone className="w-4 h-4 text-accent" />
                  1900 1234
                </a>
              </div>

              {/* Nút Liên hệ tư vấn dưới cùng trên di động/sidebar */}
              <Link
                href="/contact"
                onClick={closeSidebars}
                className="mt-2 block w-full text-center py-3 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] border border-[#001226] hover:border-accent rounded-full text-xs uppercase tracking-[0.15em] font-bold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </motion.div>
        )}

        {/* 3. Sidebar Lớp 2 (Đồng cấp phẳng) */}
        {activeMenu !== null && activeOption !== null && (
          <motion.div
            key="navbar-sidebar-2"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1 
            }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed top-0 left-0 lg:left-80 bottom-0 bg-slate-50 border-r border-slate-200 pt-24 lg:pt-28 px-6 pb-6 shadow-xl flex flex-col justify-between w-full lg:w-80 z-[55] lg:z-[45] overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Nút Quay lại trên di động / máy tính */}
              <button
                onClick={() => setActiveOption(null)}
                className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-slate-650 hover:text-accent-dark cursor-pointer pb-2 border-b border-slate-200/60"
              >
                <ChevronRight className="w-4 h-4 rotate-180 text-accent" />
                Quay lại
              </button>

              {/* Tiêu đề tùy chọn phụ */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-450 font-semibold">
                  Lọc cụ thể
                </span>
                <h4 className="font-serif text-lg font-bold text-slate-800 leading-tight">
                  {activeOption}
                </h4>
              </div>

              {/* Danh sách các giá trị lọc cụ thể */}
              <div className="space-y-1.5">
                {menuStructures[activeMenu].options
                  .find((opt) => opt.name === activeOption)
                  ?.subValues.map((val) => (
                    <button
                      key={val.label}
                      onClick={() => handleSubValueClick(val.query)}
                      className="w-full flex items-center justify-between py-3 bg-transparent text-left text-xs font-semibold text-slate-700 hover:text-accent-dark transition-colors duration-300 cursor-pointer group"
                    >
                      <span>{val.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-accent-dark transition-colors" />
                    </button>
                  ))}
              </div>
            </div>

            <div className="py-6 text-[11px] text-slate-400 italic">
              Nhấp chọn để chuyển trang danh sách dịch vụ đã lọc.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
