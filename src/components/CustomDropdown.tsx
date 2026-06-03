"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon: React.ReactNode;
  placeholder?: string;
  placement?: "top" | "bottom";
}

export default function CustomDropdown({
  label,
  value,
  onChange,
  options,
  icon,
  placeholder = "Chọn...",
  placement = "bottom",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} className="relative w-full select-none">
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 cursor-pointer py-1"
      >
        {/* Left Circle Icon */}
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0 transition-all duration-300 hover:bg-white/10">
          {icon}
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-[10px] uppercase tracking-[0.12em] text-white/60 font-semibold block">
            {label}
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-white text-sm font-semibold truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-white/60 transition-transform duration-300 flex-shrink-0 ml-1 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Popover Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: placement === "top" ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === "top" ? -10 : 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 right-0 z-30 bg-white border border-slate-200/80 rounded-xl shadow-2xl overflow-hidden py-1.5 max-h-60 overflow-y-auto ${
              placement === "top" ? "bottom-full mb-3" : "top-full mt-3"
            }`}
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-5 py-3 text-xs font-semibold cursor-pointer transition-all duration-200 text-left ${
                  option.value === value
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
  );
}
