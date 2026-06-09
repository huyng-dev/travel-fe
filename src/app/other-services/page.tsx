/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { mockOtherServices } from "@/data/mockData";
import { 
  ChevronRight, Home, ShieldAlert, Star, Grid, List, CheckCircle2, Sliders, Search, X,
  Compass, Car, Wifi, Languages, Ticket 
} from "lucide-react";
import LatestBlogs from "@/components/LatestBlogs";
import CustomDropdown from "@/components/CustomDropdown";
import { motion, AnimatePresence } from "framer-motion";

function OtherServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read search parameters from URL
  const categoryQuery = searchParams.get("category") || "all";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOption, setSortOption] = useState<string>("default");
  const [localSearch, setLocalSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset visibleCount and search states when categoryQuery changes during rendering
  const [prevCategoryQuery, setPrevCategoryQuery] = useState(categoryQuery);
  if (categoryQuery !== prevCategoryQuery) {
    setPrevCategoryQuery(categoryQuery);
    setVisibleCount(12);
    setLocalSearch("");
    setSearchQuery("");
    setIsSuggestionsOpen(false);
  }

  const handleTabClick = (tabValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tabValue === "all") {
      params.delete("category");
    } else {
      params.set("category", tabValue);
    }
    router.push(`/other-services?${params.toString()}`, { scroll: false });
  };

  const tabOptions = [
    { value: "all", label: "Tất cả" },
    { value: "car", label: "Thuê xe" },
    { value: "sim", label: "Sim du lịch" },
    { value: "guide", label: "Hướng dẫn viên" },
    { value: "ticket", label: "Vé tham quan" },
  ];

  const sortOptions = [
    { value: "default", label: "Lựa chọn của chúng tôi" },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
  ];

  // Filtering logic
  const filteredServices = mockOtherServices.filter((service) => {
    if (categoryQuery !== "all") {
      if (service.type !== categoryQuery) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = service.name.toLowerCase().includes(q);
      const matchDesc = service.description.toLowerCase().includes(q);
      const matchSummary = service.summary.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchSummary) return false;
    }
    return true;
  });

  // Calculate autocomplete suggestions based on current localSearch input
  const suggestions = localSearch.trim()
    ? mockOtherServices.filter((item) => {
        // Only suggest items matching current category tab if not "all"
        if (categoryQuery !== "all" && item.type !== categoryQuery) return false;
        return item.name.toLowerCase().includes(localSearch.toLowerCase());
      }).slice(0, 8)
    : [];

  const getItemBadgeType = (type: string) => {
    switch (type) {
      case "car": return { label: "Xe đưa đón", className: "bg-emerald-50 text-emerald-700 border-emerald-100" };
      case "sim": return { label: "Sim du lịch", className: "bg-orange-50 text-orange-700 border-orange-100" };
      case "guide": return { label: "Hướng dẫn viên", className: "bg-cyan-50 text-cyan-700 border-cyan-100" };
      case "ticket": return { label: "Vé tham quan", className: "bg-yellow-50 text-yellow-700 border-yellow-100" };
      default: return { label: "Dịch vụ", className: "bg-slate-50 text-slate-700 border-slate-100" };
    }
  };

  const getServiceIconInline = (type: string) => {
    switch (type) {
      case "car": return <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case "sim": return <Wifi className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case "guide": return <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case "ticket": return <Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      default: return <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setIsSuggestionsOpen(false);
  };

  const sortedServices = [...filteredServices].sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    if (sortOption === "price-asc") return priceA - priceB;
    if (sortOption === "price-desc") return priceB - priceA;
    return 0;
  });

  return (
    <div className="w-full">
      {/* 1. HERO BANNER */}
      <div className="relative h-[560px] md:h-[480px] w-full flex items-center justify-center bg-slate-900 z-30">
        <img
          src="https://halongbayview.vn//wp-content/uploads/2024/03/6-diem-nhan-cua-du-an-can-ho-dich-vu-ha-long-bay-view-1.jpg"
          alt="Other Services Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001226]/30 via-[#001226]/50 to-[#001226]/85" />
        
        <div className="absolute top-28 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-accent flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white/90">Dịch vụ khác</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-6xl mt-32">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold hidden md:block">
            Tiện Ích & Trải Nghiệm Đi Kèm
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal max-w-3xl mx-auto leading-tight">
            DỊCH VỤ DU LỊCH TIỆN LỢI & CHUYÊN NGHIỆP
          </h1>

          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto w-full mt-6 relative z-50">
            <div ref={suggestionRef} className="relative flex flex-row flex-nowrap items-center bg-white border border-slate-100 hover:border-accent/30 focus-within:border-accent/40 shadow-[0_20px_48px_rgba(0,0,0,0.12)] rounded-full p-2 pl-6 pr-2">
              <input
                type="text"
                placeholder="Tìm xe, sim, hướng dẫn viên, vé..."
                value={localSearch}
                onFocus={() => setIsSuggestionsOpen(localSearch.trim().length > 0)}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setIsSuggestionsOpen(e.target.value.trim().length > 0);
                }}
                className="w-full bg-transparent text-slate-800 text-sm font-semibold border-none focus:outline-none placeholder-slate-400 focus:ring-0 p-0 min-w-0"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    setSearchQuery("");
                    setIsSuggestionsOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-650 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-bold text-xs uppercase tracking-[0.1em] rounded-full flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 select-none ml-2 cursor-pointer shrink-0 whitespace-nowrap border-none"
              >
                <Search className="w-4 h-4" />
                TÌM KIẾM
              </button>

              {/* Autocomplete Suggestions Dropdown */}
              <AnimatePresence>
                {isSuggestionsOpen && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full z-50 bg-white border border-slate-200/90 rounded-2xl shadow-2xl py-3 mt-3 max-h-80 overflow-y-auto text-slate-800 text-left"
                  >
                    <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 select-none">
                      Gợi ý dịch vụ phù hợp
                    </div>
                    <div className="mt-1 divide-y divide-slate-50">
                      {suggestions.map((item) => {
                        const badge = getItemBadgeType(item.type);
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setIsSuggestionsOpen(false);
                              router.push(`/other-services/${item.id}`);
                            }}
                            className="px-4 py-3 hover:bg-accent/10 cursor-pointer flex items-center justify-between gap-3 transition-colors duration-150 text-left"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {getServiceIconInline(item.type)}
                              <span className="text-xs font-semibold text-slate-700 truncate">
                                {item.name}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${badge.className}`}>
                              {badge.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>

      {/* 2. CATEGORY PILL TABS */}
      <div className="bg-white border-b border-slate-100 py-4 sticky top-[72px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-start gap-2.5 overflow-x-auto no-scrollbar scroll-smooth">
            {tabOptions.map((tab) => {
              const isSelected = categoryQuery === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTabClick(tab.value)}
                  className={`px-5 py-2.5 rounded-full text-[13px] md:text-[14px] font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-[#001226] text-white shadow-md hover:scale-[1.02]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MAIN PAGE CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-[50vh]">
        <div className="space-y-10">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1 text-left">
              <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-wide uppercase">
                {tabOptions.find(t => t.value === categoryQuery)?.label || "Dịch vụ"}
              </h2>
            </div>

            <div className="flex items-center gap-6 self-start sm:self-auto">
              <div className="w-64">
                <CustomDropdown
                  label="Sắp xếp theo"
                  value={sortOption}
                  onChange={setSortOption}
                  options={sortOptions}
                  icon={<Sliders className="w-4 h-4 text-accent" />}
                  variant="light"
                />
              </div>

              <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1.5 rounded-full shadow-sm">
                <button 
                  onClick={() => setViewMode("grid")} 
                  className={`p-2 rounded-full transition-all cursor-pointer ${viewMode === "grid" ? "bg-accent text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode("list")} 
                  className={`p-2 rounded-full transition-all cursor-pointer ${viewMode === "list" ? "bg-accent text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          {sortedServices.length > 0 ? (
            <div className="space-y-12">
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
                {sortedServices.slice(0, visibleCount).map((service) => (
                  <ProductCard
                    key={service.id}
                    id={service.id}
                    type="other"
                    name={service.name}
                    tagline={service.summary}
                    image={service.imageGallery[0]}
                    stars={service.rating}
                    price={service.price}
                    originalPrice={service.originalPrice}
                    amenities={Object.values(service.attributes).filter(val => typeof val === "string") as string[]}
                    variant="detailed"
                    viewMode={viewMode}
                    category={service.type}
                  />
                ))}
              </div>
              {sortedServices.length > visibleCount && (
                <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => setVisibleCount(prev => Math.min(prev + 12, 30))} 
                    className="px-12 py-4 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] font-bold text-[11px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl cursor-pointer"
                  >
                    Xem thêm dịch vụ khác
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 p-16 text-center rounded-[2rem] max-w-lg mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-6">
              <ShieldAlert className="w-12 h-12 text-accent mx-auto animate-bounce" />
              <h3 className="font-serif text-xl font-bold text-slate-900">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Rất tiếc, hiện tại không có sản phẩm dịch vụ nào phù hợp với danh mục này.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. INTRODUCTION SECTION */}
      <section className="py-20 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Về chúng tôi</span>
                <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight">
                  Giải Pháp Du Lịch Trọn Gói <br /> Tiện Nghi & An Tâm Tuyệt Đối
                </h2>
                <p className="text-sm text-slate-650 leading-relaxed max-w-xl">
                  Halong Travel Desk cung cấp giải pháp du lịch toàn diện để hành trình của quý khách trở nên hoàn hảo nhất.
                  Chúng tôi mang đến các dịch vụ bổ trợ chất lượng cao từ xe Limousine đưa đón thương gia, eSIM/SIM 4G kết nối liên tục,
                  hướng dẫn viên địa phương am hiểu sâu sắc, đến vé tham quan trực tuyến nhanh chóng không cần xếp hàng.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Phương tiện chất lượng cao",
                  "Kích hoạt online nhanh chóng",
                  "Hướng dẫn viên chuyên nghiệp",
                  "E-ticket quét mã tiện lợi",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200" 
                  alt="Limousine Travel"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-[240px] hidden md:block border border-slate-50">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-accent text-accent" />)}
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight mb-2">
                  &quot;Xe Limousine chạy đúng giờ, ghế ngồi êm ái, wifi rất mạnh giúp tôi làm việc thoải mái suốt chuyến đi!&quot;
                </p>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">— Anh Minh Tuấn (Hà Nội)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function OtherServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-0 bg-white">
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center bg-white"><div className="w-10 h-10 border-[3px] border-accent border-t-transparent rounded-full animate-spin" /></div>}>
          <OtherServicesContent />
        </Suspense>
        <LatestBlogs />
      </main>
      <Footer />
    </>
  );
}
