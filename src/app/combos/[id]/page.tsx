/* eslint-disable @next/next/no-img-element */
"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Lightbox from "@/components/Lightbox";
import { mockCombos, mockCruises, mockHotels, mockReviews, Review } from "@/data/mockData";
import {
  Star,
  ChevronRight,
  Home,
  Send,
  MessageSquare,
  Calendar,
  MapPin,
  Anchor,
  Hotel as HotelIcon,
  Clock,
  CheckCircle2,
  Luggage
} from "lucide-react";
import toast from "react-hot-toast";

export default function ComboDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const comboId = resolvedParams.id;

  // Find current combo
  const combo = mockCombos.find((c) => c.id === comboId);

  // Find associated cruise and hotel
  const cruiseObj = useMemo(() => {
    if (!combo) return null;
    return mockCruises.find((c) => c.id === combo.cruiseId) || null;
  }, [combo]);

  const hotelObj = useMemo(() => {
    if (!combo) return null;
    return mockHotels.find((h) => h.id === combo.hotelId) || null;
  }, [combo]);

  // States
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"policy" | "child" | "cancel">("policy");

  // Lightbox Modal States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Tomorrow's date helper
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const tomorrowStr = useMemo(() => getTomorrowString(), []);

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(tomorrowStr);
  const [bookingAdults, setBookingAdults] = useState(2);
  const [bookingChildren, setBookingChildren] = useState(0);
  const [bookingInfants, setBookingInfants] = useState(0);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

  // Combined photo gallery from both cruise and hotel
  const imageGallery = useMemo(() => {
    if (!cruiseObj || !hotelObj) return [];
    return [
      cruiseObj.imageGallery[0],
      hotelObj.imageGallery[0],
      cruiseObj.imageGallery[1] || cruiseObj.imageGallery[0],
      hotelObj.imageGallery[1] || hotelObj.imageGallery[0],
      cruiseObj.imageGallery[2] || cruiseObj.imageGallery[0],
      hotelObj.imageGallery[2] || hotelObj.imageGallery[0],
    ];
  }, [cruiseObj, hotelObj]);

  // Scrollspy state for Nav Tabs
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "itinerary", "regulations", "reviews"];
      let currentSection = sections[0];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when booking modal or lightbox is open
  useEffect(() => {
    if (isBookingModalOpen || lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isBookingModalOpen, lightboxOpen]);

  // Calculate itinerary length
  const itineraryText = useMemo(() => {
    if (!combo || !cruiseObj) return { title: "", details: "" };
    const hotelNights = combo.patternOptions.hotelStayBeforeDays + combo.patternOptions.hotelStayAfterDays;
    const cruiseNights = cruiseObj.durationDays - 1;
    const totalDays = hotelNights + cruiseObj.durationDays;
    const totalNights = hotelNights + cruiseNights;
    return {
      title: `${totalDays} Ngày ${totalNights} Đêm`,
      details: `${hotelNights} đêm khách sạn + ${cruiseObj.durationDays} ngày ${cruiseNights} đêm du thuyền`
    };
  }, [combo, cruiseObj]);

  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại liên hệ.");
      return;
    }
    if (!bookingDate) {
      toast.error("Vui lòng chọn ngày khởi hành.");
      return;
    }

    toast.success("Gửi yêu cầu đặt combo thành công! TRAVEL sẽ liên hệ lại trong ít phút.");
    setIsBookingModalOpen(false);

    setBookingName("");
    setBookingPhone("");
    setBookingEmail("");
    setBookingNotes("");
    setBookingDate(tomorrowStr);
    setBookingAdults(2);
    setBookingChildren(0);
    setBookingInfants(0);
  };

  // Load reviews matching this combo
  const matchedReviews = useMemo(() => {
    if (!combo || !cruiseObj || !hotelObj) return [];

    const cruiseReviews = mockReviews.filter(
      (r) => r.stayType.toLowerCase().includes(cruiseObj.name.split(" ")[0].toLowerCase())
    );
    const hotelReviews = mockReviews.filter(
      (r) => r.stayType.toLowerCase().includes(hotelObj.name.split(" ")[0].toLowerCase())
    );

    const combined = [...cruiseReviews, ...hotelReviews];
    if (combined.length === 0) {
      return [
        {
          id: "rev-combo-fallback-1",
          userName: "Lê Ngọc Hân",
          userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
          rating: 5,
          comment: `Một chuyến đi quá tuyệt vời! Gói combo kết hợp giữa du thuyền và resort đảo Rều giúp gia đình tôi vừa có chuyến nghỉ dưỡng riêng tư tĩnh lặng, vừa được thưởng ngoạn cảnh vịnh vô cùng sang chảnh.`,
          date: "2026-05-28",
          stayType: combo.name
        },
        {
          id: "rev-combo-fallback-2",
          userName: "Đỗ Quốc Việt",
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
          rating: 5,
          comment: `Dịch vụ từ A đến Z cực kỳ chuyên nghiệp. Đơn giá combo siêu hời so với việc tự đặt lẻ từng dịch vụ. Highly recommend combo này cho các cặp đôi!`,
          date: "2026-05-21",
          stayType: combo.name
        }
      ];
    }
    return combined;
  }, [combo, cruiseObj, hotelObj]);

  // State for user-added reviews during the session
  const [addedReviews, setAddedReviews] = useState<Review[]>([]);

  // Combined reviews
  const allReviews = useMemo(() => {
    return [...addedReviews, ...matchedReviews];
  }, [addedReviews, matchedReviews]);

  if (!combo || !cruiseObj || !hotelObj) {
    return (
      <>
        <Navbar solid />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
          <Luggage className="w-16 h-16 text-accent animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Không tìm thấy gói combo</h2>
          <p className="text-sm text-slate-500 mb-6">Đường dẫn không tồn tại hoặc gói combo đã ngừng áp dụng.</p>
          <Link href="/combos" className="px-6 py-2.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] text-xs uppercase tracking-widest font-bold rounded-full transition-all">
            Quay lại danh sách combo
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Format currency
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Regulations
  const regulations = {
    policy: [
      `Thời gian nhận phòng khách sạn: Từ 14:00. Check-out khách sạn trước 12:00.`,
      `Thời gian check-in du thuyền: Từ 11:30 - 12:15 tại cảng tàu khách quốc tế.`,
      `Hành trình du thuyền được cố định theo chương trình ${cruiseObj.durationDays} ngày ${cruiseObj.durationDays - 1} đêm.`,
      `Quý khách vui lòng cung cấp thông tin Căn cước công dân hoặc Hộ chiếu trước ít nhất 3 ngày để làm thủ tục đăng ký ngủ đêm trên vịnh.`
    ],
    child: [
      "Trẻ em dưới 4 tuổi: Miễn phí chung giường và dịch vụ với bố mẹ (tối đa 1 bé/phòng).",
      "Trẻ em từ 4 đến dưới 11 tuổi: Phụ thu tính bằng 70% đơn giá combo người lớn (ngủ chung giường bố mẹ).",
      "Trẻ em từ 11 tuổi trở lên: Tính chi phí phụ thu như người lớn."
    ],
    cancel: [
      "Hủy combo trước 14 ngày khởi hành: Miễn phí hoàn hủy.",
      "Hủy combo từ 7 đến 13 ngày khởi hành: Phí hủy là 50% tổng giá trị combo.",
      "Hủy combo dưới 7 ngày hoặc không xuất hiện: Phí hủy là 100% tổng giá trị đặt dịch vụ.",
      "Không áp dụng hoãn hủy cho các dịp lễ Tết hoặc các chương trình khuyến mại xả kho."
    ]
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      toast.error("Vui lòng điền đầy đủ họ tên và nội dung đánh giá.");
      return;
    }

    const newReview: Review = {
      id: `rev-new-combo-${Date.now()}`,
      userName: reviewName,
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split("T")[0],
      stayType: combo.name
    };

    setAddedReviews((prev) => [newReview, ...prev]);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    toast.success("Đánh giá của bạn đã được gửi thành công và đang chờ duyệt!");
  };

  // Suggestions (exclude current combo)
  const suggestedCombos = mockCombos.filter((c) => c.id !== combo.id).slice(0, 3);

  // Average rating calculation
  const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, allReviews.length)).toFixed(1);

  // Suggested itinerary combining hotel and cruise
  const proposedItinerary = [
    {
      day: 1,
      title: "Nhận phòng khách sạn & Nghỉ ngơi tự do",
      location: hotelObj.name,
      description: `Quý khách tự di chuyển tới khách sạn ${hotelObj.name}. Làm thủ tục nhận phòng Deluxe Hướng Biển tiêu chuẩn vào lúc 14:00. Buổi chiều, quý khách tự do thư giãn tắm bể bơi ngoài trời rộng lớn, trải nghiệm các dịch vụ spa cao cấp hoặc dạo bãi biển riêng thơ mộng.`
    },
    {
      day: 2,
      title: "Di chuyển ra Cảng - Check-in siêu du thuyền",
      location: cruiseObj.name,
      description: `Sau bữa sáng buffet tại khách sạn, quý khách làm thủ tục check-out trước 11:00. Xe đưa đón (hoặc tự túc) chuyển quý khách sang bến cảng tuần châu làm thủ tục check-in du thuyền ${cruiseObj.name}. Bắt đầu hải trình khám phá Vịnh Hạ Long huyền ảo, thưởng thức buffet hải sản và chèo thuyền kayak khám phá hang động hoang sơ.`
    },
    {
      day: 3,
      title: "Thái cực quyền - Chinh phục đảo Ti Tốp - Kết thúc",
      location: "Vịnh Hạ Long",
      description: `Bắt đầu ngày mới với bài tập dưỡng sinh trên boong tàu lộng gió. Tham quan hang động kỳ vĩ nhất vịnh và tự do tắm biển trên bãi cát đảo Ti Tốp, leo đỉnh núi ngắm toàn cảnh kỳ quan thiên nhiên. Sau đó dùng bữa trưa nhẹ trên đường di chuyển trở lại đất liền. Kết thúc chương trình combo trọn gói hoàn hảo.`
    }
  ];

  return (
    <div className="w-full bg-white text-slate-800">
      <Navbar solid />

      {/* 1. HEADER SECTION (White background) */}
      <section className="bg-white pt-28 pb-6">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-[#001226] flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <Link href="/combos" className="hover:text-[#001226]">Combo du lịch</Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800">{combo.name}</span>
          </div>

          {/* Title, Badge, Tagline */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[9px] uppercase tracking-[0.15em] font-semibold rounded-sm">
                Combo Đặc Quyền
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-4xl text-slate-900 tracking-wide font-normal">{combo.name}</h1>
            <p className="text-sm text-slate-500 italic">{combo.tagline}</p>
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="bg-white px-6 pb-6">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-auto md:h-[450px]">
            {/* Main large image */}
            <div
              className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-sm cursor-pointer aspect-video md:aspect-auto"
              onClick={() => {
                setLightboxIdx(0);
                setLightboxOpen(true);
              }}
            >
              <img
                src={imageGallery[0]}
                alt={`${combo.name} 1`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Thumbnails */}
            {[1, 2, 3, 4].map((imgIdx) => (
              <div
                key={imgIdx}
                className="hidden md:block relative overflow-hidden rounded-sm cursor-pointer"
                onClick={() => {
                  setLightboxIdx(imgIdx);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={imageGallery[imgIdx] || imageGallery[0]}
                  alt={`${combo.name} ${imgIdx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          {/* View all photos button */}
          <button
            onClick={() => {
              setLightboxIdx(0);
              setLightboxOpen(true);
            }}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold py-2 px-4 rounded-sm shadow-md transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <span>Xem tất cả ảnh</span>
            <span className="text-slate-400">({imageGallery.length})</span>
          </button>
        </div>
      </section>

      {/* STICKY NAV TABS */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md hidden md:block pb-1 pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {[
              { id: "overview", label: "Giới thiệu" },
              { id: "itinerary", label: "Lịch trình" },
              { id: "regulations", label: "Quy định" },
              { id: "reviews", label: "Đánh giá" },
            ].map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    const el = document.getElementById(tab.id);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 130;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className={`px-5 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#001226] text-white shadow-sm"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. OVERVIEW & INCLUSIONS */}
      <section id="overview" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

          {/* Left Side: Overview & Inclusions (col-span-2) */}
          <div className="lg:col-span-2 space-y-12 text-left">

            {/* Overview text */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-slate-900 leading-tight">
                Hành Trình Kết Hợp Độc Bản: Đất Liền và Biển Khơi
              </h2>
              <p className="text-slate-650 text-sm md:text-base leading-relaxed font-sans font-light">
                {combo.description}
              </p>
            </div>

            {/* Inclusions Split */}
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <h3 className="font-serif text-lg font-bold text-slate-900 uppercase">CHI TIẾT DỊCH VỤ BAO GỒM</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cruise Inclusion */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <Anchor className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Dịch vụ du thuyền</h4>
                      <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wide leading-tight">{cruiseObj.name}</h3>
                    </div>
                  </div>

                  <div className="aspect-[16/10] rounded-sm overflow-hidden bg-slate-200">
                    <img src={cruiseObj.imageGallery[0]} alt={cruiseObj.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">Tiêu chuẩn cabin Deluxe Ocean View</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">Chương trình hải trình {cruiseObj.durationDays} ngày {cruiseObj.durationDays - 1} đêm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">Buffet hải sản, chèo kayak, tập dưỡng sinh</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {cruiseObj.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hotel Inclusion */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <HotelIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Dịch vụ nghỉ dưỡng</h4>
                      <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wide leading-tight">{hotelObj.name}</h3>
                    </div>
                  </div>

                  <div className="aspect-[16/10] rounded-sm overflow-hidden bg-slate-200">
                    <img src={hotelObj.imageGallery[0]} alt={hotelObj.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">Tiêu chuẩn phòng Deluxe Hướng Biển</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">Thời gian lưu trú: {combo.patternOptions.hotelStayBeforeDays + combo.patternOptions.hotelStayAfterDays} đêm nghỉ dưỡng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">Bao gồm bữa ăn buffet sáng, bãi tắm riêng</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {hotelObj.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Price, CTA & Specs Widget */}
          <div className="lg:col-span-1 lg:sticky lg:top-36">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-6 text-left">
              {/* Price */}
              <div className="border-b border-slate-100 pb-5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">Đơn giá combo từ</span>
                <div className="flex items-baseline gap-2.5">
                  <div className="text-3xl font-serif font-bold text-[#001226]">{formatPrice(combo.salePrice)}</div>
                  {combo.netPrice > combo.salePrice && (
                    <span className="text-sm text-slate-400 line-through font-sans">{formatPrice(combo.netPrice)}</span>
                  )}
                </div>
                <span className="text-xs text-slate-400">/ khách trọn gói</span>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={handleBookingClick}
                className="w-full py-4 bg-accent hover:bg-[#001226] text-[#001226] hover:text-white font-bold text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-md cursor-pointer"
              >
                Đặt Combo Ngay
              </button>

              {/* Specs */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Luggage className="w-4 h-4 text-accent" />
                  <h4 className="font-serif text-xs font-bold text-slate-900 uppercase tracking-wide">THÔNG SỐ GÓI COMBO</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">DU THUYỀN</span>
                    <span className="font-bold text-slate-800 text-right max-w-[160px]">{cruiseObj.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">KHÁCH SẠN</span>
                    <span className="font-bold text-slate-800 text-right max-w-[160px]">{hotelObj.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">LỊCH TRÌNH</span>
                    <span className="font-bold text-slate-800 text-right">{itineraryText.title}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">BAO GỒM</span>
                    <span className="font-bold text-slate-800 text-right max-w-[160px]">{itineraryText.details}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">KHỞI HÀNH</span>
                    <span className="font-bold text-slate-800 uppercase text-accent">Hàng ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. PROPOSED ITINERARY SECTION */}
      <section id="itinerary" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 space-y-12 text-left">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">
              LỊCH TRÌNH TRẢI NGHIỆM CHI TIẾT
            </h2>
          </div>

          <div className="relative border-l-2 border-slate-100 pl-8 space-y-12 py-2">
            {proposedItinerary.map((day, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline circle badge */}
                <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-[#001226] text-accent flex items-center justify-center text-xs font-bold border-4 border-white shadow-md group-hover:bg-accent group-hover:text-[#001226] transition-colors duration-300">
                  {day.day}
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif text-base md:text-lg font-semibold text-slate-900">
                      Ngày {day.day}: {day.title}
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                      <MapPin className="w-3 h-3 text-accent" />
                      {day.location}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">
                    {day.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. REGULATIONS & NOTES */}
      <section id="regulations" className="py-16 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">QUY ĐỊNH CHUNG & LƯU Ý</h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-150 p-4 space-y-1">
              <button
                onClick={() => setActiveTab("policy")}
                className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "policy" ? "bg-[#001226] text-white shadow-sm" : "text-slate-655 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Quy định chung</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button
                onClick={() => setActiveTab("child")}
                className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "child" ? "bg-[#001226] text-white shadow-sm" : "text-slate-655 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Chính sách trẻ em</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button
                onClick={() => setActiveTab("cancel")}
                className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "cancel" ? "bg-[#001226] text-white shadow-sm" : "text-slate-655 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Chính sách hoãn hủy</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>

            <div className="w-full md:w-2/3 p-8 text-left">
              <div className="space-y-4">
                {regulations[activeTab].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REVIEWS & FEEDBACK */}
      <section id="reviews" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">

          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2 text-left">
              <h3 className="font-serif text-xl font-bold text-slate-900 uppercase">ĐÁNH GIÁ TỪ DU KHÁCH</h3>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-150 rounded-sm flex flex-col sm:flex-row items-center gap-6 shadow-sm text-left">
              <div className="text-center space-y-1">
                <span className="text-4xl font-serif font-bold text-[#001226]">{avgRating}</span>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Điểm đánh giá</span>
              </div>

              <div className="flex-1 space-y-2 border-l border-slate-200 pl-6 w-full text-left">
                <div className="flex items-center gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-xs font-semibold text-slate-655 ml-2">100% khách hàng hài lòng tuyệt đối</span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans font-light leading-relaxed">
                  Tổng số {allReviews.length} phản hồi từ trải nghiệm nghỉ ngơi thực tế tại đây.
                </p>
              </div>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              {allReviews.map((rev) => (
                <div key={rev.id} className="p-6 border-b border-slate-100 last:border-0 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                      <div className="text-left">
                        <h5 className="text-xs font-bold text-slate-800">{rev.userName}</h5>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rev.rating) ? "fill-accent text-accent" : "text-slate-200"}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-light pl-12 text-left">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Review form */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-150 p-8 rounded-sm shadow-sm h-fit">
            <div className="border-b border-slate-200 pb-4 mb-6 flex items-center gap-2 text-left">
              <MessageSquare className="w-5 h-5 text-accent" />
              <h4 className="font-serif text-base font-bold text-slate-900 uppercase">
                GỬI ĐÁNH GIÁ CỦA BẠN
              </h4>
            </div>

            <form onSubmit={handleAddReview} className="space-y-5">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Họ và tên của bạn</label>
                <input type="text" placeholder="Nhập đầy đủ họ tên..." value={reviewName} onChange={(e) => setReviewName(e.target.value)} className="w-full bg-white border border-slate-300 rounded-sm px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent" />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Đánh giá số sao</label>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <button key={i} type="button" onClick={() => setReviewRating(starVal)} className="p-1 hover:scale-115 transition-transform cursor-pointer" aria-label={`Đánh giá ${starVal} sao`}>
                        <Star className={`w-6 h-6 ${starVal <= reviewRating ? "fill-accent text-accent" : "text-slate-300 hover:text-accent/60"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Nội dung bình luận</label>
                <textarea rows={4} placeholder="Chia sẻ cảm nhận thực tế của quý khách..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full bg-white border border-slate-300 rounded-sm p-4 text-xs font-medium focus:outline-none focus:border-accent" />
              </div>

              <button type="submit" className="w-full py-3.5 bg-[#001226] hover:bg-accent text-white hover:text-[#001226] text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                <Send className="w-4 h-4" />
                Gửi phản hồi của bạn
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. RELATED SUGGESTED COMBOS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Khám phá thêm</span>
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">
              GỢI Ý CÁC GÓI COMBO KHÁC
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {suggestedCombos.map((item) => {
              const suggestedCruise = mockCruises.find((c) => c.id === item.cruiseId);
              return (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  type="combo"
                  name={item.name}
                  tagline={item.tagline}
                  image={suggestedCruise?.imageGallery[0] || ""}
                  stars={5}
                  price={item.salePrice}
                  originalPrice={item.netPrice}
                  badge="Gói Đặc Biệt"
                  amenities={["Kết hợp hoàn hảo", "Tích hợp đưa đón", "Tiết kiệm 20%"]}
                  variant="detailed"
                />
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* LIGHTBOX MODAL */}
      <Lightbox
        images={imageGallery}
        isOpen={lightboxOpen}
        initialIndex={lightboxIdx}
        onClose={() => setLightboxOpen(false)}
        title={combo.name}
        location={`${cruiseObj.name} · ${hotelObj.name}`}
      />

      {/* COMBO BOOKING POPUP MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Form Side - Left Column */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold block">Đặt combo trọn gói</span>
                    <h3 className="font-serif text-xl md:text-2xl text-slate-900 font-medium">
                      ĐĂNG KÝ YÊU CẦU ĐẶT COMBO
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">
                      {combo.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer"
                    aria-label="Đóng"
                  >
                    <span className="text-xl font-light">&times;</span>
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-5">

                  {/* Departure Date selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                      Ngày khởi hành combo *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        min={tomorrowStr}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Passenger Counters */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                      Số lượng hành khách đi combo
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Người lớn", sub: null, val: bookingAdults, setter: setBookingAdults, min: 1 },
                        { label: "Trẻ em", sub: "4 - 11 tuổi (-30%)", val: bookingChildren, setter: setBookingChildren, min: 0 },
                        { label: "Em bé", sub: "Dưới 4 tuổi (Free)", val: bookingInfants, setter: setBookingInfants, min: 0 },
                      ].map(({ label, sub, val, setter, min }) => (
                        <div key={label} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center space-y-1 shadow-xs">
                          <div className="space-y-0">
                            <span className="text-[9px] font-bold text-slate-700 block">{label}</span>
                            {sub && <span className="text-[7px] text-slate-400 block -mt-0.5">{sub}</span>}
                          </div>
                          <div className="flex items-center justify-between">
                            <button type="button" onClick={() => setter((prev: number) => Math.max(min, prev - 1))} className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 font-bold text-xs select-none cursor-pointer">-</button>
                            <span className="text-xs font-bold text-slate-800">{val}</span>
                            <button type="button" onClick={() => setter((prev: number) => prev + 1)} className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 font-bold text-xs select-none cursor-pointer">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Thông tin liên hệ</span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Họ và tên *</label>
                        <input type="text" required placeholder="Nguyễn Văn A..." value={bookingName} onChange={(e) => setBookingName(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Số điện thoại *</label>
                        <input type="tel" required placeholder="0912345xxx..." value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Địa chỉ Email</label>
                      <input type="email" placeholder="email@example.com..." value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Yêu cầu thêm</label>
                      <textarea rows={2} placeholder="Ví dụ: Cần xe đưa đón khứ hồi từ Hà Nội, phòng khách sạn tầng cao..." value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs" />
                    </div>
                  </div>

                  <div className="block md:hidden pt-4 border-t border-slate-100">
                    <button type="submit" className="w-full py-4 text-xs uppercase tracking-widest font-bold rounded-lg bg-[#001226] hover:bg-accent text-white hover:text-[#001226] transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer">
                      Gửi yêu cầu đặt combo
                    </button>
                  </div>
                </form>
              </div>

              {/* Summary Card Side - Right Column */}
              <div className="w-full md:w-[350px] bg-slate-50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col justify-between overflow-y-auto text-left shadow-inner">
                <div className="space-y-6">
                  <h4 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">
                    Báo giá tạm tính
                  </h4>

                  {/* Combo Preview Image */}
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-200 shadow-inner relative">
                    <img src={cruiseObj.imageGallery[0]} alt="Combo Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[8px] font-bold text-slate-900 shadow-xs uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-accent" />
                      Lịch trình: {itineraryText.title}
                    </div>
                  </div>

                  {/* Details summary */}
                  <div className="space-y-4 text-xs text-slate-650">
                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Gói combo:</span>
                      <span className="font-bold text-slate-800 text-right max-w-[170px] truncate" title={combo.name}>{combo.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Khởi hành:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {bookingDate ? new Date(bookingDate).toLocaleDateString("vi-VN") : "Chưa chọn"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Khách đi combo:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {bookingAdults} NL
                        {bookingChildren > 0 && `, ${bookingChildren} TE`}
                        {bookingInfants > 0 && `, ${bookingInfants} EB`}
                      </span>
                    </div>

                    {/* Breakdown pricing list */}
                    <div className="space-y-2 border-b border-slate-150 pb-3">
                      <span className="font-medium text-slate-500 block">Chi tiết chi phí:</span>
                      <div className="space-y-1.5 pl-2 border-l-2 border-accent/40 text-[11px]">
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-800">Người lớn <span className="text-slate-455 font-normal text-[10px]">x{bookingAdults}</span></span>
                          <span className="font-medium text-slate-700">{formatPrice(combo.salePrice * bookingAdults)}</span>
                        </div>
                        {bookingChildren > 0 && (
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-800">Trẻ em (70%) <span className="text-slate-455 font-normal text-[10px]">x{bookingChildren}</span></span>
                            <span className="font-medium text-slate-700">{formatPrice(combo.salePrice * 0.7 * bookingChildren)}</span>
                          </div>
                        )}
                        {bookingInfants > 0 && (
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-800">Em bé (Miễn phí) <span className="text-slate-455 font-normal text-[10px]">x{bookingInfants}</span></span>
                            <span className="font-medium text-slate-700">Miễn phí</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 pt-6 border-t border-slate-200 mt-6">
                  {/* Dynamic Total Price */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 block font-bold">Tổng chi phí dự kiến</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl md:text-2xl font-bold font-serif text-[#001226]">
                        {formatPrice(
                          (combo.salePrice * bookingAdults) + (combo.salePrice * 0.7 * bookingChildren)
                        )}
                      </span>
                      <span className="text-[9px] text-slate-455 uppercase font-medium">Tổng cộng</span>
                    </div>
                  </div>

                  {/* Informational Warning Banner */}
                  <div className="bg-amber-50 border border-amber-250 p-3 rounded-lg text-[10px] text-amber-800 leading-relaxed font-medium">
                    * Giá trọn gói bao gồm vé tham quan vịnh, các bữa ăn theo chương trình, phòng nghỉ tiêu chuẩn mặc định. Giá chưa bao gồm phụ thu cuối tuần, ngày lễ hoặc phụ phí phòng đơn.
                  </div>

                  {/* Submission button on Desktop */}
                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    className="hidden md:flex w-full py-4 text-xs uppercase tracking-widest font-bold rounded-lg bg-[#001226] hover:bg-accent text-white hover:text-[#001226] transition-all duration-300 items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    Gửi yêu cầu đặt combo
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
