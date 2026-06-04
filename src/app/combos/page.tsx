/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { mockCombos, mockCruises } from "@/data/mockData";
import { Luggage, ChevronRight, Home, ShieldAlert, SlidersHorizontal, Trash2, Search, X, Star, Grid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ComboListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const nameQuery = searchParams.get("name") || "";
  const priceQuery = searchParams.get("price") || "";
  const starsQuery = searchParams.get("stars") || "";

  const [bannerName, setBannerName] = useState(nameQuery);

  // States của bộ lọc nâng cao
  const [appliedStars, setAppliedStars] = useState<number[]>(starsQuery ? [parseInt(starsQuery)] : []);
  const [appliedPrices, setAppliedPrices] = useState<string[]>(priceQuery ? [priceQuery] : []);

  // States tạm thời trong Sidebar
  const [tempStars, setTempStars] = useState<number[]>(starsQuery ? [parseInt(starsQuery)] : []);
  const [tempPrices, setTempPrices] = useState<string[]>(priceQuery ? [priceQuery] : []);

  // State mở Sidebar bộ lọc
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync state from query params during rendering (React pattern to avoid useEffect cascading renders)
  const [prevName, setPrevName] = useState(nameQuery);
  const [prevPrice, setPrevPrice] = useState(priceQuery);
  const [prevStars, setPrevStars] = useState(starsQuery);

  if (nameQuery !== prevName || priceQuery !== prevPrice || starsQuery !== prevStars) {
    setPrevName(nameQuery);
    setPrevPrice(priceQuery);
    setPrevStars(starsQuery);
    setBannerName(nameQuery);
    setAppliedPrices(priceQuery ? [priceQuery] : []);
    setTempPrices(priceQuery ? [priceQuery] : []);
    setAppliedStars(starsQuery ? [parseInt(starsQuery)] : []);
    setTempStars(starsQuery ? [parseInt(starsQuery)] : []);
  }

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const [sortOption, setSortOption] = useState<string>("default");

  // Đồng bộ hóa URL khi lọc từ Banner Search hoặc Left Sidebar
  const updateUrl = (stars: number[], prices: string[]) => {
    const params = new URLSearchParams();
    if (bannerName) params.set("name", bannerName);
    if (prices.length === 1) {
      params.set("price", prices[0]);
    }
    if (stars.length === 1) {
      params.set("stars", stars[0].toString());
    }
    router.push(`/combos?${params.toString()}`, { scroll: false });
  };

  const handleBannerSearch = () => {
    const params = new URLSearchParams();
    if (bannerName) params.set("name", bannerName);
    
    // reset other filters on new banner search
    setAppliedStars([]);
    setTempStars([]);
    setAppliedPrices([]);
    setTempPrices([]);

    router.push(`/combos?${params.toString()}`, { scroll: false });
  };

  // Xử lý Checkbox trong Sidebar trượt (Mobile)
  const toggleStar = (star: number) => {
    setTempStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const togglePrice = (priceOpt: string) => {
    setTempPrices(prev =>
      prev.includes(priceOpt) ? prev.filter(p => p !== priceOpt) : [...prev, priceOpt]
    );
  };

  // Xử lý Checkbox trực tiếp trong Left Sidebar (Desktop)
  const toggleStarDirect = (star: number) => {
    const next = appliedStars.includes(star)
      ? appliedStars.filter(s => s !== star)
      : [...appliedStars, star];
    setAppliedStars(next);
    setTempStars(next);
    updateUrl(next, appliedPrices);
  };

  const togglePriceDirect = (priceOpt: string) => {
    const next = appliedPrices.includes(priceOpt)
      ? appliedPrices.filter(p => p !== priceOpt)
      : [...appliedPrices, priceOpt];
    setAppliedPrices(next);
    setTempPrices(next);
    updateUrl(appliedStars, next);
  };

  const handleApplyFilters = () => {
    setAppliedStars(tempStars);
    setAppliedPrices(tempPrices);
    setIsSidebarOpen(false);
    updateUrl(tempStars, tempPrices);
  };

  const handleClearFilters = () => {
    setTempStars([]);
    setTempPrices([]);
    setAppliedStars([]);
    setAppliedPrices([]);
    setBannerName("");
    setIsSidebarOpen(false);
    router.push("/combos", { scroll: false });
  };

  const handleCloseSidebar = () => {
    setTempStars(appliedStars);
    setTempPrices(appliedPrices);
    setIsSidebarOpen(false);
  };

  // Logic lọc combo
  const filteredCombos = mockCombos.filter((combo) => {
    // 1. Tên combo
    if (nameQuery && !combo.name.toLowerCase().includes(nameQuery.toLowerCase())) {
      return false;
    }
    // 2. Khoảng giá
    if (appliedPrices.length > 0) {
      const hasMatch = appliedPrices.some(priceOpt => {
        if (priceOpt === "low") return combo.salePrice < 8000000;
        if (priceOpt === "high") return combo.salePrice >= 8000000;
        return true;
      });
      if (!hasMatch) return false;
    } else if (priceQuery) {
      if (priceQuery === "low" && combo.salePrice >= 8000000) return false;
      if (priceQuery === "high" && combo.salePrice < 8000000) return false;
    }
    // 3. Hạng sao
    if (appliedStars.length > 0) {
      if (!appliedStars.includes(5)) return false;
    }
    return true;
  });

  // Logic Sắp xếp
  const sortedCombos = [...filteredCombos].sort((a, b) => {
    if (sortOption === "price-asc") {
      return a.salePrice - b.salePrice;
    }
    if (sortOption === "price-desc") {
      return b.salePrice - a.salePrice;
    }
    return 0; // default
  });

  const totalActiveFilters = appliedStars.length + appliedPrices.length;

  const availablePrices = [
    { value: "low", label: "Dưới 8 Triệu VNĐ" },
    { value: "high", label: "Trên 8 Triệu VNĐ" }
  ];

  return (
    <div className="w-full">
      {/* 1. COMPACT BANNER */}
      <div className="relative h-[560px] md:h-[480px] w-full flex items-center justify-center bg-slate-900 z-30">
        <img
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1920"
          alt="Combos Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001226]/30 via-[#001226]/50 to-[#001226]/85" />
        
        {/* Breadcrumb Path absolute inside banner */}
        <div className="absolute top-28 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-accent flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white/90">Combo du lịch</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-4xl mt-20">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold block">
            Hành Trình Kết Hợp Hoàng Gia
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal">
            COMBO NGHỈ DƯỠNG ĐẶC QUYỀN
          </h1>

          {/* Banner Search Input Overlay */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleBannerSearch(); }}
            className="max-w-xl mx-auto bg-white border border-slate-100 shadow-xl md:rounded-full rounded-2xl p-3 md:pl-8 md:pr-3 md:py-3 flex flex-col md:flex-row items-center gap-4 md:gap-0 text-left w-full mt-6"
          >
            {/* Tên combo */}
            <div className="w-full md:flex-1 flex items-center gap-3 pr-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-accent flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-slate-200/60">
                <Luggage className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold block">
                  Tên gói combo
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên gói combo..."
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-sm font-semibold border-none focus:outline-none placeholder-slate-400 mt-0.5 focus:ring-0 p-0"
                />
              </div>
            </div>

            {/* Action button */}
            <div className="w-full md:w-auto flex-shrink-0">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-bold text-xs uppercase tracking-[0.1em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer border-none"
              >
                <Search className="w-4 h-4" />
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. FILTER BAR (Mobile only) */}
      <div className="border-b border-slate-100 bg-white sticky top-[72px] z-20 shadow-sm py-4 lg:hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2.5">
            {/* Hạng sao Filter Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`px-4 py-2 border rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex ${
                appliedStars.length > 0
                  ? "border-[#001226] bg-slate-50 text-[#001226]"
                  : "border-slate-200 hover:border-slate-800 text-slate-650 hover:bg-slate-50"
              }`}
            >
              Hạng sao{appliedStars.length > 0 ? ` (${appliedStars.length})` : ": Tất cả"}
            </button>

            {/* Khoảng giá Filter Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`px-4 py-2 border rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex ${
                appliedPrices.length > 0
                  ? "border-[#001226] bg-slate-50 text-[#001226]"
                  : "border-slate-200 hover:border-slate-800 text-slate-650 hover:bg-slate-50"
              }`}
            >
              Khoảng giá{appliedPrices.length > 0 ? ` (${appliedPrices.length})` : ": Tất cả"}
            </button>
          </div>

          {/* Bộ lọc nâng cao Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`px-4 py-2 border rounded-full text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 flex-shrink-0 ${
              totalActiveFilters > 0
                ? "bg-[#001226] border-[#001226] text-white"
                : "border-slate-200 hover:border-slate-800 text-slate-700 bg-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Bộ lọc</span>
            {totalActiveFilters > 0 && (
              <span className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold bg-accent text-[#001226]">
                {totalActiveFilters}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. MAIN PAGE CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-10 min-h-[50vh]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* DESKTOP STICKY LEFT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-28 bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] space-y-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-855" />
                <h3 className="font-serif text-sm font-bold text-slate-855 uppercase tracking-wider">Bộ lọc tìm kiếm</h3>
              </div>
              {totalActiveFilters > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-[10px] uppercase tracking-wider font-bold text-accent hover:text-accent-dark transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {/* 1. Hạng sao */}
            <div className="space-y-3">
              <h4 className="font-serif text-xs font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                Hạng sao combo
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-650 cursor-pointer select-none hover:text-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={appliedStars.includes(5)}
                    onChange={() => toggleStarDirect(5)}
                    className="w-4 h-4 rounded border-slate-200 text-[#001226] focus:ring-[#001226] cursor-pointer"
                  />
                  <div className="flex items-center gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                    ))}
                    <span className="text-[10px] text-slate-500 font-medium ml-1">
                      (5 sao)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Khoảng giá */}
            <div className="space-y-3">
              <h4 className="font-serif text-xs font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                Khoảng giá gói combo
              </h4>
              <div className="space-y-2">
                {availablePrices.map((p) => {
                  const isChecked = appliedPrices.includes(p.value);
                  return (
                    <label key={p.value} className="flex items-center gap-2.5 text-xs font-semibold text-slate-650 cursor-pointer select-none hover:text-accent transition-colors">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePriceDirect(p.value)}
                        className="w-4 h-4 rounded border-slate-200 text-[#001226] focus:ring-[#001226] cursor-pointer"
                      />
                      <span>{p.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCTS CONTENT */}
          <div className="lg:col-span-3 space-y-8">
            {/* Results Header (Count & Sort) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-wide">
                  {nameQuery ? `Kết quả tìm kiếm: "${nameQuery}"` : "Gói combo độc bản"}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Tìm thấy <span className="font-bold text-slate-850">{sortedCombos.length}</span> combo phù hợp
                </p>
              </div>

              {/* Sort & View Mode Dropdown */}
              <div className="flex items-center gap-4 self-start sm:self-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sắp xếp:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-xs font-bold focus:outline-none bg-slate-50 border border-slate-200 rounded-full px-4 py-2 cursor-pointer text-slate-700"
                  >
                    <option value="default">Lựa chọn của chúng tôi</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-full shadow-xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      viewMode === "grid" ? "bg-accent text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      viewMode === "list" ? "bg-accent text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            {sortedCombos.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                {sortedCombos.map((combo) => {
                  const associatedCruise = mockCruises.find((c) => c.id === combo.cruiseId);
                  return (
                    <ProductCard
                      key={combo.id}
                      id={combo.id}
                      type="combo"
                      name={combo.name}
                      tagline={combo.tagline}
                      image={associatedCruise?.imageGallery[0] || ""}
                      stars={5}
                      price={combo.salePrice}
                      originalPrice={combo.netPrice}
                      badge="Ưu đãi đặc biệt"
                      amenities={["Du thuyền 5 sao", "Khách sạn cung điện", "Trị liệu chuyên sâu"]}
                      variant="detailed"
                      viewMode={viewMode}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm py-12">
                <ShieldAlert className="w-12 h-12 text-accent mx-auto animate-bounce" />
                <h3 className="font-serif text-lg font-bold text-slate-800">Không tìm thấy combo phù hợp</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Rất tiếc, các tiêu chí lọc của quý khách hiện không trùng khớp với gói combo nghỉ dưỡng nào của chúng tôi. 
                  Quý khách vui lòng thử tìm kiếm lại với từ khóa khác hoặc xóa bộ lọc.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] font-semibold text-xs uppercase tracking-[0.15em] rounded-full transition-all duration-300 inline-block cursor-pointer"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. MOBILE SLIDE-IN FILTER DRAWER */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseSidebar}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar content panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[380px] bg-white shadow-2xl flex flex-col h-full text-slate-800"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-slate-150 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-serif text-lg font-bold text-slate-900">Bộ lọc nâng cao</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Combo nghỉ dưỡng</p>
                </div>
                <button
                  onClick={handleCloseSidebar}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Section 1: Hạng sao */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-slate-450 font-bold border-b border-slate-100 pb-1.5">
                    Hạng sao combo
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={tempStars.includes(5)}
                        onChange={() => toggleStar(5)}
                        className="w-4.5 h-4.5 rounded border-slate-300 text-[#001226] focus:ring-[#001226] cursor-pointer"
                      />
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                        ))}
                        <span className="ml-1 text-slate-500">(5 sao)</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Section 2: Khoảng giá */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-slate-450 font-bold border-b border-slate-100 pb-1.5">
                    Khoảng giá (Hạn mức)
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {availablePrices.map((p) => (
                      <label key={p.value} className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={tempPrices.includes(p.value)}
                          onChange={() => togglePrice(p.value)}
                          className="w-4.5 h-4.5 rounded border-slate-300 text-[#001226] focus:ring-[#001226] cursor-pointer"
                        />
                        <span>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-slate-150 bg-slate-50 flex items-center justify-between gap-4">
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 px-4 py-3 border border-slate-300 hover:border-slate-800 text-slate-650 hover:text-slate-900 text-xs uppercase tracking-wider font-bold rounded-full transition-all duration-300 cursor-pointer bg-white"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa bộ lọc
                </button>
                
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-6 py-3 bg-[#001226] hover:bg-accent text-white hover:text-[#001226] text-xs uppercase tracking-wider font-bold rounded-full transition-all duration-300 cursor-pointer border border-[#001226] hover:border-accent"
                >
                  Áp dụng
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CombosPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ComboListContent />
      </Suspense>
      <Footer />
    </>
  );
}
