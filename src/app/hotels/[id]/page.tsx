/* eslint-disable @next/next/no-img-element */
"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Lightbox from "@/components/Lightbox";
import { mockHotels, mockReviews, Review } from "@/data/mockData";
import {
  Star,
  ChevronRight,
  Home,
  Building2,
  Compass,
  Send,
  MessageSquare,
  Waves,
  Utensils,
  Heart,
  Sun,
  Coffee,
  UserCheck,
  Calendar,
  Layers,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

// Helper function to map hotel amenities to icons
const getHotelAmenityIcon = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes("bể bơi") || nameLower.includes("pool")) return <Waves className="w-5 h-5 text-accent" />;
  if (nameLower.includes("bãi tắm") || nameLower.includes("biển")) return <Sun className="w-5 h-5 text-accent" />;
  if (nameLower.includes("spa") || nameLower.includes("massage") || nameLower.includes("vincharm")) return <Heart className="w-5 h-5 text-accent" />;
  if (nameLower.includes("nhà hàng") || nameLower.includes("ăn")) return <Utensils className="w-5 h-5 text-accent" />;
  if (nameLower.includes("cano") || nameLower.includes("đón")) return <Compass className="w-5 h-5 text-accent" />;
  if (nameLower.includes("kid") || nameLower.includes("trẻ em")) return <UserCheck className="w-5 h-5 text-accent" />;
  if (nameLower.includes("onsen") || nameLower.includes("khoáng")) return <Waves className="w-5 h-5 text-accent" />;
  if (nameLower.includes("thiền") || nameLower.includes("trà")) return <Coffee className="w-5 h-5 text-accent" />;
  if (nameLower.includes("vườn") || nameLower.includes("zen")) return <Sun className="w-5 h-5 text-accent" />;
  return <Building2 className="w-5 h-5 text-accent" />;
};

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const hotelId = resolvedParams.id;

  // Find current hotel
  const hotel = mockHotels.find((h) => h.id === hotelId);

  // States
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"policy" | "child" | "cancel">("policy");

  // Lightbox Modal States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Room Sidebar States (Details Drawer)
  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number | null>(null);
  const [roomPhotoIdx, setRoomPhotoIdx] = useState(0);

  // Tomorrow's and Day After Tomorrow's date helper
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const getDayAfterTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  };

  const tomorrowStr = useMemo(() => getTomorrowString(), []);
  const dayAfterTomorrowStr = useMemo(() => getDayAfterTomorrowString(), []);

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingCheckIn, setBookingCheckIn] = useState(tomorrowStr);
  const [bookingCheckOut, setBookingCheckOut] = useState(dayAfterTomorrowStr);
  const [bookingRoomsQty, setBookingRoomsQty] = useState<number[]>(() => {
    const h = mockHotels.find((item) => item.id === hotelId);
    return h ? h.roomTypes.map((_, i) => i === 0 ? 1 : 0) : [];
  });
  const [bookingAdults, setBookingAdults] = useState(2);
  const [bookingChildren, setBookingChildren] = useState(0);
  const [bookingInfants, setBookingInfants] = useState(0);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

  // Scrollspy state for Nav Tabs
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "rooms", "regulations", "map", "reviews"];
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

  // Lock background scroll when sidebar drawer or booking modal or lightbox is open
  useEffect(() => {
    if (selectedRoomIdx !== null || isBookingModalOpen || lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedRoomIdx, isBookingModalOpen, lightboxOpen]);

  // Enriched Room Types mapping
  const mockRooms = useMemo(() => {
    if (!hotel) return [];
    return hotel.roomTypes.map((room, idx) => {
      const sizes = ["38 m²", "76 m²", "90 m²", "120 m²"];
      const defaultAmenities = [
        "Wifi tốc độ cao miễn phí",
        "Điều hòa nhiệt độ độc lập",
        "Mini bar đầy đủ đồ uống",
        "Tivi thông minh màn hình phẳng",
        "Trà & Cà phê miễn phí hàng ngày",
        "Két sắt an toàn trong phòng"
      ];

      const defaultDetails = [
        "Ban công riêng biệt với tầm nhìn thoáng đãng và ghế ngồi ngắm cảnh.",
        "1 Giường đôi cỡ lớn (King-size) hoặc 2 giường đơn tùy chọn khi nhận phòng.",
        "Phòng tắm lát đá sang trọng có bồn tắm nằm hoặc vòi tắm hoa sen nhiệt độ.",
        "Trang bị đầy đủ đồ dùng vệ sinh cá nhân, máy sấy tóc và áo choàng tắm.",
        "Dọn phòng mỗi ngày và miễn phí 2 chai nước khoáng sạch mỗi đêm nghỉ."
      ];

      return {
        name: room.name,
        size: sizes[idx % sizes.length],
        capacity: room.capacity,
        description: room.description,
        price: room.pricePerNight,
        image: room.image,
        images: [
          room.image,
          hotel.imageGallery[1] || room.image,
          hotel.imageGallery[2] || room.image,
          hotel.imageGallery[3] || room.image,
        ],
        planImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600",
        details: defaultDetails,
        amenities: defaultAmenities
      };
    });
  }, [hotel]);

  // Calculate stay duration (nights)
  const bookingNights = useMemo(() => {
    if (!bookingCheckIn || !bookingCheckOut) return 1;
    const checkIn = new Date(bookingCheckIn);
    const checkOut = new Date(bookingCheckOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    if (diffTime <= 0) return 1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [bookingCheckIn, bookingCheckOut]);

  // Handle Check-in date adjustment to push Check-out date if needed
  const handleCheckInChange = (val: string) => {
    setBookingCheckIn(val);
    const checkInDate = new Date(val);
    const checkOutDate = new Date(bookingCheckOut);
    if (checkOutDate <= checkInDate) {
      const nextDate = new Date(checkInDate);
      nextDate.setDate(nextDate.getDate() + 1);
      setBookingCheckOut(nextDate.toISOString().split("T")[0]);
    }
  };

  const handleBookingClick = () => {
    const defaultQty = mockRooms.map((_, i) => i === 0 ? 1 : 0);
    setBookingRoomsQty(defaultQty);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại liên hệ.");
      return;
    }
    if (!bookingCheckIn || !bookingCheckOut) {
      toast.error("Vui lòng chọn đầy đủ ngày nhận và trả phòng.");
      return;
    }
    const hasRoomSelected = bookingRoomsQty.some(qty => qty > 0);
    if (!hasRoomSelected) {
      toast.error("Vui lòng chọn ít nhất 1 phòng nghỉ.");
      return;
    }

    toast.success("Gửi yêu cầu đặt phòng thành công! TRAVEL sẽ liên hệ lại trong ít phút.");
    setIsBookingModalOpen(false);

    setBookingName("");
    setBookingPhone("");
    setBookingEmail("");
    setBookingNotes("");
    setBookingCheckIn(tomorrowStr);
    setBookingCheckOut(dayAfterTomorrowStr);
    setBookingRoomsQty(mockRooms.map((_, i) => i === 0 ? 1 : 0));
    setBookingAdults(2);
    setBookingChildren(0);
    setBookingInfants(0);
  };

  // Load reviews matching this hotel dynamically via useMemo
  const matchedReviews = useMemo(() => {
    if (!hotel) return [];
    const matched = mockReviews.filter(
      (r) => r.stayType.toLowerCase().includes(hotel.name.split(" ")[0].toLowerCase())
    );
    if (matched.length === 0) {
      return [
        {
          id: "rev-fallback-1",
          userName: "Đoàn Quốc Trung",
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
          rating: 5,
          comment: `Không gian nghỉ dưỡng tuyệt vời tại ${hotel.name}. Phòng ốc sạch sẽ, hướng biển tuyệt đẹp. Đội ngũ nhân viên phục vụ cực kỳ chuyên nghiệp và lịch thiệp.`,
          date: "2026-05-28",
          stayType: hotel.name
        },
        {
          id: "rev-fallback-2",
          userName: "Hoàng Thị Ngọc Mai",
          userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
          rating: 4.8,
          comment: `Mọi thứ đều hoàn hảo từ đồ ăn sáng đến bể bơi. Cả nhà tôi đã có kỳ nghỉ rất trọn vẹn và thư thái. Nhất định sẽ quay lại!`,
          date: "2026-05-20",
          stayType: hotel.name
        }
      ];
    }
    return matched;
  }, [hotel]);

  // State for user-added reviews during the session
  const [addedReviews, setAddedReviews] = useState<Review[]>([]);

  // Combined reviews
  const allReviews = useMemo(() => {
    return [...addedReviews, ...matchedReviews];
  }, [addedReviews, matchedReviews]);

  // Google Maps Embed URLs mapping for each hotel
  const hotelMapUrl = useMemo(() => {
    switch (hotel?.id) {
      case "hotel-vinpearl-halong":
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.7533887413697!2d107.0381665759557!3d20.96245869005391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a59af5b8ab55f%3A0xe54e60bc21df0c94!2zVmlucGVhcmwgUmVzb3J0ICYgU3BhIEjhuqEgTG9uZw!5e0!3m2!1svi!2svn!4v1716912345680!5m2!1svi!2svn";
      case "hotel-yoko-onsen-quang-hanh":
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.6575306560946!2d107.19972237595462!3d20.92615699128038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a43b2f5619379%3A0x6bba84ec6be5f356!2zWW9rbyBPbnNlbiBRdWFuZyBIYW5o!5e0!3m2!1svi!2svn!4v1716912345681!5m2!1svi!2svn";
      case "hotel-premier-village-halong":
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.7675127599026!2d107.02636257595568!3d20.961889490073284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5840d5555555%3A0x286377e8a9cf733e!2sPremier%20Village%20Ha%20Long%20Bay%20Resort!5e0!3m2!1svi!2svn!4v1716912345682!5m2!1svi!2svn";
      default:
        return "";
    }
  }, [hotel?.id]);

  if (!hotel) {
    return (
      <>
        <Navbar solid />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
          <Building2 className="w-16 h-16 text-accent animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Không tìm thấy khách sạn</h2>
          <p className="text-sm text-slate-500 mb-6">Đường dẫn không tồn tại hoặc khách sạn đã ngừng hoạt động.</p>
          <Link href="/hotels" className="px-6 py-2.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] text-xs uppercase tracking-widest font-bold rounded-full transition-all">
            Quay lại danh sách
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

  const activeRoom = selectedRoomIdx !== null ? mockRooms[selectedRoomIdx as number] : null;

  // Hotel regulations
  const regulations = {
    policy: [
      "Thời gian nhận phòng khách sạn: Từ 14:00.",
      "Thời gian trả phòng khách sạn: Trước 12:00 trưa.",
      "Nhận phòng sớm hoặc trả phòng trễ tùy thuộc vào tình trạng phòng trống và có phí phụ thu quy định.",
      "Mang theo Căn cước công dân hoặc Hộ chiếu gốc để làm thủ tục nhận phòng."
    ],
    child: [
      "Miễn phí tiền phòng cho tối đa 2 trẻ em dưới 4 tuổi chung giường với bố mẹ.",
      "Trẻ em từ 4 đến dưới 12 tuổi: Phụ thu ăn sáng theo quy định của khách sạn (không bao gồm giường phụ).",
      "Trẻ em từ 12 tuổi trở lên: Tính phí phụ thu như người lớn và yêu cầu kê giường phụ."
    ],
    cancel: [
      "Hủy phòng trước 7 ngày khởi hành: Miễn phí hủy.",
      "Hủy phòng từ 3 đến 6 ngày khởi hành: Phí hủy là 50% tổng giá trị phòng nghỉ đã đặt.",
      "Hủy phòng dưới 3 ngày hoặc không nhận phòng: Phí hủy là 100% tổng tiền đặt phòng.",
      "Chính sách hoãn hủy có thể thay đổi tùy thuộc vào từng thời điểm cao điểm hoặc chương trình khuyến mại."
    ]
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      toast.error("Vui lòng điền đầy đủ họ tên và nội dung đánh giá.");
      return;
    }

    const newReview: Review = {
      id: `rev-new-${Date.now()}`,
      userName: reviewName,
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split("T")[0],
      stayType: hotel.name
    };

    setAddedReviews((prev) => [newReview, ...prev]);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    toast.success("Đánh giá của bạn đã được gửi thành công và đang chờ duyệt!");
  };

  // Suggestions (exclude current hotel)
  const suggestedHotels = mockHotels.filter((h) => h.id !== hotel.id).slice(0, 3);

  // Average rating calculation
  const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, allReviews.length)).toFixed(1);

  // Price starting from
  const priceFrom = Math.min(...hotel.roomTypes.map(r => r.pricePerNight));

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
            <Link href="/hotels" className="hover:text-[#001226]">Khách sạn</Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800">{hotel.name}</span>
          </div>

          {/* Title, Stars, Location */}
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="font-serif text-2xl md:text-4xl text-slate-900 tracking-wide font-normal">{hotel.name}</h1>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${index < hotel.stars ? "fill-accent text-accent" : "text-slate-200"}`}
                  />
                ))}
                <span className="text-xs font-semibold text-slate-500 ml-2">({hotel.stars}.0)</span>
              </div>
            </div>
            {/* Address */}
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{hotel.location}</span>
            </div>
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
                src={hotel.imageGallery[0]}
                alt={`${hotel.name} 1`}
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
                  src={hotel.imageGallery[imgIdx] || hotel.imageGallery[0]}
                  alt={`${hotel.name} ${imgIdx + 1}`}
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
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold py-2 px-4 rounded-full shadow-md transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <span>Xem tất cả ảnh</span>
            <span className="text-slate-400">({hotel.imageGallery.length})</span>
          </button>
        </div>
      </section>

      {/* STICKY NAV TABS */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md hidden md:block pb-1 pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {[
              { id: "overview", label: "Giới thiệu" },
              { id: "rooms", label: "Hạng phòng" },
              { id: "regulations", label: "Quy định" },
              { id: "map", label: "Bản đồ" },
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

      {/* 2. OVERVIEW & SPECS (2-Column Layout) */}
      <section id="overview" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Left Side: Overview & Amenities (col-span-2) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview text */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-slate-900 leading-tight">
                Không gian nghỉ ngơi tuyệt mỹ và dịch vụ đẳng cấp
              </h2>
              <p className="text-slate-650 text-sm md:text-base leading-relaxed font-sans font-light">
                {hotel.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="font-serif text-lg font-bold text-slate-900 uppercase">TIỆN ÍCH KHÁCH SẠN</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm border border-slate-100 hover:border-accent/20 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center flex-shrink-0">
                      {getHotelAmenityIcon(amenity)}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Price, Booking CTA & Specs (col-span-1) */}
          <div className="lg:col-span-1 lg:sticky lg:top-36">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-6">
              {/* Price */}
              <div className="border-b border-slate-100 pb-5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">Giá chỉ từ</span>
                <div className="text-3xl font-serif font-bold text-[#001226]">{formatPrice(priceFrom)}</div>
                <span className="text-xs text-slate-400">/ đêm phòng</span>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={handleBookingClick}
                className="w-full py-4 bg-accent hover:bg-[#001226] text-[#001226] hover:text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-md cursor-pointer"
              >
                Đặt Phòng Ngay
              </button>

              {/* Specs */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-accent" />
                  <h4 className="font-serif text-xs font-bold text-slate-900 uppercase tracking-wide">THÔNG TIN KHÁCH SẠN</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">ĐỊA ĐIỂM</span>
                    <span className="font-bold text-slate-800 text-right max-w-[160px]">{hotel.location.split(",").slice(-1)[0].trim()}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">TỔNG SỐ PHÒNG</span>
                    <span className="font-bold text-slate-800 uppercase">{hotel.roomCount} phòng</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">TIÊU CHUẨN</span>
                    <span className="font-bold text-slate-800 uppercase">{hotel.stars} sao</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ROOM CATEGORIES SECTION (Vertical List of Row Cards) */}
      <section id="rooms" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">
              CÁC HẠNG PHÒNG
            </h2>
          </div>

          <div className="space-y-6">
            {mockRooms.map((room, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row border border-slate-200 rounded-sm hover:border-slate-350 hover:shadow-xs transition-all duration-300 bg-white overflow-hidden"
              >
                {/* Image */}
                <div
                  className="w-full md:w-56 h-40 md:h-40 relative overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setSelectedRoomIdx(index);
                    setRoomPhotoIdx(0);
                  }}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between md:h-40">
                  <div className="space-y-2">
                    <h3
                      className="font-serif text-base md:text-lg font-bold text-slate-900 hover:text-accent-dark transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedRoomIdx(index);
                        setRoomPhotoIdx(0);
                      }}
                    >
                      {room.name}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        Diện tích: {room.size}
                      </span>
                      <span>•</span>
                      <span>Sức chứa: {room.capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Giá từ</span>
                      <span className="font-serif text-base font-bold text-slate-900">{formatPrice(room.price)}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRoomIdx(index);
                        setRoomPhotoIdx(0);
                      }}
                      className="px-5 py-2 bg-slate-900 hover:bg-accent text-white hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                  </div>
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
                  activeTab === "policy"
                    ? "bg-[#001226] text-white shadow-sm"
                    : "text-slate-655 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Nhận và trả phòng</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button
                onClick={() => setActiveTab("child")}
                className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "child"
                    ? "bg-[#001226] text-white shadow-sm"
                    : "text-slate-655 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Chính sách trẻ em</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button
                onClick={() => setActiveTab("cancel")}
                className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "cancel"
                    ? "bg-[#001226] text-white shadow-sm"
                    : "text-slate-655 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Chính sách hoãn hủy</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>

            <div className="w-full md:w-2/3 p-8">
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

      {/* MAP & ADDRESS SECTION */}
      <section id="map" className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">BẢN ĐỒ & VỊ TRÍ</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Text info */}
            <div className="space-y-4 text-sm text-slate-700 font-sans">
              <h3 className="font-serif text-lg font-bold text-slate-900 uppercase">Thông tin địa điểm</h3>
              <ul className="list-disc pl-5 space-y-3 font-light text-slate-650 leading-relaxed md:text-base">
                <li className="pl-1">
                  Khách sạn <span className="font-semibold text-slate-800">{hotel.name}</span> tọa lạc tại địa chỉ: <span className="font-semibold text-slate-800">{hotel.location}</span>.
                </li>
                <li className="pl-1">
                  Vị trí đắc địa, thuận tiện di chuyển, kết nối thuận lợi tới các điểm vui chơi, nhà hàng và khu mua sắm trung tâm tại Quảng Ninh.
                </li>
              </ul>
            </div>

            {/* Map iframe */}
            {hotelMapUrl && (
              <div className="w-full h-[350px] lg:h-[400px] border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                <iframe
                  src={hotelMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Bản đồ vị trí ${hotel.name}`}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. REVIEWS & FEEDBACK */}
      <section id="reviews" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">

          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-slate-900 uppercase">ĐÁNH GIÁ TỪ DU KHÁCH</h3>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-150 rounded-sm flex flex-col sm:flex-row items-center gap-6 shadow-sm">
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
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="text-left">
                        <h5 className="text-xs font-bold text-slate-800">{rev.userName}</h5>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(rev.rating) ? "fill-accent text-accent" : "text-slate-200"}`}
                        />
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
            <div className="border-b border-slate-200 pb-4 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <h4 className="font-serif text-base font-bold text-slate-900 uppercase">
                GỬI ĐÁNH GIÁ CỦA BẠN
              </h4>
            </div>

            <form onSubmit={handleAddReview} className="space-y-5">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                  Họ và tên của bạn
                </label>
                <input
                  type="text"
                  placeholder="Nhập đầy đủ họ tên..."
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-sm px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                  Đánh giá số sao
                </label>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(starVal)}
                        className="p-1 hover:scale-115 transition-transform cursor-pointer"
                        aria-label={`Đánh giá ${starVal} sao`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            starVal <= reviewRating
                              ? "fill-accent text-accent"
                              : "text-slate-300 hover:text-accent/60"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                  Nội dung bình luận
                </label>
                <textarea
                  rows={4}
                  placeholder="Chia sẻ cảm nhận thực tế của quý khách..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-sm p-4 text-xs font-medium focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#001226] hover:bg-accent text-white hover:text-[#001226] text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                Gửi phản hồi của bạn
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. RELATED SUGGESTED HOTELS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Khám phá thêm</span>
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">
              GỢI Ý CÁC KHÁCH SẠN KHÁC
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {suggestedHotels.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                type="hotel"
                name={item.name}
                tagline={item.description.slice(0, 100) + "..."}
                image={item.imageGallery[0]}
                stars={item.stars}
                price={Math.min(...item.roomTypes.map(r => r.pricePerNight))}
                location={item.location.split(",").slice(-1)[0].trim()}
                amenities={item.amenities}
                launchYear="N/A"
                material="N/A"
                cabinCount={item.roomCount}
                variant="detailed"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* LIGHTBOX MODAL */}
      <Lightbox
        images={hotel.imageGallery}
        isOpen={lightboxOpen}
        initialIndex={lightboxIdx}
        onClose={() => setLightboxOpen(false)}
        title={hotel.name}
        stars={hotel.stars}
        location={hotel.location}
      />

      {/* ROOM DETAILS SIDEBAR / DRAWER */}
      <AnimatePresence>
        {selectedRoomIdx !== null && activeRoom && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoomIdx(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 tracking-wider">
                <span className="uppercase">{hotel.name}</span>
                <span className="text-slate-900 uppercase font-serif text-[11px] tracking-widest">Hạng phòng & Suites</span>
                <button
                  onClick={() => setSelectedRoomIdx(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-655 cursor-pointer"
                  aria-label="Đóng"
                >
                  <span className="text-xl font-light">&times;</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin">

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Chi tiết hạng phòng</span>
                    <h3 className="font-serif text-2xl md:text-3xl text-slate-955 font-medium">
                      {activeRoom.name}
                    </h3>
                  </div>
                  <div className="flex gap-6 text-right self-start flex-shrink-0 whitespace-nowrap">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Diện tích</span>
                      <span className="font-serif text-xl font-bold text-slate-800 block whitespace-nowrap">{activeRoom.size}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Sức chứa</span>
                      <span className="font-serif text-xl font-bold text-slate-800 block whitespace-nowrap">{activeRoom.capacity}</span>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-slate-900 shadow-inner group">
                  <img
                    src={activeRoom.images[roomPhotoIdx]}
                    alt={`${activeRoom.name} view ${roomPhotoIdx + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                  />

                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5">
                    {activeRoom.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setRoomPhotoIdx(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === roomPhotoIdx ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                    <button
                      onClick={() => setRoomPhotoIdx((prev) => (prev === 0 ? activeRoom.images.length - 1 : prev - 1))}
                      className="w-8 h-8 rounded-full border border-white/45 hover:border-white text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                    <button
                      onClick={() => setRoomPhotoIdx((prev) => (prev === activeRoom.images.length - 1 ? 0 : prev + 1))}
                      className="w-8 h-8 rounded-full border border-white/45 hover:border-white text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                    {activeRoom.amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-sm border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        <span className="text-xs text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sticky bottom bar: Price + Book CTA */}
              <div className="border-t border-slate-100 px-6 py-4 bg-white flex items-center justify-between gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold block mb-0.5">Giá phòng từ</span>
                  <span className="font-serif text-base font-bold text-slate-900">
                    {formatPrice(activeRoom.price)} <span className="text-[10px] text-slate-450 font-sans font-normal">/ đêm</span>
                  </span>
                </div>
                <button
                  onClick={() => {
                    const targetIdx = selectedRoomIdx !== null ? (selectedRoomIdx as number) : 0;
                    setBookingRoomsQty(mockRooms.map((_, i) => i === targetIdx ? 1 : 0));
                    setSelectedRoomIdx(null);
                    setIsBookingModalOpen(true);
                  }}
                  className="px-6 py-3 bg-[#001226] hover:bg-accent text-white hover:text-[#001226] border border-[#001226] hover:border-accent text-xs uppercase tracking-widest font-bold rounded-full transition-all cursor-pointer"
                >
                  Đặt phòng này
                </button>
              </div>

              {/* Bottom Navigation (prev/next room) */}
              <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedRoomIdx((prev) => (prev === 0 ? mockRooms.length - 1 : prev! - 1));
                    setRoomPhotoIdx(0);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-accent-dark transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>
                    {mockRooms[selectedRoomIdx === 0 ? mockRooms.length - 1 : selectedRoomIdx - 1].name}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedRoomIdx((prev) => (prev === mockRooms.length - 1 ? 0 : prev! + 1));
                    setRoomPhotoIdx(0);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-accent-dark transition-colors cursor-pointer"
                >
                  <span>
                    {mockRooms[selectedRoomIdx === mockRooms.length - 1 ? 0 : selectedRoomIdx + 1].name}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HOTEL BOOKING POPUP MODAL */}
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
                    <span className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold block">Đặt phòng khách sạn</span>
                    <h3 className="font-serif text-xl md:text-2xl text-slate-900 font-medium">
                      ĐĂNG KÝ YÊU CẦU ĐẶT PHÒNG
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">
                      {hotel.name}
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

                  {/* Stay Duration - Check-in & Check-out dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                        Ngày nhận phòng *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          min={tomorrowStr}
                          value={bookingCheckIn}
                          onChange={(e) => handleCheckInChange(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        />
                        <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                        Ngày trả phòng *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          min={(() => {
                            if (!bookingCheckIn) return tomorrowStr;
                            const d = new Date(bookingCheckIn);
                            d.setDate(d.getDate() + 1);
                            return d.toISOString().split("T")[0];
                          })()}
                          value={bookingCheckOut}
                          onChange={(e) => setBookingCheckOut(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        />
                        <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Room quantities counters */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                      Chọn loại phòng & số lượng
                    </label>
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1.5 scrollbar-thin border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                      {mockRooms.map((room, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors shadow-xs">
                          <div className="text-left pr-4">
                            <span className="font-semibold text-xs text-slate-800 block leading-tight">{room.name}</span>
                            <span className="text-[10px] text-slate-450 block mt-1">
                              {formatPrice(room.price)} / đêm • {room.size} • {room.capacity}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setBookingRoomsQty(prev => {
                                  const next = [...prev];
                                  next[idx] = Math.max(0, next[idx] - 1);
                                  return next;
                                });
                              }}
                              className="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer shadow-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-slate-850 min-w-[14px] text-center">
                              {bookingRoomsQty[idx] || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setBookingRoomsQty(prev => {
                                  const next = [...prev];
                                  next[idx] = (next[idx] || 0) + 1;
                                  return next;
                                });
                              }}
                              className="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer shadow-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Passenger Counters */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                      Số lượng khách nghỉ
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Người lớn", sub: null, val: bookingAdults, setter: setBookingAdults, min: 1 },
                        { label: "Trẻ em", sub: "4 - 11 tuổi", val: bookingChildren, setter: setBookingChildren, min: 0 },
                        { label: "Em bé", sub: "Dưới 4 tuổi", val: bookingInfants, setter: setBookingInfants, min: 0 },
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
                      <textarea rows={2} placeholder="Ví dụ: Phòng tầng cao, 2 giường đơn ghép lại, nhận phòng trễ..." value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs" />
                    </div>
                  </div>

                  <div className="block md:hidden pt-4 border-t border-slate-100">
                    <button type="submit" disabled={!bookingRoomsQty.some(q => q > 0)} className={`w-full py-4 text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${bookingRoomsQty.some(q => q > 0) ? "bg-[#001226] hover:bg-accent text-white hover:text-[#001226] cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                      Gửi yêu cầu đặt phòng
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

                  {(() => {
                    const firstSelectedIdx = bookingRoomsQty.findIndex(q => q > 0);
                    const activeRoomForImage = firstSelectedIdx !== -1 ? mockRooms[firstSelectedIdx] : mockRooms[0];
                    return (
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-200 shadow-inner relative">
                        <img src={activeRoomForImage?.image || hotel.imageGallery[0]} alt="Room Preview" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[8px] font-bold text-slate-900 shadow-xs uppercase tracking-wider">
                          Thời gian lưu trú: {bookingNights} đêm
                        </div>
                      </div>
                    );
                  })()}

                  <div className="space-y-4 text-xs text-slate-650">
                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Khách sạn:</span>
                      <span className="font-bold text-slate-800 text-right">{hotel.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Nhận phòng:</span>
                      <span className="font-bold text-slate-800 text-right">{bookingCheckIn ? new Date(bookingCheckIn).toLocaleDateString("vi-VN") : "Chưa chọn"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Trả phòng:</span>
                      <span className="font-bold text-slate-800 text-right">{bookingCheckOut ? new Date(bookingCheckOut).toLocaleDateString("vi-VN") : "Chưa chọn"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Khách nghỉ:</span>
                      <span className="font-bold text-slate-800 text-right">{bookingAdults} NL{bookingChildren > 0 && `, ${bookingChildren} TE`}{bookingInfants > 0 && `, ${bookingInfants} EB`}</span>
                    </div>
                    <div className="space-y-2 border-b border-slate-150 pb-3">
                      <span className="font-medium text-slate-500 block">Danh sách phòng:</span>
                      {!bookingRoomsQty.some(q => q > 0) ? (
                        <span className="text-red-500 font-semibold block text-[11px] italic">Chưa chọn phòng nghỉ nào</span>
                      ) : (
                        <div className="space-y-1.5 pl-2 border-l-2 border-accent/40">
                          {mockRooms.map((room, idx) => {
                            const qty = bookingRoomsQty[idx] || 0;
                            if (qty === 0) return null;
                            return (
                              <div key={idx} className="flex justify-between text-[11px]">
                                <span className="font-semibold text-slate-800 max-w-[170px] truncate">{room.name} <span className="text-slate-455 font-normal text-[10px]">x{qty}</span></span>
                                <span className="font-medium text-slate-700">{formatPrice(room.price * qty * bookingNights)}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 pt-6 border-t border-slate-200 mt-6">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 block font-bold">Tổng chi phí dự kiến</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl md:text-2xl font-bold font-serif text-[#001226]">
                        {formatPrice(
                          mockRooms.reduce((sum, room, i) => {
                            const qty = bookingRoomsQty[i] || 0;
                            return sum + (room.price * qty * bookingNights);
                          }, 0)
                        )}
                      </span>
                      <span className="text-[9px] text-slate-455 uppercase font-medium">Tổng cộng</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-250 p-3 rounded-lg text-[10px] text-amber-800 leading-relaxed font-medium">
                    * Giá ước tính trên tính theo số đêm lưu trú, chưa bao gồm phụ thu trẻ em, cuối tuần, ngày lễ hoặc dịch vụ xe đưa đón. Tư vấn viên TRAVEL sẽ liên hệ sớm nhất.
                  </div>

                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={!bookingRoomsQty.some(q => q > 0)}
                    className={`hidden md:flex w-full py-4 text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-300 items-center justify-center gap-2 shadow-md ${
                      bookingRoomsQty.some(q => q > 0)
                        ? "bg-[#001226] hover:bg-accent text-white hover:text-[#001226] cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Gửi yêu cầu đặt phòng
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
