/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockBlogs } from "@/data/mockData";
import { Newspaper, ChevronRight, Home, ShieldAlert, Clock } from "lucide-react";

function BlogListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category") || "all";

  // State chuyên mục đang chọn
  const [activeCategory, setActiveCategory] = useState(categoryQuery);

  // Ánh xạ slug danh mục sang nhãn hiển thị trong mockData
  const mapCategoryName = (slug: string) => {
    switch (slug) {
      case "du-lich": return "Cẩm nang du lịch";
      case "du-thuyen": return "Trải nghiệm du thuyền";
      case "khach-san": return "Khách sạn nghỉ dưỡng";
      case "kinh-nghiem": return "Kinh nghiệm du hành";
      case "uu-dai": return "Ưu đãi đặc quyền";
      default: return slug;
    }
  };

  const getCategoryTitle = (slug: string) => {
    switch (slug) {
      case "du-lich": return "Cẩm nang du lịch";
      case "du-thuyen": return "Tin tức du thuyền";
      case "khach-san": return "Trải nghiệm khách sạn";
      case "kinh-nghiem": return "Kinh nghiệm du hành";
      case "uu-dai": return "Thông tin ưu đãi đặc quyền";
      default: return "Tạp chí du lịch";
    }
  };

  // Thực hiện lọc blog thời gian thực
  const filteredBlogs = mockBlogs.filter((blog) => {
    if (activeCategory === "all") return true;
    const targetCategoryLabel = mapCategoryName(activeCategory).toLowerCase();
    return (
      blog.category.toLowerCase().includes(targetCategoryLabel) ||
      blog.category.toLowerCase().includes(activeCategory.toLowerCase())
    );
  });

  const categories = [
    { key: "all", label: "Tất cả chuyên mục" },
    { key: "du-lich", label: "Cẩm nang du lịch" },
    { key: "du-thuyen", label: "Trải nghiệm du thuyền" },
    { key: "khach-san", label: "Khách sạn nghỉ dưỡng" },
    { key: "kinh-nghiem", label: "Kinh nghiệm du hành" },
    { key: "uu-dai", label: "Ưu đãi đặc quyền" }
  ];

  const handleTabChange = (key: string) => {
    setActiveCategory(key);
    const params = new URLSearchParams();
    if (key !== "all") {
      params.set("category", key);
    }
    router.push(`/blogs?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* 1. COMPACT BANNER */}
      <div className="relative h-[280px] w-full flex items-center justify-center bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1920"
          alt="Blogs Banner"
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
            <span className="text-white/90">Blog</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-white space-y-4 px-6 w-full max-w-4xl mt-20">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent font-semibold block">
            Tin Tức & Ký Sự
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide font-normal">
            BẢN TIN DU HÀNH
          </h1>
        </div>
      </div>

      {/* 2. CATEGORY TABS STICKY BAR */}
      <div className="border-b border-slate-100 bg-white sticky top-[72px] z-20 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2.5 overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleTabChange(cat.key)}
                className={`px-5 py-2 border rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-[#001226] bg-[#001226] text-white shadow-sm"
                    : "border-slate-200 hover:border-slate-800 text-slate-650 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 min-h-[50vh]">
        {/* Title */}
        <div className="space-y-3 pb-4 border-b border-slate-100">
          <span className="text-xs uppercase tracking-[0.25em] text-accent-dark font-semibold block">Cảm hứng khám phá</span>
          <h2 className="font-serif text-2xl md:text-3xl text-slate-900 font-normal tracking-wide flex items-center gap-2.5">
            <Newspaper className="w-6 h-6 text-accent-dark" />
            {getCategoryTitle(activeCategory)}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Có <span className="font-bold text-slate-850">{filteredBlogs.length}</span> bài viết trong chuyên mục này
          </p>
        </div>

        {/* Results */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="group bg-white border border-slate-200 hover:border-accent/40 rounded-2xl shadow-sm hover:shadow-lg flex flex-col h-full transition-all duration-300 overflow-hidden text-inherit hover:text-inherit no-underline cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden w-full bg-slate-100">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[9.5px] uppercase tracking-[0.1em] font-bold bg-white text-accent rounded-full shadow-md">
                    {blog.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider">
                    <span>{blog.publishedAt}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blog.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-slate-900 group-hover:text-accent transition-colors duration-300 line-clamp-2 text-left">
                    {blog.title}
                  </h3>
                  
                  <p className="text-slate-655 text-xs leading-relaxed line-clamp-3 flex-grow font-sans text-left">
                    {blog.excerpt}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-accent-dark group-hover:text-slate-900 font-bold flex items-center gap-1 transition-colors duration-300">
                      Đọc bài viết <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <ShieldAlert className="w-12 h-12 text-accent mx-auto animate-bounce" />
            <h3 className="font-serif text-lg font-bold text-slate-800">Không có bài viết phù hợp</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hiện tại danh mục tin tức này chưa cập nhật bài viết mới. Quý khách vui lòng tham khảo các chuyên mục khác hoặc quay lại xem toàn bộ.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleTabChange("all")}
                className="px-6 py-2.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] font-semibold text-xs uppercase tracking-[0.15em] rounded-full transition-all duration-300 inline-block cursor-pointer"
              >
                Xem tất cả bài viết
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BlogListContentWithKey() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  return <BlogListContent key={category} />;
}

export default function BlogsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <BlogListContentWithKey />
      </Suspense>
      <Footer />
    </>
  );
}
