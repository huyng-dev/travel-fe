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
                  <p className="text-xs sm:text-sm md:text-base text-slate-100 font-light leading-relaxed tracking-wider max-w-2xl mx-auto drop-shadow-sm">
                    {heroSlides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* FLOATING QUICK CRUISE SEARCH BAR (Absolute positioned overlapping bottom edge) */}
            <motion.div
              initial={{ opacity: 0, y: 25, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-0 left-1/2 translate-y-1/2 w-full max-w-4xl z-20 px-6 md:px-0"
            >
              <form
                onSubmit={handleHeroSearch}
                className="bg-white border border-slate-100 shadow-xl md:rounded-full rounded-3xl p-3 md:pl-8 md:pr-3 md:py-3 flex flex-col md:flex-row items-center gap-4 md:gap-0 text-left"
              >
                {/* Search Input: Name */}
                <div className="w-full md:flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-accent flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-slate-200/60">
                    <Ship className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <label className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold block">
                      Tên du thuyền
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên du thuyền..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="w-full bg-transparent text-slate-800 text-sm font-semibold border-none focus:outline-none placeholder-slate-400 mt-0.5 focus:ring-0 p-0"
                    />
                  </div>
                </div>

                {/* Vertical Divider (Desktop only) */}
                <div className="hidden md:block w-[1px] h-8 bg-slate-200/80 mx-6" />

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
                    icon={<MapPin className="w-4 h-4 text-accent" />}
                    variant="light"
                  />
                </div>

                {/* Action button */}
                <div className="w-full md:w-auto flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-bold text-xs uppercase tracking-[0.1em] rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer border-none"
                  >
                    <Search className="w-4 h-4" />
                    TÌM KIẾM
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>



        {/* DYNAMIC PRODUCT CATALOG SECTION (Light Theme Slate background) */}
        <section id="catalog" className="pt-36 pb-24 bg-slate-50 border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left">
              <div className="space-y-2 text-center md:text-left w-full md:w-auto">
                <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
                  DỊCH VỤ ĐẲNG CẤP
                </span>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
                  HÀNH TRÌNH MỚI NHẤT
                </h2>
              </div>

              {/* Controls and Tabs Container */}
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto justify-center">
                {/* Filter Tabs */}
                <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 bg-white p-1 border border-slate-200/80 rounded-full shadow-sm max-w-full justify-start sm:justify-center scroll-smooth">
                  <button
                    onClick={() => { setFilter("cruise"); setActiveProductDot(0); }}
                    className={`flex-shrink-0 px-5 py-2 text-[10px] uppercase tracking-[0.15em] font-bold rounded-full transition-all duration-300 cursor-pointer ${
                      filter === "cruise" ? "bg-accent text-white" : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    Du thuyền
                  </button>
                  <button
                    onClick={() => { setFilter("hotel"); setActiveProductDot(0); }}
                    className={`flex-shrink-0 px-5 py-2 text-[10px] uppercase tracking-[0.15em] font-bold rounded-full transition-all duration-300 cursor-pointer ${
                      filter === "hotel" ? "bg-accent text-white" : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    Khách sạn
                  </button>
                  <button
                    onClick={() => { setFilter("combo"); setActiveProductDot(0); }}
                    className={`flex-shrink-0 px-5 py-2 text-[10px] uppercase tracking-[0.15em] font-bold rounded-full transition-all duration-300 cursor-pointer ${
                      filter === "combo" ? "bg-accent text-white" : "text-slate-500 hover:text-slate-850"
                    }`}
                  >
                    Combo du lịch
                  </button>
                </div>

                {/* Circular Navigation Arrows */}
                <div className="hidden sm:flex gap-2.5">
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
                    className="flex-shrink-0 w-[calc(100vw-48px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] select-none"
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

        {/* SIMPLIFIED DESTINATIONS SECTION (Moved below reviews) */}
        <section className="py-24 bg-white text-slate-850">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
                ĐIỂM ĐẾN NỔI BẬT
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
                CÁC ĐIỂM ĐẾN
              </h2>
            </div>

            {/* 3-card simple grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {discoverSlides.map((slide, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/cruises?destination=${encodeURIComponent(slide.destination)}`)}
                  className="group cursor-pointer text-center space-y-4"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-md border border-slate-100/80">
                    <img
                      src={slide.thumbnail}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-slate-850 font-semibold group-hover:text-accent transition-colors">
                      {slide.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Khám phá ngay</p>
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

        {/* BLOGS & MAGAZINE SECTION */}
        <section id="blogs" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <style dangerouslySetInnerHTML={{__html: `
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}} />
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold block">
                TIN TỨC MỚI NHẤT
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-slate-900 font-bold uppercase tracking-wide">
                BẢN TIN DU HÀNH
              </h2>
            </div>

            {/* Slider container with controls */}
            <div className="relative w-full">
              {/* Controls at upper right */}
              <div className="hidden sm:flex justify-end gap-2.5 mb-6">
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
                      className="flex-shrink-0 w-[calc(100vw-48px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] select-none group cursor-pointer"
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
                        <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[9.5px] uppercase tracking-[0.1em] font-bold bg-white text-accent rounded-full shadow-md">
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
