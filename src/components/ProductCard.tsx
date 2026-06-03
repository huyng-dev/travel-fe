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
  launchYear,
  material,
  cabinCount,
  roomCount,
  variant = "compact",
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

  const cardContent = (
    <>
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden w-full bg-slate-900">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Badge */}
        {badge && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[9px] uppercase tracking-[0.15em] font-semibold bg-accent text-primary rounded-sm shadow-md">
            {badge}
          </span>
        )}

        {/* Product Type Tag */}
        {type !== "combo" && (
          <span className="absolute top-4 right-4 z-10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.1em] font-semibold bg-[#001226] text-accent border border-accent/15 rounded-sm">
            {type === "cruise" ? "Du Thuyền" : "Khách Sạn"}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        {/* Star Rating & Location */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          {type !== "combo" ? (
            <div className="flex items-center gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-3.5 h-3.5 ${
                    index < stars ? "fill-accent text-accent" : "text-slate-200"
                  }`}
                />
              ))}
              <span className="ml-1 text-[11px] text-slate-500 font-semibold">({stars}.0)</span>
            </div>
          ) : (
            <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-sm">
              Gói Trải Nghiệm Trọn Gói
            </span>
          )}
          {location && (
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

        {/* Technical Specifications Grid (Detailed view for Cruises & Hotels) */}
        {isDetailed && type !== "combo" && (
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 text-[11px] text-slate-500 font-medium bg-slate-50/50 rounded-sm">
            <div className="text-center border-r border-slate-100 last:border-0 px-1">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-normal">
                {type === "cruise" ? "Hạ thủy" : "Hạng sao"}
              </span>
              <span className="text-slate-800 font-bold">
                {type === "cruise" ? (launchYear || "N/A") : `${stars} sao`}
              </span>
            </div>
            <div className="text-center border-r border-slate-100 last:border-0 px-1">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-normal">
                {type === "cruise" ? "Chất liệu" : "Loại hình"}
              </span>
              <span className="text-slate-800 font-bold truncate max-w-[80px] inline-block" title={type === "cruise" ? material : (id === "hotel-yoko-onsen-quang-hanh" ? "Khu Onsen" : "Resort & Spa")}>
                {type === "cruise" ? (material || "N/A") : (id === "hotel-yoko-onsen-quang-hanh" ? "Khu Onsen" : "Resort & Spa")}
              </span>
            </div>
            <div className="text-center border-r border-slate-100 last:border-0 px-1">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-normal">
                {type === "cruise" ? "Số cabins" : "Quy mô"}
              </span>
              <span className="text-slate-800 font-bold">
                {type === "cruise" ? `${cabinCount || "N/A"} phòng` : `${roomCount || "N/A"} phòng`}
              </span>
            </div>
          </div>
        )}

        {/* Highlighted Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {amenities.slice(0, isDetailed ? 4 : 2).map((amenity, i) => (
              <span
                key={i}
                className="text-[10.5px] bg-slate-50 border border-slate-100/80 text-slate-600 px-2 py-0.5 rounded-sm"
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
                  <span className="text-[10px] text-slate-445 font-normal block">Giá combo từ</span>
                  <span className="text-sm font-bold">{formatPrice(price)} / khách</span>
                </>
              ) : (
                "Giá theo yêu cầu"
              )}
            </span>
          </div>

          {type === "cruise" || type === "hotel" || type === "combo" ? (
            <div
              className="flex items-center gap-1 px-4 py-2 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] border border-[#001226] hover:border-accent text-[10px] uppercase tracking-[0.15em] font-bold rounded-full transition-all duration-300 shadow-sm"
            >
              Khám phá
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          ) : (
            <button
              onClick={handleEnquire}
              className="flex items-center gap-1 px-4 py-2 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] border border-[#001226] hover:border-accent text-[10px] uppercase tracking-[0.15em] font-bold rounded-full transition-all duration-300 shadow-sm cursor-pointer"
            >
              Khám phá
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </>
  );

  if (type === "cruise" || type === "hotel" || type === "combo") {
    const routePrefix = type === "cruise" ? "cruises" : type === "hotel" ? "hotels" : "combos";
    return (
      <Link
        href={`/${routePrefix}/${id}`}
        className="group relative flex flex-col bg-white border border-slate-100 rounded-sm overflow-hidden hover:border-accent/40 hover:shadow-lg transition-all duration-500 shadow-md h-full cursor-pointer text-inherit hover:text-inherit no-underline"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className="group relative flex flex-col bg-white border border-slate-100 rounded-sm overflow-hidden hover:border-accent/40 hover:shadow-lg transition-all duration-500 shadow-md h-full"
    >
      {cardContent}
    </div>
  );
}
