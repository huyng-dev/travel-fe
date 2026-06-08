"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const containerVariants: Variants = {
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    closed: {
      opacity: 0,
      x: 30,
      scale: 0.8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const contactItems = [
    {
      name: "Trang liên hệ",
      icon: <MessageSquare className="w-6 h-6" />,
      href: "/contact",
      tooltip: "Gửi liên hệ",
    },
    {
      name: "Facebook Messenger",
      icon: <Image src="/messenger.svg" alt="Facebook Messenger" width={32} height={32} className="select-none" />,
      href: "https://m.me/travelhalong",
      tooltip: "Messenger",
      external: true,
    },
    {
      name: "Zalo",
      icon: <Image src="/zalo.svg" alt="Zalo" width={32} height={32} className="select-none" />,
      href: "https://zalo.me/0901234567",
      tooltip: "Zalo",
      external: true,
    },
    {
      name: "Viber",
      icon: <Image src="/viber.svg" alt="Viber" width={31} height={31} className="select-none" />,
      href: "https://viber.click/0901234567",
      tooltip: "Viber",
      external: true,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-8 right-6 z-[30] flex items-center flex-row-reverse gap-3"
    >
      {/* Toggle Button */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-1.5 rounded-full bg-accent text-white hover:bg-accent-dark hover:text-white border border-accent/30 hover:border-accent-dark/80 shadow-[0_10px_30px_rgba(197,168,128,0.3)] hover:shadow-[0_10px_30px_rgba(197,168,128,0.5)] transition-all duration-300 cursor-pointer flex items-center justify-center w-11 h-11"
          aria-label={isOpen ? "Đóng danh sách liên hệ" : "Mở danh sách liên hệ"}
        >
          {/* Pulsing outer ring - only visible when closed */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping pointer-events-none" />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Tooltip for Main Toggle Button */}
        {!isOpen && (
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-accent text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-accent/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-lg after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-full after:border-4 after:border-transparent after:border-l-accent">
            Liên hệ tư vấn
          </span>
        )}
      </div>

      {/* Expanded Horizontal Contact Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex items-center gap-3"
          >
            {contactItems.map((item) => {
              const buttonContent = (
                <button
                  className="relative p-1.5 rounded-full bg-accent text-white hover:bg-accent-dark hover:text-white border border-accent/30 hover:border-accent-dark/80 shadow-[0_10px_25px_rgba(197,168,128,0.25)] hover:shadow-[0_10px_25px_rgba(197,168,128,0.45)] transition-all duration-300 cursor-pointer flex items-center justify-center w-11 h-11 group"
                  aria-label={item.name}
                >
                  {item.icon}

                  {/* Tooltip on top */}
                  <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-accent/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-accent">
                    {item.tooltip}
                  </span>
                </button>
              );

              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                >
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {buttonContent}
                    </a>
                  ) : (
                    <Link href={item.href}>
                      {buttonContent}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
