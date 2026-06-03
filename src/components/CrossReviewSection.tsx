"use client";

import React, { useState } from "react";
import { Star, Compass, Building, CheckCircle2 } from "lucide-react";
import { mockReviews, Review } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

export default function CrossReviewSection() {
  const [activeTab, setActiveTab] = useState<"cruise" | "hotel">("cruise");

  // Lọc đánh giá dựa trên từ khóa du thuyền hoặc khách sạn
  const cruiseReviews = mockReviews.filter(
    (r) => 
      r.stayType.includes("Essence Grand") || 
      r.stayType.includes("Ambassador") || 
      r.stayType.includes("Heritage")
  );

  const hotelReviews = mockReviews.filter(
    (r) => 
      r.stayType.includes("Vinpearl") || 
      r.stayType.includes("Yoko Onsen") || 
      r.stayType.includes("Premier Village")
  );

  const currentReviews = activeTab === "cruise" ? cruiseReviews : hotelReviews;

  // Tính điểm trung bình
  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return "5.0";
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(currentReviews);

  const formatDateVi = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div id="reviews" className="w-full space-y-8 text-slate-800">
      {/* Aggregate Score & Tabs Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-sm shadow-md">
        <div className="flex items-center gap-5">
          <div className="text-center bg-white border border-slate-200 p-4 rounded-sm min-w-[100px] shadow-sm">
            <span className="text-3xl font-serif font-bold text-accent-dark">{avgRating}</span>
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider mt-1">trên 5 sao</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg text-slate-800 font-semibold tracking-wide">
              Đánh Giá Của Khách Hàng
            </h3>
            <p className="text-xs text-slate-500">
              Những vị khách thượng lưu đánh giá cao về trải nghiệm.
            </p>
            <div className="flex items-center gap-0.5 text-accent-dark">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.round(parseFloat(avgRating))
                      ? "fill-accent text-accent"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-sm border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("cruise")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold rounded-sm transition-all duration-300 ${
              activeTab === "cruise"
                ? "bg-[#001226] text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Compass className="w-4 h-4" />
            Du Thuyền
          </button>
          <button
            onClick={() => setActiveTab("hotel")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold rounded-sm transition-all duration-300 ${
              activeTab === "hotel"
                ? "bg-[#001226] text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building className="w-4 h-4" />
            Khách Sạn
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-slate-200 hover:border-accent/40 p-6 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* User Profile & Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-slate-800 tracking-wide">
                          {review.userName}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-accent-dark font-medium">
                          <CheckCircle2 className="w-3 h-3 text-accent-dark" />
                          <span>Đã trải nghiệm</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-accent-dark">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-3.5 h-3.5 ${
                            index < review.rating ? "fill-accent text-accent" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-slate-600 text-xs leading-relaxed italic font-sans pl-1 border-l-2 border-accent/20">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider">
                  <span className="text-accent-dark font-semibold">{review.stayType}</span>
                  <span>{formatDateVi(review.date)}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
