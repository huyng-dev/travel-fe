/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { mockCombos, mockCruises } from "@/data/mockData";
import { ChevronRight, Home, ShieldAlert, Grid, List, CheckCircle2, Luggage, Sliders } from "lucide-react";
import SearchWidget from "@/components/SearchWidget";
import LatestBlogs from "@/components/LatestBlogs";
import CustomDropdown from "@/components/CustomDropdown";

function ComboListContent() {
  const searchParams = useSearchParams();

  const nameQuery = searchParams.get("keyword") || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOption, setSortOption] = useState<string>("default");

  const sortOptions = [
    { value: "default", label: "Lựa chọn của chúng tôi" },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
  ];

  // Logic lọc combo
  const filteredCombos = mockCombos.filter((combo) => {
    if (nameQuery && !combo.name.toLowerCase().includes(nameQuery.toLowerCase())) return false;
    return true;
  });

  const sortedCombos = [...filteredCombos].sort((a, b) => {
    if (sortOption === "price-asc") return a.salePrice - b.salePrice;
    if (sortOption === "price-desc") return b.salePrice - a.salePrice;
    return 0;
  });

  return (
    <div className="w-full">
      {/* 1. HERO BANNER */}
      <div className="relative h-[560px] md:h-[480px] w-full flex items-center justify-center bg-slate-900 z-30">
        <img
          src="https://cly.1cdn.vn/2024/12/26/hlong.jpg"
          alt="Combos Banner"
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
            <span className="text-white/90">Combo du lịch</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-6xl mt-32">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold hidden md:block">
            Hành Trình Kết Hợp
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal max-w-3xl mx-auto leading-tight">
            GÓI NGHỈ DƯỠNG TRỌN GÓI HOÀN HẢO
          </h1>


          <div className="max-w-6xl mx-auto w-full mt-6">
            <SearchWidget initialCategory="combo" initialKeyword={nameQuery} />
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 py-16 min-h-[50vh]">
        <div className="space-y-10">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1 text-left">
              <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-wide uppercase">Gói combo độc bản</h2>
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
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-full transition-all cursor-pointer ${viewMode === "grid" ? "bg-accent text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}><Grid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-full transition-all cursor-pointer ${viewMode === "list" ? "bg-accent text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Results List */}
          {sortedCombos.length > 0 ? (
            <div className="space-y-12">
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
                {sortedCombos.slice(0, visibleCount).map((combo) => {
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
              {sortedCombos.length > visibleCount && (
                <div className="flex justify-center pt-8">
                  <button onClick={() => setVisibleCount(prev => Math.min(prev + 12, 30))} className="px-12 py-4 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] font-bold text-[11px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl cursor-pointer">Xem thêm combo</button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 p-16 text-center rounded-[2rem] max-w-lg mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-6">
              <ShieldAlert className="w-12 h-12 text-accent mx-auto animate-bounce" />
              <h3 className="font-serif text-xl font-bold text-slate-900">Không tìm thấy combo phù hợp</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Rất tiếc, hiện tại không có gói combo nào phù hợp với yêu cầu của bạn.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. INTRODUCTION SECTION */}
      <section className="py-20 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Giải pháp tối ưu</span>
                <h2 className="font-serif text-3xl md:text-4xl text-slate-900 leading-tight">
                  Tận Hưởng Kỳ Nghỉ <br /> Trọn Gói & Tiết Kiệm
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  Gói Combo du lịch của Halong Travel Desk là sự kết hợp tuyệt vời giữa du thuyền chất lượng và khách sạn nghỉ dưỡng tiện nghi. 
                  Chúng tôi thiết kế những trải nghiệm xuyên suốt, giúp bạn tiết kiệm thời gian lên lịch trình và tối ưu hóa chi phí lên đến 30% so với đặt riêng lẻ. 
                  Tất cả những gì bạn cần làm là xách vali lên và tận hưởng kỳ nghỉ của mình.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Tiết kiệm chi phí tối đa",
                  "Lịch trình kết hợp tinh tế",
                  "Dịch vụ đưa đón tận nơi",
                  "Một đầu mối hỗ trợ duy nhất",
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
                  src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200" 
                  alt="Vacation Combo"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-[#001226] p-6 rounded-2xl shadow-xl max-w-[240px] hidden md:block text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <Luggage className="w-4 h-4 text-[#001226]" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-accent uppercase">Hot Deal</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium mb-4">
                  Đã có hơn 10,000+ lượt đặt combo thành công trong năm vừa qua.
                </p>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#001226] bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-[#001226] bg-accent text-[#001226] flex items-center justify-center text-[10px] font-bold">
                    +1k
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CombosPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center bg-white"><div className="w-10 h-10 border-[3px] border-accent border-t-transparent rounded-full animate-spin" /></div>}>
        <ComboListContent />
      </Suspense>
      <LatestBlogs />
      <Footer />
    </>
  );
}
