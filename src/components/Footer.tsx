"use client";

import React from "react";
import Link from "next/link";
import { Compass, Award, Shield, HelpCircle } from "lucide-react";

export default function Footer() {

  return (
    <footer className="bg-[#000810] text-slate-400 text-sm border-t border-accent/10">
      {/* Top Banner - Certifications */}
      <div className="border-b border-white/5 py-8 bg-[#000c18]/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium tracking-wide">Hạm Đội Đạt Giải Thưởng</h4>
              <p className="text-xs text-slate-500">Du thuyền hạng sang tốt nhất thế giới.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium tracking-wide">Bảo Hiểm Toàn Diện</h4>
              <p className="text-xs text-slate-500">An tâm tuyệt đối trong suốt kỳ nghỉ dưỡng kỳ quan.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5">
              <HelpCircle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-serif text-white font-medium tracking-wide">Hỗ Trợ Chuyên Biệt 24/7</h4>
              <p className="text-xs text-slate-500">Đội ngũ chuyên viên tư vấn du thuyền phục vụ riêng biệt.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: About & Logo */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3">
            <Compass className="w-8 h-8 text-accent" />
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-[0.2em] font-semibold text-white">
                TRAVEL
              </span>
            </div>
          </Link>
          <p className="text-slate-400 leading-relaxed text-xs">
            Hệ thống đặt phòng khách sạn và siêu du thuyền nghỉ dưỡng cao cấp hàng đầu tại Vịnh Hạ Long.
            Chúng tôi mang đến những hành trình độc bản, kết hợp tinh tế giữa vẻ đẹp kỳ quan thiên nhiên và dịch vụ tiện nghi thượng lưu bậc nhất.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div className="space-y-4">
          <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold border-b border-accent/20 pb-2">
            Điểm Đến Nổi Bật
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/cruises?destination=Vịnh Hạ Long" className="hover:text-accent transition-colors duration-200">
                Kỳ Quan Vịnh Hạ Long
              </Link>
            </li>
            <li>
              <Link href="/cruises?destination=Vịnh Lan Hạ" className="hover:text-accent transition-colors duration-200">
                Vịnh Lan Hạ Hoang Sơ
              </Link>
            </li>
            <li>
              <Link href="/cruises?destination=Đảo Cát Bà" className="hover:text-accent transition-colors duration-200">
                Đảo Cát Bà Kỳ Vĩ
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Info */}
        <div className="space-y-4">
          <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold border-b border-accent/20 pb-2">
            Văn Phòng Đại Diện
          </h3>
          <ul className="space-y-2.5 text-xs leading-relaxed text-slate-400">
            <li>
              <span className="text-white">Địa chỉ:</span> Hạ Long, Quảng Ninh, Việt Nam
            </li>
            <li>
              <span className="text-white">Hotline:</span> <a href="tel:19001234" className="hover:text-accent">1900 1234</a>
            </li>
            <li>
              <span className="text-white">Email:</span> <a href="mailto:booking@travel.vn" className="hover:text-accent">booking@travel.vn</a>
            </li>
            <li>
              <span className="text-white">Giờ làm việc:</span> 8:00 - 18:00 (Thứ 2 - Thứ 7)
            </li>
          </ul>
        </div>

        {/* Column 4: About Pages Links */}
        <div className="space-y-4">
          <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold border-b border-accent/20 pb-2">
            Giới thiệu
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="#" className="hover:text-accent transition-colors duration-200">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-accent transition-colors duration-200">
                Khách hàng doanh nghiệp
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-accent transition-colors duration-200">
                Hình thức thanh toán
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-accent transition-colors duration-200">
                Quy định chung và lưu ý
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-accent transition-colors duration-200">
                Câu hỏi thường gặp
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TRAVEL Hạ Long. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-accent transition-colors duration-200">Chính sách riêng tư</Link>
            <Link href="#" className="hover:text-accent transition-colors duration-200">Điều khoản và điều kiện</Link>
            <Link href="#" className="hover:text-accent transition-colors duration-200">Hướng dẫn sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
