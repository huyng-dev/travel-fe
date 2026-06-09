"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Tag, DollarSign, ChevronDown, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockCruises, mockHotels, mockCombos } from "@/data/mockData";

interface SearchWidgetProps {
  initialKeyword?: string;
  initialCategory?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
}

export default function SearchWidget({
  initialKeyword = "",
  initialCategory = "all",
  initialMinPrice = 0,
  initialMaxPrice = 50000000,
}: SearchWidgetProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  // States for custom dropdowns
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Sync state from props during rendering to avoid useEffect cascading renders
  const [prevInitialKeyword, setPrevInitialKeyword] = useState(initialKeyword);
  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategory);
  const [prevInitialMinPrice, setPrevInitialMinPrice] = useState(initialMinPrice);
  const [prevInitialMaxPrice, setPrevInitialMaxPrice] = useState(initialMaxPrice);

  if (
    initialKeyword !== prevInitialKeyword ||
    initialCategory !== prevInitialCategory ||
    initialMinPrice !== prevInitialMinPrice ||
    initialMaxPrice !== prevInitialMaxPrice
  ) {
    setPrevInitialKeyword(initialKeyword);
    setPrevInitialCategory(initialCategory);
    setPrevInitialMinPrice(initialMinPrice);
    setPrevInitialMaxPrice(initialMaxPrice);

    setKeyword(initialKeyword);
    setCategory(initialCategory);
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setIsPriceOpen(false);
      }
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autocomplete items mapping
  const allSearchItems = [
    ...mockCombos.map(cb => ({ id: cb.id, name: cb.name, type: "combo", path: `/combos/${cb.id}` })),
    ...mockCruises.map(c => ({ id: c.id, name: c.name, type: "cruise", path: `/cruises/${c.id}` })),
    ...mockHotels.map(h => {
      const isDining = h.category === "restaurant" || h.category === "culture";
      const routePrefix = isDining ? "dining-culture" : "stays";
      return { id: h.id, name: h.name, type: h.category || "hotel", path: `/${routePrefix}/${h.id}` };
    })
  ];

  const suggestions = keyword.trim()
    ? allSearchItems.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase())).slice(0, 8)
    : [];

  const getItemBadgeType = (type: string) => {
    switch (type) {
      case "cruise": return { label: "Du thuyền", className: "bg-blue-50 text-blue-700 border-blue-100" };
      case "hotel": return { label: "Khách sạn", className: "bg-teal-50 text-teal-700 border-teal-100" };
      case "villa": return { label: "Villa", className: "bg-indigo-50 text-indigo-700 border-indigo-100" };
      case "homestay": return { label: "Homestay", className: "bg-rose-50 text-rose-700 border-rose-100" };
      case "restaurant": return { label: "Nhà hàng", className: "bg-amber-50 text-amber-700 border-amber-100" };
      case "combo": return { label: "Combo", className: "bg-purple-50 text-purple-700 border-purple-100" };
      default: return { label: "Dịch vụ", className: "bg-slate-50 text-slate-700 border-slate-100" };
    }
  };

  // Format currency
  const formatPriceLabel = (val: number) => {
    if (val >= 50000000) return "Không giới hạn";
    if (val === 0) return "0 đ";
    if (val >= 1000000) {
      const millions = val / 1000000;
      return `${millions.toLocaleString("vi-VN")} triệu`;
    }
    return `${(val / 1000).toLocaleString("vi-VN")}k`;
  };

  const formatCurrencyInput = (val: number) => {
    return val.toLocaleString("vi-VN") + " đ";
  };

  const parseCurrencyInput = (text: string): number => {
    const cleanText = text.replace(/[^0-9]/g, "");
    return cleanText ? parseInt(cleanText, 10) : 0;
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseCurrencyInput(e.target.value);
    setMinPrice(val);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseCurrencyInput(e.target.value);
    setMaxPrice(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: string[] = [];
    if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
    if (category !== "all") params.push(`category=${category}`);
    if (minPrice > 0) params.push(`minPrice=${minPrice}`);
    if (maxPrice < 50000000) params.push(`maxPrice=${maxPrice}`);

    router.push(`/search?${params.join("&")}`);
  };

  const categoryOptions = [
    { value: "all", label: "Tất cả dịch vụ" },
    { value: "combo", label: "Combo trọn gói" },
    { value: "cruise", label: "Du thuyền" },
    { value: "hotel", label: "Khách sạn" },
    { value: "villa", label: "Villa" },
    { value: "homestay", label: "Homestay" },
    { value: "restaurant", label: "Nhà hàng" },
  ];

  const getCategoryLabel = () => {
    const option = categoryOptions.find((opt) => opt.value === category);
    return option ? option.label : "Chọn loại hình";
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full bg-white border border-slate-100 hover:border-accent/30 focus-within:border-accent/40 shadow-[0_20px_48px_rgba(0,0,0,0.12)] hover:shadow-[0_24px_56px_rgba(212,163,89,0.15)] md:rounded-full rounded-2xl p-3.5 md:pl-9 md:pr-3.5 md:py-3.5 flex flex-col md:flex-row items-center gap-4 md:gap-0 text-left transition-all duration-500"
    >
      {/* 1. Keyword search */}
      <div ref={suggestionRef} className="w-full md:flex-1 flex items-center gap-3 relative">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-accent flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-slate-200/60">
          <Compass className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <label className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold block">
            Từ khóa tìm kiếm
          </label>
          <input
            type="text"
            placeholder="Tên tour, khách sạn, dịch vụ..."
            value={keyword}
            onFocus={() => setIsSuggestionsOpen(keyword.trim().length > 0)}
            onChange={(e) => {
              setKeyword(e.target.value);
              setIsSuggestionsOpen(e.target.value.trim().length > 0);
            }}
            className="w-full bg-transparent text-slate-800 text-sm font-semibold border-none focus:outline-none placeholder-slate-400 mt-0.5 focus:ring-0 p-0"
          />
        </div>

        {/* Suggested Autocomplete Dropdown */}
        <AnimatePresence>
          {isSuggestionsOpen && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full w-full md:w-[500px] lg:w-[600px] z-50 bg-white border border-slate-200/90 rounded-2xl shadow-2xl py-3 mt-3 max-h-80 overflow-y-auto text-slate-800"
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
                        router.push(item.path);
                      }}
                      className="px-4 py-3 hover:bg-accent/10 cursor-pointer flex items-center justify-between gap-3 transition-colors duration-150 text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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

      {/* Vertical Divider */}
      <div className="hidden md:block w-[1px] h-8 bg-slate-200/80 mx-6" />

      {/* 2. Category selection */}
      <div ref={categoryRef} className="w-full md:flex-1 relative">
        <div
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex items-center gap-3 cursor-pointer py-1"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 text-accent flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-slate-200/60">
            <Tag className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <span className="text-[10px] uppercase tracking-[0.12em] font-semibold block text-slate-500">
              Loại hình dịch vụ
            </span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-sm font-semibold truncate text-slate-800">
                {getCategoryLabel()}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 text-slate-400 ml-1 ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isCategoryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 z-30 bg-white border border-slate-200/80 rounded-xl shadow-2xl overflow-hidden py-1.5 mt-3 max-h-64 overflow-y-auto"
            >
              {categoryOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setCategory(option.value);
                    setIsCategoryOpen(false);
                  }}
                  className={`px-5 py-3 text-xs font-semibold cursor-pointer transition-all duration-200 text-left ${
                    option.value === category
                      ? "text-[#001226] font-bold bg-accent/10"
                      : "text-slate-700 hover:bg-accent/10 hover:text-slate-900"
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-[1px] h-8 bg-slate-200/80 mx-6" />

      {/* 3. Price Range dropdown */}
      <div ref={priceRef} className="w-full md:flex-1 relative">
        <div
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="w-full flex items-center gap-3 cursor-pointer py-1"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 text-accent flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-slate-200/60">
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <span className="text-[10px] uppercase tracking-[0.12em] font-semibold block text-slate-500">
              Khoảng giá (VNĐ)
            </span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-sm font-semibold truncate text-slate-800">
                {minPrice === 0 && maxPrice >= 50000000
                  ? "Tất cả mức giá"
                  : `${formatPriceLabel(minPrice)} - ${formatPriceLabel(maxPrice)}`}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 text-slate-400 ml-1 ${
                  isPriceOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isPriceOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 md:left-auto md:right-0 w-[280px] sm:w-[320px] z-30 bg-white border border-slate-200/80 rounded-2xl shadow-2xl p-5 mt-3 space-y-4 text-slate-800"
            >
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b border-slate-100 pb-2 text-left">
                Chọn khoảng giá
              </h4>

              {/* Price inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Từ</span>
                  <input
                    type="text"
                    value={formatCurrencyInput(minPrice)}
                    onChange={handleMinPriceChange}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Đến</span>
                  <input
                    type="text"
                    value={formatCurrencyInput(maxPrice)}
                    onChange={handleMaxPriceChange}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-accent text-slate-800"
                  />
                </div>
              </div>

              {/* Range Slider for max price */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                  <span>Mức giá tối đa</span>
                  <span className="text-accent">{formatPriceLabel(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="500000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                  <span>500k</span>
                  <span>25 triệu</span>
                  <span>50 triệu+</span>
                </div>
              </div>

              {/* Footer action */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMinPrice(0);
                    setMaxPrice(50000000);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] uppercase tracking-wider font-bold rounded-full transition-all duration-300 cursor-pointer"
                >
                  Đặt lại
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPriceOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white hover:bg-accent hover:text-slate-900 text-[10px] uppercase tracking-wider font-bold rounded-full transition-all duration-300 cursor-pointer"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Action Button */}
      <div className="w-full md:w-auto flex-shrink-0 md:ml-4">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-bold text-xs uppercase tracking-[0.1em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer border-none"
        >
          <Search className="w-4 h-4" />
          TÌM KIẾM
        </button>
      </div>
    </form>
  );
}
