"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PromoModal() {
  const [isVisible, setIsVisible] = useState(false);

  const closeModal = () => {
    setIsVisible(false);
    const now = new Date().getTime();
    localStorage.setItem("travel_promo_dismissed_time", now.toString());
  };

  useEffect(() => {
    // Check if user has dismissed the promotion in the last 24 hours
    const dismissedTime = localStorage.getItem("travel_promo_dismissed_time");
    if (dismissedTime) {
      const elapsed = new Date().getTime() - parseInt(dismissedTime, 10);
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in ms
      if (elapsed > oneDay) {
        // Expired, show the popup again
        localStorage.removeItem("travel_promo_dismissed_time");
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } else {
      // First time visiting, show the popup
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (isVisible) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border border-slate-100 flex flex-col z-10"
          >
            {/* Clickable Image Banner */}
            <Link
              href="/hot-deal"
              onClick={closeModal}
              className="relative w-full cursor-pointer block group overflow-hidden"
            >
              <Image
                src="/images/promo_banner.jpeg"
                alt="Khuyến mãi hè Hạ Long"
                width={500}
                height={500}
                priority
                className="w-full h-auto object-contain select-none group-hover:scale-102 transition-transform duration-500"
              />
              {/* Premium overlay hover effect */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>

            {/* Close Button at top-right */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all cursor-pointer flex items-center justify-center backdrop-blur-sm border border-white/10 z-20"
              aria-label="Đóng quảng cáo"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
