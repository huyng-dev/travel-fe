/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { mockHotels, mockCruises } from "@/data/mockData";
import { ChevronRight, Home, ShieldAlert, Star, Grid, List, CheckCircle2, Sliders } from "lucide-react";
import SearchWidget from "@/components/SearchWidget";
import LatestBlogs from "@/components/LatestBlogs";
import CustomDropdown from "@/components/CustomDropdown";

interface UnifiedStayItem {
  id: string;
  type: "hotel" | "cruise";
  name: string;
  tagline: string;
  image: string;
  stars: number;
  price: number;
  originalPrice?: number;
  location: string;
  amenities: string[];
  roomCount?: number;
  cabinCount?: number;
  durationDays?: number;
  category: string;
}

// Chuyển đổi dữ liệu khách sạn & du thuyền về cấu trúc chung UnifiedStayItem
const unifiedHotels: UnifiedStayItem[] = mockHotels
  .filter((h) => h.category !== "restaurant")
  .map((h) => ({
    id: h.id,
    type: "hotel",
    name: h.name,
    tagline: h.location.split(",").slice(-2).join(",").trim(),
    image: h.imageGallery[0],
    stars: h.stars,
    price: h.roomTypes[0]?.pricePerNight || h.priceFrom || 0,
    originalPrice: h.originalPrice,
    location: h.location,
    amenities: h.amenities,
    roomCount: h.roomCount,
    category: h.category || "hotel",
  }));

const unifiedCruises: UnifiedStayItem[] = mockCruises.map((c) => ({
  id: c.id,
  type: "cruise",
  name: c.name,
  tagline: c.tagline,
  image: c.imageGallery[0],
  stars: c.stars,
  price: c.priceFrom,
  originalPrice: c.originalPrice,
  location: c.destinations[0] || "Vịnh Hạ Long",
  amenities: c.amenities,
  cabinCount: c.cabinCount,
  durationDays: c.durationDays,
  category: "cruise",
}));

const allStays: UnifiedStayItem[] = [...unifiedCruises, ...unifiedHotels];

function StaysContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Đọc tham số tìm kiếm từ URL
  const categoryQuery = searchParams.get("category") || "all";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOption, setSortOption] = useState<string>("default");

  // Reset visibleCount when categoryQuery changes during rendering
  const [prevCategoryQuery, setPrevCategoryQuery] = useState(categoryQuery);
  if (categoryQuery !== prevCategoryQuery) {
    setPrevCategoryQuery(categoryQuery);
    setVisibleCount(12);
  }

  const handleTabClick = (tabValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tabValue === "all") {
      params.delete("category");
    } else {
      params.set("category", tabValue);
    }
    router.push(`/stays?${params.toString()}`, { scroll: false });
  };

  const tabOptions = [
    { value: "all", label: "Tất cả" },
    { value: "cruise", label: "Du thuyền" },
    { value: "hotel", label: "Khách sạn" },
    { value: "villa", label: "Villa" },
    { value: "homestay", label: "Homestay" },
  ];

  const sortOptions = [
    { value: "default", label: "Lựa chọn của chúng tôi" },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
  ];

  // Logic lọc lưu trú (không lấy ẩm thực/nhà hàng)
  const filteredStays = allStays.filter((stay) => {
    if (categoryQuery !== "all") {
      return stay.category === categoryQuery;
    }
    return true;
  });

  const sortedStays = [...filteredStays].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="w-full">
      {/* 1. HERO BANNER */}
      <div className="relative h-[560px] md:h-[480px] w-full flex items-center justify-center bg-slate-900 z-30">
        <img
          src="https://owa.bestprice.vn/images/cruises/uploads/du-thuyen-paradise-elegance-646b47ebe2a17.jpg"
          alt="Hotels Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001226]/30 via-[#001226]/50 to-[#001226]/85" />
        
        <div className="absolute top-28 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-accent flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white/90">Lưu trú</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-6xl mt-32">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold hidden md:block">
            Nghỉ Dưỡng & Tận Hưởng
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal max-w-3xl mx-auto leading-tight">
            KHÔNG GIAN NGHỈ DƯỠNG SANG TRỌNG & ẤM CÚNG
          </h1>

          <div className="max-w-6xl mx-auto w-full mt-6">
            <SearchWidget initialCategory={["hotel", "villa", "homestay", "cruise"].includes(categoryQuery) ? categoryQuery : "hotel"} />
          </div>
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

          {/* Stays Grid/List */}
          {sortedStays.length > 0 ? (
            <div className="space-y-12">
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
                {sortedStays.slice(0, visibleCount).map((stay) => (
                  <ProductCard
                    key={stay.id}
                    id={stay.id}
                    type={stay.type}
                    name={stay.name}
                    tagline={stay.tagline}
                    image={stay.image}
                    stars={stay.stars}
                    price={stay.price}
                    originalPrice={stay.originalPrice}
                    location={stay.location}
                    amenities={stay.amenities}
                    roomCount={stay.roomCount}
                    cabinCount={stay.cabinCount}
                    durationDays={stay.durationDays}
                    variant="detailed"
                    viewMode={viewMode}
                    category={stay.category}
                  />
                ))}
              </div>
              {sortedStays.length > visibleCount && (
                <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => setVisibleCount(prev => Math.min(prev + 12, 30))} 
                    className="px-12 py-4 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] font-bold text-[11px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl cursor-pointer"
                  >
                    Xem thêm lưu trú
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 p-16 text-center rounded-[2rem] max-w-lg mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-6">
              <ShieldAlert className="w-12 h-12 text-accent mx-auto animate-bounce" />
              <h3 className="font-serif text-xl font-bold text-slate-900">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Rất tiếc, hiện tại không có sản phẩm lưu trú nào phù hợp với danh mục này.</p>
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
                  Nâng Tầm Trải Nghiệm <br /> Du Thuyền & Nghỉ Dưỡng
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  Halong Travel Desk tự hào mang đến bộ sưu tập những du thuyền hạng sang và không gian lưu trú chất lượng hàng đầu bên bờ kỳ quan. 
                  Từ những du thuyền sang trọng lướt trên sóng vịnh, khách sạn hiện đại hướng biển, biệt thự nghỉ dưỡng riêng tư đến các căn homestay nhỏ xinh hoài niệm, 
                  mỗi lựa chọn đều được chúng tôi chuẩn bị kỹ lưỡng để đảm bảo sự hài lòng và thoải mái nhất cho quý khách.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Du thuyền & Lưu trú tuyển chọn",
                  "Vị trí và hải trình đắc địa",
                  "Hỗ trợ đặt chỗ 24/7",
                  "Ưu đãi voucher độc quyền",
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
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200" 
                  alt="Luxury Stay"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-[240px] hidden md:block border border-slate-50">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-accent text-accent" />)}
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight mb-2">
                  &quot;Không gian homestay thật gần gũi, ấm cúng và view vịnh tuyệt vời!&quot;
                </p>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">— Khách hàng lưu trú</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function StaysPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-0 bg-white">
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center bg-white"><div className="w-10 h-10 border-[3px] border-accent border-t-transparent rounded-full animate-spin" /></div>}>
          <StaysContent />
        </Suspense>
        <LatestBlogs />
      </main>
      <Footer />
    </>
  );
}
