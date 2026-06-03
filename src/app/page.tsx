/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CrossReviewSection from "@/components/CrossReviewSection";
import CustomDropdown from "@/components/CustomDropdown";
import { mockCruises, mockHotels, mockCombos, mockBlogs } from "@/data/mockData";
import { Search, MapPin, ChevronRight, ChevronLeft, ArrowUpRight, Ship } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface DisplayProduct {
  id: string;
  type: "cruise" | "hotel" | "combo";
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
}

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920",
    title: "Nghỉ Dưỡng Thượng Lưu\nTại Vịnh Kỳ Quan",
    description: "Trải nghiệm những hải trình độc bản trên các siêu du thuyền 6 sao và kỳ nghỉ dưỡng riêng tư tại lâu đài Đảo Rều biệt lập.",
  },
  {
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1920",
    title: "Thiên Đường Khoáng Nóng\nGiữa Lòng Thung Lũng",
    description: "Đắm chìm trong dòng khoáng nóng tự nhiên chuẩn Nhật Bản tại Yoko Onsen Quang Hanh, cân bằng Thân - Tâm - Trí giữa vách đá mờ sương.",
  },
  {
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1920",
    title: "Tinh Hoa Di Sản\n& Nghệ Thuật Đông Dương",
    description: "Khám phá vịnh Lan Hạ thơ mộng cùng siêu phẩm du thuyền di sản Heritage Bình Chuẩn mang phong cách Indochine hoài niệm.",
  },
];

const discoverSlides = [
  {
    bgImage: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1920",
    thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800",
    title: "Vịnh Hạ Long",
    subtitle: "Du ngoạn giữa những hòn đảo đá vôi huyền thoại, chiêm ngưỡng hang động lung linh và đảo đá kỳ vĩ.",
    destination: "Vịnh Hạ Long",
  },
  {
    bgImage: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1920",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
    title: "Vịnh Lan Hạ",
    subtitle: "Len lỏi qua các hang sáng tối yên bình, chèo thuyền kayak và hòa mình vào bãi tắm hoang sơ tĩnh lặng.",
    destination: "Vịnh Lan Hạ",
  },
  {
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920",
    thumbnail: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800",
    title: "Đảo Cát Bà",
    subtitle: "Khám phá rừng quốc gia kì vĩ, đạp xe xuyên thung lũng ghé thăm ngôi làng cổ Việt Hải hoang sơ bên sườn núi.",
    destination: "Đảo Cát Bà",
  },
];

const serviceSlides = [
  {
    title: "Du Thuyền Thượng Lưu",
    description: "Đội tàu siêu du thuyền 5-6 sao hiện đại bậc nhất, mang đến những hải trình độc bản ngắm nhìn toàn cảnh vịnh kỳ quan từ ban công riêng tư.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200",
  },
  {
    title: "Khách Sạn & Resort Biệt Lập",
    description: "Hệ thống biệt thự sát biển và lâu đài đảo Rều mang phong cách hoàng gia Pháp cổ điển, mang lại những kỳ nghỉ riêng tư tuyệt đối cho gia đình.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200",
  },
  {
    title: "Tinh Hoa Ẩm Thực 5 Sao",
    description: "Thưởng thức tiệc tối buffet tôm hùm không giới hạn, tiệc Fine Dining chuẩn Âu cùng những ly rượu vang hảo hạng lộng gió biển khơi.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200",
  },
  {
    title: "Suối Khoáng Nóng Trị Liệu",
    description: "Đắm chìm trong nguồn khoáng nóng brom tự nhiên chuẩn Nhật Bản tại thung lũng đá vôi, hồi phục sức khỏe Thân - Tâm - Trí trọn vẹn.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200",
  },
];

export default function Home() {
  const router = useRouter();
  const [filter, setFilter] = useState<"cruise" | "hotel" | "combo">("cruise");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDiscoverSlide, setCurrentDiscoverSlide] = useState(0);
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardWidth, setCardWidth] = useState(380);

  const productScrollRef = React.useRef<HTMLDivElement>(null);
  const [activeProductDot, setActiveProductDot] = useState(0);
  const [productCardWidth, setProductCardWidth] = useState(380);

  const handleProductDragEnd = (event: unknown, info: PanInfo) => {
    const threshold = 50;
    const productsToDisplay = filteredProducts().slice(0, 6);
    const maxIndex = Math.max(0, productsToDisplay.length - visibleCount);
    if (info.offset.x < -threshold) {
      setActiveProductDot((prev) => Math.min(maxIndex, prev + 1));
    } else if (info.offset.x > threshold) {
      setActiveProductDot((prev) => Math.max(0, prev - 1));
    }
  };

  React.useEffect(() => {
    const updateWidth = () => {
      if (productScrollRef.current && productScrollRef.current.firstElementChild) {
        setProductCardWidth(productScrollRef.current.firstElementChild.clientWidth);
      }
    };
    const timer = setTimeout(updateWidth, 100);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWidth);
    };
  }, [visibleCount, filter]);

  React.useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  React.useEffect(() => {
    const updateWidth = () => {
      if (scrollRef.current && scrollRef.current.firstElementChild) {
        setCardWidth(scrollRef.current.firstElementChild.clientWidth);
      }
    };
    const timer = setTimeout(updateWidth, 100);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWidth);
    };
  }, [visibleCount]);

  const handleDragEnd = (event: unknown, info: PanInfo) => {
    const threshold = 50;
    const maxIndex = Math.max(0, mockBlogs.length - visibleCount);
    if (info.offset.x < -threshold) {
      setActiveDot((prev) => Math.min(maxIndex, prev + 1));
    } else if (info.offset.x > threshold) {
      setActiveDot((prev) => Math.max(0, prev - 1));
    }
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDiscoverSlide((prev: number) => (prev + 1) % discoverSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentServiceSlide((prev: number) => (prev + 1) % serviceSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Form tìm kiếm du thuyền ở Hero
  const [searchName, setSearchName] = useState("");
  const [searchDestination, setSearchDestination] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let query = "/cruises";
    const params = [];
    if (searchName) params.push(`name=${encodeURIComponent(searchName)}`);
    if (searchDestination) params.push(`destination=${encodeURIComponent(searchDestination)}`);
    if (params.length > 0) {
      query += `?${params.join("&")}`;
    }
    router.push(query);
  };

  const filteredProducts = (): DisplayProduct[] => {
    switch (filter) {
      case "cruise":
        return mockCruises.map((c) => ({
          id: c.id,
          type: "cruise" as const,
          name: c.name,
          tagline: c.tagline,
          image: c.imageGallery[0],
          stars: c.stars,
          price: c.id === "cruise-essence-grand" ? 7900000 : c.id === "cruise-ambassador" ? 6200000 : 6800000,
          durationDays: c.durationDays,
          location: c.destinations[0],
          amenities: c.amenities,
        }));
      case "hotel":
        return mockHotels.map((h) => ({
          id: h.id,
          type: "hotel" as const,
          name: h.name,
          tagline: h.location,
          image: h.imageGallery[0],
          stars: h.stars,
          price: h.roomTypes[0].pricePerNight,
          location: h.location,
          amenities: h.amenities,
        }));
      case "combo":
        return mockCombos.map((cb) => {
          const originalPrice = cb.netPrice;
          return {
            id: cb.id,
            type: "combo" as const,
            name: cb.name,
            tagline: cb.tagline,
            image: cb.id === "combo-essence-vinpearl" ? mockCruises[0].imageGallery[0] : mockCruises[1].imageGallery[0],
            stars: 5,
            price: cb.salePrice,
            originalPrice,
            badge: "Ưu Đãi Đặc Biệt",
            amenities: ["Bao gồm du thuyền & resort 5 sao", "Cano đưa đón riêng", "Liệu trình Spa kèm theo"],
          };
        });
      default:
        return [];
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-0 bg-white">
        {/* HERO SECTION - FULL SCREEN 100VH */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Hero background images slideshow */}
          <div className="absolute inset-0 z-0">
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
            <div className="absolute inset-0 bg-black/35 z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30 z-[1]" />
          </div>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-6 w-full z-10 text-center flex flex-col justify-between h-full pt-32 pb-12">
            {/* Slide Text Container (Centered in remaining height) */}
            <div className="flex-grow flex flex-col items-center justify-center max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight tracking-wide drop-shadow-lg whitespace-pre-line">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 font-light leading-relaxed tracking-wider max-w-2xl mx-auto drop-shadow-sm">
                    {heroSlides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* FLOATING QUICK CRUISE SEARCH BAR (Pushed to bottom) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="w-full max-w-4xl mx-auto z-20 px-4 md:px-0"
            >
              <form
                onSubmit={handleHeroSearch}
                className="bg-white/10 border border-white/20 backdrop-blur-xl md:rounded-full rounded-2xl p-3 md:pl-8 md:pr-3 md:py-3 shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-0 text-left"
              >
                {/* Search Input: Name */}
                <div className="w-full md:flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0 transition-all duration-300 hover:bg-white/10">
                    <Ship className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <label className="text-[10px] uppercase tracking-[0.12em] text-white/60 font-semibold block">
                      Tên du thuyền
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên du thuyền..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="w-full bg-transparent text-white text-sm font-semibold border-none focus:outline-none placeholder-white/45 mt-0.5 focus:ring-0 p-0"
                    />
                  </div>
                </div>

                {/* Vertical Divider (Desktop only) */}
                <div className="hidden md:block w-[1px] h-8 bg-white/15 mx-6" />

                {/* Dropdown: Destination */}
                <div className="w-full md:flex-1 md:mr-8">
                  <CustomDropdown
                    label="Tuyến điểm du ngoạn"
                    value={searchDestination}
                    onChange={setSearchDestination}
                    options={[
                      { value: "", label: "Tất cả tuyến điểm" },
                      { value: "Vịnh Hạ Long", label: "Vịnh Hạ Long" },
                      { value: "Vịnh Lan Hạ", label: "Vịnh Lan Hạ" },
                      { value: "Đảo Cát Bà", label: "Đảo Cát Bà" },
                    ]}
                    icon={<MapPin className="w-4 h-4 text-white" />}
                    placement="top"
                  />
                </div>

                {/* Action button */}
                <div className="w-full md:w-auto flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3.5 bg-white hover:bg-accent text-[#001226] font-bold text-xs uppercase tracking-[0.15em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    TÌM KIẾM
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* DISCOVER SECTION */}
        <section className="py-24 bg-white text-slate-850">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            {/* Header Text */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-slate-500 text-[10px] uppercase tracking-[0.25em] font-sans font-semibold block">
                SỐNG TRỌN TỪNG KHOẢNH KHẮC
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-wider font-semibold uppercase">
                KHÁM PHÁ
              </h2>
            </div>

            {/* Slideshow Container */}
            <div className="relative h-[550px] md:h-[650px] w-full overflow-hidden rounded-2xl shadow-xl bg-slate-950">
              {/* Background Images with Crossfade */}
              <div className="absolute inset-0">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={currentDiscoverSlide}
                    src={discoverSlides[currentDiscoverSlide].bgImage}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 object-cover w-full h-full"
                    alt={discoverSlides[currentDiscoverSlide].title}
                  />
                </AnimatePresence>
                {/* Gradient overlays to darken for accessibility and premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
              </div>

              {/* Centered Floating Glassmorphic Card */}
              <div className="relative z-10 flex items-center justify-center h-full px-4 md:px-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDiscoverSlide}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-[360px] md:max-w-[420px] bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-7 text-center text-white shadow-2xl flex flex-col items-center"
                  >
                    {/* Thumbnail */}
                    <div className="w-full aspect-[16/10] overflow-hidden rounded-lg mb-5 shadow-lg border border-white/10">
                      <img
                        src={discoverSlides[currentDiscoverSlide].thumbnail}
                        alt={discoverSlides[currentDiscoverSlide].title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    {/* Title */}
                    <h3 className="font-serif text-lg md:text-xl text-white tracking-wide font-medium">
                      {discoverSlides[currentDiscoverSlide].title}
                    </h3>
                    {/* Subtitle */}
                    <p className="text-slate-200/90 text-xs md:text-sm max-w-sm font-light mt-2.5 leading-relaxed font-sans">
                      {discoverSlides[currentDiscoverSlide].subtitle}
                    </p>
                    {/* Button */}
                    <button
                      onClick={() =>
                        router.push(
                          `/cruises?destination=${encodeURIComponent(
                            discoverSlides[currentDiscoverSlide].destination
                          )}`
                        )
                      }
                      className="mt-6 px-7 py-2.5 border border-white/30 hover:border-transparent bg-transparent hover:bg-[#c5a880] text-white hover:text-[#001226] font-semibold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 group cursor-pointer"
                    >
                      Khám Phá
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Left: Dots indicator */}
              <div className="absolute bottom-6 left-6 md:left-8 z-20 flex items-center gap-1.5">
                {discoverSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDiscoverSlide(index)}
                    className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                      index === currentDiscoverSlide ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Bottom Right: Circular Arrows */}
              <div className="absolute bottom-6 right-6 md:right-8 z-20 flex items-center gap-2.5">
                <button
                  onClick={() =>
                    setCurrentDiscoverSlide(
                      (prev: number) => (prev - 1 + discoverSlides.length) % discoverSlides.length
                    )
                  }
                  className="w-10 h-10 rounded-full border border-white/30 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentDiscoverSlide((prev: number) => (prev + 1) % discoverSlides.length)
                  }
                  className="w-10 h-10 rounded-full border border-white/30 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* DYNAMIC PRODUCT CATALOG SECTION (Light Theme Slate background) */}
        <section id="catalog" className="py-24 bg-slate-50 border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] text-accent-dark font-semibold block">
                  DỊCH VỤ ĐẲNG CẤP
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-wider font-semibold uppercase">
                  HÀNH TRÌNH MỚI NHẤT
                </h2>
              </div>

              {/* Controls and Tabs Container */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 bg-white p-1.5 border border-slate-200 rounded-sm shadow-sm">
                  <button
                    onClick={() => { setFilter("cruise"); setActiveProductDot(0); }}
                    className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-semibold rounded-sm transition-all duration-300 cursor-pointer ${
                      filter === "cruise" ? "bg-[#001226] text-white" : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    Du thuyền
                  </button>
                  <button
                    onClick={() => { setFilter("hotel"); setActiveProductDot(0); }}
                    className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-semibold rounded-sm transition-all duration-300 cursor-pointer ${
                      filter === "hotel" ? "bg-[#001226] text-white" : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    Khách sạn
                  </button>
                  <button
                    onClick={() => { setFilter("combo"); setActiveProductDot(0); }}
                    className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-semibold rounded-sm transition-all duration-300 cursor-pointer ${
                      filter === "combo" ? "bg-[#001226] text-white" : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    Combo du lịch
                  </button>
                </div>

                {/* Circular Navigation Arrows */}
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setActiveProductDot((prev) => Math.max(0, prev - 1))}
                    className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-650 hover:text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer bg-white"
                    aria-label="Previous products"
                  >
                    <ChevronLeft className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => {
                      const productsToDisplay = filteredProducts().slice(0, 6);
                      const maxIndex = Math.max(0, productsToDisplay.length - visibleCount);
                      setActiveProductDot((prev) => Math.min(maxIndex, prev + 1));
                    }}
                    className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-650 hover:text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer bg-white"
                    aria-label="Next products"
                  >
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Slider carousel */}
            <div className="relative w-full overflow-hidden pb-4">
              <motion.div
                ref={productScrollRef}
                drag="x"
                dragConstraints={{
                  left: -Math.max(0, filteredProducts().slice(0, 6).length - visibleCount) * (productCardWidth + 24),
                  right: 0,
                }}
                dragElastic={0.15}
                onDragEnd={handleProductDragEnd}
                animate={{ x: -activeProductDot * (productCardWidth + 24) }}
                transition={{ type: "spring", stiffness: 180, damping: 24 }}
                className="flex gap-6 cursor-grab active:cursor-grabbing w-full"
              >
                {filteredProducts().slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] select-none"
                  >
                    <ProductCard
                      id={product.id}
                      type={product.type}
                      name={product.name}
                      tagline={product.tagline}
                      image={product.image}
                      stars={product.stars}
                      badge={product.badge}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      durationDays={product.durationDays}
                      location={product.location}
                      amenities={product.amenities}
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dots pagination */}
            <div className="flex justify-center items-center gap-1.5 mt-4">
              {Array.from({ length: Math.max(1, filteredProducts().slice(0, 6).length - visibleCount + 1) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveProductDot(index)}
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                    index === activeProductDot ? "w-6 bg-slate-800" : "w-1.5 bg-slate-200 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
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
                <div className="space-y-4">
                  <span className="text-slate-500 text-[10px] uppercase tracking-[0.25em] font-sans font-semibold block">
                    DỊCH VỤ CỦA TRAVEL
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentServiceSlide}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <h2 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-wide leading-tight">
                        {serviceSlides[currentServiceSlide].title}
                      </h2>
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans font-light">
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

        {/* DUAL-TAB CROSS REVIEWS SECTION */}
        <section className="py-24 bg-slate-50 border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
              <span className="text-xs uppercase tracking-[0.25em] text-accent-dark font-semibold block">
                KHÁCH HÀNG PHẢN HỒI
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-wider font-semibold uppercase">
                TRẢI NGHIỆM THỰC TẾ
              </h2>
              <div className="w-16 h-[1.5px] bg-accent" />
            </div>

            <CrossReviewSection />
          </div>
        </section>

        {/* BLOGS & MAGAZINE SECTION */}
        <section id="blogs" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <style dangerouslySetInnerHTML={{__html: `
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}} />
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-slate-500 text-[10px] uppercase tracking-[0.25em] font-sans font-semibold block">
                CÓ GÌ MỚI TẠI TRAVEL HẠ LONG
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-wider font-semibold uppercase">
                BẢN TIN DU HÀNH
              </h2>
            </div>

            {/* Slider container with controls */}
            <div className="relative w-full">
              {/* Controls at upper right */}
              <div className="flex justify-end gap-2.5 mb-6">
                <button
                  onClick={() => setActiveDot((prev) => Math.max(0, prev - 1))}
                  className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-650 hover:text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                  aria-label="Previous articles"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => {
                    const maxIndex = Math.max(0, mockBlogs.length - visibleCount);
                    setActiveDot((prev) => Math.min(maxIndex, prev + 1));
                  }}
                  className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-650 hover:text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                  aria-label="Next articles"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Carousel container */}
              <div className="overflow-hidden w-full relative pb-4">
                <motion.div
                  ref={scrollRef}
                  drag="x"
                  dragConstraints={{
                    left: -Math.max(0, mockBlogs.length - visibleCount) * (cardWidth + 24),
                    right: 0,
                  }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                  animate={{ x: -activeDot * (cardWidth + 24) }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                  className="flex gap-6 cursor-grab active:cursor-grabbing w-full"
                >
                  {mockBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="flex-shrink-0 w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] select-none group cursor-pointer"
                      onClick={() => router.push(`/blogs?category=${encodeURIComponent(blog.category)}`)}
                    >
                      {/* Image */}
                      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100 relative shadow-sm border border-slate-100">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                          draggable="false"
                        />
                        <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] font-semibold bg-[#001226] text-accent rounded-sm">
                          {blog.category}
                        </span>
                      </div>
                      {/* Content below image */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-wider font-sans font-medium">
                          <span>{blog.publishedAt}</span>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
                        </div>
                        <h3 className="font-serif text-base text-slate-900 leading-snug group-hover:text-accent-dark transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                      </div>
                    </article>
                  ))}
                </motion.div>
              </div>

              {/* Dots pagination */}
              <div className="flex justify-center items-center gap-1.5 mt-8">
                {Array.from({ length: Math.max(1, mockBlogs.length - visibleCount + 1) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDot(index)}
                    className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                      index === activeDot ? "w-6 bg-slate-800" : "w-1.5 bg-slate-200 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to article ${index + 1}`}
                  />
                ))}
              </div>

              {/* View All Button */}
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => router.push("/blogs")}
                  className="px-8 py-3 border border-slate-800 hover:border-transparent bg-transparent hover:bg-[#001226] text-slate-900 hover:text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                >
                  Xem Tất Cả
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
