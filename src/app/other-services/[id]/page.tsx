/* eslint-disable @next/next/no-img-element */
"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import { mockOtherServices } from "@/data/mockData";
import {
  Star,
  ChevronRight,
  Home,
  Compass,
  Car,
  Wifi,
  Ticket,
  Languages,
  CheckCircle2,
  Building2,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

// Helper function to map service attributes to icons
const getServiceIcon = (type: string) => {
  switch (type) {
    case "car": return <Car className="w-5 h-5 text-accent" />;
    case "sim": return <Wifi className="w-5 h-5 text-accent" />;
    case "guide": return <Languages className="w-5 h-5 text-accent" />;
    case "ticket": return <Ticket className="w-5 h-5 text-accent" />;
    default: return <Compass className="w-5 h-5 text-accent" />;
  }
};

export default function OtherServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  // Find current service
  const service = mockOtherServices.find((s) => s.id === serviceId);

  // States
  const [activeTab, setActiveTab] = useState<"policy" | "cancel">("policy");

  // Lightbox Modal States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Booking Form States
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [bookingQty, setBookingQty] = useState(1);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

  // Lock background scroll when lightbox or booking modal is open
  useEffect(() => {
    if (lightboxOpen || isBookingModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, isBookingModalOpen]);

  // Dynamic label configuration based on service type
  const typeLabels = useMemo(() => {
    if (!service) {
      return {
        typeName: "Dịch vụ",
        qtyLabel: "Số lượng",
        priceUnit: "",
        bookingHeader: "Đặt dịch vụ",
        notePlaceholder: "Các yêu cầu đặc biệt..."
      };
    }
    switch (service.type) {
      case "car":
        return {
          typeName: "Thuê xe đưa đón",
          qtyLabel: "Số vé / Số hành khách",
          priceUnit: "khách",
          bookingHeader: "Đặt xe đưa đón",
          notePlaceholder: "Ví dụ: Điểm đón cụ thể tại Hà Nội, giờ đón mong muốn..."
        };
      case "sim":
        return {
          typeName: "Sim du lịch",
          qtyLabel: "Số lượng SIM / eSIM",
          priceUnit: "SIM",
          bookingHeader: "Mua SIM / eSIM",
          notePlaceholder: "Ví dụ: Số lượng eSIM và SIM vật lý cần nhận..."
        };
      case "guide":
        return {
          typeName: "Hướng dẫn viên bản địa",
          qtyLabel: "Số ngày thuê",
          priceUnit: "ngày",
          bookingHeader: "Thuê hướng dẫn viên",
          notePlaceholder: "Ví dụ: Ngoại ngữ mong muốn (Anh, Trung, Hàn), số lượng đoàn..."
        };
      case "ticket":
        return {
          typeName: "Vé tham quan vui chơi",
          qtyLabel: "Số lượng vé",
          priceUnit: "vé",
          bookingHeader: "Đặt vé tham quan",
          notePlaceholder: "Ví dụ: Số lượng vé người lớn, trẻ em cao từ 1m - 1.4m..."
        };
      default:
        return {
          typeName: "Dịch vụ khác",
          qtyLabel: "Số lượng",
          priceUnit: "dịch vụ",
          bookingHeader: "Đặt dịch vụ",
          notePlaceholder: "Ví dụ: Các yêu cầu đặc biệt khác..."
        };
    }
  }, [service]);

  // Dynamic regulations based on service type
  const regulations = useMemo(() => {
    if (!service) return { policy: [], cancel: [] };
    if (service.type === "car") {
      return {
        policy: [
          "Vui lòng có mặt tại điểm đón trước ít nhất 15 phút so với giờ khởi hành.",
          "Mỗi khách được mang theo tối đa 1 vali cỡ vừa (dưới 20kg) và 1 túi xách tay nhỏ.",
          "Không mang thức ăn có mùi nặng, vật nuôi hoặc các chất cấm lên xe.",
          "Thông tin tài xế và biển số xe sẽ được gửi qua SMS/Zalo trước 2 tiếng khởi hành."
        ],
        cancel: [
          "Hủy trước 24 tiếng so với giờ xuất phát: Miễn phí hoàn hủy.",
          "Hủy từ 12 - 24 tiếng trước giờ xuất phát: Phí hủy là 50% tiền vé.",
          "Hủy dưới 12 tiếng hoặc không có mặt: Không hoàn trả chi phí đặt chỗ."
        ]
      };
    }
    if (service.type === "sim") {
      return {
        policy: [
          "SIM/eSIM chỉ sử dụng tại lãnh thổ Việt Nam và tự động kích hoạt sau khi quét QR hoặc lắp phôi SIM.",
          "Thiết bị điện thoại phải được mở khóa mạng (Unblocked/Global version) mới có thể sử dụng eSIM.",
          "Dữ liệu mạng được tính theo chu kỳ ngày (Reset lúc 00:00 hàng ngày).",
          "Nếu gặp sự cố kết nối, vui lòng liên hệ ngay với Hotline hỗ trợ in trên bao bì SIM để được hướng dẫn cấu hình APN."
        ],
        cancel: [
          "Kích hoạt online (eSIM): Không hỗ trợ đổi trả hoặc hoàn tiền sau khi mã QR đã được gửi đi.",
          "SIM vật lý: Được hỗ trợ hoàn hủy 100% nếu quý khách chưa nhận phôi SIM trực tiếp tại bến cảng."
        ]
      };
    }
    if (service.type === "guide") {
      return {
        policy: [
          "Thời gian làm việc tiêu chuẩn của Hướng dẫn viên là 8 tiếng/ngày (Kết thúc trước 21:00).",
          "Giá dịch vụ bao gồm chi phí đi lại của HDV trong khu vực nội thành Hạ Long/Vịnh.",
          "Quý khách vui lòng lo bữa ăn trưa cùng đoàn cho HDV hoặc phụ thu ăn trưa 150.000 VNĐ.",
          "Lịch trình tham quan chi tiết sẽ được HDV trao đổi trực tiếp với trưởng đoàn trước ngày khởi hành."
        ],
        cancel: [
          "Hủy dịch vụ trước 3 ngày khởi hành: Hoàn trả 100% tiền cọc.",
          "Hủy dịch vụ từ 1 - 3 ngày trước khởi hành: Phí hủy là 50% tổng chi phí dịch vụ.",
          "Hủy dịch vụ trong vòng 24 tiếng: Phí hủy là 100% tổng chi phí."
        ]
      };
    }
    // Default (ticket)
    return {
      policy: [
        "Vé điện tử (E-Ticket) sẽ được gửi qua Email hoặc Zalo của quý khách dưới dạng mã QR.",
        "Vé chỉ có giá trị sử dụng một lần duy nhất vào đúng ngày đăng ký tham quan.",
        "Vui lòng xuất trình mã QR trên điện thoại trực tiếp tại cổng soát vé, không cần đổi vé giấy.",
        "Trẻ em cao dưới 1m được miễn phí vé vào cổng tất cả các khu vui chơi."
      ],
      cancel: [
        "Vé vui chơi Sun World đã mua không được hoàn, hủy, thay đổi ngày sử dụng dưới mọi hình thức.",
        "Vui lòng cân nhắc kỹ ngày đi trước khi tiến hành thanh toán."
      ]
    };
  }, [service]);

  // Format currency
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại liên hệ.");
      return;
    }
    if (!bookingDate) {
      toast.error("Vui lòng chọn ngày sử dụng dịch vụ.");
      return;
    }
    if (bookingQty <= 0) {
      toast.error("Số lượng sử dụng không hợp lệ.");
      return;
    }

    toast.success("Gửi yêu cầu đặt dịch vụ thành công! TRAVEL sẽ liên hệ lại trong ít phút.");
    setIsBookingModalOpen(false);
    
    // Reset Form
    setBookingName("");
    setBookingPhone("");
    setBookingEmail("");
    setBookingNotes("");
    setBookingQty(1);
  };

  if (!service) {
    return (
      <>
        <Navbar solid />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
          <Building2 className="w-16 h-16 text-accent animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Không tìm thấy dịch vụ</h2>
          <p className="text-sm text-slate-500 mb-6">Đường dẫn không tồn tại hoặc dịch vụ đã ngừng kinh doanh.</p>
          <Link href="/other-services" className="px-6 py-2.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] text-xs uppercase tracking-widest font-bold rounded-full transition-all">
            Quay lại danh sách
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate total price estimated
  const estimatedTotal = service.price * bookingQty;

  // Render specifications box (EAV mapping) in vertical sidebar format
  const renderSpecs = () => {
    const attrs = service.attributes;
    return (
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          {getServiceIcon(service.type)}
          <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">Thông tin dịch vụ chi tiết</h3>
        </div>
        <div className="flex flex-col">
          {Object.entries(attrs).map(([key, val]) => {
            let label = key;
            if (key === "seats") label = "Số chỗ";
            else if (key === "carClass") label = "Hạng xe";
            else if (key === "highway") label = "Lộ trình di chuyển";
            else if (key === "carrier") label = "Nhà mạng hạ tầng";
            else if (key === "dataLimit") label = "Dung lượng 4G";
            else if (key === "validity") label = "Thời hạn sử dụng";
            else if (key === "activation") label = "Cách thức kích hoạt";
            else if (key === "languages") label = "Ngôn ngữ hướng dẫn";
            else if (key === "experience") label = "Kinh nghiệm HDV";
            else if (key === "certification") label = "Chứng chỉ hành nghề";
            else if (key === "maxGroupSize") label = "Đoàn khách tối đa";
            else if (key === "ticketType") label = "Loại vé điện tử";
            else if (key === "entryMethod") label = "Cách soát vé";
            else if (key === "includes" || key === "amenities") return null;

            return (
              <div key={key} className="flex justify-between py-2.5 border-b border-slate-100 text-xs items-center gap-4">
                <span className="text-slate-500 font-medium uppercase shrink-0">{label}</span>
                <span className="font-bold text-slate-800 text-right max-w-[200px] break-words">
                  {Array.isArray(val) ? val.join(", ") : String(val)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Average rating is 5.0 by default or custom
  const avgRating = service.rating.toFixed(1);

  // Suggestions of the same category (exclude current)
  const suggestedServices = mockOtherServices
    .filter((s) => s.id !== service.id && s.type === service.type)
    .slice(0, 3);

  return (
    <div className="w-full bg-white text-slate-800">
      <Navbar solid />

      <main className="flex-grow">
        {/* 1. HEADER SECTION */}
        <section className="bg-white pt-28 pb-6">
          <div className="max-w-7xl mx-auto px-6 space-y-4">
            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              <Link href="/" className="hover:text-[#001226] flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Trang chủ
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link href="/other-services" className="hover:text-[#001226]">Dịch vụ khác</Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-800">{service.name}</span>
            </div>

            {/* Title, Stars, Location */}
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h1 className="font-serif text-2xl md:text-4xl text-slate-900 tracking-wide font-normal">{service.name}</h1>
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${index < service.rating ? "fill-accent text-accent" : "text-slate-200"}`}
                    />
                  ))}
                  <span className="text-xs font-semibold text-slate-500 ml-2">({avgRating})</span>
                </div>
              </div>
              {/* Service Summary */}
              {service.summary && (
                <p className="text-slate-500 text-sm italic font-medium">
                  {service.summary}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* GALLERY GRID */}
        <section className="bg-white px-6 pb-6">
          <div className="max-w-7xl mx-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-auto md:h-[400px]">
              {/* Main large image */}
              <div
                className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-sm cursor-pointer aspect-video md:aspect-auto"
                onClick={() => {
                  setLightboxIdx(0);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={service.imageGallery[0]}
                  alt={`${service.name} 1`}
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
                    src={service.imageGallery[imgIdx] || service.imageGallery[0]}
                    alt={`${service.name} ${imgIdx + 1}`}
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
              <span className="text-slate-400">({service.imageGallery.length})</span>
            </button>
          </div>
        </section>

        {/* OVERVIEW & SPECS & BOOKING */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:gap-x-16 items-start">
            {/* 1. Description: Row 1, Col 1-2 on Desktop */}
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-accent">
                {typeLabels.typeName}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-slate-900 leading-tight">
                Chi tiết dịch vụ và tiện nghi đi kèm
              </h2>
              <p className="text-slate-650 text-sm md:text-base leading-relaxed font-sans font-light">
                {service.description}
              </p>
            </div>

            {/* 2. Sidebar (Price, CTA, Specs): Col 3, Row 1-2 on Desktop */}
            <div className="lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-36 w-full">
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-6 text-left">
                {/* Price Display */}
                <div className="border-b border-slate-100 pb-5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                    Đơn giá dịch vụ
                  </span>
                  <div className="text-3xl font-serif font-bold text-[#001226]">
                    {formatPrice(service.price)}
                  </div>
                  {service.originalPrice && (
                    <div className="text-xs text-slate-400 line-through mt-0.5">
                      {formatPrice(service.originalPrice)}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 block mt-1">
                    * Tính theo đơn vị 1 {typeLabels.priceUnit}
                  </span>
                </div>

                {/* Booking Modal Trigger CTA */}
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-4 bg-accent hover:bg-[#001226] text-[#001226] hover:text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 select-none border-none font-sans"
                >
                  {typeLabels.bookingHeader.toUpperCase()}
                </button>

                {/* Specifications box (rendered vertically in sidebar) */}
                {renderSpecs()}
              </div>
            </div>

            {/* 3. Regulations Section: Row 2, Col 1-2 on Desktop */}
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 space-y-6 border-t border-slate-100 pt-10">
              <h3 className="font-serif text-lg font-bold text-slate-900 uppercase">QUY ĐỊNH CHUNG & CHÍNH SÁCH</h3>
              
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-150 p-4 space-y-1">
                  <button
                    onClick={() => setActiveTab("policy")}
                    className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeTab === "policy"
                        ? "bg-[#001226] text-white shadow-sm"
                        : "text-slate-655 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>Quy định sử dụng</span>
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

                <div className="w-full md:w-2/3 p-6 min-h-[200px] bg-white text-left">
                  <ul className="space-y-4">
                    {regulations[activeTab].map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUGGESTED SERVICES */}
        {suggestedServices.length > 0 && (
          <section className="py-16 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6 space-y-8">
              <h3 className="font-serif text-xl md:text-2xl text-slate-900 text-left uppercase tracking-wide">
                CÁC DỊCH VỤ TƯƠNG TỰ KHÁC
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {suggestedServices.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-250 shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/other-services/${item.id}`} className="block relative aspect-[16/10] overflow-hidden group">
                      <img
                        src={item.imageGallery[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-[#001226]/80 backdrop-blur-sm text-white text-[9px] uppercase tracking-wider font-semibold px-2.5 py-0.5 border border-white/10 rounded-full">
                        {typeLabels.typeName}
                      </span>
                    </Link>
                    <div className="p-5 text-left space-y-3">
                      <h4 className="font-serif text-base font-bold text-slate-900 line-clamp-1 hover:text-accent transition-colors">
                        <Link href={`/other-services/${item.id}`}>{item.name}</Link>
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Đơn giá từ</span>
                          <span className="font-serif text-sm font-bold text-slate-900">{formatPrice(item.price)}</span>
                        </div>
                        <Link
                          href={`/other-services/${item.id}`}
                          className="px-4 py-1.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] text-[10px] uppercase tracking-wider font-bold rounded-full transition-all"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Lightbox for Gallery */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={service.imageGallery}
        initialIndex={lightboxIdx}
        title={service.name}
        location={undefined}
        stars={service.rating}
      />

      {/* Booking Modal Popup */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            {/* Dark glassmorphic backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 text-slate-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-650 rounded-full hover:bg-slate-50 transition-colors z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-6 text-left">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-extrabold text-accent block mb-1">
                    {typeLabels.typeName}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                    {typeLabels.bookingHeader}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    Sản phẩm: {service.name}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Date & Quantity side-by-side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Select Date */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Ngày sử dụng *
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-md focus:outline-none focus:border-accent text-slate-700 font-medium h-[38px]"
                        required
                      />
                    </div>

                    {/* Select Quantity */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {typeLabels.qtyLabel} *
                      </label>
                      <div className="flex items-center gap-2 h-[38px]">
                        <button
                          type="button"
                          onClick={() => setBookingQty(q => Math.max(1, q - 1))}
                          className="w-9 h-9 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center font-bold text-slate-700 cursor-pointer flex-shrink-0"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={bookingQty}
                          onChange={(e) => setBookingQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full h-9 bg-slate-50 border border-slate-200 text-xs text-center rounded-md focus:outline-none focus:border-accent text-slate-700 font-bold min-w-0"
                        />
                        <button
                          type="button"
                          onClick={() => setBookingQty(q => q + 1)}
                          className="w-9 h-9 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center font-bold text-slate-700 cursor-pointer flex-shrink-0"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Billing Estimation */}
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-md space-y-2 text-xs">
                    <div className="flex justify-between font-medium text-slate-500">
                      <span>Đơn giá:</span>
                      <span>{formatPrice(service.price)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-500">
                      <span>Số lượng:</span>
                      <span>{bookingQty} x {typeLabels.priceUnit}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#001226] text-sm pt-2 border-t border-slate-200">
                      <span>Tổng tiền ước tính:</span>
                      <span className="text-base text-accent-dark">{formatPrice(estimatedTotal)}</span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    {/* Name & Phone side-by-side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-md focus:outline-none focus:border-accent text-slate-700"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Số điện thoại liên hệ (Zalo) *
                        </label>
                        <input
                          type="tel"
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="0912xxxxxx"
                          className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-md focus:outline-none focus:border-accent text-slate-700"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-md focus:outline-none focus:border-accent text-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Ghi chú yêu cầu
                      </label>
                      <textarea
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder={typeLabels.notePlaceholder}
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-md focus:outline-none focus:border-accent text-slate-700 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 mt-2 bg-accent hover:bg-[#001226] text-[#001226] hover:text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-md cursor-pointer"
                  >
                    GỬI YÊU CẦU ĐẶT DỊCH VỤ
                  </button>
                </form>

                {/* Estimate Warning */}
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * Báo giá trên mang tính chất tham khảo tạm tính. Tư vấn viên của TRAVEL sẽ liên hệ xác nhận tình trạng khả dụng và gửi hóa đơn chính thức kèm ưu đãi (nếu có).
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
