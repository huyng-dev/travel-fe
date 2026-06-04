/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Send, Home, ChevronRight, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [subject] = useState("Yêu cầu tư vấn từ khách hàng");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phoneNumber || !emailAddress || !subject || !message) {
      toast.error("Vui lòng điền đầy đủ tất cả các trường thông tin yêu cầu.");
      return;
    }

    setLoading(true);

    // Giả lập 1 giây gửi dữ liệu
    setTimeout(() => {
      setLoading(false);
      toast.success(
        "Yêu cầu liên hệ của quý khách đã được gửi! Chúng tôi sẽ phản hồi sớm nhất trong vòng 15 phút."
      );
      // Reset form
      setFullName("");
      setPhoneNumber("");
      setEmailAddress("");
      setMessage("");
    }, 1000);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-0 bg-white text-slate-800">
        {/* 1. COMPACT BANNER */}
        <div className="relative h-[280px] w-full flex items-center justify-center bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920"
            alt="Contact Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001226]/40 via-[#001226]/60 to-[#001226]/90" />
          
          {/* Breadcrumb Path absolute inside banner */}
          <div className="absolute top-28 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-widest font-semibold">
              <Link href="/" className="hover:text-accent flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Trang chủ
              </Link>
              <ChevronRight className="w-3 h-3 text-white/40" />
              <span className="text-white/90">Liên hệ</span>
            </div>
          </div>

          <div className="relative z-10 text-center text-white space-y-3 px-6 w-full max-w-4xl mt-20">
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold block">
              Dịch Vụ Khách Hàng Cao Cấp
            </span>
            <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal">
              KẾT NỐI VỚI TRAVEL
            </h1>
          </div>
        </div>

        {/* 2. SPLIT SECTION: CONTACT FORM & MAP */}
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Form Card */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-6 md:p-10 lg:p-12 flex flex-col justify-between">
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-wide text-[#001226]">
                  Khám phá Việt Nam cùng TRAVEL
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Hãy liên hệ ngay để nhận tư vấn chuyên sâu và thiết kế hành trình du lịch độc bản dành riêng cho quý khách!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6 flex-grow">
                {/* Row 1: Họ và tên */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold block">
                    Họ và tên <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-accent text-slate-800 text-xs rounded-full px-5 py-4 focus:outline-none focus:ring-0 transition-all duration-300 font-medium"
                  />
                </div>

                {/* Row 2: Email & Số điện thoại */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold block">
                      Địa chỉ Email <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Nhập email..."
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-accent text-slate-800 text-xs rounded-full px-5 py-4 focus:outline-none focus:ring-0 transition-all duration-300 font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold block">
                      Số điện thoại <span className="text-accent">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Nhập số điện thoại..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-accent text-slate-800 text-xs rounded-full px-5 py-4 focus:outline-none focus:ring-0 transition-all duration-300 font-medium"
                    />
                  </div>
                </div>

                {/* Row 3: Nội dung */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold block">
                    Nội dung yêu cầu <span className="text-accent">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Nhập yêu cầu của bạn (Tên du thuyền/khách sạn, ngày đi, số khách...)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-accent text-slate-800 text-xs rounded-2xl px-5 py-4 focus:outline-none focus:ring-0 transition-all duration-300 resize-none font-medium leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#001226] hover:bg-accent text-white hover:text-[#001226] font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-[1px] active:translate-y-0 mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý yêu cầu...
                    </>
                  ) : (
                    <>
                      Gửi yêu cầu liên hệ
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Map Card */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-4 flex flex-col h-[400px] lg:h-auto min-h-[450px]">
              <div className="w-full h-full overflow-hidden rounded-2xl border border-slate-100 relative">
                <iframe
                  src="https://maps.google.com/maps?q=H%E1%BA%A1%20Long,%20Qu%E1%BA%A3ng%20Ninh,%20Vi%E1%BB%87t%20Nam&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(10%) contrast(102%) brightness(99%)" }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="Văn phòng TRAVEL Hạ Long"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 3. CONTACT INFORMATION GRID */}
        <div className="bg-white py-20 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold block">
                Kết nối trực tiếp
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#001226] tracking-wide font-normal">
                THÔNG TIN VĂN PHÒNG ĐẠI DIỆN
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Quý khách có thể ghé thăm trực tiếp văn phòng hoặc kết nối với chúng tôi qua các kênh hỗ trợ khẩn cấp dưới đây.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1: Address */}
              <div className="bg-slate-50/60 border border-slate-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif text-sm font-bold text-slate-800">Trụ sở chính</h4>
                  <p className="text-xs text-slate-655 leading-relaxed font-medium">
                    Hạ Long, Quảng Ninh, Việt Nam
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=H%E1%BA%A1+Long,+Qu%E1%BA%A3ng+Ninh,+Vi%E1%BB%87t+Nam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-wider font-bold text-[#001226] hover:text-accent transition-colors flex items-center justify-center gap-1"
                  >
                    Xem vị trí bản đồ
                  </a>
                </div>
              </div>

              {/* Card 2: Hotline */}
              <div className="bg-slate-50/60 border border-slate-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif text-sm font-bold text-slate-800">Tổng đài 24/7</h4>
                  <p className="text-xs text-slate-655 leading-relaxed font-medium">
                    Luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của quý khách.
                  </p>
                  <p className="text-sm font-bold text-slate-850">1900 1234</p>
                </div>
                <div className="pt-2">
                  <a
                    href="tel:19001234"
                    className="text-[10px] uppercase tracking-wider font-bold text-[#001226] hover:text-accent transition-colors"
                  >
                    Gọi hỗ trợ ngay
                  </a>
                </div>
              </div>

              {/* Card 3: Email */}
              <div className="bg-slate-50/60 border border-slate-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif text-sm font-bold text-slate-850">Thư điện tử</h4>
                  <p className="text-xs text-slate-655 leading-relaxed font-medium">
                    Phản hồi thông tin và gửi báo giá chi tiết lịch trình du hành.
                  </p>
                  <p className="text-xs font-bold text-slate-850">booking@travel.vn</p>
                </div>
                <div className="pt-2">
                  <a
                    href="mailto:booking@travel.vn"
                    className="text-[10px] uppercase tracking-wider font-bold text-[#001226] hover:text-accent transition-colors"
                  >
                    Gửi thư yêu cầu
                  </a>
                </div>
              </div>

              {/* Card 4: Hours */}
              <div className="bg-slate-50/60 border border-slate-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif text-sm font-bold text-slate-800">Giờ làm việc</h4>
                  <p className="text-xs text-slate-655 leading-relaxed font-medium">
                    Thứ 2 - Thứ 7: 8:00 - 18:00
                  </p>
                  <p className="text-xs text-slate-655 leading-relaxed font-medium">
                    Chủ nhật: Hỗ trợ khẩn cấp hotline
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-accent">
                    Phục vụ tận tâm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
