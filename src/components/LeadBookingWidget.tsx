"use client";

import React, { useState, useEffect } from "react";
import { Calendar, User, Phone, Mail, Compass, Luggage } from "lucide-react";
import { mockCombos, mockCruises } from "@/data/mockData";
import toast from "react-hot-toast";

// Khai báo kiểu Props cho component form độc lập
interface BookingFormProps {
  selectedComboId: string;
  onComboChange: (comboId: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  associatedCruise?: { startDates: string[] };
  currentCombo: {
    salePrice: number;
    patternOptions: { hotelStayBeforeDays: number };
  };
  checkIn: string;
  checkOut: string;
  fullName: string;
  setFullName: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  emailAddress: string;
  setEmailAddress: (val: string) => void;
  captchaChecked: boolean;
  setCaptchaChecked: (val: boolean) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  formatPrice: (value: number) => string;
  formatDateVi: (dateStr: string) => string;
}

// Tách FormContent thành component BookingForm bên ngoài
function BookingForm({
  selectedComboId,
  onComboChange,
  selectedDate,
  onDateChange,
  associatedCruise,
  currentCombo,
  checkIn,
  checkOut,
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  emailAddress,
  setEmailAddress,
  captchaChecked,
  setCaptchaChecked,
  loading,
  handleSubmit,
  formatPrice,
  formatDateVi,
}: BookingFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Selection */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold block">
          Gói combo đã chọn
        </label>
        <select
          value={selectedComboId}
          onChange={(e) => onComboChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-sm p-3 focus:border-accent focus:outline-none transition-all duration-300"
        >
          {mockCombos.map((combo) => (
            <option key={combo.id} value={combo.id}>
              {combo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Date Configuration */}
      <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 space-y-2">
        <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
          <span className="text-slate-600 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            Chọn ngày khởi hành:
          </span>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent border-none text-accent font-semibold focus:outline-none cursor-pointer"
          >
            {associatedCruise?.startDates.map((date) => (
              <option key={date} value={date} className="bg-white text-slate-800">
                {formatDateVi(date)}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Hotel Mapping Display */}
        <div className="grid grid-cols-2 gap-4 pt-1 text-[11px]">
          <div>
            <span className="text-slate-500 block">Check-in Khách sạn:</span>
            <span className="text-slate-800 font-semibold">{checkIn || "N/A"}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Check-out Khách sạn:</span>
            <span className="text-slate-800 font-semibold">{checkOut || "N/A"}</span>
          </div>
        </div>

        {/* Dynamic info helper */}
        <div className="text-[10px] text-accent-dark italic flex items-center gap-1 mt-1 border-t border-slate-200 pt-1">
          <Luggage className="w-3 h-3 text-accent-dark flex-shrink-0" />
          <span>Bao gồm {currentCombo.patternOptions.hotelStayBeforeDays} đêm nghỉ dưỡng trước khi lên tàu.</span>
        </div>
      </div>

      {/* Guest Details */}
      <div className="space-y-3">
        <div className="relative">
          <User className="absolute left-3 top-3 w-4 h-4 text-accent/80" />
          <input
            type="text"
            required
            placeholder="Họ và tên của quý khách *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-sm pl-10 pr-4 py-3 focus:border-accent focus:outline-none transition-all duration-300"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 w-4 h-4 text-accent/80" />
          <input
            type="tel"
            required
            placeholder="Số điện thoại di động *"
            value={fullName ? phoneNumber : ""} // Tránh cảnh báo nếu reset
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-sm pl-10 pr-4 py-3 focus:border-accent focus:outline-none transition-all duration-300"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-accent/80" />
          <input
            type="email"
            required
            placeholder="Địa chỉ Email nhận báo giá *"
            value={fullName ? emailAddress : ""}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-sm pl-10 pr-4 py-3 focus:border-accent focus:outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Fake CAPTCHA */}
      <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 p-3 rounded-sm">
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-600">
          <input
            type="checkbox"
            checked={captchaChecked}
            onChange={(e) => setCaptchaChecked(e.target.checked)}
            className="w-4 h-4 accent-accent rounded border-slate-200 bg-white cursor-pointer focus:ring-0 focus:ring-offset-0"
          />
          <span>Tôi đồng ý bảo mật và xác minh tôi là con người.</span>
        </label>
      </div>

      {/* Quote summary */}
      <div className="border-t border-slate-200 pt-3 mt-2 flex items-center justify-between text-xs">
        <span className="text-slate-500">Giá combo ước tính:</span>
        <span className="text-sm font-bold text-accent-dark">
          {formatPrice(currentCombo.salePrice)}
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] transition-all duration-300 font-semibold text-xs uppercase tracking-[0.2em] rounded-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,18,38,0.15)] border border-[#001226]"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ĐANG GỬI YÊU CẦU...
          </>
        ) : (
          "ĐĂNG KÝ TƯ VẤN NGAY"
        )}
      </button>
    </form>
  );
}

export default function LeadBookingWidget() {
  const [loading, setLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedComboId, setSelectedComboId] = useState(mockCombos[0].id);
  const [selectedDate, setSelectedDate] = useState(() => {
    const initialCombo = mockCombos[0];
    const initialCruise = mockCruises.find((c) => c.id === initialCombo.cruiseId);
    return initialCruise?.startDates[0] || "";
  });
  const [captchaChecked, setCaptchaChecked] = useState(false);

  // Dynamic values
  const currentCombo = mockCombos.find((c) => c.id === selectedComboId) || mockCombos[0];
  const associatedCruise = mockCruises.find((c) => c.id === currentCombo.cruiseId);

  // Xử lý đổi combo và tự cập nhật ngày đi
  const handleComboChange = (comboId: string) => {
    setSelectedComboId(comboId);
    const combo = mockCombos.find((c) => c.id === comboId);
    if (combo) {
      const cruise = mockCruises.find((c) => c.id === combo.cruiseId);
      if (cruise && cruise.startDates.length > 0) {
        setSelectedDate(cruise.startDates[0]);
      }
    }
  };

  // Lắng nghe sự kiện click chọn sản phẩm từ các ProductCard
  useEffect(() => {
    const handleSelectProduct = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { id, type } = customEvent.detail;
      
      let targetComboId = selectedComboId;
      if (type === "combo") {
        targetComboId = id;
      } else if (type === "cruise") {
        const matchedCombo = mockCombos.find((c) => c.cruiseId === id);
        if (matchedCombo) {
          targetComboId = matchedCombo.id;
        }
      } else if (type === "hotel") {
        const matchedCombo = mockCombos.find((c) => c.hotelId === id);
        if (matchedCombo) {
          targetComboId = matchedCombo.id;
        }
      }
      
      setSelectedComboId(targetComboId);
      
      const matchedComboObj = mockCombos.find((c) => c.id === targetComboId);
      if (matchedComboObj) {
        const cruise = mockCruises.find((c) => c.id === matchedComboObj.cruiseId);
        if (cruise && cruise.startDates.length > 0) {
          setSelectedDate(cruise.startDates[0]);
        }
      }
    };

    window.addEventListener("select-product", handleSelectProduct);
    return () => window.removeEventListener("select-product", handleSelectProduct);
  }, [selectedComboId]);

  // Định dạng ngày hiển thị
  const formatDateVi = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Tính toán động ngày Check-in và Check-out của khách sạn
  const getHotelDates = () => {
    if (!selectedDate || !currentCombo) return { checkIn: "", checkOut: "" };

    const cruiseDate = new Date(selectedDate);
    const beforeDays = currentCombo.patternOptions.hotelStayBeforeDays;
    
    const checkInDate = new Date(cruiseDate);
    checkInDate.setDate(cruiseDate.getDate() - beforeDays);

    const checkOutDate = new Date(cruiseDate);

    return {
      checkIn: checkInDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      checkOut: checkOutDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
  };

  const { checkIn, checkOut } = getHotelDates();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phoneNumber || !emailAddress) {
      toast.error("Vui lòng điền đầy đủ các thông tin cá nhân bắt buộc.");
      return;
    }

    if (!captchaChecked) {
      toast.error("Vui lòng hoàn thành xác nhận CAPTCHA bảo mật.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success(
        "Hệ thống đã nhận được yêu cầu của quý khách! Nhân viên tư vấn sẽ liên hệ lại trong vòng 15 phút."
      );
      setFullName("");
      setPhoneNumber("");
      setEmailAddress("");
      setCaptchaChecked(false);
    }, 1000);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div id="lead-booking-widget" className="w-full">
      {/* DESKTOP VIEW: STICKY PANEL */}
      <div className="hidden lg:block sticky top-24 bg-white border border-slate-200 p-6 rounded-sm shadow-xl space-y-6">
        <div className="text-center space-y-1.5 border-b border-slate-200 pb-4">
          <h3 className="font-serif text-lg font-semibold text-slate-800 tracking-wide flex items-center justify-center gap-2">
            <Compass className="w-5 h-5 text-accent animate-pulse" />
            YÊU CẦU BÁO GIÁ
          </h3>
          <p className="text-xs text-slate-500">
            Hành trình khám phá đang đợi quý khách. Hãy để lại thông tin tư vấn.
          </p>
        </div>

        <BookingForm
          selectedComboId={selectedComboId}
          onComboChange={handleComboChange}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          associatedCruise={associatedCruise}
          currentCombo={currentCombo}
          checkIn={checkIn}
          checkOut={checkOut}
          fullName={fullName}
          setFullName={setFullName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          emailAddress={emailAddress}
          setEmailAddress={setEmailAddress}
          captchaChecked={captchaChecked}
          setCaptchaChecked={setCaptchaChecked}
          loading={loading}
          handleSubmit={handleSubmit}
          formatPrice={formatPrice}
          formatDateVi={formatDateVi}
        />
      </div>
    </div>
  );
}
