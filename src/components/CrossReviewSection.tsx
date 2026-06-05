"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockReviews, Review } from "@/data/mockData";

export default function CrossReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right
  const [isHovered, setIsHovered] = useState(false);

  // Tính điểm trung bình dựa trên tất cả reviews
  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return "5.0";
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(mockReviews);

  // Xác định badge loại hình dịch vụ dựa trên stayType
  const getServiceBadge = (stayType: string) => {
    const type = stayType.toLowerCase();
    
    // Villa check
    if (type.includes("villa") || type.includes("village")) {
      return { label: "Villa", className: "bg-indigo-50/70 text-indigo-700 border-indigo-150/70" };
    }
    // Combo check
    if (type.includes("combo")) {
      return { label: "Combo trọn gói", className: "bg-purple-50/70 text-purple-700 border-purple-150/70" };
    }
    // Nhà hàng check
    if (type.includes("nhà hàng") || type.includes("restaurant") || type.includes("hồng hạnh")) {
      return { label: "Nhà hàng", className: "bg-amber-50/70 text-amber-700 border-amber-150/70" };
    }
    // Du thuyền check
    if (
      type.includes("cruise") ||
      type.includes("du thuyền") ||
      type.includes("essence") ||
      type.includes("ambassador") ||
      type.includes("heritage")
    ) {
      return { label: "Du thuyền", className: "bg-blue-50/70 text-blue-700 border-blue-150/70" };
    }
    // Khách sạn / Resort check
    if (
      type.includes("resort") ||
      type.includes("hotel") ||
      type.includes("khách sạn") ||
      type.includes("yoko") ||
      type.includes("vinpearl")
    ) {
      return { label: "Khách sạn", className: "bg-teal-50/70 text-teal-700 border-teal-150/70" };
    }
    return { label: "Dịch vụ", className: "bg-slate-50/70 text-slate-700 border-slate-150/70" };
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mockReviews.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mockReviews.length) % mockReviews.length);
  }, []);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  // Thiết lập animation cho trượt ngang (sử dụng khoảng cách vừa phải để tránh giật cục và tạo cảm giác mượt mà)
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 120 : -120,
      opacity: 0,
    }),
  };

  // Swipe gesture support
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const activeReview = mockReviews[currentIndex];
  const activeBadge = activeReview ? getServiceBadge(activeReview.stayType) : null;

  return (
    <div id="reviews" className="w-full space-y-8 text-slate-800">
      {/* Aggregate Score Header */}
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
              Những vị khách thượng lưu đánh giá cao về trải nghiệm nghỉ dưỡng tại Hạ Long.
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
      </div>

      {/* Reviews Slide Carousel */}
      <div className="relative max-w-4xl mx-auto px-4 md:px-12">
        <div 
          className="relative min-h-[280px] md:min-h-[220px] overflow-hidden bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-md hover:border-accent/30 transition-colors duration-300 p-6 md:p-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Decorative Quote Icon Background */}
          <span className="absolute -top-4 -left-2 text-8xl md:text-9xl font-serif text-slate-100 pointer-events-none select-none z-0">
            “
          </span>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            {activeReview && (
              <motion.div
                key={activeReview.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "tween", duration: 0.4, ease: "easeOut" },
                  opacity: { duration: 0.25 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    handleNext();
                  } else if (swipe > swipeConfidenceThreshold) {
                    handlePrev();
                  }
                }}
                className="relative z-10 h-full flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
              >
                <div className="space-y-5">
                  {/* Top: Customer name & Stars */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-slate-800 tracking-wide">
                        {activeReview.userName}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-accent-dark font-medium mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-dark" />
                        <span>Đã trải nghiệm</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5 text-accent-dark">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < activeReview.rating ? "fill-accent text-accent" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mid: Comment text */}
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed italic font-sans pl-3 border-l-2 border-accent/20 relative z-10 py-1">
                    &ldquo;{activeReview.comment}&rdquo;
                  </p>
                </div>

                {/* Bottom: Service badge & Detail */}
                {activeBadge && (
                  <div className="flex flex-wrap items-center gap-3 mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${activeBadge.className}`}>
                      {activeBadge.label}
                    </span>
                    <span className="text-slate-800 font-bold normal-case text-xs md:text-sm">{activeReview.stayType}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons (Desktop: Floating on sides) */}
        <button
          onClick={handlePrev}
          className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-50 border border-slate-200 p-2 md:p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group hidden md:block cursor-pointer"
          aria-label="Đánh giá trước"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-accent-dark transition-colors" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-slate-50 border border-slate-200 p-2 md:p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group hidden md:block cursor-pointer"
          aria-label="Đánh giá tiếp theo"
        >
          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-accent-dark transition-colors" />
        </button>

        {/* Navigation Controls (Mobile: Chevron buttons beside dots) */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="md:hidden bg-white border border-slate-200 p-1.5 rounded-full shadow-sm active:bg-slate-50 cursor-pointer"
            aria-label="Đánh giá trước"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5">
            {mockReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex ? "w-5 bg-accent" : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Đi tới slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="md:hidden bg-white border border-slate-200 p-1.5 rounded-full shadow-sm active:bg-slate-50 cursor-pointer"
            aria-label="Đánh giá tiếp theo"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
