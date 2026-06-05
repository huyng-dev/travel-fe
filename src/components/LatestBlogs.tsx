/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { mockBlogs } from "@/data/mockData";
import { ChevronRight, ChevronLeft, ArrowUpRight } from "lucide-react";
import { motion, PanInfo } from "framer-motion";

export default function LatestBlogs() {
  const router = useRouter();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardWidth, setCardWidth] = useState(380);

  React.useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  React.useEffect(() => {
    const updateWidth = () => {
      if (scrollRef.current && scrollRef.current.firstElementChild) {
        setCardWidth(scrollRef.current.firstElementChild.clientWidth);
      }
    };
    const timer = setTimeout(updateWidth, 100);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWidth);
    };
  }, [visibleCount]);

  const handleDragEnd = (event: unknown, info: PanInfo) => {
    const threshold = 50;
    const maxIndex = Math.max(0, mockBlogs.length - visibleCount);
    if (info.offset.x < -threshold) {
      setActiveDot((prev) => Math.min(maxIndex, prev + 1));
    } else if (info.offset.x > threshold) {
      setActiveDot((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <section id="blogs" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <style dangerouslySetInnerHTML={{__html: `
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
            TIN TỨC MỚI NHẤT
          </span>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
            BẢN TIN DU HÀNH
          </h2>
        </div>

        {/* Slider container with controls */}
        <div className="relative w-full">
          {/* Controls at upper right */}
          <div className="hidden sm:flex justify-end gap-2.5 mb-6">
            <button
              onClick={() => setActiveDot((prev) => Math.max(0, prev - 1))}
              className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-650 hover:text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
              aria-label="Previous articles"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => {
                const maxIndex = Math.max(0, mockBlogs.length - visibleCount);
                setActiveDot((prev) => Math.min(maxIndex, prev + 1));
              }}
              className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-650 hover:text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
              aria-label="Next articles"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Carousel container */}
          <div className="overflow-hidden w-full relative pb-4">
            <motion.div
              ref={scrollRef}
              drag="x"
              dragConstraints={{
                left: -Math.max(0, mockBlogs.length - visibleCount) * (cardWidth + 24),
                right: 0,
              }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              animate={{ x: -activeDot * (cardWidth + 24) }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              className="flex gap-6 cursor-grab active:cursor-grabbing w-full"
            >
              {mockBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="flex-shrink-0 w-[calc(100vw-48px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] select-none group cursor-pointer"
                  onClick={() => router.push(`/blogs/${blog.id}`)}
                >
                  {/* Image */}
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 relative shadow-sm border border-slate-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                      draggable="false"
                    />
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[9.5px] uppercase tracking-[0.1em] font-bold bg-white text-accent rounded-full shadow-md">
                      {blog.category}
                    </span>
                  </div>
                  {/* Content below image */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-wider font-sans font-medium">
                      <span>{blog.publishedAt}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
                    </div>
                    <h3 className="font-serif text-base text-slate-900 leading-snug group-hover:text-accent-dark transition-colors line-clamp-2 text-left">
                      {blog.title}
                    </h3>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>

          {/* Dots pagination */}
          <div className="flex justify-center items-center gap-1.5 mt-8">
            {Array.from({ length: Math.max(1, mockBlogs.length - visibleCount + 1) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveDot(index)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  index === activeDot ? "w-6 bg-slate-800" : "w-1.5 bg-slate-200 hover:bg-slate-400"
                }`}
                aria-label={`Go to article ${index + 1}`}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={() => router.push("/blogs")}
              className="px-8 py-3 border border-slate-800 hover:border-transparent bg-transparent hover:bg-[#001226] text-slate-900 hover:text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              Xem Tất Cả
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
