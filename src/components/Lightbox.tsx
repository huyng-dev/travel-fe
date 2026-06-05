/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
  location?: string;
  stars?: number;
}

export default function Lightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
  location,
  stars,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);

  if (isOpen !== prevIsOpen || initialIndex !== prevInitialIndex) {
    setPrevIsOpen(isOpen);
    setPrevInitialIndex(initialIndex);
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && isOpen) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight" && isOpen) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex flex-col bg-black/95 backdrop-blur-sm select-none">
        {/* Top Header */}
        <div className="px-6 py-4 bg-black/40 flex items-center justify-between border-b border-white/5 z-[100]">
          <div className="text-left text-white">
            {title && <h3 className="font-serif text-base md:text-lg text-white font-medium">{title}</h3>}
            {(stars !== undefined || location) && (
              <div className="flex items-center gap-3 mt-1 text-[11px] text-white/60">
                {stars !== undefined && (
                  <>
                    <div className="flex items-center text-accent">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-3.5 h-3.5 ${
                            index < stars ? "fill-accent text-accent" : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                    {location && <span>•</span>}
                  </>
                )}
                {location && <span>{location}</span>}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white text-3xl font-light hover:text-accent transition-colors cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5"
            aria-label="Đóng"
          >
            &times;
          </button>
        </div>

        {/* Main Image Viewport */}
        <div
          className="flex-1 relative flex items-center justify-center p-6 md:p-12 cursor-zoom-out"
          onClick={onClose}
        >
          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className="absolute left-4 md:left-8 text-white hover:text-accent transition-colors z-[100] cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 border border-white/10"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Main Image */}
          <div
            className="max-w-full max-h-full flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              src={images[currentIndex]}
              alt={`Gallery ${currentIndex + 1}`}
              className="max-w-[85vw] max-h-[60vh] md:max-h-[65vh] object-contain rounded-xs shadow-2xl cursor-default"
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-4 md:right-8 text-white hover:text-accent transition-colors z-[100] cursor-pointer w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 border border-white/10"
            aria-label="Ảnh sau"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Bottom Thumbnail Bar */}
        <div className="bg-black/45 border-t border-white/5 py-4 px-6 flex flex-col items-center gap-3 z-[100]">
          {/* Indicator */}
          <span className="text-white/50 text-[11px] font-sans font-light">
            Ảnh {currentIndex + 1} / {images.length}
          </span>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto max-w-full no-scrollbar pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-14 h-10 md:w-16 md:h-12 rounded-sm overflow-hidden flex-shrink-0 transition-all border ${
                  idx === currentIndex
                    ? "border-accent scale-105"
                    : "border-white/10 opacity-50 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
