"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingContact() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 right-6 z-[55]"
    >
      <Link href="/contact" aria-label="Liên hệ tư vấn nhanh">
        {/* Pulsing outer ring */}
        <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping pointer-events-none" />
        
        {/* Main button */}
        <button
          className="relative p-3 rounded-full bg-accent text-white hover:bg-accent-dark hover:text-white border border-accent/30 hover:border-accent-dark/80 shadow-[0_10px_30px_rgba(197,168,128,0.3)] hover:shadow-[0_10px_30px_rgba(197,168,128,0.5)] transition-all duration-300 cursor-pointer flex items-center justify-center group"
        >
          <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          
          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-accent text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-accent/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-lg">
            Liên hệ tư vấn
          </span>
        </button>
      </Link>
    </motion.div>
  );
}
