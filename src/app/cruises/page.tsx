/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { mockCruises } from "@/data/mockData";
import { ChevronRight, Home, ShieldAlert, SlidersHorizontal, Trash2, Search, X, Star, Ship, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomDropdown from "@/components/CustomDropdown";

function CruiseListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Đọc tham số tìm kiếm từ URL
  const nameQuery = searchParams.get("name") || "";
  const destQuery = searchParams.get("destination") || "";
  const starsQuery = searchParams.get("stars") || "";
  
  // State của Banner Search Inputs
  const [bannerName, setBannerName] = useState(nameQuery);
  const [bannerDest, setBannerDest] = useState(destQuery);

  // States của bộ lọc nâng cao
  const [appliedDests, setAppliedDests] = useState<string[]>(destQuery ? [destQuery] : []);
  const [appliedStars, setAppliedStars] = useState<number[]>(starsQuery ? [parseInt(starsQuery)] : []);
  const [appliedAmenities, setAppliedAmenities] = useState<string[]>([]);

  // States tạm thời trong Sidebar (trước khi bấm Áp dụng)
  const [tempDests, setTempDests] = useState<string[]>(destQuery ? [destQuery] : []);
  const [tempStars, setTempStars] = useState<number[]>(starsQuery ? [parseInt(starsQuery)] : []);
  const [tempAmenities, setTempAmenities] = useState<string[]>([]);

  // State mở Sidebar bộ lọc
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

  // State sắp xếp (Sort)
  const [sortOption, setSortOption] = useState<string>("default");

  // Ô tìm kiếm và bộ lọc tự động khởi tạo theo các tham số URL

  // Đồng bộ hóa URL khi lọc từ Banner Search
  const handleBannerSearch = () => {
    const params = new URLSearchParams();
    if (bannerName) params.set("name", bannerName);
    if (bannerDest) params.set("destination", bannerDest);
    
    // reset bộ lọc nâng cao khác khi tìm kiếm mới ở banner
    setAppliedDests(bannerDest ? [bannerDest] : []);
    setTempDests(bannerDest ? [bannerDest] : []);
    setAppliedStars([]);
    setTempStars([]);
    setAppliedAmenities([]);
    setTempAmenities([]);

    router.push(`/cruises?${params.toString()}`);
  };



  // Xử lý Checkbox trong Sidebar
  const toggleDest = (dest: string) => {
    setTempDests(prev =>
      prev.includes(dest) ? prev.filter(d => d !== dest) : [...prev, dest]
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

  // Áp dụng bộ lọc từ Sidebar
  const handleApplyFilters = () => {
    setAppliedDests(tempDests);
    setAppliedStars(tempStars);
    setAppliedAmenities(tempAmenities);
    setIsSidebarOpen(false);

    // Đồng bộ lại URL query parameters
    const params = new URLSearchParams();
    if (bannerName) params.set("name", bannerName);
    if (tempDests.length === 1) {
      params.set("destination", tempDests[0]);
    } else if (tempDests.length > 1) {
      // nếu chọn nhiều thì URL giữ điểm đến của banner hoặc không cần
      if (bannerDest) params.set("destination", bannerDest);
    }
    if (tempStars.length === 1) {
      params.set("stars", tempStars[0].toString());
    }
    router.push(`/cruises?${params.toString()}`);
  };

  // Xóa toàn bộ bộ lọc
  const handleClearFilters = () => {
    setTempDests([]);
    setTempStars([]);
    setTempAmenities([]);
    setAppliedDests([]);
    setAppliedStars([]);
    setAppliedAmenities([]);
    setBannerName("");
    setBannerDest("");
    setIsSidebarOpen(false);
    router.push("/cruises");
  };

  // Đóng sidebar và khôi phục lại giá trị cũ (chưa áp dụng)
  const handleCloseSidebar = () => {
    setTempDests(appliedDests);
    setTempStars(appliedStars);
    setTempAmenities(appliedAmenities);
    setIsSidebarOpen(false);
  };

  // Tất cả các điểm đến & tiện ích độc nhất của mock dữ liệu để tạo bộ lọc
  const availableDests = ["Vịnh Hạ Long", "Vịnh Lan Hạ", "Đảo Cát Bà"];
  const availableAmenities = [
    "Hồ bơi vô cực nước mặn",
    "Sân đỗ trực thăng riêng",
    "Phòng mô phỏng Golf 3D",
    "Hầm rượu vang & Cigar",
    "Dịch vụ quản gia 24/7",
    "Bể sục Jacuzzi ngoài trời",
    "Tiệc tối buffet tôm hùm thả ga",
    "Ban nhạc sống biểu diễn hàng tối",
    "Triển lãm tranh họa sĩ Phạm Lực",
    "Hồ bơi bốn mùa trên boong tàu"
  ];

  // Logic lọc du thuyền
  const filteredCruises = mockCruises.filter((cruise) => {
    // 1. Lọc theo tên từ Banner
    if (nameQuery && !cruise.name.toLowerCase().includes(nameQuery.toLowerCase())) {
      return false;
    }

    // 2. Lọc theo Điểm đến (Sidebar hoặc Banner fallback)
    if (appliedDests.length > 0) {
      const hasDest = cruise.destinations.some(d => appliedDests.includes(d));
      if (!hasDest) return false;
    } else if (destQuery) {
      const hasDest = cruise.destinations.some(d => d.toLowerCase().includes(destQuery.toLowerCase()));
      if (!hasDest) return false;
    }

    // 3. Lọc theo Hạng sao (Sidebar)
    if (appliedStars.length > 0) {
      if (!appliedStars.includes(cruise.stars)) return false;
    }

    // 4. Lọc theo Tiện ích (Sidebar - Match toàn bộ tiện ích đã chọn)
    if (appliedAmenities.length > 0) {
      const hasAllAmenities = appliedAmenities.every(a => cruise.amenities.includes(a));
      if (!hasAllAmenities) return false;
    }

    return true;
  });

  // Logic Sắp xếp
  const sortedCruises = [...filteredCruises].sort((a, b) => {
    if (sortOption === "price-asc") {
      return a.priceFrom - b.priceFrom;
    }
    if (sortOption === "price-desc") {
      return b.priceFrom - a.priceFrom;
    }
    if (sortOption === "stars-desc") {
      return b.stars - a.stars;
    }
    return 0; // default
  });

  const totalActiveFilters = appliedDests.length + appliedStars.length + appliedAmenities.length;

  return (
    <div className="w-full">
      {/* 1. COMPACT SEARCH BANNER */}
      <div className="relative h-[560px] md:h-[600px] w-full flex items-center justify-center bg-slate-900 z-30">
        <img
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1920"
          alt="Cruises Banner"
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
            <span className="text-white/90">Du thuyền</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-4xl mt-20">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold block">
            Hải Trình Kỳ Vĩ
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal">
            HẠM ĐỘI DU THUYỀN HẠNG SANG
          </h1>
          
          {/* Banner Search Input Overlay */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleBannerSearch(); }}
            className="max-w-3xl mx-auto bg-white/10 border border-white/20 backdrop-blur-xl md:rounded-full rounded-2xl p-3 md:pl-8 md:pr-3 md:py-3 shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-0 text-left w-full mt-6"
          >
            {/* Tên du thuyền */}
            <div className="w-full md:flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0 transition-all duration-300 hover:bg-white/10">
                <Ship className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <label className="text-[10px] uppercase tracking-[0.12em] text-white/60 font-semibold block">
                  Tên du thuyền
                </label>
                <input
                  type="text"
                  placeholder="Tìm theo tên du thuyền..."
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  className="w-full bg-transparent text-white text-sm font-semibold border-none focus:outline-none placeholder-white/45 mt-0.5 focus:ring-0 p-0"
                />
              </div>
            </div>

            {/* Vertical Divider (Desktop only) */}
            <div className="hidden md:block w-[1px] h-8 bg-white/15 mx-6" />

            {/* Dropdown: Destination */}
            <div className="w-full md:flex-1 md:mr-8">
              <CustomDropdown
                label="Tuyến điểm du ngoạn"
                value={bannerDest}
                onChange={setBannerDest}
                options={[
                  { value: "", label: "Tất cả điểm đến" },
                  ...availableDests.map(d => ({ value: d, label: d }))
                ]}
                icon={<MapPin className="w-4 h-4 text-white" />}
                placement="bottom"
              />
            </div>

            {/* Action button */}
            <div className="w-full md:w-auto flex-shrink-0">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3.5 bg-white hover:bg-accent text-[#001226] font-bold text-xs uppercase tracking-[0.15em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. FILTER BAR */}
      <div className="border-b border-slate-100 bg-white sticky top-[72px] z-20 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2.5">
            {/* Hạng sao Filter Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`px-4 py-2 border rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer hidden sm:flex ${
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
              className={`px-4 py-2 border rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer hidden sm:flex ${
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
            <span>Bộ lọc nâng cao</span>
            {totalActiveFilters > 0 && (
              <span className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold bg-accent text-[#001226]">
                {totalActiveFilters}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 min-h-[50vh]">
        {/* Results Header (Count & Sort) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-normal text-slate-900 tracking-wide">
              {nameQuery ? `Kế quả tìm kiếm: "${nameQuery}"` : "Hải trình khám phá"}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Tìm thấy <span className="font-bold text-slate-850">{sortedCruises.length}</span> du thuyền phù hợp
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sắp xếp:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-xs font-bold focus:outline-none bg-slate-50 border border-slate-200 rounded-full px-4 py-2 cursor-pointer text-slate-700"
            >
              <option value="default">Lựa chọn của chúng tôi</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="stars-desc">Hạng sao cao nhất</option>
            </select>
          </div>
        </div>

        {/* Cruises Grid */}
        {sortedCruises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCruises.map((cruise) => (
              <ProductCard
                key={cruise.id}
                id={cruise.id}
                type="cruise"
                name={cruise.name}
                tagline={cruise.tagline}
                image={cruise.imageGallery[0]}
                stars={cruise.stars}
                price={cruise.priceFrom}
                durationDays={cruise.durationDays}
                location={cruise.destinations[0]}
                amenities={cruise.amenities}
                launchYear={cruise.launchYear}
                material={cruise.material}
                cabinCount={cruise.cabinCount}
                variant="detailed"
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm py-12">
            <ShieldAlert className="w-12 h-12 text-accent-dark mx-auto animate-bounce" />
            <h3 className="font-serif text-lg font-bold text-slate-800">Không tìm thấy du thuyền phù hợp</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rất tiếc, các tiêu chí lọc của quý khách hiện không trùng khớp với du thuyền nào trong hạm đội của chúng tôi. 
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

      {/* 3. FILTER SIDEBAR (Trượt từ phải sang) */}
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
                  className="p-2 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer text-slate-600"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 1. Điểm đến */}
                <div className="space-y-3.5">
                  <h4 className="font-serif text-sm font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                    Điểm đến khám phá
                  </h4>
                  <div className="space-y-2.5">
                    {availableDests.map((dest) => {
                      const isChecked = tempDests.includes(dest);
                      return (
                        <label key={dest} className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDest(dest)}
                            className="w-4.5 h-4.5 rounded border-slate-300 text-[#001226] focus:ring-[#001226] cursor-pointer"
                          />
                          <span>{dest}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Phân khúc / Hạng sao */}
                <div className="space-y-3.5">
                  <h4 className="font-serif text-sm font-bold text-slate-850 uppercase tracking-wide border-b border-slate-100 pb-2">
                    Hạng sao du thuyền
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
                              ({star} sao - {star === 5 ? "Siêu sang" : "Cao cấp"})
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
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
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
                  className="flex items-center gap-1.5 px-4 py-3 border border-slate-300 hover:border-slate-800 text-slate-600 hover:text-slate-900 text-xs uppercase tracking-wider font-bold rounded-full transition-all duration-300 cursor-pointer bg-white"
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

function CruiseListContentWithKey() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const dest = searchParams.get("destination") || "";
  const stars = searchParams.get("stars") || "";
  return <CruiseListContent key={`${name}-${dest}-${stars}`} />;
}

export default function CruisesPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <CruiseListContentWithKey />
      </Suspense>
      <Footer />
    </>
  );
}
