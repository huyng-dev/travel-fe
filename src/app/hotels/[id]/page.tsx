/* eslint-disable @next/next/no-img-element */
"use client";

import React, { use, useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { mockHotels, mockReviews, Review } from "@/data/mockData";
import { 
  Star, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
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
  Calendar
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

  // Photo Gallery Slider State
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

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

  // Lock background scroll when sidebar drawer or booking modal is open
  useEffect(() => {
    if (selectedRoomIdx !== null || isBookingModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedRoomIdx, isBookingModalOpen]);

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
    
    // Simulate API request
    toast.success("Gửi yêu cầu đặt phòng thành công! TRAVEL sẽ liên hệ lại trong ít phút.");
    setIsBookingModalOpen(false);
    
    // Reset form fields
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

  // Rooms Carousel States & Refs
  const roomsScrollRef = useRef<HTMLDivElement>(null);
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(4);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const handleRoomsScroll = () => {
    const container = roomsScrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild?.clientWidth || 0;
    const gap = 24; // gap-6
    const totalItemWidth = cardWidth + gap;

    if (totalItemWidth > 0) {
      const index = Math.round(scrollLeft / totalItemWidth);
      setActiveRoomIdx(index);
    }
  };

  const scrollToRoom = (index: number) => {
    const container = roomsScrollRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.clientWidth || 0;
    const gap = 24; // gap-6
    const totalItemWidth = cardWidth + gap;

    container.scrollTo({
      left: index * totalItemWidth,
      behavior: "smooth"
    });
  };

  const scrollRooms = (direction: "left" | "right") => {
    const container = roomsScrollRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.clientWidth || 0;
    const gap = 24; // gap-6
    const totalItemWidth = cardWidth + gap;

    const scrollAmount = direction === "left" ? -totalItemWidth : totalItemWidth;
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
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

  if (!hotel) {
    return (
      <>
        <Navbar />
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

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev === 0 ? hotel.imageGallery.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev === hotel.imageGallery.length - 1 ? 0 : prev + 1));
  };

  // Suggestions (exclude current hotel)
  const suggestedHotels = mockHotels.filter((h) => h.id !== hotel.id).slice(0, 3);

  // Average rating calculation
  const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, allReviews.length)).toFixed(1);

  // Price starting from
  const priceFrom = Math.min(...hotel.roomTypes.map(r => r.pricePerNight));

  return (
    <div className="w-full bg-white text-slate-800">
      <Navbar />

      {/* 1. HERO BANNER */}
      <section className="relative h-[80vh] w-full bg-slate-900 overflow-hidden">
        <img
          src={hotel.imageGallery[0]}
          alt={hotel.name}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001226]/20 via-[#001226]/40 to-[#001226]/95" />

        {/* Breadcrumb Path (absolute inside banner like list page) */}
        <div className="absolute top-28 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-accent flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <Link href="/hotels" className="hover:text-accent">Khách sạn</Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white/95">{hotel.name}</span>
          </div>
        </div>

        {/* Floating Glassmorphic Footer inside Hero Banner */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 pt-20 bg-gradient-to-t from-[#001226] via-[#001226]/80 to-transparent">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 w-full">
            
            {/* Left Column: Title & Ratings (Limited width to prevent squishing) */}
            <div className="space-y-2 text-white flex-1 min-w-0 max-w-xl md:max-w-2xl lg:max-w-3xl">
              <div className="space-y-2">
                <h1 className="font-serif text-3xl md:text-5xl tracking-wide font-normal drop-shadow-md break-words">
                  {hotel.name.toUpperCase()}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${index < hotel.stars ? "fill-accent text-accent" : "text-white/20"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white/80 tracking-wider">
                    ({hotel.stars}.0) • {hotel.location.split(",").slice(-1)[0].trim()}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Section (Never wraps, never squished) */}
            <div className="flex items-center gap-6 flex-shrink-0 whitespace-nowrap">
              <div className="text-right hidden sm:block">
                <span className="block text-[10px] uppercase tracking-widest text-white/50">Giá chỉ từ</span>
                <span className="text-xl font-bold text-accent font-serif">{formatPrice(priceFrom)}</span>
                <span className="text-[10px] text-white/40 block">/ đêm phòng</span>
              </div>

              <button
                onClick={handleBookingClick}
                className="px-8 py-4 bg-accent hover:bg-white text-[#001226] font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.03] cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                Đặt Lịch Ngay
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. OVERVIEW & TECH SPECS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Left Side: Overview & Amenities (col-span-2) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview text */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Tổng quan khu nghỉ dưỡng</span>
              <h2 className="font-serif text-2xl md:text-3xl text-slate-900 leading-tight">
                Không gian nghỉ ngơi tuyệt mỹ và dịch vụ đẳng cấp
              </h2>
              <p className="text-slate-650 text-sm md:text-base leading-relaxed font-sans font-light">
                {hotel.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Tiện ích cao cấp</span>
                <h3 className="font-serif text-lg font-bold text-slate-900">TIỆN ÍCH KHÁCH SẠN</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm border border-slate-100 hover:border-accent/20 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      {getHotelAmenityIcon(amenity)}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Technical Specs */}
          <div className="lg:col-span-1 lg:sticky lg:top-28">
            <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-sm space-y-6 shadow-sm">
              <div className="border-b border-slate-200/60 pb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent" />
                <h4 className="font-serif text-base font-bold text-slate-900 uppercase tracking-wide">
                  THÔNG TIN KHÁCH SẠN
                </h4>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">ĐỊA ĐIỂM</span>
                  <span className="font-bold text-slate-800 text-right max-w-[180px]">{hotel.location}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">TỔNG SỐ PHÒNG NGHỈ</span>
                  <span className="font-bold text-slate-800 uppercase">{hotel.roomCount} phòng</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">TIÊU CHUẨN</span>
                  <span className="font-bold text-slate-800 uppercase">{hotel.stars} sao</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. GALLERY SLIDESHOW */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Hình ảnh thực tế</span>
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">
              KHÔNG GIAN NGHỈ DƯỠNG
            </h2>
          </div>

          <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden rounded-sm bg-slate-900 shadow-lg group">
            <img
              src={hotel.imageGallery[activePhotoIdx]}
              alt={`Hotel view ${activePhotoIdx + 1}`}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Bottom-left: Dots */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1.5">
              {hotel.imageGallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activePhotoIdx ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Bottom-right: Arrows */}
            <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
              <button
                onClick={handlePrevPhoto}
                className="w-10 h-10 rounded-full border border-white/44 hover:border-white text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="w-10 h-10 rounded-full border border-white/44 hover:border-white text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROOM CATEGORIES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-slate-100 pb-8">
            <div className="text-left space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Lựa chọn phòng ngủ</span>
              <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">
                CÁC HẠNG PHÒNG THƯỢNG HẠNG
              </h2>
            </div>
            
            {/* Navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRooms("left")}
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 text-slate-655 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer bg-white shadow-sm"
                aria-label="Previous rooms"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollRooms("right")}
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 text-slate-655 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer bg-white shadow-sm"
                aria-label="Next rooms"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rooms Carousel */}
          <div 
            ref={roomsScrollRef}
            onScroll={handleRoomsScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-4"
          >
            {mockRooms.map((room, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start relative aspect-[3/4] overflow-hidden rounded-sm bg-slate-900 shadow-md group flex flex-col justify-end"
              >
                <img
                  src={room.image}
                  alt={room.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="relative z-10 p-6 space-y-4 flex flex-col w-full text-left">
                  <h3 className="font-serif text-base font-semibold text-white tracking-wide leading-snug">
                    {room.name}
                  </h3>
                  
                  <div className="space-y-2.5 border-t border-white/20 pt-3">
                    <div className="flex gap-6 text-[10px] text-white/70">
                      <div>
                        <span className="block text-[8px] text-white/70 uppercase tracking-widest font-semibold">Khách tối đa</span>
                        <span className="font-bold text-white text-xs">{room.capacity}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-white/70 uppercase tracking-widest font-semibold">Diện tích</span>
                        <span className="font-bold text-white text-xs">{room.size}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-[9px] text-white/70 uppercase tracking-widest font-semibold">Giá từ:</span>
                      <span className="font-serif text-xs md:text-sm font-bold text-accent whitespace-nowrap">{formatPrice(room.price)} / đêm</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRoomIdx(index);
                      setRoomPhotoIdx(0);
                    }}
                    className="w-full py-2.5 bg-white hover:bg-accent text-[#001226] font-bold text-[10px] uppercase tracking-wider rounded-full flex items-center justify-between px-5 transition-colors duration-300 shadow-md cursor-pointer"
                  >
                    <span>Khám phá</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dots pagination */}
          <div className="flex justify-center items-center gap-1.5">
            {Array.from({ length: Math.max(1, mockRooms.length - visibleCount + 1) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToRoom(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeRoomIdx ? "w-6 bg-[#001226]" : "w-1.5 bg-slate-300 hover:bg-slate-450"
                }`}
                aria-label={`Go to room page ${idx + 1}`}
              />
            ))}
          </div>

          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      </section>

      {/* 5. REGULATIONS & NOTES */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Điều khoản đặt chỗ</span>
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">
              QUY ĐỊNH CHUNG & LƯU Ý
            </h2>
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

      {/* 6. REVIEWS & FEEDBACK */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Phản hồi thực tế</span>
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

      {/* 7. RELATED SUGGESTED HOTELS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Khám khám thêm</span>
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
                  <div className="flex gap-8 text-right self-start">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Diện tích</span>
                      <span className="font-serif text-xl font-bold text-slate-800">{activeRoom.size}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Sức chứa</span>
                      <span className="font-serif text-lg font-bold text-slate-800">{activeRoom.capacity}</span>
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
                  <h4 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">TIỆN NGHI PHÒNG</h4>
                  <p className="text-xs text-slate-500 font-sans font-light leading-relaxed">
                    {activeRoom.description}
                  </p>
                  
                  <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                    {activeRoom.amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-sm border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        <span className="text-xs text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-6 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400">Giá phòng nghỉ</span>
                      <span className="font-serif text-lg font-bold text-slate-900">{formatPrice(activeRoom.price)} <span className="text-[10px] text-slate-450 font-sans font-normal">/ đêm</span></span>
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
                </div>

              </div>

              <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedRoomIdx((prev) => (prev === 0 ? mockRooms.length - 1 : prev! - 1));
                    setRoomPhotoIdx(0);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-655 hover:text-accent-dark transition-colors cursor-pointer"
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
                  className="flex items-center gap-2 text-xs font-semibold text-slate-655 hover:text-accent-dark transition-colors cursor-pointer"
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
                    {/* Check-in Date */}
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

                    {/* Check-out Date */}
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
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center space-y-1 shadow-xs">
                        <span className="text-[9px] font-bold text-slate-700 block">Người lớn</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setBookingAdults(prev => Math.max(1, prev - 1))}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800">{bookingAdults}</span>
                          <button
                            type="button"
                            onClick={() => setBookingAdults(prev => prev + 1)}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center space-y-1 shadow-xs">
                        <div className="space-y-0">
                          <span className="text-[9px] font-bold text-slate-700 block">Trẻ em</span>
                          <span className="text-[7px] text-slate-400 block -mt-0.5">4 - 11 tuổi</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setBookingChildren(prev => Math.max(0, prev - 1))}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800">{bookingChildren}</span>
                          <button
                            type="button"
                            onClick={() => setBookingChildren(prev => prev + 1)}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center space-y-1 shadow-xs">
                        <div className="space-y-0">
                          <span className="text-[9px] font-bold text-slate-700 block">Em bé</span>
                          <span className="text-[7px] text-slate-400 block -mt-0.5">Dưới 4 tuổi</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setBookingInfants(prev => Math.max(0, prev - 1))}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800">{bookingInfants}</span>
                          <button
                            type="button"
                            onClick={() => setBookingInfants(prev => prev + 1)}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Thông tin liên hệ</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nguyễn Văn A..."
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0912345xxx..."
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">
                        Địa chỉ Email
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com..."
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">
                        Yêu cầu thêm
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ví dụ: Phòng tầng cao, 2 giường đơn ghép lại, nhận phòng trễ..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="block md:hidden pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={!bookingRoomsQty.some(q => q > 0)}
                      className={`w-full py-4 text-xs uppercase tracking-widest font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                        bookingRoomsQty.some(q => q > 0)
                          ? "bg-[#001226] hover:bg-accent text-white hover:text-[#001226] cursor-pointer"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
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

                  {/* Room Preview Image */}
                  {(() => {
                    const firstSelectedIdx = bookingRoomsQty.findIndex(q => q > 0);
                    const activeRoomForImage = firstSelectedIdx !== -1 ? mockRooms[firstSelectedIdx] : mockRooms[0];
                    return (
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-200 shadow-inner relative">
                        <img
                          src={activeRoomForImage?.image || hotel.imageGallery[0]}
                          alt="Room Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[8px] font-bold text-slate-900 shadow-xs uppercase tracking-wider">
                          Thời gian lưu trú: {bookingNights} đêm
                        </div>
                      </div>
                    );
                  })()}

                  {/* Details summary */}
                  <div className="space-y-4 text-xs text-slate-650">
                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Khách sạn:</span>
                      <span className="font-bold text-slate-800 text-right">{hotel.name}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Nhận phòng (Check-in):</span>
                      <span className="font-bold text-slate-800 text-right">
                        {bookingCheckIn ? new Date(bookingCheckIn).toLocaleDateString("vi-VN") : "Chưa chọn"}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Trả phòng (Check-out):</span>
                      <span className="font-bold text-slate-800 text-right">
                        {bookingCheckOut ? new Date(bookingCheckOut).toLocaleDateString("vi-VN") : "Chưa chọn"}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Khách nghỉ:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {bookingAdults} NL
                        {bookingChildren > 0 && `, ${bookingChildren} TE`}
                        {bookingInfants > 0 && `, ${bookingInfants} EB`}
                      </span>
                    </div>

                    {/* Rooms List */}
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
                  {/* Dynamic Total Price */}
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

                  {/* Informational Warning Banner */}
                  <div className="bg-amber-50 border border-amber-250 p-3 rounded-lg text-[10px] text-amber-800 leading-relaxed font-medium">
                    * Giá ước tính trên tính theo số đêm lưu trú, chưa bao gồm phụ thu trẻ em, cuối tuần, ngày lễ hoặc dịch vụ xe đưa đón. Tư vấn viên TRAVEL sẽ liên hệ sớm nhất.
                  </div>

                  {/* Submission button on Desktop */}
                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={!bookingRoomsQty.some(q => q > 0)}
                    className={`hidden md:flex w-full py-4 text-xs uppercase tracking-widest font-bold rounded-lg transition-all duration-300 items-center justify-center gap-2 shadow-md ${
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
    </div>
  );
}
