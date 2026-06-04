/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { mockHotels } from "@/data/mockData";
import { Building, ChevronRight, Home, ShieldAlert, SlidersHorizontal, Trash2, Search, X, Star, MapPin, Grid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomDropdown from "@/components/CustomDropdown";

function HotelListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Đọc tham số tìm kiếm từ URL
  const nameQuery = searchParams.get("name") || "";
  const locationQuery = searchParams.get("location") || "";
  const starsQuery = searchParams.get("stars") || "";

  // State của Banner Search Inputs
  const [bannerName, setBannerName] = useState(nameQuery);
  const [bannerLocation, setBannerLocation] = useState(locationQuery);

  // States của bộ lọc nâng cao
  const [appliedLocations, setAppliedLocations] = useState<string[]>(locationQuery ? [locationQuery] : []);
  const [appliedStars, setAppliedStars] = useState<number[]>(starsQuery ? [parseInt(starsQuery)] : []);
  const [appliedAmenities, setAppliedAmenities] = useState<string[]>([]);

  // States tạm thời trong Sidebar (trước khi bấm Áp dụng)
  const [tempLocations, setTempLocations] = useState<string[]>(locationQuery ? [locationQuery] : []);
  const [tempStars, setTempStars] = useState<number[]>(starsQuery ? [parseInt(starsQuery)] : []);
  const [tempAmenities, setTempAmenities] = useState<string[]>([]);

  // State mở Sidebar bộ lọc
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync state from query params during rendering (React pattern to avoid useEffect cascading renders)
  const [prevName, setPrevName] = useState(nameQuery);
  const [prevLoc, setPrevLoc] = useState(locationQuery);
  const [prevStars, setPrevStars] = useState(starsQuery);

  if (nameQuery !== prevName || locationQuery !== prevLoc || starsQuery !== prevStars) {
    setPrevName(nameQuery);
    setPrevLoc(locationQuery);
    setPrevStars(starsQuery);
    setBannerName(nameQuery);
    setBannerLocation(locationQuery);
    setAppliedLocations(locationQuery ? [locationQuery] : []);
    setTempLocations(locationQuery ? [locationQuery] : []);
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

  // State sắp xếp (Sort)
  const [sortOption, setSortOption] = useState<string>("default");

  // Đồng bộ hóa URL khi lọc từ Banner Search hoặc Left Sidebar
  const updateUrl = (locs: string[], stars: number[]) => {
    const params = new URLSearchParams();
    if (bannerName) params.set("name", bannerName);
    if (locs.length === 1) {
      params.set("location", locs[0]);
    } else if (locs.length > 1 && bannerLocation) {
      params.set("location", bannerLocation);
    }
    if (stars.length === 1) {
      params.set("stars", stars[0].toString());
    }
    router.push(`/hotels?${params.toString()}`, { scroll: false });
  };

  // Đồng bộ hóa URL khi lọc từ Banner Search
  const handleBannerSearch = () => {
    const params = new URLSearchParams();
    if (bannerName) params.set("name", bannerName);
    if (bannerLocation) params.set("location", bannerLocation);

    // Reset bộ lọc nâng cao khác khi tìm kiếm mới ở banner
    setAppliedLocations(bannerLocation ? [bannerLocation] : []);
    setTempLocations(bannerLocation ? [bannerLocation] : []);
    setAppliedStars([]);
    setTempStars([]);
    setAppliedAmenities([]);
    setTempAmenities([]);

    router.push(`/hotels?${params.toString()}`, { scroll: false });
  };

  // Xử lý Checkbox trong Sidebar trượt (Mobile)
  const toggleLocation = (loc: string) => {
    setTempLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const toggleStar = (star: number) => {
    setTempStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setTempAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Xử lý Checkbox trực tiếp trong Left Sidebar (Desktop)
  const toggleLocationDirect = (loc: string) => {
    const next = appliedLocations.includes(loc)
      ? appliedLocations.filter(l => l !== loc)
      : [...appliedLocations, loc];
    setAppliedLocations(next);
    setTempLocations(next); // Đồng bộ trạng thái temp
    updateUrl(next, appliedStars);
  };

  const toggleStarDirect = (star: number) => {
    const next = appliedStars.includes(star)
      ? appliedStars.filter(s => s !== star)
      : [...appliedStars, star];
    setAppliedStars(next);
    setTempStars(next);
    updateUrl(appliedLocations, next);
  };

  const toggleAmenityDirect = (amenity: string) => {
    const next = appliedAmenities.includes(amenity)
      ? appliedAmenities.filter(a => a !== amenity)
      : [...appliedAmenities, amenity];
    setAppliedAmenities(next);
    setTempAmenities(next);
    updateUrl(appliedLocations, appliedStars);
  };

  // Áp dụng bộ lọc từ Sidebar trượt (Mobile)
  const handleApplyFilters = () => {
    setAppliedLocations(tempLocations);
    setAppliedStars(tempStars);
    setAppliedAmenities(tempAmenities);
    setIsSidebarOpen(false);
    updateUrl(tempLocations, tempStars);
  };

  // Xóa toàn bộ bộ lọc
  const handleClearFilters = () => {
    setTempLocations([]);
    setTempStars([]);
    setTempAmenities([]);
    setAppliedLocations([]);
    setAppliedStars([]);
    setAppliedAmenities([]);
    setBannerName("");
    setBannerLocation("");
    setIsSidebarOpen(false);
    router.push("/hotels", { scroll: false });
  };

  // Đóng sidebar và khôi phục lại giá trị cũ (chưa áp dụng)
  const handleCloseSidebar = () => {
    setTempLocations(appliedLocations);
    setTempStars(appliedStars);
    setTempAmenities(appliedAmenities);
    setIsSidebarOpen(false);
  };

  // Các dữ liệu địa điểm & tiện ích nổi bật của Mock
  const availableLocations = ["Bãi Cháy", "Đảo Rều", "Quang Hanh"];
  const availableAmenities = [
    "3 bãi tắm riêng",
    "Bể bơi 1200m²",
    "Vincharm Spa",
    "Nhà hàng 5 sao",
    "Cano đưa đón 24/7",
    "Tắm khoáng Onsen",
    "Xông hơi đá muối",
    "Phòng Washitsu",
    "Vườn Nhật Bản",
    "Hồ bơi riêng",
    "Bãi cát riêng",
    "Bể bơi trung tâm"
  ];

  // Logic lọc khách sạn
  const filteredHotels = mockHotels.filter((hotel) => {
    // 1. Lọc theo tên từ Banner
    if (nameQuery && !hotel.name.toLowerCase().includes(nameQuery.toLowerCase())) {
      return false;
    }

    // 2. Lọc theo khu vực địa lý
    if (appliedLocations.length > 0) {
      const hasLoc = appliedLocations.some(loc => hotel.location.toLowerCase().includes(loc.toLowerCase()));
      if (!hasLoc) return false;
    } else if (locationQuery) {
      const hasLoc = hotel.location.toLowerCase().includes(locationQuery.toLowerCase());
      if (!hasLoc) return false;
    }

    // 3. Lọc theo Hạng sao (Sidebar)
    if (appliedStars.length > 0) {
      if (!appliedStars.includes(hotel.stars)) return false;
    }

    // 4. Lọc theo Tiện ích (Sidebar - Match toàn bộ tiện ích đã chọn)
    if (appliedAmenities.length > 0) {
      const hasAllAmenities = appliedAmenities.every(a => hotel.amenities.includes(a));
      if (!hasAllAmenities) return false;
    }

    return true;
  });

  // Logic Sắp xếp
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    const priceA = a.roomTypes[0]?.pricePerNight || 0;
    const priceB = b.roomTypes[0]?.pricePerNight || 0;

    if (sortOption === "price-asc") {
      return priceA - priceB;
    }
    if (sortOption === "price-desc") {
      return priceB - priceA;
    }
    if (sortOption === "stars-desc") {
      return b.stars - a.stars;
    }
    return 0; // default
  });

  const totalActiveFilters = appliedLocations.length + appliedStars.length + appliedAmenities.length;

  return (
    <div className="w-full">
      {/* 1. COMPACT SEARCH BANNER */}
      <div className="relative h-[560px] md:h-[480px] w-full flex items-center justify-center bg-slate-900 z-30">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920"
          alt="Hotels Banner"
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
            <span className="text-white/90">Khách sạn</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-4xl mt-20">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold block">
            Nghỉ Dưỡng Thượng Lưu
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal">
            RESORT & KHÁCH SẠN CAO CẤP
          </h1>
          
          {/* Banner Search Input Overlay */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleBannerSearch(); }}
            className="max-w-3xl mx-auto bg-white border border-slate-100 shadow-xl md:rounded-full rounded-2xl p-3 md:pl-8 md:pr-3 md:py-3 flex flex-col md:flex-row items-center gap-4 md:gap-0 text-left w-full mt-6"
          >
            {/* Tên khách sạn */}
            <div className="w-full md:flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-accent flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-slate-200/60">
                <Building className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <label className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold block">
                  Tên khách sạn
                </label>
                <input
                  type="text"
                  placeholder="Tìm theo tên khách sạn..."
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-sm font-semibold border-none focus:outline-none placeholder-slate-400 mt-0.5 focus:ring-0 p-0"
                />
              </div>
            </div>

            {/* Vertical Divider (Desktop only) */}
            <div className="hidden md:block w-[1px] h-8 bg-slate-200/80 mx-6" />

            {/* Dropdown: Location */}
            <div className="w-full md:flex-1 md:mr-8">
              <CustomDropdown
                label="Khu vực điểm đến"
                value={bannerLocation}
                onChange={setBannerLocation}
                options={[
                  { value: "", label: "Tất cả khu vực" },
                  ...availableLocations.map(loc => ({ value: loc, label: loc }))
                ]}
                icon={<MapPin className="w-4 h-4 text-accent" />}
                placement="bottom"
                variant="light"
              />
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

            {/* Tiện ích Filter Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`px-4 py-2 border rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex ${
                appliedAmenities.length > 0
                  ? "border-[#001226] bg-slate-50 text-[#001226]"
                  : "border-slate-200 hover:border-slate-800 text-slate-650 hover:bg-slate-50"
              }`}
            >
              Tiện ích{appliedAmenities.length > 0 ? ` (${appliedAmenities.length})` : ": Tất cả"}
            </button>
          </div>

          {/* Bộ lọc tổng quát Button */}
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

            {/* 1. Khu vực địa lý */}
            <div className="space-y-3">
              <h4 className="font-serif text-xs font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                Khu vực địa lý
              </h4>
              <div className="space-y-2">
                {availableLocations.map((loc) => {
                  const isChecked = appliedLocations.includes(loc);
                  return (
                    <label key={loc} className="flex items-center gap-2.5 text-xs font-semibold text-slate-650 cursor-pointer select-none hover:text-accent transition-colors">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLocationDirect(loc)}
                        className="w-4 h-4 rounded border-slate-200 text-[#001226] focus:ring-[#001226] cursor-pointer"
                      />
                      <span>{loc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Hạng sao */}
            <div className="space-y-3">
              <h4 className="font-serif text-xs font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                Hạng sao khách sạn
              </h4>
              <div className="space-y-2">
                {[5, 4].map((star) => {
                  const isChecked = appliedStars.includes(star);
                  return (
                    <label key={star} className="flex items-center gap-2.5 text-xs font-semibold text-slate-650 cursor-pointer select-none hover:text-accent transition-colors">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleStarDirect(star)}
                        className="w-4 h-4 rounded border-slate-200 text-[#001226] focus:ring-[#001226] cursor-pointer"
                      />
                      <div className="flex items-center gap-0.5 text-accent">
                        {Array.from({ length: star }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                        ))}
                        <span className="text-[10px] text-slate-500 font-medium ml-1">
                          ({star} sao)
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Tiện ích */}
            <div className="space-y-3">
              <h4 className="font-serif text-xs font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                Tiện ích nổi bật
              </h4>
              <div className="space-y-2">
                {availableAmenities.map((amenity) => {
                  const isChecked = appliedAmenities.includes(amenity);
                  return (
                    <label key={amenity} className="flex items-center gap-2.5 text-xs font-semibold text-slate-650 cursor-pointer select-none hover:text-accent transition-colors">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAmenityDirect(amenity)}
                        className="w-4 h-4 rounded border-slate-200 text-[#001226] focus:ring-[#001226] cursor-pointer"
                      />
                      <span className="leading-tight">{amenity}</span>
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
                  {nameQuery ? `Kết quả tìm kiếm: "${nameQuery}"` : "Khu nghỉ dưỡng nổi tiếng"}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Tìm thấy <span className="font-bold text-slate-850">{sortedHotels.length}</span> khách sạn phù hợp
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
                    <option value="price-asc">Giá từ thấp đến cao</option>
                    <option value="price-desc">Giá từ cao đến thấp</option>
                    <option value="stars-desc">Hạng sao cao nhất</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-full shadow-xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      viewMode === "grid" ? "bg-accent text-white" : "text-slate-500 hover:text-slate-880"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      viewMode === "list" ? "bg-accent text-white" : "text-slate-500 hover:text-slate-880"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hotels Grid/List */}
            {sortedHotels.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
                {sortedHotels.map((hotel) => (
                  <ProductCard
                    key={hotel.id}
                    id={hotel.id}
                    type="hotel"
                    name={hotel.name}
                    tagline={hotel.location.split(",").slice(-2).join(",").trim()}
                    image={hotel.imageGallery[0]}
                    stars={hotel.stars}
                    price={hotel.roomTypes[0]?.pricePerNight}
                    location={hotel.location}
                    amenities={hotel.amenities}
                    roomCount={hotel.roomCount}
                    variant="detailed"
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm py-12">
                <ShieldAlert className="w-12 h-12 text-accent-dark mx-auto animate-bounce" />
                <h3 className="font-serif text-lg font-bold text-slate-800">Không tìm thấy khách sạn phù hợp</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Rất tiếc, các tiêu chí lọc của quý khách hiện không trùng khớp với khách sạn nào trong danh sách 5 sao của chúng tôi. 
                  Vui lòng xóa bộ lọc hoặc chọn các tiêu chí khác để tìm kiếm lại.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] font-bold text-xs uppercase tracking-[0.12em] rounded-full transition-all duration-300 inline-block border border-[#001226] hover:border-accent cursor-pointer"
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
              key="filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseSidebar}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs"
            />

            {/* Sidebar Container */}
            <motion.div
              key="filter-sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-full sm:w-[400px] bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-150">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-800" />
                  <h3 className="font-serif text-lg font-semibold text-slate-900">Bộ lọc nâng cao</h3>
                </div>
                <button
                  onClick={handleCloseSidebar}
                  className="p-2 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer text-slate-650"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 1. Địa điểm / Khu vực */}
                <div className="space-y-3.5">
                  <h4 className="font-serif text-sm font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                    Khu vực địa lý
                  </h4>
                  <div className="space-y-2.5">
                    {availableLocations.map((loc) => {
                      const isChecked = tempLocations.includes(loc);
                      return (
                        <label key={loc} className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleLocation(loc)}
                            className="w-4.5 h-4.5 rounded border-slate-300 text-[#001226] focus:ring-[#001226] cursor-pointer"
                          />
                          <span>{loc}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Hạng sao */}
                <div className="space-y-3.5">
                  <h4 className="font-serif text-sm font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                    Hạng sao khách sạn
                  </h4>
                  <div className="space-y-2.5">
                    {[5, 4].map((star) => {
                      const isChecked = tempStars.includes(star);
                      return (
                        <label key={star} className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStar(star)}
                            className="w-4.5 h-4.5 rounded border-slate-300 text-[#001226] focus:ring-[#001226] cursor-pointer"
                          />
                          <div className="flex items-center gap-0.5 text-accent">
                            {Array.from({ length: star }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                            ))}
                            <span className="text-[11px] text-slate-500 font-medium ml-1">
                              ({star} sao)
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Tiện ích nổi bật */}
                <div className="space-y-3.5">
                  <h4 className="font-serif text-sm font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                    Tiện ích nổi bật
                  </h4>
                  <div className="space-y-2.5">
                    {availableAmenities.map((amenity) => {
                      const isChecked = tempAmenities.includes(amenity);
                      return (
                        <label key={amenity} className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAmenity(amenity)}
                            className="w-4.5 h-4.5 rounded border-slate-300 text-[#001226] focus:ring-[#001226] cursor-pointer"
                          />
                          <span>{amenity}</span>
                        </label>
                      );
                    })}
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

function HotelListContentWithKey() {
  return <HotelListContent />;
}

export default function HotelsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <HotelListContentWithKey />
      </Suspense>
      <Footer />
    </>
  );
}
