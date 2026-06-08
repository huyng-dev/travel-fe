"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";

export default function FloatingContact() {
  const contactItems = [
    {
      name: "Trang liên hệ",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/contact",
      tooltip: "Gửi liên hệ",
    },
    {
      name: "Facebook Messenger",
      icon: <Image src="/messenger.svg" alt="Facebook Messenger" width={30} height={30} className="select-none" />,
      href: "https://m.me/travelhalong",
      tooltip: "Messenger",
      external: true,
    },
    {
      name: "Zalo",
      icon: <Image src="/zalo.svg" alt="Zalo" width={30} height={30} className="select-none" />,
      href: "https://zalo.me/0901234567",
      tooltip: "Zalo",
      external: true,
    },
    {
      name: "Viber",
      icon: <Image src="/viber.svg" alt="Viber" width={30} height={30} className="select-none" />,
      href: "https://viber.click/0901234567",
      tooltip: "Viber",
      external: true,
    },
  ];

  return (
    <div className="fixed bottom-8 left-6 z-[30] flex flex-col gap-3">
      {contactItems.map((item) => {
        const buttonContent = (
          <button
            className="relative p-1.5 rounded-full bg-accent text-white hover:bg-accent-dark hover:text-white border border-accent/30 hover:border-accent-dark/80 shadow-[0_10px_25px_rgba(197,168,128,0.25)] hover:shadow-[0_10px_25px_rgba(197,168,128,0.45)] transition-all duration-300 cursor-pointer flex items-center justify-center w-11 h-11 group"
            aria-label={item.name}
          >
            {item.icon}

            {/* Tooltip on the right side */}
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-accent text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-accent/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-lg after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:right-full after:border-4 after:border-transparent after:border-r-accent">
              {item.tooltip}
            </span>
          </button>
        );

        return (
          <div key={item.name}>
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
          </div>
        );
      })}
    </div>
  );
}
