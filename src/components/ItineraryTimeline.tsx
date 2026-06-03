"use client";

import React, { useState } from "react";
import { ChevronDown, MapPin, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ItineraryDay } from "@/data/mockData";

interface ItineraryTimelineProps {
  days: ItineraryDay[];
}

export default function ItineraryTimeline({ days }: ItineraryTimelineProps) {
  const [activeDay, setActiveDay] = useState<number | null>(1);

  const toggleDay = (day: number) => {
    setActiveDay(activeDay === day ? null : day);
  };

  return (
    <div className="relative border-l border-accent/20 ml-4 md:ml-6 space-y-6 py-4">
      {days.map((item) => {
        const isOpen = activeDay === item.day;

        return (
          <div key={item.day} className="relative pl-6 md:pl-8 group">
            {/* Timeline bullet node */}
            <button
              onClick={() => toggleDay(item.day)}
              className={`absolute left-0 -translate-x-[9.5px] top-1.5 w-[18px] h-[18px] rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                isOpen
                  ? "bg-accent border-accent shadow-[0_0_12px_rgba(197,168,128,0.6)]"
                  : "bg-primary border-accent/40 group-hover:border-accent"
              }`}
              aria-label={`Chi tiết ngày ${item.day}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300 ${
                  isOpen ? "scale-100" : "scale-0"
                }`}
              />
            </button>

            {/* Accordion Card */}
            <div
              className={`border rounded-sm transition-all duration-300 ${
                isOpen
                  ? "bg-slate-50 border-slate-200/80 shadow-md"
                  : "bg-white border-slate-200 hover:border-accent/30 hover:bg-slate-50/50"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggleDay(item.day)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">
                      NGÀY {item.day}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      {item.location}
                    </span>
                  </div>
                  <h4 className="font-serif text-base md:text-lg font-medium text-slate-800 tracking-wide">
                    {item.title}
                  </h4>
                </div>

                <div
                  className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-accent/80 hover:text-accent transition-all duration-300 ${
                    isOpen ? "rotate-180 bg-accent/5" : "rotate-0 bg-transparent"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 md:p-5 pt-0 border-t border-slate-100 space-y-4 text-sm text-slate-600">
                      <p className="leading-relaxed font-sans">{item.description}</p>
                      
                      {/* Activities checklist */}
                      {item.activities && item.activities.length > 0 && (
                        <div className="space-y-2.5 pt-2">
                          <p className="text-xs uppercase tracking-[0.1em] text-accent font-semibold">
                            Hoạt động trong ngày:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.activities.map((act, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 text-xs text-slate-500"
                              >
                                <CheckCircle2 className="w-4 h-4 text-accent/70 mt-0.5 flex-shrink-0" />
                                <span>{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
