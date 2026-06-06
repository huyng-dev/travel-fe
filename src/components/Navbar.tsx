"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Phone, Compass, ChevronRight, Menu, Globe, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  solid?: boolean;
}

export default function Navbar({ solid = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // States cho Dropdown hover trên desktop
  const [hoveredMenu, setHoveredMenu] = useState<"cruise" | "hotel" | null>(null);

  // State cho mobile menu
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // States cho Dropdown ngôn ngữ
  const [currentLang, setCurrentLang] = useState<"vi" | "en">("vi");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const isHeaderSolid = solid || isScrolled || isMobileOpen;

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

  // Khóa cuộn trang khi mở menu di động
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Cấu trúc dữ liệu cho Dropdown dọc đơn giản (OTA Style) - combo và du thuyền đã bỏ dropdown
  const menuDropdowns = {
    hotel: [
      { label: "Khách sạn & Resort", href: "/stays-dining?category=hotel" },
      { label: "Biệt thự & Villa", href: "/stays-dining?category=villa" },
      { label: "Nhà hàng & Ẩm thực", href: "/stays-dining?category=restaurant" },
      { label: "Xem tất cả", href: "/stays-dining", isBold: true }
    ]
  };

  const navMenus = [
    { key: "hot-deal" as const, label: "Hot Deals", path: "/hot-deal" },
    { key: "cruise" as const, label: "Du thuyền", path: "/cruises" },
    { key: "hotel" as const, label: "Lưu trú & Ẩm thực", path: "/stays-dining" },
    { key: "combo" as const, label: "Combo", path: "/combos" },
    { key: "blog" as const, label: "Blog", path: "/blogs" }
  ];

  return (
    <>
      {/* HEADER NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-500 ${
          isHeaderSolid
            ? "bg-white py-4 shadow-md text-slate-800"
            : "bg-transparent py-6 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
          
          <div className="flex items-center gap-10">
            {/* Logo TRAVEL ở bên trái */}
            <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 group">
              <Compass className="w-7 h-7 text-accent group-hover:rotate-45 transition-transform duration-500" />
              <div className="flex flex-col">
                <span className={`font-serif text-lg tracking-[0.25em] font-bold ${
                  isHeaderSolid ? "text-slate-900" : "text-white"
                }`}>
                  TRAVEL
                </span>
              </div>
            </Link>

            {/* Menu chính bên trái (Desktop hover dropdowns) */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navMenus.map((menu) => (
                <div
                  key={menu.key}
                  className="relative"
                  onMouseEnter={() => {
                    if (menu.key === "hotel") {
                      setHoveredMenu("hotel");
                    }
                  }}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  {/* Click navigates directly */}
                  <Link
                    href={menu.path}
                    className={`text-xs uppercase tracking-[0.15em] font-semibold py-3 transition-colors duration-300 relative group flex items-center gap-1 cursor-pointer ${
                      hoveredMenu === menu.key
                        ? "text-accent"
                        : isHeaderSolid
                        ? "text-slate-800 hover:text-accent"
                        : "text-white hover:text-accent"
                    }`}
                  >
                    {menu.label}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-300 ${
                      hoveredMenu === menu.key ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                  </Link>

                  {/* Dropdown panel on Hover (Vertical Single Column style) */}
                  <AnimatePresence>
                    {menu.key === "hotel" && hoveredMenu === "hotel" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full pt-2 z-50 text-slate-800 text-left"
                      >
                        <div className="w-60 bg-white border border-slate-100 shadow-2xl rounded-xl p-2 flex flex-col gap-0.5">
                          {menuDropdowns.hotel.map((lnk, lIdx) => (
                            <React.Fragment key={lIdx}>
                              {lnk.isBold && <div className="h-[1px] bg-slate-100 my-1.5" />}
                              <Link
                                href={lnk.href}
                                className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 flex items-center justify-between group/link ${
                                  lnk.isBold
                                    ? "font-bold text-accent hover:bg-slate-50 hover:text-accent"
                                    : "font-medium text-slate-650 hover:bg-slate-50 hover:text-accent"
                                }`}
                              >
                                <span>{lnk.label}</span>
                                {lnk.isBold && (
                                  <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform text-accent" />
                                )}
                              </Link>
                            </React.Fragment>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* Hotline & Liên hệ bên phải */}
          <div className="flex items-center space-x-6 z-10 ml-auto">
            {/* Bộ chọn Ngôn ngữ (Chỉ hiển thị trên desktop) */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`flex items-center gap-1.5 text-xs font-semibold py-1 transition-colors duration-300 cursor-pointer ${
                  isHeaderSolid ? "text-slate-800 hover:text-[#001226]" : "text-white hover:text-slate-200"
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

            {/* Số điện thoại (Hiển thị trực tiếp trên cả Mobile và Desktop) */}
            <a
              href="tel:19001234"
              className={`flex items-center gap-1.5 text-base md:text-sm uppercase tracking-[0.05em] md:tracking-[0.1em] font-extrabold ${
                isHeaderSolid ? "text-slate-800 hover:text-[#001226]" : "text-white hover:text-slate-200"
              }`}
            >
              <Phone className="w-4 h-4 text-accent animate-pulse" />
              <span>1900 1234</span>
            </a>

            {/* Nút Liên hệ trên desktop */}
            <Link
              href="/contact"
              className={`hidden lg:block px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold rounded-full border transition-all duration-300 ${
                isHeaderSolid
                  ? "bg-[#001226] text-white hover:bg-accent hover:text-[#001226] border-[#001226] hover:border-accent"
                  : "bg-white text-slate-800 hover:bg-accent hover:text-[#001226] border-white hover:border-accent"
              }`}
            >
              Liên hệ tư vấn
            </Link>

            {/* Mobile Hamburger Icon */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-1.5 rounded-full border border-slate-200 text-slate-800 bg-white shadow-sm hover:bg-slate-50 cursor-pointer z-50"
              aria-label="Mở menu di động"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER MENU - DROPS DOWN FROM THE NAVBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-35 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-x-0 top-0 z-40 bg-white shadow-2xl border-b border-slate-100 pt-20 px-6 pb-8 lg:hidden flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2 mt-4">
                {navMenus.map((menu) => (
                  <Link
                    key={menu.key}
                    href={menu.path}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-sm font-bold uppercase tracking-wider text-slate-800 hover:text-accent transition-colors py-3 border-b border-slate-100 flex items-center justify-between"
                  >
                    <span>{menu.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  className="text-sm font-bold uppercase tracking-wider text-slate-800 hover:text-accent transition-colors py-3 border-b border-slate-100 flex items-center justify-between"
                >
                  <span>Liên hệ tư vấn</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Thông tin liên hệ hỗ trợ & Email */}
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Hotline hỗ trợ 24/7</span>
                  <a href="tel:19001234" className="flex items-center gap-2.5 font-extrabold text-slate-800 hover:text-accent text-base">
                    <Phone className="w-4.5 h-4.5 text-accent" />
                    1900 1234
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Email liên hệ</span>
                  <a href="mailto:info@travelhalong.vn" className="flex items-center gap-2.5 font-extrabold text-slate-800 hover:text-accent text-base">
                    <Mail className="w-4.5 h-4.5 text-accent" />
                    info@travelhalong.vn
                  </a>
                </div>
              </div>

              {/* Bộ chọn ngôn ngữ bên trong Mobile Drawer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Ngôn ngữ / Language</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentLang("vi");
                      setIsMobileOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                      currentLang === "vi"
                        ? "bg-[#001226] text-white border border-[#001226]"
                        : "bg-slate-50 text-slate-650 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => {
                      setCurrentLang("en");
                      setIsMobileOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                      currentLang === "en"
                        ? "bg-[#001226] text-white border border-[#001226]"
                        : "bg-slate-50 text-slate-650 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
