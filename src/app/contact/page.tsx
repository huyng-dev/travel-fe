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
  const [subject, setSubject] = useState("");
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
      setSubject("");
      setMessage("");
    }, 1000);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-0 bg-white text-slate-800">
        {/* 1. COMPACT BANNER */}
        <div className="relative h-[560px] md:h-[400px] w-full flex items-center justify-center bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920"
            alt="Contact Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001226]/30 via-[#001226]/50 to-[#001226]/85" />
          
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

          <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-4xl mt-20">
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold block">
              Dịch Vụ Khách Hàng Cao Cấp
            </span>
            <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal">
              LIÊN HỆ VỚI CHÚNG TÔI
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          {/* Grid Layout: Contact Form & Info/Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Message Form */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-6 md:p-8 rounded shadow-sm space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-serif text-xl font-bold text-slate-800">
                  Gửi Tin Nhắn Cho Chúng Tôi
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Vui lòng nhập thông tin liên hệ và nội dung yêu cầu, chuyên viên của chúng tôi sẽ liên hệ lại ngay.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold block">Họ và tên của quý khách *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A..."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-sm p-3.5 focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold block">Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0901234567..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-sm p-3.5 focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold block">Địa chỉ Email nhận phản hồi *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com..."
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-sm p-3.5 focus:border-accent focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold block">Tiêu đề liên hệ *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tư vấn lịch trình du thuyền Essence Grand..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-sm p-3.5 focus:border-accent focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold block">Nội dung yêu cầu chi tiết *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Quý khách muốn tìm hiểu về dịch vụ nào, thời gian khởi hành mong muốn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-sm p-3.5 focus:border-accent focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ĐANG GỬI TIN NHẮN...
                    </>
                  ) : (
                    <>
                      Gửi Yêu Cầu Liên Hệ
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Contact Details & Location Map */}
            <div className="lg:col-span-5 space-y-8">
              {/* Information Card */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded space-y-6">
                <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-200 pb-3">
                  Thông Tin Đại Diện Công Ty
                </h3>
                
                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[9px]">Địa chỉ văn phòng</span>
                      <span className="text-slate-800 font-medium leading-relaxed">
                        Hạ Long, Quảng Ninh, Việt Nam
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-accent-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[9px]">Tổng đài hỗ trợ 24/7</span>
                      <a href="tel:19001234" className="text-slate-800 font-bold hover:text-accent">
                        1900 1234
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-accent-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[9px]">Thư điện tử</span>
                      <a href="mailto:booking@travel.vn" className="text-slate-800 font-bold hover:text-accent">
                        booking@travel.vn
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-accent-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 block font-semibold uppercase tracking-wider text-[9px]">Giờ phục vụ</span>
                      <span className="text-slate-800 font-medium">
                        Thứ 2 - Thứ 7: 8:00 - 18:00 | Chủ nhật: Hỗ trợ khẩn cấp qua hotline
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Google Maps */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold block">
                  Vị trí trên bản đồ
                </span>
                <div className="overflow-hidden border border-slate-200 rounded shadow-sm bg-slate-150">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424167443916!2d106.70014291535647!3d10.778796862094258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f48f49e4917%3A0xe54e60fa236d6c6!2zMjIgTLSqIFRow6FuaCBUw7RuLCBC4bq_biBOZ2jDqSwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1655000000000!5m2!1svi!2s"
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Văn phòng TRAVEL Hạ Long"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
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
