/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CrossReviewSection from "@/components/CrossReviewSection";
import SearchWidget from "@/components/SearchWidget";
import { mockCruises, mockHotels, mockCombos } from "@/data/mockData";
import { ChevronRight, ChevronLeft, ArrowUpRight, ThumbsUp, Tag, Gift, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LatestBlogs from "@/components/LatestBlogs";
import PromoModal from "@/components/PromoModal";

interface DisplayProduct {
  id: string;
  type: "cruise" | "hotel" | "combo" | "restaurant";
  name: string;
  tagline?: string;
  image: string;
  stars: number;
  badge?: string;
  price?: number;
  originalPrice?: number;
  durationDays?: number;
  location?: string;
  amenities?: string[];
  category?: string;
}

const heroSlides = [
  {
    image: "https://bizweb.dktcdn.net/100/512/250/files/z5612772745864-db8d77ba6a138198d44a9b4698430268-optimized.jpg?v=1720420645713",
    title: "Combo Trải Nghiệm\n& Tour Trọn Gói Tiết Kiệm",
    description: "Sự kết hợp tuyệt vời giữa hành trình du ngoạn du thuyền và nghỉ dưỡng tiện nghi tại vịnh biển Hạ Long với mức giá ưu đãi nhất.",
  },
  {
    image: "https://cdn3.ivivu.com/2023/11/du-lich-ha-long-ivivu.jpg",
    title: "Tinh Hoa Di Sản\n& Nghệ Thuật Đông Dương",
    description: "Khám phá Vịnh Hạ Long kỳ vĩ cùng các du thuyền di sản mang phong cách kiến trúc hoài niệm thân thuộc.",
  },
  {
    image: "https://tourdulichvinhhalong.com.vn/wp-content/uploads/2025/05/anh-1-4-16279776696801576903300.jpg",
    title: "Trải Nghiệm Kỳ Quan\nNghỉ Dưỡng Trọn Vẹn",
    description: "Trải nghiệm những hải trình đáng nhớ trên các du thuyền cao cấp và kỳ nghỉ dưỡng thoải mái tại các resort, khách sạn tiện nghi hướng vịnh.",
  },
];

const serviceCategories = [
  {
    thumbnail: "https://dulichviet.com.vn/images/bandidau/nen-chon-du-thuyen-nao-khi-di-du-lich-ha-long.jpg",
    title: "Du Thuyền Cao Cấp",
    subtitle: "Trải nghiệm kỳ quan Hạ Long trên những du thuyền hiện đại và sang trọng.",
    path: "/stays?category=cruise",
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
    title: "Khách Sạn & Resort",
    subtitle: "Khu nghỉ dưỡng sang trọng bên vịnh biển biệt lập, tiện ích chuẩn quốc tế.",
    path: "/stays?category=hotel",
  },
  {
    thumbnail: "https://digiticket.vn/blog/wp-content/uploads/2022/02/villa-ha-long-1.jpg",
    title: "Biệt Thự & Villa",
    subtitle: "Không gian nghỉ ngơi riêng tư, tiện nghi dành riêng cho gia đình và nhóm bạn.",
    path: "/stays?category=villa",
  },
  {
    thumbnail: "https://static.vinwonders.com/production/nha-hang-ha-long-2.jpg",
    title: "Nhà Hàng & Ẩm Thực",
    subtitle: "Thưởng thức hải sản tươi ngon độc bản và ẩm thực tinh tế mang hương vị biển khơi.",
    path: "/dining-culture?category=restaurant",
  },
];

const serviceSlides = [
  {
    title: "Du Thuyền Cao Cấp",
    description: "Đội tàu du thuyền hiện đại, mang đến những hải trình đáng nhớ ngắm nhìn toàn cảnh vịnh kỳ quan từ ban công riêng tư.",
    image: "https://dulichviet.com.vn/images/bandidau/nen-chon-du-thuyen-nao-khi-di-du-lich-ha-long.jpg",
  },
  {
    title: "Khách Sạn & Resort Biệt Lập",
    description: "Hệ thống khách sạn và resort sát biển đầy đủ tiện nghi, mang lại kỳ nghỉ thoải mái và ấm cúng cho cả gia đình.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200",
  },
  {
    title: "Trải Nghiệm Ẩm Thực Hấp Dẫn",
    description: "Thưởng thức tiệc buffet tôm hùm hấp dẫn cùng các món ăn hải sản đa dạng, mang đến hương vị tươi ngon đặc sắc bên bờ vịnh.",
    image: "https://static.vinwonders.com/production/nha-hang-ha-long-2.jpg",
  },
  {
    title: "Villa & Biệt Thự Sát Biển",
    description: "Không gian rộng rãi với tầm nhìn hướng vịnh, các biệt thự 3-4 phòng ngủ có hồ bơi riêng là lựa chọn lý tưởng cho các gia đình và nhóm bạn.",
    image: "https://digiticket.vn/blog/wp-content/uploads/2022/02/villa-ha-long-1.jpg",
  },
];

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);



  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentServiceSlide((prev: number) => (prev + 1) % serviceSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const hotDeals: DisplayProduct[] = [
    // Combos
    ...mockCombos.filter(cb => cb.isHotDeal).map(cb => ({
      id: cb.id,
      type: "combo" as const,
      name: cb.name,
      tagline: cb.tagline,
      image: mockCruises.find(c => c.id === cb.cruiseId)?.imageGallery[0] || mockCruises[0].imageGallery[0],
      stars: 5,
      price: cb.salePrice,
      originalPrice: cb.netPrice,
      location: "Hạ Long, Quảng Ninh",
      amenities: ["Bao gồm du thuyền & resort 5 sao", "Cano đưa đón riêng", "Liệu trình Spa"],
      category: cb.category,
    })),
    // Cruises
    ...mockCruises.filter(c => c.isHotDeal).map(c => ({
      id: c.id,
      type: "cruise" as const,
      name: c.name,
      tagline: c.tagline,
      image: c.imageGallery[0],
      stars: c.stars,
      price: c.priceFrom,
      originalPrice: c.originalPrice,
      durationDays: c.durationDays,
      location: c.destinations[0],
      amenities: c.amenities,
      category: c.category,
    })),
    // Hotels, Villas, Restaurants, Homestays
    ...mockHotels.filter(h => h.isHotDeal).map(h => ({
      id: h.id,
      type: h.category === "restaurant" ? ("restaurant" as const) : ("hotel" as const),
      name: h.name,
      tagline: h.description, // Dùng description làm tagline ngắn gọn
      image: h.imageGallery[0],
      stars: h.stars,
      price: h.priceFrom || h.roomTypes[0]?.pricePerNight,
      originalPrice: h.originalPrice,
      location: h.location,
      amenities: h.amenities,
      category: h.category,
    }))
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-0 bg-white">
        {/* HERO SECTION - TIGHTER HEIGHT & OVERLAPPING SEARCH BAR */}
        <section className="relative h-[68vh] w-full flex items-center justify-center overflow-visible mb-16 md:mb-20">
          {/* Hero background images slideshow (overflow-hidden & rounded bottom) */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-b-[2rem] md:rounded-b-[4.5rem] shadow-xl">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentSlide}
                src={heroSlides[currentSlide].image}
                alt="Luxury Ha Long Experience"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 object-cover w-full h-full scale-105"
              />
            </AnimatePresence>
            {/* Overlay gradients for readability */}
            <div className="absolute inset-0 bg-black/30 z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35 z-[1]" />
          </div>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-6 w-full z-10 text-center flex flex-col justify-center h-full pt-12 pb-16 relative">
            {/* Slide Text Container (Centered in remaining height) */}
            <div className="max-w-3xl mx-auto space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <h1 className="font-serif text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-wide drop-shadow-lg whitespace-pre-line">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-sm md:text-base text-slate-100 font-light leading-relaxed tracking-wider max-w-2xl mx-auto drop-shadow-sm">
                    {heroSlides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* FLOATING QUICK SEARCH BAR (Absolute positioned overlapping bottom edge) */}
            <motion.div
              initial={{ opacity: 0, y: 25, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-0 left-1/2 w-full max-w-6xl z-20 px-6 md:px-0 flex flex-col items-center"
            >
              {/* Quick suggestion tags to make search area stand out */}
              <div className="md:flex hidden flex-wrap items-center justify-center gap-3 text-xs text-white/95 font-semibold backdrop-blur-md bg-slate-900/40 px-5 py-2 translate-y-1/2 rounded-full border border-white/15 shadow-xl select-none">
                <span className="text-[10px] uppercase tracking-widest text-accent font-extrabold">Gợi ý tìm kiếm:</span>
                <Link href="/stays?category=cruise" className="hover:text-accent text-white transition-colors duration-300">#Du thuyền 5 sao</Link>
                <span className="text-white/20">|</span>
                <Link href="/stays?category=hotel" className="hover:text-accent text-white transition-colors duration-300">#Khách sạn sang trọng</Link>
                <span className="text-white/20">|</span>
                <Link href="/stays?category=villa" className="hover:text-accent text-white transition-colors duration-300">#Villa sát biển</Link>
                <span className="text-white/20">|</span>
                <Link href="/dining-culture?category=restaurant" className="hover:text-accent text-white transition-colors duration-300">#Nhà hàng hải sản</Link>
              </div>
              <div className="w-full translate-y-1/2">
                <SearchWidget />
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUST POLICIES SECTION */}
        <section id="trust-policies" className="bg-white pb-6 md:pb-8 pt-28 md:pt-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-slate-50 border border-slate-100/80 rounded-3xl p-6 md:p-10 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5 flex-shrink-0">
                  <ThumbsUp className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-slate-900 font-semibold tracking-wide text-sm md:text-base">Chọn lọc chất lượng</h4>
                  <p className="text-[11.5px] md:text-sm text-slate-600 leading-relaxed">
                    Chỉ tuyển chọn các dịch vụ lưu trú, ẩm thực và du thuyền chất lượng hàng đầu tại Hạ Long.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5 flex-shrink-0">
                  <Tag className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-slate-900 font-semibold tracking-wide text-sm md:text-base">Cam kết giá tốt nhất</h4>
                  <p className="text-[11.5px] md:text-sm text-slate-600 leading-relaxed">
                    Đảm bảo mức giá tốt nhất thị trường và sẵn sàng khớp giá nếu có nơi rẻ hơn.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5 flex-shrink-0">
                  <Gift className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-slate-900 font-semibold tracking-wide text-sm md:text-base">Nhiều ưu đãi đi kèm</h4>
                  <p className="text-[11.5px] md:text-sm text-slate-600 leading-relaxed">
                    Nhận thêm nhiều quà tặng và voucher dịch vụ đi kèm độc quyền khi đặt phòng/du thuyền.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5 flex-shrink-0">
                  <PhoneCall className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-slate-900 font-semibold tracking-wide text-sm md:text-base">Hỗ trợ 24/7</h4>
                  <p className="text-[11.5px] md:text-sm text-slate-600 leading-relaxed">
                    Chuyên viên am hiểu địa phương hỗ trợ tận tình qua hotline và Zalo 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CURATED HOT DEALS SECTION */}
        <section id="hot-deal" className="py-24 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="text-center md:text-left space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
                  KHUYẾN MÃI ĐỘC QUYỀN
                </span>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
                  SIÊU ƯU ĐÃI HẠ LONG
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Khám phá các combo nghỉ dưỡng và dịch vụ cao cấp với mức giá ưu đãi tốt nhất trong ngày
                </p>
              </div>
              <div className="flex justify-center md:justify-end shrink-0">
                <button
                  onClick={() => router.push("/hot-deal")}
                  className="px-6 py-2.5 bg-white hover:bg-slate-900 border border-slate-300 hover:border-slate-900 text-slate-700 hover:text-white font-bold text-[11px] uppercase tracking-[0.15em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-xs hover:shadow hover:scale-[1.01] cursor-pointer"
                >
                  <span>Xem tất cả</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotDeals.slice(0, 30).map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard
                    id={product.id}
                    type={product.type}
                    name={product.name}
                    tagline={product.tagline}
                    image={product.image}
                    stars={product.stars}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    durationDays={product.durationDays}
                    location={product.location}
                    amenities={product.amenities}
                    category={product.category}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES INTRO SECTION */}
        <section id="services-intro" className="py-24 bg-[#fdfbf7] text-slate-850">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Text & Controls */}
              <div className="lg:col-span-5 flex flex-col justify-between min-h-[350px] space-y-8">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
                    DỊCH VỤ CỦA TRAVEL
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentServiceSlide}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
                        {serviceSlides[currentServiceSlide].title}
                      </h2>
                      <p className="text-slate-650 text-sm md:text-base leading-relaxed font-sans font-light pt-2">
                        {serviceSlides[currentServiceSlide].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Controls: Dots and Arrows */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                  {/* Dots (Bottom-left) */}
                  <div className="flex items-center gap-1.5">
                    {serviceSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentServiceSlide(index)}
                        className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                          index === currentServiceSlide ? "w-6 bg-slate-800" : "w-1.5 bg-slate-300 hover:bg-slate-500"
                        }`}
                        aria-label={`Go to service ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Circular Arrows (Bottom-right) */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() =>
                        setCurrentServiceSlide(
                          (prev: number) => (prev - 1 + serviceSlides.length) % serviceSlides.length
                        )
                      }
                      className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-650 hover:text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                      aria-label="Previous service"
                    >
                      <ChevronLeft className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentServiceSlide((prev: number) => (prev + 1) % serviceSlides.length)
                      }
                      className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-650 hover:text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                      aria-label="Next service"
                    >
                      <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Image slider */}
              <div className="lg:col-span-7">
                <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-2xl shadow-xl relative bg-slate-100">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentServiceSlide}
                      src={serviceSlides[currentServiceSlide].image}
                      alt={serviceSlides[currentServiceSlide].title}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DUAL-TAB CROSS REVIEWS SECTION - WITH LIGHT TEAL WAVE BACKGROUND */}
        <section className="py-24 bg-teal-50/30 bg-wave-pattern border-t border-b border-teal-100/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
                KHÁCH HÀNG PHẢN HỒI
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
                TRẢI NGHIỆM THỰC TẾ
              </h2>
            </div>

            <CrossReviewSection />
          </div>
        </section>

        {/* EXPLORE BY SERVICE CATEGORY SECTION */}
        <section className="py-24 bg-white text-slate-850">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
                DỊCH VỤ CỦA CHÚNG TÔI
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
                KHÁM PHÁ THEO LOẠI HÌNH
              </h2>
            </div>

            {/* 4-card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {serviceCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => router.push(category.path)}
                  className="group cursor-pointer text-center space-y-4"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-md border border-slate-100/80 bg-slate-900 relative">
                    <img
                      src={category.thumbnail}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="space-y-1.5 px-2">
                    <h3 className="font-serif text-base text-slate-950 font-semibold group-hover:text-accent transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-2">
                      {category.subtitle}
                    </p>
                    <span className="text-[10px] text-accent uppercase tracking-widest font-bold block pt-1 group-hover:underline">
                      Khám phá ngay &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNERS SECTION - UNIQUE DESIGN */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50/50 bg-wave-pattern border-t border-b border-slate-100/80">
          <div className="max-w-7xl mx-auto px-6 space-y-12 text-center">
            {/* Centered Distinct Header */}
            <div className="max-w-3xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
                ĐỐI TÁC
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
                CÁC HÃNG DU THUYỀN LỚN
              </h2>
            </div>

            {/* Balanced Grid of Standalone SVGs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-12 md:gap-x-16 gap-y-12 items-center justify-items-center opacity-75 pt-6">
              {/* Partner 1: Stellar of the Seas */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <circle cx="20" cy="25" r="3" />
                  <circle cx="26" cy="19" r="2" />
                  <circle cx="32" cy="25" r="3" />
                  <circle cx="26" cy="31" r="2" />
                  <circle cx="14" cy="25" r="2" />
                  <circle cx="26" cy="13" r="2" />
                  <circle cx="38" cy="25" r="2" />
                  <circle cx="26" cy="37" r="2" />
                  <text x="48" y="24" className="font-serif text-xs font-bold tracking-[0.1em]">STELLAR</text>
                  <text x="48" y="34" className="font-sans text-[7.5px] tracking-[0.2em] font-medium">OF THE SEAS</text>
                </svg>
              </div>

              {/* Partner 2: Genesis */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M15 35 L17 18 L24 28 L31 18 L33 35 Z M20 15 A 2 2 0 1 1 20 11 A 2 2 0 1 1 20 15 M30 15 A 2 2 0 1 1 30 11 A 2 2 0 1 1 30 15" />
                  <text x="45" y="26" className="font-serif text-xs font-bold tracking-[0.15em]">GENESIS</text>
                  <text x="45" y="35" className="font-sans text-[7.5px] tracking-[0.3em] font-medium">REGAL</text>
                </svg>
              </div>

              {/* Partner 3: Paradise Vietnam */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M15 35 C 15 22, 25 15, 35 15 C 30 25, 20 30, 15 35 M22 35 C 22 26, 28 20, 35 20 C 32 28, 26 32, 22 35" />
                  <text x="45" y="24" className="font-serif text-[10px] font-bold tracking-[0.1em]">PARADISE</text>
                  <text x="45" y="34" className="font-sans text-[7.5px] tracking-[0.2em] font-bold">VIETNAM</text>
                </svg>
              </div>

              {/* Partner 4: Capella Cruise */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M12 28 L35 28 L28 15 Z M10 32 L37 32 C 34 35, 25 35, 12 32" />
                  <text x="45" y="25" className="font-serif text-xs font-bold tracking-[0.1em]">CAPELLA</text>
                  <text x="45" y="34" className="font-sans text-[7px] tracking-[0.3em] font-medium">CRUISE</text>
                </svg>
              </div>

              {/* Partner 5: Bhaya */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M15 20 Q 20 15, 25 20 T 35 20 M15 27 Q 20 22, 25 27 T 35 27 M15 34 Q 20 29, 25 34 T 35 34" fill="none" stroke="currentColor" strokeWidth="2" />
                  <text x="45" y="27" className="font-serif text-sm font-bold italic tracking-wide">Bhaya</text>
                  <text x="45" y="36" className="font-sans text-[7px] tracking-[0.25em] font-medium">THE CRUISE CO.</text>
                </svg>
              </div>

              {/* Partner 6: Rosy Cruise */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M25 15 L33 22 L25 35 L17 22 Z M25 18 L29 23 L25 30 L21 23 Z" />
                  <text x="45" y="25" className="font-serif text-xs font-bold tracking-[0.1em]">ROSY CRUISE</text>
                  <text x="45" y="34" className="font-sans text-[7px] tracking-[0.25em] font-medium">HALONG - LANHA</text>
                </svg>
              </div>

              {/* Partner 7: Heritage */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <rect x="15" y="15" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <text x="21" y="29" className="font-serif text-[10px] font-bold">H</text>
                  <text x="45" y="24" className="font-serif text-xs font-bold tracking-[0.15em]">HERITAGE</text>
                  <text x="45" y="34" className="font-sans text-[7px] tracking-[0.3em] font-medium">CRUISES</text>
                </svg>
              </div>

              {/* Partner 8: Catherine */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M15 25 C15 15, 30 15, 30 25 C30 35, 15 35, 15 25 M20 25 L25 25" fill="none" stroke="currentColor" strokeWidth="2" />
                  <text x="42" y="25" className="font-serif text-xs font-bold tracking-[0.1em]">CATHERINE</text>
                  <text x="42" y="34" className="font-sans text-[7px] tracking-[0.2em] font-medium">LUXURY CRUISE</text>
                </svg>
              </div>

              {/* Partner 9: Scarlet Pearl */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M25 15 C 20 25, 20 35, 32 32 C 22 30, 22 20, 25 15 Z" />
                  <circle cx="28" cy="26" r="3.5" />
                  <text x="45" y="24" className="font-serif text-xs font-bold tracking-[0.1em]">SCARLET</text>
                  <text x="45" y="34" className="font-sans text-[7.5px] tracking-[0.2em] font-bold">PEARL</text>
                </svg>
              </div>

              {/* Partner 10: Ambassador */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M25 12 L35 17 L35 28 C 35 34, 25 38, 25 38 C 25 38, 15 34, 15 28 L15 17 Z M25 17 L20 28 L23 28 L25 22 L27 28 L30 28 Z" />
                  <text x="45" y="23" className="font-serif text-[10px] font-bold tracking-[0.1em]">AMBASSADOR</text>
                  <text x="45" y="33" className="font-sans text-[7.5px] tracking-[0.25em] font-medium">CRUISE</text>
                </svg>
              </div>

              {/* Partner 11: Essence Grand */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M12 20 Q 20 15, 28 20 T 44 20 M12 27 Q 20 22, 28 27 T 44 27 M12 34 Q 20 29, 28 34 T 44 34" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <text x="50" y="24" className="font-serif text-xs font-bold tracking-[0.1em]">ESSENCE</text>
                  <text x="50" y="34" className="font-sans text-[7.5px] tracking-[0.2em] font-bold">GRAND</text>
                </svg>
              </div>

              {/* Partner 12: Indochina Sails */}
              <div className="hover:opacity-100 transition-all duration-300 flex flex-col items-center select-none text-slate-550 hover:text-accent hover:scale-105 transform">
                <svg className="w-42 h-14" viewBox="0 0 150 50" fill="currentColor">
                  <path d="M12 32 L38 32 C35 36, 15 36, 12 32 M15 28 L23 12 L26 28 M28 28 L33 15 L36 28" />
                  <text x="45" y="24" className="font-serif text-[10px] font-bold tracking-[0.05em]">INDOCHINA</text>
                  <text x="45" y="34" className="font-sans text-[7.5px] tracking-[0.2em] font-medium">SAILS</text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <LatestBlogs />
      </main>

      <Footer />
      <PromoModal />
    </>
  );
}
