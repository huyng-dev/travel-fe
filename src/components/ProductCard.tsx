/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";

interface ProductCardProps {
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
  launchYear?: string;
  material?: string;
  cabinCount?: number;
  roomCount?: number;
  variant?: "compact" | "detailed";
  viewMode?: "grid" | "list";
  category?: string;
}

export default function ProductCard({
  id,
  type,
  name,
  tagline,
  image,
  stars,
  badge,
  price,
  originalPrice,
  location,
  amenities,
  variant = "compact",
  viewMode = "grid",
  category,
}: ProductCardProps) {
  
  // Định dạng tiền tệ VNĐ
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleEnquire = () => {
    // Kích hoạt sự kiện tùy chỉnh để cập nhật LeadBookingWidget
    const event = new CustomEvent("select-product", {
      detail: { id, name, type },
    });
    window.dispatchEvent(event);

    // Cuộn mượt tới Widget
    const widget = document.getElementById("lead-booking-widget");
    if (widget) {
      widget.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isDetailed = variant === "detailed";

  // Tính tỷ lệ phần trăm giảm giá nếu có
  const discountPercent = originalPrice && price && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Lấy nhãn phân loại dịch vụ
  const getCategoryLabel = () => {
    if (type === "combo") return "Combo trọn gói";
    if (category) {
      switch (category) {
        case "cruise": return "Du thuyền";
        case "hotel": return "Khách sạn";
        case "villa": return "Villa";
        case "restaurant": return "Nhà hàng";
        default: return category;
      }
    }
    return type === "cruise" ? "Du thuyền" : "Khách sạn";
  };

  const cardContent = (
    <>
      {/* Image Section */}
      <div className={`relative ${viewMode === "list" ? "aspect-[16/10] md:aspect-[4/3] w-full md:w-80" : "aspect-[16/10] w-full"} overflow-hidden bg-slate-900 flex-shrink-0`}>
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Discount Badge / Custom Badge */}
        {discountPercent > 0 ? (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[11px] uppercase tracking-[0.12em] font-extrabold bg-rose-600 text-white rounded-full shadow-lg">
            GIẢM {discountPercent}%
          </span>
        ) : badge ? (
          <span className="absolute top-4 left-4 z-10 px-3 py-0.5 text-[11px] uppercase tracking-[0.1em] font-bold bg-amber-400 text-slate-900 rounded-full shadow-md">
            {badge}
          </span>
        ) : null}

        {/* Product Type Tag */}
        <span className="absolute top-4 right-4 z-10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.1em] font-semibold bg-slate-900/60 text-white border border-white/20 backdrop-blur-md rounded-full">
          {getCategoryLabel()}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        {/* Star Rating & Location */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          {type !== "combo" ? (
            <div className="flex items-center gap-0.5 text-accent-gold">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-3.5 h-3.5 ${
                    index < stars ? "fill-accent-gold text-accent-gold" : "text-slate-200"
                  }`}
                />
              ))}
              <span className="ml-1 text-[11px] text-slate-500 font-semibold">({stars}.0)</span>
            </div>
          ) : (
            <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-accent-gold bg-accent-gold/10 px-2.5 py-0.5 rounded-full">
              Gói Trải Nghiệm Trọn Gói
            </span>
          )}
          {location && type !== "combo" && (
            <div className="flex items-center gap-1 font-medium text-slate-650 max-w-[150px] min-w-0 text-left">
              <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              <span className="truncate" title={location}>
                {type === "hotel" ? location.split(",")[0].trim() : location}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1 text-left">
          <h3 className="font-serif text-base font-semibold text-slate-900 tracking-wide group-hover:text-accent-dark transition-colors duration-300">
            {name}
          </h3>
          {tagline && (
            <p className="text-[11px] text-slate-500 font-medium italic tracking-wide line-clamp-1">
              {tagline}
            </p>
          )}
        </div>

        {/* Highlighted Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {amenities.slice(0, isDetailed ? 4 : 2).map((amenity, i) => (
              <span
                key={i}
                className="text-[10.5px] bg-slate-50 border border-slate-100/80 text-slate-650 px-2.5 py-0.5 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action Button (Pushes to bottom) */}
        <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex flex-col text-left">
            {originalPrice && (
              <span className="text-[10px] text-slate-450 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-xs font-semibold text-accent-dark">
              {price ? (
                <>
                  <span className="text-[10px] text-slate-400 font-normal block">Giá từ</span>
                  <span className="text-base font-bold text-accent-dark">{formatPrice(price)} / khách</span>
                </>
              ) : (
                "Giá theo yêu cầu"
              )}
            </span>
          </div>

          {type === "cruise" || type === "hotel" || type === "combo" ? (
            <div
              className="flex-shrink-0 flex items-center gap-1 px-4 py-2 bg-accent text-white hover:bg-accent-dark border border-transparent text-[10px] uppercase tracking-[0.1em] font-bold rounded-full transition-all duration-300 shadow-sm whitespace-nowrap"
            >
              Khám phá
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          ) : (
            <button
              onClick={handleEnquire}
              className="flex-shrink-0 flex items-center gap-1 px-4 py-2 bg-accent text-white hover:bg-accent-dark border border-transparent text-[10px] uppercase tracking-[0.1em] font-bold rounded-full transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap"
            >
              Khám phá
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </>
  );

  const isList = viewMode === "list";

  if (type === "cruise" || type === "hotel" || type === "combo") {
    const routePrefix = type === "cruise" ? "cruises" : type === "hotel" ? "stays-dining" : "combos";
    return (
      <Link
        href={`/${routePrefix}/${id}`}
        className={`group relative flex ${isList ? "flex-col md:flex-row" : "flex-col"} bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all duration-500 shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full cursor-pointer text-inherit hover:text-inherit no-underline`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className={`group relative flex ${isList ? "flex-col md:flex-row" : "flex-col"} bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all duration-500 shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full`}
    >
      {cardContent}
    </div>
  );
}
