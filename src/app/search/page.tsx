/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchWidget from "@/components/SearchWidget";
import LatestBlogs from "@/components/LatestBlogs";
import { mockCruises, mockHotels, mockCombos } from "@/data/mockData";
import {
  Home,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  Grid,
  List,
  X,
  RotateCcw,
  Sliders,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomDropdown from "@/components/CustomDropdown";

interface DisplayProduct {
  id: string;
  type: "cruise" | "hotel" | "combo";
  name: string;
  tagline?: string;
  image: string;
  stars: number;
  price?: number;
  originalPrice?: number;
  durationDays?: number;
  location?: string;
  amenities?: string[];
  category?: string;
  destinations?: string[];
}

function SearchLoading() {
  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
          Đang tải kết quả...
        </p>
      </div>
    </div>
  );
}

function SearchListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const keywordQuery = searchParams.get("keyword") || "";
  const categoryQuery = searchParams.get("category") || "all";
  const minPriceQuery = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice")!)
    : 0;
  const maxPriceQuery = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice")!)
    : 50000000;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState<string>("default");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Reset visibleCount when categoryQuery changes during rendering
  const [prevCategoryQuery, setPrevCategoryQuery] = useState(categoryQuery);
  if (categoryQuery !== prevCategoryQuery) {
    setPrevCategoryQuery(categoryQuery);
    setVisibleCount(12);
  }

  const categoryOptions = [
    { value: "all", label: "Tất cả dịch vụ" },
    { value: "combo", label: "Combo trọn gói" },
    { value: "cruise", label: "Du thuyền" },
    { value: "hotel", label: "Khách sạn" },
    { value: "villa", label: "Villa" },
    { value: "restaurant", label: "Nhà hàng" },
  ];

  const sortOptions = [
    { value: "default", label: "Lựa chọn của chúng tôi" },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
  ];

  const availableAmenities = useMemo(() => {
    const cruiseAmenities = [
      "Bể bơi vô cực", "Sân trực thăng", "Phòng Golf 3D",
      "Hầm rượu & Cigar", "Quản gia 24/7", "Bể sục Jacuzzi",
      "Buffet tôm hùm", "Nhạc sống tối",
    ];
    const hotelAmenities = [
      "3 bãi tắm riêng", "Bể bơi 1200m²", "Vincharm Spa",
      "Nhà hàng 5 sao", "Cano đưa đón 24/7", "Kid's Club",
      "Tắm khoáng Onsen", "Xông hơi đá muối", "Vườn Nhật Bản",
      "Hồ bơi riêng", "Bãi cát riêng",
    ];
    return Array.from(new Set([...cruiseAmenities, ...hotelAmenities])).sort();
  }, []);

  const handleCategoryChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("category");
    } else {
      params.set("category", val);
    }
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const allProducts = useMemo<DisplayProduct[]>(() => {
    const list: DisplayProduct[] = [];

    mockCombos.forEach((cb) => {
      list.push({
        id: cb.id,
        type: "combo",
        name: cb.name,
        tagline: cb.tagline,
        image:
          mockCruises.find((c) => c.id === cb.cruiseId)?.imageGallery[0] ||
          mockCruises[0].imageGallery[0],
        stars: 5,
        price: cb.salePrice,
        originalPrice: cb.netPrice,
        location: "Hạ Long, Quảng Ninh",
        amenities: ["Bao gồm du thuyền & resort 5 sao", "Cano đưa đón riêng", "Liệu trình Spa"],
        category: "combo",
      });
    });

    mockCruises.forEach((c) => {
      list.push({
        id: c.id,
        type: "cruise",
        name: c.name,
        tagline: c.tagline,
        image: c.imageGallery[0],
        stars: c.stars,
        price: c.priceFrom,
        originalPrice: c.originalPrice,
        durationDays: c.durationDays,
        location: c.destinations[0],
        amenities: c.amenities,
        destinations: c.destinations,
        category: "cruise",
      });
    });

    mockHotels.forEach((h) => {
      list.push({
        id: h.id,
        type: "hotel",
        name: h.name,
        tagline: h.description,
        image: h.imageGallery[0],
        stars: h.stars,
        price: h.priceFrom || h.roomTypes[0]?.pricePerNight,
        originalPrice: h.originalPrice,
        location: h.location,
        amenities: h.amenities,
        category: h.category || "hotel",
      });
    });

    return list;
  }, []);

  const filteredProducts = allProducts.filter((product) => {
      if (categoryQuery !== "all") {
        if (categoryQuery === "combo") {
          if (product.type !== "combo") return false;
        } else {
          if (product.category !== categoryQuery) return false;
        }
      }

      if (keywordQuery) {
        const key = keywordQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(key);
        const matchesTagline = product.tagline?.toLowerCase().includes(key) || false;
        const matchesLocation = product.location?.toLowerCase().includes(key) || false;
        const matchesDests = product.destinations?.some((d) => d.toLowerCase().includes(key)) || false;
        if (!matchesName && !matchesTagline && !matchesLocation && !matchesDests) return false;
      }

      const price = product.price || 0;
      if (price < minPriceQuery || price > maxPriceQuery) return false;

      if (selectedAmenities.length > 0) {
        if (!product.amenities) return false;
        if (!selectedAmenities.every((a) => product.amenities?.includes(a))) return false;
      }

      return true;
    });

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortOption === "price-asc") return list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortOption === "price-desc") return list.sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [filteredProducts, sortOption]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]);
    setVisibleCount(6);
  };

  const clearAllFilters = useCallback(() => {
    setSelectedAmenities([]);
    setVisibleCount(12);
    const params = new URLSearchParams();
    if (keywordQuery) params.set("keyword", keywordQuery);
    router.push(`/search?${params.toString()}`, { scroll: false });
  }, [keywordQuery, router, setSelectedAmenities, setVisibleCount]);

  const hasActiveFilters =
    selectedAmenities.length > 0 ||
    !!keywordQuery ||
    minPriceQuery > 0 ||
    maxPriceQuery < 50000000;

  const filterSidebar = (
    <div className="space-y-8 text-left">
      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          Loại hình dịch vụ
        </h4>
        <div className="space-y-2">
          {categoryOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 text-xs text-slate-600 cursor-pointer font-medium hover:text-slate-900 group">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${categoryQuery === opt.value ? "border-accent bg-accent" : "border-slate-300 group-hover:border-accent"}`}>
                {categoryQuery === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <input
                type="radio"
                name="category"
                className="hidden"
                checked={categoryQuery === opt.value}
                onChange={() => handleCategoryChange(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          Tiện ích đi kèm
        </h4>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
          {availableAmenities.map((amenity) => (
            <label key={amenity} className="flex items-center gap-3 text-xs text-slate-600 cursor-pointer font-medium hover:text-slate-900 group">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="rounded-sm border-slate-300 text-accent focus:ring-accent w-4 h-4 cursor-pointer"
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear all filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Xóa toàn bộ bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* 1. HERO SEARCH BANNER */}
      <div className="relative h-[560px] md:h-[480px] w-full flex items-center justify-center bg-slate-900 z-30">
        <img
          src="https://baithojunks.com/wp-content/uploads/2023/10/9008halongbay-1.jpg"
          alt="Search Results Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001226]/30 via-[#001226]/50 to-[#001226]/85" />

        {/* Breadcrumb */}
        <div className="absolute top-28 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-accent flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white/90">Kết quả tìm kiếm</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-6xl mt-32">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold block">
            Hải Trình & Nghỉ Dưỡng
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal max-w-3xl mx-auto leading-tight">
            KHÁM PHÁ KỲ QUAN THEO CÁCH RIÊNG CỦA BẠN
          </h1>

          <div className="max-w-6xl mx-auto w-full mt-6">
            <SearchWidget
              initialKeyword={keywordQuery}
              initialCategory={categoryQuery}
              initialMinPrice={minPriceQuery}
              initialMaxPrice={maxPriceQuery}
            />
          </div>
        </div>
      </div>

      {/* 2. RESULTS CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-16 min-h-[60vh]">
        {/* Main Content: Sidebar + Results */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Desktop sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 hidden lg:block sticky top-36">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {filterSidebar}
            </div>
          </aside>

          {/* Results Area */}
          <main className="flex-1 w-full space-y-10">
            {/* Controls bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-slate-100">
              <div className="space-y-1 text-left">
                <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-wide">
                  Kết quả tìm thấy
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Có <span className="font-bold text-slate-850">{sortedProducts.length}</span> lựa chọn phù hợp với tiêu chí của bạn
                </p>
              </div>


              <div className="flex items-center gap-6 self-start sm:self-auto">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 bg-white text-[11px] font-bold rounded-full cursor-pointer hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
                  Bộ lọc
                </button>

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
                    className={`p-2 rounded-full transition-all cursor-pointer ${
                      viewMode === "grid" ? "bg-accent text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-full transition-all cursor-pointer ${
                      viewMode === "list" ? "bg-accent text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid / List */}
            {sortedProducts.length > 0 ? (
              <div className="space-y-12">
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "space-y-8"
                  }
                >
                  {sortedProducts.slice(0, visibleCount).map((product) => (
                    <ProductCard
                      key={`${product.type}-${product.id}`}
                      id={product.id}
                      type={product.type}
                      name={product.name}
                      tagline={product.tagline}
                      image={product.image}
                      stars={product.stars}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      location={product.location}
                      amenities={product.amenities}
                      durationDays={product.durationDays}
                      category={product.category}
                      viewMode={viewMode}
                      variant="compact"
                    />
                  ))}
                </div>

                {/* Load More */}
                {sortedProducts.length > visibleCount && (
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={() => setVisibleCount(prev => Math.min(prev + 12, 30))}
                      className="px-12 py-4 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] font-bold text-[11px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl cursor-pointer"
                    >
                      Xem thêm kết quả
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 p-16 text-center rounded-[2rem] max-w-lg mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-6">
                <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Không tìm thấy sản phẩm phù hợp
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Rất tiếc, các bộ lọc hiện tại của bạn không khớp với bất kỳ dịch vụ nào. Vui lòng thử đặt lại bộ lọc hoặc thay đổi từ khóa.
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3 bg-slate-900 hover:bg-accent hover:text-[#001226] text-white text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer shadow-md"
                >
                  Xóa bộ lọc để thử lại
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  <h3 className="font-serif text-base font-bold text-slate-900 uppercase tracking-wide">
                    Bộ lọc nâng cao
                  </h3>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{filterSidebar}</div>
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full py-4 bg-[#001226] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-[#001226] transition-all shadow-lg"
                >
                  Áp dụng bộ lọc
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LatestBlogs />
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<SearchLoading />}>
        <SearchListContent />
      </Suspense>
      <Footer />
    </>
  );
}
