/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchWidget from "@/components/SearchWidget";
import { mockCruises, mockHotels, mockCombos } from "@/data/mockData";
import { Home, ChevronRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import LatestBlogs from "@/components/LatestBlogs";
import CrossReviewSection from "@/components/CrossReviewSection";

interface DisplayProduct {
  id: string;
  type: "cruise" | "hotel" | "combo";
  name: string;
  tagline?: string;
  image: string;
  stars: number;
  badge?: string;
  price?: number;
  originalPrice?: number;
  durationDays?: number;
  location?: string;
  amenities?: string[];
  category?: string;
}

function HotDealListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read active tab category
  const category = searchParams.get("category") || "all";
  const activeTab = category;

  const handleTabClick = (tabValue: string) => {
    const params = new URLSearchParams();
    if (tabValue !== "all") params.set("category", tabValue);
    router.push(`/hot-deal?${params.toString()}`, { scroll: false });
  };

  // Combine all hot deals from mock data
  const allDeals: DisplayProduct[] = [
    // Combos
    ...mockCombos.filter(cb => cb.isHotDeal).map(cb => ({
      id: cb.id,
      type: "combo" as const,
      name: cb.name,
      tagline: cb.tagline,
      image: mockCruises.find(c => c.id === cb.cruiseId)?.imageGallery[0] || mockCruises[0].imageGallery[0],
      stars: 5,
      price: cb.salePrice,
      originalPrice: cb.netPrice,
      location: "Hạ Long, Quảng Ninh",
      amenities: ["Bao gồm du thuyền & resort 5 sao", "Cano đưa đón riêng", "Liệu trình Spa"],
      category: cb.category || "combo",
    })),
    // Cruises
    ...mockCruises.filter(c => c.isHotDeal).map(c => ({
      id: c.id,
      type: "cruise" as const,
      name: c.name,
      tagline: c.tagline,
      image: c.imageGallery[0],
      stars: c.stars,
      price: c.priceFrom,
      originalPrice: c.originalPrice,
      durationDays: c.durationDays,
      location: c.destinations[0],
      amenities: c.amenities,
      category: c.category || "cruise",
    })),
    // Hotels, villas, restaurants
    ...mockHotels.filter(h => h.isHotDeal).map(h => ({
      id: h.id,
      type: "hotel" as const,
      name: h.name,
      tagline: h.description,
      image: h.imageGallery[0],
      stars: h.stars,
      price: h.priceFrom || h.roomTypes[0]?.pricePerNight,
      originalPrice: h.originalPrice,
      location: h.location,
      amenities: h.amenities,
      category: h.category || "hotel",
    }))
  ];

  // Filtering logic
  const filteredDeals = allDeals.filter((product) => {
    // Active Tab / Category filter
    if (activeTab !== "all") {
      if (activeTab === "combo") {
        if (product.type !== "combo") return false;
      } else {
        if (product.category !== activeTab) return false;
      }
    }
    return true;
  });

  const tabOptions = [
    { value: "all", label: "Tất cả Deal" },
    { value: "combo", label: "Combo trọn gói" },
    { value: "cruise", label: "Du thuyền" },
    { value: "hotel", label: "Khách sạn" },
    { value: "villa", label: "Villa" },
    { value: "restaurant", label: "Nhà hàng" },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO BANNER & SEARCH WIDGET */}
      <div className="relative h-[560px] md:h-[480px] w-full flex items-center justify-center bg-slate-900 z-30">
        <img
          src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920"
          alt="Ha Long Sunset"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001226]/30 via-[#001226]/50 to-[#001226]/85" />

        {/* Breadcrumbs inside banner */}
        <div className="absolute top-28 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-accent flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white/90">Hot Deals</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-6xl mt-32">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold hidden md:flex items-center justify-center gap-1.5">
            Ưu Đãi Độc Quyền
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal max-w-2xl mx-auto leading-tight">
            SĂN DEAL HẠ LONG GIÁ TỐT NHẤT HÔM NAY
          </h1>

          {/* Reusable SearchWidget */}
          <div className="max-w-6xl mx-auto w-full mt-6 flex flex-col items-center">
            <SearchWidget />
          </div>
        </div>
      </div>

      {/* 2. ANCHOR FILTER BAR (Internal Tabs) */}
      <div className="bg-white border-b border-slate-100 py-4 sticky top-[72px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-start gap-2.5 overflow-x-auto no-scrollbar scroll-smooth">
            {tabOptions.map((tab) => {
              const isSelected = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTabClick(tab.value)}
                  className={`px-5 py-2.5 rounded-full text-[13px] md:text-[14px] font-bold transition-all duration-250 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-[#001226] text-white shadow-md hover:scale-[1.02]"
                      : "text-slate-650 hover:bg-slate-100 hover:text-slate-900 bg-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. PRODUCT GRID VIEW */}
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-[50vh]">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100 mb-10">
          <div className="space-y-1 text-left">
            <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-wide">
              Danh sách siêu ưu đãi
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Tìm thấy <span className="font-bold text-slate-850">{filteredDeals.length}</span> ưu đãi đặc sắc đang diễn ra
            </p>
          </div>
        </div>

        {/* Lưới sản phẩm */}
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDeals.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard
                  id={product.id}
                  type={product.type}
                  name={product.name}
                  tagline={product.tagline}
                  image={product.image}
                  stars={product.stars}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  durationDays={product.durationDays}
                  location={product.location}
                  amenities={product.amenities}
                  category={product.category}
                  variant="detailed"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm py-12 my-8">
            <ShieldAlert className="w-12 h-12 text-accent-dark mx-auto animate-bounce" />
            <h3 className="font-serif text-lg font-bold text-slate-800">Không tìm thấy deal phù hợp</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rất tiếc, các tiêu chí lọc hiện tại không tìm thấy ưu đãi nào phù hợp trong hệ thống của chúng tôi. 
              Vui lòng thay đổi từ khóa, chọn lại khoảng giá hoặc xóa bộ lọc để xem lại.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  router.push("/hot-deal");
                }}
                className="px-6 py-2.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] font-bold text-xs uppercase tracking-[0.12em] rounded-full transition-all duration-300 inline-block border border-[#001226] hover:border-accent cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HotDealPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <HotDealListContent />
      </Suspense>
        <section className="py-24 bg-teal-50/30 bg-wave-pattern border-t border-b border-teal-100/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
                KHÁCH HÀNG PHẢN HỒI
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
                TRẢI NGHIỆM THỰC TẾ
              </h2>
            </div>

            <CrossReviewSection />
          </div>
        </section>
      <LatestBlogs />
      <Footer />
    </>
  );
}
