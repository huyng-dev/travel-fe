/* eslint-disable @next/next/no-img-element */
"use client";

import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockBlogs, Blog } from "@/data/mockData";
import { 
  Home, 
  ChevronRight, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Check, 
  ArrowLeft,
  Newspaper,
  ThumbsUp
} from "lucide-react";
import toast from "react-hot-toast";

// Rich formatted content map for mock articles to look extremely professional
const getRichBlogContent = (id: string, blog: Blog) => {
  const highlightClass = "border-l-4 border-accent pl-6 py-2 my-8 font-serif italic text-lg text-slate-700 bg-slate-50 rounded-r-md";
  const subHeadingClass = "font-serif text-xl md:text-2xl text-slate-900 font-semibold mt-10 mb-4 tracking-wide text-left";
  const paragraphClass = "text-slate-655 text-sm md:text-base leading-relaxed font-sans font-light mb-6 text-left";
  const listContainerClass = "space-y-3.5 my-6 pl-2";
  const listItemClass = "flex items-start gap-3 text-sm md:text-base text-slate-655 leading-relaxed text-left";
  const checkIconClass = "w-5 h-5 text-accent mt-0.5 flex-shrink-0";
  const infoBoxClass = "bg-[#001226]/5 border border-[#001226]/10 p-6 rounded-lg my-8 text-left";

  switch (id) {
    case "blog-halong-travel-guide":
      return (
        <>
          <p className={paragraphClass}>
            Vịnh Hạ Long, một trong bảy kỳ quan thiên nhiên mới của thế giới, luôn sở hữu vẻ đẹp say lòng du khách suốt bốn mùa. Với hàng ngàn hòn đảo đá vôi kỳ vĩ nhô lên từ làn nước xanh ngọc bảo, nơi đây không chỉ là niềm tự hào của du lịch Việt Nam mà còn là điểm đến mơ ước của những tâm hồn xê dịch trên toàn thế giới.
          </p>

          <div className={highlightClass}>
            &ldquo;Hạ Long không chỉ là một danh lam thắng cảnh, đó là một tuyệt tác nghệ thuật điêu khắc của tạo hóa, nơi đá và nước hòa quyện tạo nên bản tình ca vĩnh cửu.&rdquo;
          </div>

          <h2 className={subHeadingClass}>Thời Điểm Đẹp Nhất Để Ghé Thăm Hạ Long</h2>
          <p className={paragraphClass}>
            Mỗi mùa Hạ Long lại mang một vẻ đẹp độc bản riêng biệt. Tuy nhiên, thời điểm lý tưởng nhất để trải nghiệm trọn vẹn vịnh kỳ quan thường chia làm hai giai đoạn chính:
          </p>
          <ul className={listContainerClass}>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Mùa hè & thu (Tháng 4 - Tháng 10):</strong> Thời tiết nắng ấm, trời trong xanh cực kỳ thích hợp cho các hoạt động bơi lội, chèo thuyền kayak và vui chơi trên bãi cát trắng mịn.</span>
            </li>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Mùa đông & xuân (Tháng 11 - Tháng 3 năm sau):</strong> Thời tiết se lạnh, vịnh biển thường chìm trong sương mờ ảo ảnh tạo nên một bức tranh thủy mặc trầm mặc cổ điển, rất thu hút du khách nước ngoài ưa chuộng sự yên tĩnh.</span>
            </li>
          </ul>

          <h2 className={subHeadingClass}>Cách Di Chuyển Tối Ưu Từ Hà Nội</h2>
          <p className={paragraphClass}>
            Nhờ có tuyến đường cao tốc Hà Nội - Hải Phòng - Hạ Long hiện đại, thời gian di chuyển từ thủ đô tới vịnh di sản đã được rút ngắn đáng kể từ 4 giờ xuống chỉ còn <strong>chưa đầy 2 giờ đồng hồ</strong>.
          </p>
          <p className={paragraphClass}>
            Phương tiện tối ưu nhất hiện nay là các dòng xe Limousine Dcar 9 chỗ cao cấp đưa đón tận nơi, trang bị ghế massage, wifi miễn phí và cổng sạc USB tiện lợi. Mức giá vé dao động từ 250.000đ - 350.000đ/lượt mang lại sự thoải mái tối đa cho hành trình nghỉ dưỡng.
          </p>

          <div className={infoBoxClass}>
            <h4 className="font-serif text-slate-900 font-bold text-sm uppercase tracking-wider mb-2">Lời khuyên từ chuyên gia TRAVEL:</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              Nếu bạn lên kế hoạch đi vào các ngày cuối tuần từ tháng 6 đến tháng 8 (mùa cao điểm du lịch hè), hãy chủ động đặt vé xe và phòng nghỉ sớm trước ít nhất 3 - 4 tuần để tránh tình trạng cháy vé hoặc giá dịch vụ tăng cao.
            </p>
          </div>

          <h2 className={subHeadingClass}>Các Điểm Đến Không Thể Bỏ Lỡ</h2>
          <p className={paragraphClass}>
            Hải trình khám phá vịnh di sản sẽ không trọn vẹn nếu bạn bỏ qua những địa danh huyền thoại sau:
          </p>
          <ul className={listContainerClass}>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Hang Sửng Sốt:</strong> Hang động rộng lớn và lộng lẫy bậc nhất nằm ở khu vực trung tâm vịnh với hàng triệu khối thạch nhũ hóa đá độc đáo nhiều hình thù kỳ lạ.</span>
            </li>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Đảo Ti Tốp:</strong> Nổi tiếng với bãi tắm hình vầng trăng khuyết cát trắng phau và đỉnh núi đá vôi sừng sững - nơi bạn có thể leo 400 bậc đá ngắm nhìn toàn cảnh vịnh 360 độ từ trên cao.</span>
            </li>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Hang Luồn:</strong> Địa điểm lý tưởng để chèo thuyền kayak len lỏi qua vòm đá tự nhiên đi vào hồ nước tĩnh lặng bao quanh bởi vách núi cao, nơi sinh sống của những đàn khỉ hoang dã.</span>
            </li>
          </ul>
        </>
      );

    case "blog-luxury-cruising-halong":
      return (
        <>
          <p className={paragraphClass}>
            Trong những năm gần đây, Vịnh Hạ Long đang chứng kiến một cuộc cách mạng lớn trong phân khúc nghỉ dưỡng cao cấp với sự bùng nổ của dòng siêu du thuyền thế hệ mới đạt tiêu chuẩn 5-6 sao quốc tế. Nghỉ đêm trên vịnh giờ đây không chỉ đơn thuần là ngắm cảnh biển mà đã nâng tầm thành một lối sống thượng lưu đích thực giữa trùng khơi kỳ quan.
          </p>

          <div className={highlightClass}>
            &ldquo;Siêu du thuyền thế hệ mới chính là những &lsquo;resort nổi đẳng cấp&rsquo;, tái định nghĩa hoàn toàn khái niệm nghỉ dưỡng xa xỉ tại Việt Nam.&rdquo;
          </div>

          <h2 className={subHeadingClass}>Trang Bị Vượt Trội Khác Biệt Hoàn Toàn</h2>
          <p className={paragraphClass}>
            Nếu như trước đây các con tàu gỗ nhỏ chiếm ưu thế, thì nay các siêu du thuyền kết cấu thép bọc tàu biển chuyên dụng với chiều dài lên tới hơn 100m đã chiếm lĩnh vịnh xanh. Các tên tuổi lớn như <strong>Essence Grand Superyacht</strong> hay <strong>Ambassador Cruise</strong> sở hữu những trang bị vượt trội khiến du khách phải trầm trồ:
          </p>
          <ul className={listContainerClass}>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Hồ bơi vô cực nước mặn:</strong> Bể bơi rộng lớn ngoài trời ngập gió biển ngắm trực diện các hòn đảo kỳ vĩ.</span>
            </li>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Sân đỗ trực thăng:</strong> Tiện ích đặc quyền phục vụ giới siêu giàu di chuyển nhanh chóng từ Hà Nội.</span>
            </li>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Phòng Golf 3D & Mini Cinema:</strong> Không gian giải trí công nghệ cao hiện đại ngay giữa lòng đại dương.</span>
            </li>
          </ul>

          <h2 className={subHeadingClass}>Trải Nghiệm Ẩm Thực Tinh Tế & Ca Nhạc Độc Quyền</h2>
          <p className={paragraphClass}>
            Ẩm thực chính là linh hồn của hải trình thượng lưu. Khách hàng sẽ được thưởng thức tiệc buffet tôm hùm không giới hạn chuẩn khách sạn 5 sao, kết hợp rượu vang nhập khẩu cao cấp. Khi màn đêm buông xuống, boong tàu khổng lồ (sundeck) biến thành một sân khấu ca nhạc ngoài trời lộng lẫy, nơi diễn ra các show nhạc sống acoustic đầy lãng mạn dưới ánh sao đêm vịnh biển.
          </p>
        </>
      );

    case "blog-onsens-quang-hanh-experience":
      return (
        <>
          <p className={paragraphClass}>
            Nằm yên bình giữa những thung lũng đá vôi trùng điệp mờ sương của vùng Hạ Long, Yoko Onsen đang trở thành biểu tượng của liệu pháp nghỉ dưỡng phục hồi sức khỏe. Đây là khu nghỉ dưỡng suối khoáng nóng chuẩn Nhật Bản đầu tiên tại Việt Nam mang trong mình triết lý thiền định sâu sắc, giúp xua tan mệt mỏi và chữa lành cơ thể từ sâu bên trong.
          </p>

          <div className={highlightClass}>
            &ldquo;Tắm khoáng nóng Onsen là nghệ thuật kết nối sâu sắc giữa Thân - Tâm - Trí, đưa con người trở về trạng thái thuần khiết ban sơ.&rdquo;
          </div>

          <h2 className={subHeadingClass}>Nguồn Khoáng Quý Giá Độc Nhất Vô Nhị</h2>
          <p className={paragraphClass}>
            Nguồn nước khoáng tự nhiên được dẫn trực tiếp từ mạch suối ngầm sâu hàng trăm mét dưới lòng đất vôi cổ xưa của vùng di sản. Qua kiểm định, nguồn nước ở đây chứa hàm lượng Brom tự nhiên cực cao, kết hợp khoáng chất vi lượng quý giúp làm sạch da, lưu thông khí huyết, điều hòa huyết áp và giảm đau xương khớp đặc biệt hiệu quả.
          </p>

          <h2 className={subHeadingClass}>Quy Trình Tắm Onsen Chuẩn Nhật Bản</h2>
          <p className={paragraphClass}>
            Để đạt hiệu quả trị liệu tối đa, quý khách nên tuân thủ quy trình tắm khoáng thiền định truyền thống:
          </p>
          <ul className={listContainerClass}>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Bước 1: Làm sạch cơ thể.</strong> Tắm và gội sạch sẽ tại khu tắm ngồi trước khi vào các bể khoáng.</span>
            </li>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Bước 2: Ngâm bể khoáng nóng.</strong> Di chuyển chậm rãi ngâm mình từ các bể nhiệt độ vừa phải (37°C) sang các bể nóng hơn (40-42°C).</span>
            </li>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Bước 3: Xông hơi trị liệu.</strong> Kết hợp xông hơi đá muối Himalaya hoặc xông hơi ướt giúp đào thải độc tố qua tuyến mồ hôi.</span>
            </li>
            <li className={listItemClass}>
              <Check className={checkIconClass} />
              <span><strong>Bước 4: Ngâm bể lạnh.</strong> Ngâm mình nhanh trong bể khoáng lạnh (18°C) để se khít lỗ chân lông và làm săn chắc cơ thể.</span>
            </li>
          </ul>
        </>
      );

    default:
      // Fallback renderer splitting mock content by paragraphs
      return (
        <>
          {blog.content.split("\n\n").map((para, index) => (
            <p key={index} className={paragraphClass}>
              {para}
            </p>
          ))}
          <div className={infoBoxClass}>
            <h4 className="font-serif text-slate-900 font-bold text-sm uppercase tracking-wider mb-2">Về bản tin này:</h4>
            <p className="text-xs text-slate-655 leading-relaxed font-light">
              Bài viết thuộc chuyên mục {blog.category}, xuất bản vào ngày {blog.publishedAt}. Mọi thông tin tư vấn và đặt các gói dịch vụ du lịch cao cấp liên quan, quý khách vui lòng liên hệ hotline hỗ trợ 24/7 của TRAVEL để được phục vụ tốt nhất.
            </p>
          </div>
        </>
      );
  }
};

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const blogId = resolvedParams.id;

  // Find target blog
  const blog = mockBlogs.find((b) => b.id === blogId);

  // States
  const [likes, setLikes] = useState(24);
  const [hasLiked, setHasLiked] = useState(false);

  // Suggestions logic: same category first, fill up to 3 with others
  const suggestedBlogs = useMemo(() => {
    if (!blog) return [];
    const sameCategory = mockBlogs.filter((b) => b.category === blog.category && b.id !== blog.id);
    const otherCategory = mockBlogs.filter((b) => b.category !== blog.category && b.id !== blog.id);
    return [...sameCategory, ...otherCategory].slice(0, 3);
  }, [blog]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      toast.success("Cảm ơn bạn đã yêu thích bài viết này!");
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết bài viết vào bộ nhớ tạm!");
  };

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
          <Newspaper className="w-16 h-16 text-accent animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Không tìm thấy bài viết</h2>
          <p className="text-sm text-slate-500 mb-6">Đường dẫn không tồn tại hoặc bài viết đã bị gỡ bỏ.</p>
          <Link href="/blogs" className="px-6 py-2.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] text-xs uppercase tracking-widest font-bold rounded-full transition-all">
            Quay lại bản tin
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="w-full bg-white text-slate-800">
      <Navbar />

      {/* 1. HERO BANNER */}
      <section className="relative h-[65vh] w-full bg-slate-900 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001226]/30 via-[#001226]/50 to-[#001226]/95" />

        {/* Breadcrumbs inside banner */}
        <div className="absolute top-28 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-accent flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <Link href="/blogs" className="hover:text-accent">Blog</Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white/95 truncate max-w-[200px] md:max-w-xs">{blog.title}</span>
          </div>
        </div>

        {/* Title and Badges overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-10 pt-24 bg-gradient-to-t from-[#001226] via-[#001226]/60 to-transparent text-left">
          <div className="max-w-4xl mx-auto px-6 space-y-4">
            
            {/* Category badge */}
            <span className="inline-block px-3 py-1.5 bg-white text-accent text-[9.5px] uppercase tracking-[0.15em] font-bold rounded-full shadow-md">
              {blog.category}
            </span>

            {/* Title */}
            <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl tracking-wide font-normal text-white leading-tight drop-shadow-md">
              {blog.title.toUpperCase()}
            </h1>

            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-6 text-[11px] text-white/70 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                {blog.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                {blog.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-accent" />
                Tác giả: Biên tập viên TRAVEL
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ARTICLE CONTENT AREA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Content Render */}
          <article className="prose prose-slate max-w-none">
            {getRichBlogContent(blog.id, blog)}
          </article>

          {/* Social Interactions Bar */}
          <div className="flex items-center justify-between border-t border-b border-slate-100 py-4 my-12">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  hasLiked 
                    ? "bg-accent/10 border-accent text-accent-dark" 
                    : "border-slate-200 hover:border-slate-800 text-slate-655"
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-accent text-accent-dark" : ""}`} />
                <span>Thích bài viết ({likes})</span>
              </button>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-800 text-slate-655 text-xs font-bold transition-all cursor-pointer"
              aria-label="Chia sẻ bài viết"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Sao chép liên kết</span>
            </button>
          </div>

          {/* Back button */}
          <div className="text-left">
            <Link 
              href="/blogs" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-350 text-slate-655 hover:text-slate-900 text-xs uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh mục tin tức
            </Link>
          </div>

        </div>
      </section>

      {/* 3. RELATED RECOMMENDATIONS SECTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent-dark font-bold block">Đọc thêm tin tức</span>
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">
              BÀI VIẾT CÙNG CHUYÊN MỤC
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {suggestedBlogs.map((item) => (
              <Link
                key={item.id}
                href={`/blogs/${item.id}`}
                className="group bg-white border border-slate-200 hover:border-accent/40 rounded-2xl shadow-sm hover:shadow-lg flex flex-col h-full transition-all duration-300 overflow-hidden text-inherit hover:text-inherit no-underline cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden w-full bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[9.5px] uppercase tracking-[0.1em] font-bold bg-white text-accent rounded-full shadow-md">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider">
                    <span>{item.publishedAt}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-slate-900 group-hover:text-accent transition-colors duration-300 line-clamp-2 text-left">
                    {item.title}
                  </h3>
                  
                  <p className="text-slate-655 text-xs leading-relaxed line-clamp-3 flex-grow font-sans text-left">
                    {item.excerpt}
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

        </div>
      </section>

      <Footer />
    </div>
  );
}
