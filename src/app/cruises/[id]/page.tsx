/* eslint-disable @next/next/no-img-element */
"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Lightbox from "@/components/Lightbox";
import { mockCruises, mockReviews, Review } from "@/data/mockData";
import {
  Star,
  ChevronRight,
  Home,
  Anchor,
  Layers,
  Compass,
  Send,
  MessageSquare,
  Waves,
  Utensils,
  Music,
  Tv,
  Heart,
  Sun,
  ChefHat,
  Coffee,
  BookOpen,
  Wine,
  UserCheck,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

// Helper function to map dynamic icons to amenities
const getAmenityIcon = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes("bể bơi") || nameLower.includes("pool")) return <Waves className="w-5 h-5 text-accent" />;
  if (nameLower.includes("trực thăng") || nameLower.includes("helipad")) return <Compass className="w-5 h-5 text-accent" />;
  if (nameLower.includes("golf")) return <Anchor className="w-5 h-5 text-accent" />;
  if (nameLower.includes("rượu") || nameLower.includes("wine") || nameLower.includes("cigar"))
    return <Wine className="w-5 h-5 text-accent" />;
  if (nameLower.includes("quản gia") || nameLower.includes("butler")) return <UserCheck className="w-5 h-5 text-accent" />;
  if (nameLower.includes("phim") || nameLower.includes("cinema")) return <Tv className="w-5 h-5 text-accent" />;
  if (nameLower.includes("spa") || nameLower.includes("massage")) return <Heart className="w-5 h-5 text-accent" />;
  if (nameLower.includes("sundeck") || nameLower.includes("boong tắm")) return <Sun className="w-5 h-5 text-accent" />;
  if (nameLower.includes("jacuzzi") || nameLower.includes("sục")) return <Waves className="w-5 h-5 text-accent" />;
  if (nameLower.includes("buffet") || nameLower.includes("tôm hùm") || nameLower.includes("ẩm thực"))
    return <Utensils className="w-5 h-5 text-accent" />;
  if (nameLower.includes("nhạc") || nameLower.includes("music") || nameLower.includes("piano"))
    return <Music className="w-5 h-5 text-accent" />;
  if (nameLower.includes("thang máy")) return <Layers className="w-5 h-5 text-accent" />;
  if (nameLower.includes("tranh") || nameLower.includes("nghệ thuật")) return <BookOpen className="w-5 h-5 text-accent" />;
  if (nameLower.includes("thư viện")) return <BookOpen className="w-5 h-5 text-accent" />;
  if (nameLower.includes("nấu ăn") || nameLower.includes("chef")) return <ChefHat className="w-5 h-5 text-accent" />;
  if (nameLower.includes("trà") || nameLower.includes("tea")) return <Coffee className="w-5 h-5 text-accent" />;
  if (nameLower.includes("kayak") || nameLower.includes("chèo")) return <Compass className="w-5 h-5 text-accent" />;
  return <Anchor className="w-5 h-5 text-accent" />;
};

export default function CruiseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const cruiseId = resolvedParams.id;

  // Find current cruise
  const cruise = mockCruises.find((c) => c.id === cruiseId);

  // States
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"policy" | "child" | "cancel">("policy");

  // Lightbox Modal States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Cabin Sidebar States
  const [selectedCabinIdx, setSelectedCabinIdx] = useState<number | null>(null);
  const [cabinPhotoIdx, setCabinPhotoIdx] = useState(0);

  // Active Activity Tab State
  const [activeActivityIdx, setActiveActivityIdx] = useState(0);

  // Tomorrow's date helper
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const tomorrowStr = useMemo(() => getTomorrowString(), []);

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingItinerary, setBookingItinerary] = useState("2n1d");
  const [bookingDate, setBookingDate] = useState(tomorrowStr);
  const [bookingCabinsQty, setBookingCabinsQty] = useState<number[]>([1, 0, 0, 0, 0]);
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
      const sections = ["overview", "cabins", "activities", "regulations", "map", "reviews"];
      let currentSection = sections[0];
      const scrollPosition = window.scrollY + 200; // offset

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

  useEffect(() => {
    if (selectedCabinIdx !== null || isBookingModalOpen || lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCabinIdx, isBookingModalOpen, lightboxOpen]);

  const handleBookingClick = () => {
    const defaultQty = mockCabins.map((_, i) => (i === 0 ? 1 : 0));
    setBookingCabinsQty(defaultQty);
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
    const hasRoomSelected = bookingCabinsQty.some((qty) => qty > 0);
    if (!hasRoomSelected) {
      toast.error("Vui lòng chọn ít nhất 1 phòng nghỉ.");
      return;
    }

    // Simulate API request
    toast.success("Gửi yêu cầu đặt dịch vụ thành công! TRAVEL sẽ liên hệ lại trong ít phút.");
    setIsBookingModalOpen(false);

    // Reset form fields
    setBookingName("");
    setBookingPhone("");
    setBookingEmail("");
    setBookingNotes("");
    setBookingDate(tomorrowStr);
    setBookingCabinsQty(mockCabins.map((_, i) => (i === 0 ? 1 : 0)));
    setBookingAdults(2);
    setBookingChildren(0);
    setBookingInfants(0);
  };

  // Load reviews matching this cruise dynamically via useMemo
  const matchedReviews = useMemo(() => {
    if (!cruise) return [];
    const matched = mockReviews.filter((r) => r.stayType.toLowerCase().includes(cruise.name.split(" ")[0].toLowerCase()));
    // Fallback reviews if empty
    if (matched.length === 0) {
      return [
        {
          id: "rev-fallback-1",
          userName: "Đỗ Mạnh Hùng",
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
          rating: 5,
          comment: `Gia đình tôi đã có trải nghiệm tuyệt vời trên tàu ${cruise.name}. Tàu rất rộng rãi, phòng ốc sạch sẽ, nhân viên phục vụ cực kỳ tận tâm. Điểm 10 chất lượng!`,
          date: "2026-05-28",
          stayType: cruise.name,
        },
        {
          id: "rev-fallback-2",
          userName: "Nguyễn Lê Quỳnh Anh",
          userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
          rating: 4.8,
          comment: `Mọi thứ đều hoàn hảo từ đồ ăn đến phòng ngủ. Hải trình thú vị đưa qua các điểm hang động kỳ vĩ. Điểm trừ duy nhất là sóng wifi trên vịnh đôi lúc chập chờn, nhưng bù lại được thư giãn trọn vẹn.`,
          date: "2026-05-20",
          stayType: cruise.name,
        },
      ];
    }
    return matched;
  }, [cruise]);

  // State for user-added reviews during the session
  const [addedReviews, setAddedReviews] = useState<Review[]>([]);

  // Combined reviews derived synchronously
  const allReviews = useMemo(() => {
    return [...addedReviews, ...matchedReviews];
  }, [addedReviews, matchedReviews]);

  if (!cruise) {
    return (
      <>
        <Navbar solid />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
          <Anchor className="w-16 h-16 text-accent animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Không tìm thấy du thuyền</h2>
          <p className="text-sm text-slate-500 mb-6">Đường dẫn không tồn tại hoặc du thuyền đã bị gỡ bỏ.</p>
          <Link
            href="/cruises"
            className="px-6 py-2.5 bg-[#001226] text-white hover:bg-accent hover:text-[#001226] text-xs uppercase tracking-widest font-bold rounded-full transition-all"
          >
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
  const mockCabins = [
    {
      name: "Deluxe Ocean View Cabin",
      size: "32 m²",
      capacity: "2 Khách",
      description:
        "Hạng phòng Deluxe tiêu chuẩn được bố trí tại tầng 1 với cửa kính lớn chạm trần và ban công riêng biệt hướng ra vịnh. Trang bị đầy đủ tiện nghi hiện đại và phòng tắm đứng sang trọng.",
      price: cruise.priceFrom / 2,
      image: cruise.imageGallery[1] || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600",
      images: [
        cruise.imageGallery[1] || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600",
      ],
      planImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600",
      details: [
        "Ban công riêng tư rộng 4m² với 2 ghế bành ngắm cảnh vịnh.",
        "Trang bị 1 giường đôi King-size (180 x 190 cm) hoặc 2 giường đơn tùy chọn.",
        "Phòng tắm đứng vách kính sang trọng kèm vòi sen nhiệt độ.",
        "Điều hòa trung tâm 2 chiều, tủ két an toàn, mini bar đầy đủ đồ uống.",
        "Trà, cà phê và nước khoáng chuẩn vị được set up miễn phí mỗi ngày.",
      ],
      amenities: ["Ban công riêng", "Điều hòa nhiệt độ", "Mini bar", "Tivi thông minh", "Trà & Cà phê miễn phí"],
    },
    {
      name: "Executive Suite Panoramic",
      size: "48 m²",
      capacity: "3 Khách",
      description:
        "Tọa lạc tại tầng 2 của du thuyền với góc nhìn toàn cảnh 180 độ tuyệt mỹ ra vịnh. Hạng phòng được thiết kế theo phong cách Indochine tinh tế, bồn tắm nằm sát cửa kính ngắm cảnh thư giãn.",
      price: (cruise.priceFrom / 2) * 1.5,
      image: cruise.imageGallery[2] || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
      images: [
        cruise.imageGallery[2] || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600",
      ],
      planImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600",
      details: [
        "Ban công panorama kính cường lực tràn viền góc nhìn cực rộng.",
        "Bồn tắm Jacuzzi nằm sát cửa kính hướng vịnh ngắm hoàng hôn cực lãng mạn.",
        "1 giường đôi Super King-size (200 x 220 cm) bọc da cao cấp.",
        "Dịch vụ phục vụ trà chiều và trái cây tươi thơm ngon tại phòng mỗi ngày.",
        "Mini bar miễn phí hoàn toàn (được làm đầy lại mỗi ngày).",
      ],
      amenities: [
        "Ban công kính panorama",
        "Bồn tắm jacuzzi riêng",
        "Dịch vụ trà chiều tại phòng",
        "Trái cây tươi mỗi ngày",
        "Mini bar free refill",
      ],
    },
    {
      name: "Presidential Royal Suite",
      size: "95 m²",
      capacity: "4 Khách",
      description:
        "Căn phòng rộng lớn và tiện nghi bậc nhất trên tàu, sở hữu phòng khách, bàn ăn và boong tắm nắng sundeck riêng tư hoàn toàn. Đi kèm dịch vụ hỗ trợ chu đáo 24/7 phục vụ mọi bữa ăn tại phòng.",
      price: (cruise.priceFrom / 2) * 3.0,
      image: cruise.imageGallery[3] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
      images: [
        cruise.imageGallery[3] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1200",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200",
      ],
      planImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600",
      details: [
        "Sở hữu boong tắm nắng sundeck riêng tư biệt lập rộng 20m² có ghế nằm tắm nắng.",
        "Không gian phòng bao gồm phòng ngủ ấm cúng, phòng khách lớn và bàn ăn riêng.",
        "Dịch vụ hỗ trợ cá nhân 24/7 sắp xếp và phục vụ bữa ăn tại phòng.",
        "Đưa đón bằng xe Limousine từ Hà Nội.",
        "Tặng thức uống chào mừng mát lạnh khi nhận phòng.",
      ],
      amenities: [
        "Sundeck riêng biệt lập",
        "Phòng khách sang trọng",
        "Hỗ trợ phục vụ 24/7",
        "Đón tiễn limousine",
        "Thức uống chào mừng",
      ],
    },
    {
      name: "Grand Owner's Penthouse Suite",
      size: "120 m²",
      capacity: "4 Khách",
      description:
        "Căn phòng tổng thống sang trọng bậc nhất với hồ bơi jacuzzi vô cực riêng, phòng tắm sauna hơi nước khô, bàn ăn lớn phục vụ tiệc và tầm nhìn trực diện mũi tàu không góc chết.",
      price: (cruise.priceFrom / 2) * 4.5,
      image: cruise.imageGallery[0] || "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600",
      images: [
        cruise.imageGallery[0] || "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600",
      ],
      planImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600",
      details: [
        "Hồ bơi jacuzzi vô cực ngoài trời biệt lập ở boong trước mũi tàu.",
        "Phòng xông hơi khô sauna và xông hơi ướt hammam khép kín.",
        "Nhân viên chăm sóc riêng phục vụ chu đáo 24/7.",
        "Miễn phí các loại nước uống mát lạnh chất lượng cao giải nhiệt ngày hè.",
        "Dịch vụ massage trị liệu 60 phút mỗi ngày dành cho mỗi khách tại phòng.",
      ],
      amenities: [
        "Bể bơi vô cực mũi tàu",
        "Phòng xông hơi riêng",
        "Nhân viên phục vụ 24/7",
        "Đồ uống cao cấp free",
        "Massage trị liệu miễn phí",
      ],
    },
    {
      name: "Family Connecting Suite",
      size: "64 m²",
      capacity: "5 Khách",
      description:
        "Lựa chọn hoàn hảo cho kỳ nghỉ gia đình với thiết kế 2 phòng ngủ thông nhau qua cửa kết nối riêng biệt. Đầy đủ tiện nghi cho trẻ em và khu sinh hoạt chung đầm ấm.",
      price: (cruise.priceFrom / 2) * 2.2,
      image: cruise.imageGallery[4] || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=600",
      images: [
        cruise.imageGallery[4] || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=600",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
      ],
      planImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600",
      details: [
        "Thiết kế 2 phòng ngủ thông nhau tiện lợi cho việc chăm sóc trẻ nhỏ.",
        "Đồ chơi thông minh và khu vực vui chơi an toàn thiết kế riêng cho bé.",
        "Mini bar được set up đặc biệt có sữa tươi và nước hoa quả hữu cơ.",
        "Ban công chung cực rộng nối liền hai phòng ngủ ngắm trọn cảnh vịnh.",
        "Tặng kèm dịch vụ trông trẻ 2 tiếng miễn phí mỗi ngày trên tàu.",
      ],
      amenities: ["Cửa kết nối thông phòng", "Đồ chơi cho bé", "Sữa & nước quả hữu cơ", "Ban công gia đình lớn", "Trông trẻ miễn phí"],
    },
  ];

  const activeCabin = selectedCabinIdx !== null ? mockCabins[selectedCabinIdx as number] : null;

  // Mock activities for Life on Board section
  const mockActivities = [
    {
      key: "gastronomy",
      label: "Gastronomy",
      title: "Ẩm thực phong phú",
      description:
        "Trải nghiệm ẩm thực 5 sao với tiệc tối buffet tôm hùm, các món Á-Ưu phong phú được chế biến bởi các bếp trưởng lành nghề, kết hợp cùng đồ uống hấp dẫn.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
    },
    {
      key: "lounges",
      label: "Lounges & Bars",
      title: "Quầy bar & Lounge",
      description:
        "Thư giãn cùng những ly nước mát lạnh tại Sky Lounge lộng gió hay không gian chung ấm cúng, lắng nghe tiếng sóng vỗ rì rào hòa cùng bản nhạc nhẹ nhàng.",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
    },
    {
      key: "wellbeing",
      label: "Well-being & Spa",
      title: "Spa & Trị liệu",
      description:
        "Hồi phục sức khỏe với các liệu trình massage đá nóng, xông hơi đá muối Himalaya tại khu vực spa biệt lập, được phục vụ bởi các nhân viên chuyên nghiệp.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800",
    },
    {
      key: "pool",
      label: "Swimming pool",
      title: "Hồ bơi vô cực",
      description:
        "Thỏa sức bơi lội giữa bể bơi bốn mùa nước mặn ngoài trời, nhâm nhi ly nước ép trái cây tươi mát bên ghế tắm nắng ngắm hoàng hôn buông xuống vịnh di sản.",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800",
    },
    {
      key: "entertainment",
      label: "Entertainment",
      title: "Giải trí & Biểu diễn",
      description:
        "Đắm chìm trong các hoạt động biểu diễn nghệ thuật truyền thống, chiếu phim ngoài trời trên boong tàu hay thử tài câu mực đêm cùng các thủy thủ đoàn vô cùng thú vị.",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800",
    },
  ];

  // Regulations
  const regulations = {
    policy: [
      "Thời gian nhận phòng du thuyền: Từ 11:30 - 12:15 tại bến tàu Hạ Long/Tuần Châu.",
      "Thời gian trả phòng: Trước 09:30 sáng ngày kết thúc hải trình.",
      "Vui lòng mang theo hộ chiếu hoặc căn cước công dân bản gốc còn hạn để làm thủ tục khai báo tạm trú trên vịnh.",
      "Chương trình tàu có thể thay đổi tùy thuộc vào điều kiện thời tiết, lịch kiểm duyệt của Ban Quản lý Vịnh Hạ Long.",
    ],
    child: [
      "Miễn phí cho trẻ em dưới 4 tuổi (chung giường với bố mẹ, tối đa 1 trẻ em/cabin).",
      "Trẻ em từ 4 đến dưới 11 tuổi: Phụ thu 70% giá người lớn (chung giường với bố mẹ) hoặc 90% (nếu kê thêm giường phụ/extra bed).",
      "Trẻ em từ 11 tuổi trở lên: Tính giá như người lớn.",
    ],
    cancel: [
      "Hủy phòng trước 30 ngày trước khi khởi hành: Không tính phí hủy.",
      "Hủy phòng từ 15 đến 29 ngày trước khi khởi hành: Phí hủy là 50% tổng giá trị dịch vụ đặt chỗ.",
      "Hủy phòng dưới 14 ngày trước khi khởi hành: Phí hủy là 100% tổng giá trị dịch vụ đặt chỗ.",
      "Trường hợp thiên tai, bão lũ tàu không được cấp phép xuất bến: Hoàn tiền 100% hoặc chuyển đổi voucher sang ngày khởi hành mới.",
    ],
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
      stayType: cruise.name,
    };

    setAddedReviews((prev) => [newReview, ...prev]);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    toast.success("Đánh giá của bạn đã được gửi thành công và đang chờ duyệt!");
  };

  // Suggestions (exclude current cruise)
  const suggestedCruises = mockCruises.filter((c) => c.id !== cruise.id).slice(0, 3);

  // Average rating calculation
  const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, allReviews.length)).toFixed(1);

  return (
    <div className="w-full bg-white text-slate-800">
      <Navbar solid />

      {/* 1. HEADER SECTION (White background) */}
      <section className="bg-white pt-28 pb-6">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            <Link
              href="/"
              className="hover:text-[#001226] flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <Link
              href="/cruises"
              className="hover:text-[#001226]"
            >
              Du thuyền
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800">{cruise.name}</span>
          </div>

          {/* Title, Stars, Address */}
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="font-serif text-2xl md:text-4xl text-slate-900 tracking-wide font-normal">{cruise.name}</h1>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${index < cruise.stars ? "fill-accent text-accent" : "text-slate-200"}`}
                  />
                ))}
                <span className="text-xs font-semibold text-slate-500 ml-2">({cruise.stars}.0)</span>
              </div>
            </div>
            {/* Address */}
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Cảng Quốc tế Tuần Châu, Hạ Long, Quảng Ninh</span>
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
                src={cruise.imageGallery[0]}
                alt={`${cruise.name} 1`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Thumbnails */}
            <div
              className="hidden md:block relative overflow-hidden rounded-sm cursor-pointer"
              onClick={() => {
                setLightboxIdx(1);
                setLightboxOpen(true);
              }}
            >
              <img
                src={cruise.imageGallery[1] || cruise.imageGallery[0]}
                alt={`${cruise.name} 2`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              className="hidden md:block relative overflow-hidden rounded-sm cursor-pointer"
              onClick={() => {
                setLightboxIdx(2);
                setLightboxOpen(true);
              }}
            >
              <img
                src={cruise.imageGallery[2] || cruise.imageGallery[0]}
                alt={`${cruise.name} 3`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              className="hidden md:block relative overflow-hidden rounded-sm cursor-pointer"
              onClick={() => {
                setLightboxIdx(3);
                setLightboxOpen(true);
              }}
            >
              <img
                src={cruise.imageGallery[3] || cruise.imageGallery[0]}
                alt={`${cruise.name} 4`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              className="hidden md:block relative overflow-hidden rounded-sm cursor-pointer"
              onClick={() => {
                setLightboxIdx(cruise.imageGallery.length > 4 ? 4 : 0);
                setLightboxOpen(true);
              }}
            >
              <img
                src={cruise.imageGallery[4] || cruise.imageGallery[0]}
                alt={`${cruise.name} 5`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
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
            <span className="text-slate-400">({cruise.imageGallery.length})</span>
          </button>
        </div>
      </section>

      {/* STICKY NAV TABS */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md hidden md:block pb-1 pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {[
              { id: "overview", label: "Giới thiệu" },
              { id: "cabins", label: "Hạng phòng" },
              { id: "activities", label: "Dịch vụ" },
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

      {/* 2. OVERVIEW & TECH SPECS (2-Column Layout) */}
      <section
        id="overview"
        className="py-12 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Left Side: Overview & Amenities (col-span-2) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview text */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-slate-900 leading-tight">{cruise.tagline}</h2>
              <p className="text-slate-650 text-sm md:text-base leading-relaxed font-sans font-light">{cruise.description}</p>
            </div>

            {/* Highlights Amenities */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="font-serif text-lg font-bold text-slate-900 uppercase">TIỆN ÍCH NỔI BẬT</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {cruise.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm border border-slate-100 hover:border-accent/20 transition-colors duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center flex-shrink-0">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included Privileges */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="font-serif text-lg font-bold text-slate-900 uppercase">ĐẶC QUYỀN ĐI KÈM</h3>

              <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-xs text-slate-750 font-medium">Tất cả bữa ăn tiêu chuẩn cao cấp trên tàu</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-xs text-slate-750 font-medium">Vé tham quan và hoạt động chèo thuyền kayak</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-xs text-slate-750 font-medium">Hướng dẫn viên chuyên nghiệp suốt hải trình</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-xs text-slate-750 font-medium">Trà chiều hoàng hôn và tiệc hoa quả</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Price, Booking CTA & Specs (col-span-1) */}
          <div className="lg:col-span-1 lg:sticky lg:top-36">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-6">
              {/* Price */}
              <div className="border-b border-slate-100 pb-5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">Giá chỉ từ</span>
                <div className="text-3xl font-serif font-bold text-[#001226]">{formatPrice(cruise.priceFrom / 2)}</div>
                <span className="text-xs text-slate-400">/ khách / đêm</span>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={handleBookingClick}
                className="w-full py-4 bg-accent hover:bg-[#001226] text-[#001226] hover:text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-md cursor-pointer"
              >
                Đặt Lịch Ngay
              </button>

              {/* Specs */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Anchor className="w-4 h-4 text-accent" />
                  <h4 className="font-serif text-xs font-bold text-slate-900 uppercase tracking-wide">THÔNG SỐ DU THUYỀN</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">NĂM HẠ THỦY</span>
                    <span className="font-bold text-slate-800 uppercase">{cruise.launchYear}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">THÂN VỎ / CHẤT LIỆU</span>
                    <span className="font-bold text-slate-800 uppercase text-right max-w-[160px]">{cruise.material}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">SỐ CABINS</span>
                    <span className="font-bold text-slate-800 uppercase">{cruise.cabinCount} phòng</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">ĐỊA ĐIỂM HOẠT ĐỘNG</span>
                    <span className="font-bold text-slate-800 uppercase">{cruise.destinations[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CABINS CATEGORIES SECTION (Vertical List of Row Cards) */}
      <section
        id="cabins"
        className="py-16 bg-white border-t border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">
              CÁC HẠNG PHÒNG
            </h2>
          </div>

          <div className="space-y-6">
            {mockCabins.map((cabin, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row border border-slate-200 rounded-sm hover:border-slate-350 hover:shadow-xs transition-all duration-300 bg-white overflow-hidden"
              >
                {/* Image */}
                <div
                  className="w-full md:w-56 h-40 md:h-40 relative overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setSelectedCabinIdx(index);
                    setCabinPhotoIdx(0);
                  }}
                >
                  <img
                    src={cabin.image}
                    alt={cabin.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between md:h-40">
                  <div className="space-y-2">
                    <h3
                      className="font-serif text-base md:text-lg font-bold text-slate-900 hover:text-accent-dark transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedCabinIdx(index);
                        setCabinPhotoIdx(0);
                      }}
                    >
                      {cabin.name}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        Diện tích: {cabin.size}
                      </span>
                      <span>•</span>
                      <span>Sức chứa: {cabin.capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Giá từ</span>
                      <span className="font-serif text-base font-bold text-slate-900">{formatPrice(cabin.price)}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCabinIdx(index);
                        setCabinPhotoIdx(0);
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

      {/* 4.5 LIFE ON BOARD / ACTIVITIES SECTION */}
      <section
        id="activities"
        className="py-16 bg-white border-t border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Block: Text & Tab list */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Text content */}
            <div className="w-full md:w-3/5 space-y-4">
              <h3 className="font-serif text-3xl md:text-4xl text-slate-900 font-normal transition-all duration-300">
                {mockActivities[activeActivityIdx].title}
              </h3>
              <p className="text-slate-650 text-xs md:text-sm leading-relaxed font-sans font-light transition-all duration-300">
                {mockActivities[activeActivityIdx].description}
              </p>
            </div>

            {/* Vertical Tabs List (Right-aligned with indicator line) */}
            <div className="w-full md:w-2/5 border-r border-slate-100 pr-6 flex flex-col gap-4 text-right">
              {mockActivities.map((act, index) => (
                <button
                  key={act.key}
                  onClick={() => setActiveActivityIdx(index)}
                  className={`text-right text-xs uppercase tracking-wider font-semibold transition-all duration-300 pr-4 py-1.5 border-r-2 -mr-[26px] cursor-pointer ${
                    index === activeActivityIdx
                      ? "border-[#001226] text-slate-900 font-bold"
                      : "border-transparent text-slate-450 hover:text-slate-800"
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Block: Image */}
          <div className="lg:col-span-5 relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-slate-100 shadow-md">
            <img
              src={mockActivities[activeActivityIdx].image}
              alt={mockActivities[activeActivityIdx].title}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out transform hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* 5. REGULATIONS & NOTES (Tabs Style) */}
      <section
        id="regulations"
        className="py-16 bg-slate-50 border-t border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">QUY ĐỊNH CHUNG & LƯU Ý</h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row">
            {/* Tabs sidebar */}
            <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-150 p-4 space-y-1">
              <button
                onClick={() => setActiveTab("policy")}
                className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "policy" ? "bg-[#001226] text-white shadow-sm" : "text-slate-650 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Quy định nhận/trả phòng</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button
                onClick={() => setActiveTab("child")}
                className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "child" ? "bg-[#001226] text-white shadow-sm" : "text-slate-650 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Chính sách trẻ em</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
              <button
                onClick={() => setActiveTab("cancel")}
                className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === "cancel" ? "bg-[#001226] text-white shadow-sm" : "text-slate-650 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Chính sách hoãn hủy</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>

            {/* Tab content panel */}
            <div className="w-full md:w-2/3 p-8">
              <div className="space-y-4">
                {regulations[activeTab].map((text, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 BẢN ĐỒ & LỊCH TRÌNH */}
      <section
        id="map"
        className="py-16 bg-white border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">BẢN ĐỒ & LỊCH TRÌNH</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Text info */}
            <div className="space-y-4 text-sm text-slate-700 font-sans">
              <h3 className="font-serif text-lg font-bold text-slate-900 uppercase">Thông tin cần biết</h3>
              <ul className="list-disc pl-5 space-y-3 font-light text-slate-650 leading-relaxed md:text-base">
                <li className="pl-1">
                  Du thuyền <span className="font-semibold text-slate-800">{cruise.name}</span> xuất phát từ Cảng Quốc tế Tuần Châu, Hạ
                  Long, Quảng Ninh.
                </li>
                <li className="pl-1">
                  Bạn có thể xem chi tiết lịch trình 2 ngày 1 đêm{" "}
                  <a
                    href={`/documents/lich-trinh-${cruise.id}-2n1d.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#008080] font-semibold underline underline-offset-2 hover:text-[#005050] transition-colors"
                  >
                    tại đây
                  </a>
                  .
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="w-full h-[350px] lg:h-[400px] border border-slate-200 rounded-sm overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.9189392233215!2d106.9796068759556!3d20.955773190280974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5840d5555555%3A0x6b2bf7c85854bcfb!2zQ8G6o25nIHF14buRYyB04bq_IFR14bqnbiBDaMOidQ!5e0!3m2!1svi!2svn!4v1716912345678!5m2!1svi!2svn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ cảng Tuần Châu"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. REVIEWS & FEEDBACK (Form & list) */}
      <section
        id="reviews"
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Reviews List & Stats (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-slate-900 uppercase">ĐÁNH GIÁ TỪ DU KHÁCH</h3>
            </div>

            {/* Stats card */}
            <div className="p-6 bg-slate-50 border border-slate-150 rounded-sm flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="text-center space-y-1">
                <span className="text-4xl font-serif font-bold text-[#001226]">{avgRating}</span>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Điểm đánh giá</span>
              </div>

              <div className="flex-1 space-y-2 border-l border-slate-200 pl-6 w-full">
                <div className="flex items-center gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                  <span className="text-xs font-semibold text-slate-650 ml-2">100% khách hàng hài lòng tuyệt đối</span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans font-light leading-relaxed">
                  Tổng số {allReviews.length} phản hồi đã được xác thực từ hành trình trải nghiệm thực tế trên vịnh Hạ Long.
                </p>
              </div>
            </div>

            {/* Reviews display list */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              {allReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 border-b border-slate-100 last:border-0 space-y-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
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

                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-light pl-12">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Form (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-150 p-8 rounded-sm shadow-sm h-fit">
            <div className="border-b border-slate-200 pb-4 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <h4 className="font-serif text-base font-bold text-slate-900 uppercase">GỬI ĐÁNH GIÁ CỦA BẠN</h4>
            </div>

            <form
              onSubmit={handleAddReview}
              className="space-y-5"
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Họ và tên của bạn</label>
                <input
                  type="text"
                  placeholder="Nhập đầy đủ họ tên..."
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-sm px-4 py-3 text-xs font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              {/* Rating Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Đánh giá số sao</label>
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
                            starVal <= reviewRating ? "fill-accent text-accent" : "text-slate-300 hover:text-accent/60"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment text */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Nội dung bình luận</label>
                <textarea
                  rows={4}
                  placeholder="Hãy chia sẻ trải nghiệm thực tế của quý khách về du thuyền..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-sm p-4 text-xs font-medium focus:outline-none focus:border-accent"
                />
              </div>

              {/* Submit button */}
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

      {/* 7. RELATED SUGGESTED CRUISES */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 tracking-wide uppercase font-normal">GỢI Ý CÁC DU THUYỀN KHÁC</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {suggestedCruises.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                type="cruise"
                name={item.name}
                tagline={item.tagline}
                image={item.imageGallery[0]}
                stars={item.stars}
                price={item.priceFrom}
                location={item.destinations[0]}
                amenities={item.amenities}
                launchYear={item.launchYear}
                material={item.material}
                cabinCount={item.cabinCount}
                variant="detailed"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* LIGHTBOX MODAL */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={cruise.imageGallery}
        initialIndex={lightboxIdx}
        title={cruise.name}
        stars={cruise.stars}
        location="Cảng Quốc tế Tuần Châu, Hạ Long, Quảng Ninh"
      />

      {/* CABIN DETAILS SIDEBAR / DRAWER (Image 3 Style with Spring Transition) */}
      <AnimatePresence>
        {selectedCabinIdx !== null && activeCabin && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCabinIdx(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Sidebar Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 tracking-wider">
                <span className="uppercase">{cruise.name}</span>
                <span className="text-slate-900 uppercase font-serif text-[11px] tracking-widest">Hạng phòng & Suites</span>
                <button
                  onClick={() => setSelectedCabinIdx(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-650 cursor-pointer"
                  aria-label="Đóng"
                >
                  <span className="text-xl font-light">&times;</span>
                </button>
              </div>

              {/* Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin">
                {/* Title & Technical Specs */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Chi tiết hạng phòng</span>
                    <h3 className="font-serif text-2xl md:text-3xl text-slate-955 font-medium">{activeCabin.name}</h3>
                  </div>
                  <div className="flex gap-6 text-right self-start flex-shrink-0 whitespace-nowrap">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Diện tích</span>
                      <span className="font-serif text-xl font-bold text-slate-800 block whitespace-nowrap">{activeCabin.size}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Khách tối đa</span>
                      <span className="font-serif text-xl font-bold text-slate-800 block whitespace-nowrap">{activeCabin.capacity}</span>
                    </div>
                  </div>
                </div>

                {/* Media Content - Gallery Slide Only (Image 1 Style inside Drawer) */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-slate-900 shadow-inner group">
                  <img
                    src={activeCabin.images[cabinPhotoIdx]}
                    alt={`${activeCabin.name} view ${cabinPhotoIdx + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                  />

                  {/* Bottom-left: Dot indicator */}
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5">
                    {activeCabin.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCabinPhotoIdx(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === cabinPhotoIdx ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Bottom-right: Arrow buttons */}
                  <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                    <button
                      onClick={() => setCabinPhotoIdx((prev) => (prev === 0 ? activeCabin.images.length - 1 : prev - 1))}
                      className="w-8 h-8 rounded-full border border-white/45 hover:border-white text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                    <button
                      onClick={() => setCabinPhotoIdx((prev) => (prev === activeCabin.images.length - 1 ? 0 : prev + 1))}
                      className="w-8 h-8 rounded-full border border-white/45 hover:border-white text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Detailed Specs Block - Concise 2-Column Amenities */}
                <div className="space-y-4 text-left">
                  <h4 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">TIỆN NGHI PHÒNG</h4>
                  <p className="text-xs text-slate-500 font-sans font-light leading-relaxed">{activeCabin.description}</p>

                  <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                    {activeCabin.amenities.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-full border border-slate-100"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        <span className="text-xs text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky bottom bar inside Drawer */}
              <div className="border-t border-slate-100 px-6 py-4 bg-white flex items-center justify-between gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold block mb-0.5">Giá phòng từ</span>
                  <span className="font-serif text-base font-bold text-slate-900">
                    {formatPrice(activeCabin.price)} <span className="text-[10px] text-slate-450 font-sans font-normal">/ đêm</span>
                  </span>
                </div>
                <button
                  onClick={() => {
                    const targetIdx = selectedCabinIdx !== null ? (selectedCabinIdx as number) : 0;
                    setBookingCabinsQty(mockCabins.map((_, i) => (i === targetIdx ? 1 : 0)));
                    setSelectedCabinIdx(null);
                    setIsBookingModalOpen(true);
                  }}
                  className="px-6 py-3 bg-[#001226] hover:bg-accent text-white hover:text-[#001226] border border-[#001226] hover:border-accent text-xs uppercase tracking-widest font-bold rounded-full transition-all cursor-pointer"
                >
                  Đặt phòng này
                </button>
              </div>

              {/* Bottom Navigation */}
              <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCabinIdx((prev) => (prev === 0 ? mockCabins.length - 1 : prev! - 1));
                    setCabinPhotoIdx(0);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-accent-dark transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>{mockCabins[selectedCabinIdx === 0 ? mockCabins.length - 1 : selectedCabinIdx - 1].name}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCabinIdx((prev) => (prev === mockCabins.length - 1 ? 0 : prev! + 1));
                    setCabinPhotoIdx(0);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-accent-dark transition-colors cursor-pointer"
                >
                  <span>{mockCabins[selectedCabinIdx === mockCabins.length - 1 ? 0 : selectedCabinIdx + 1].name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Box */}
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
                    <span className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold block">Đăng ký dịch vụ</span>
                    <h3 className="font-serif text-xl md:text-2xl text-slate-900 font-medium">ĐẶT HẢI TRÌNH DU THUYỀN</h3>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">{cruise.name}</p>
                  </div>
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer"
                    aria-label="Đóng"
                  >
                    <span className="text-xl font-light">&times;</span>
                  </button>
                </div>

                <form
                  onSubmit={handleBookingSubmit}
                  className="space-y-5"
                >
                  {/* Select Itinerary & Departure Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Select Itinerary */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Chọn chuyến đi</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: "2n1d", label: "2N1Đ", desc: "2 Ngày 1 Đêm" },
                          { key: "3n2d", label: "3N2Đ", desc: "3 Ngày 2 Đêm" },
                          { key: "4n3d", label: "4N3Đ", desc: "4 Ngày 3 Đêm" },
                        ].map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setBookingItinerary(item.key)}
                            className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                              bookingItinerary === item.key
                                ? "border-[#001226] bg-[#001226]/5 text-slate-900 font-bold"
                                : "border-slate-200 text-slate-655 hover:bg-slate-55 hover:border-slate-350"
                            }`}
                          >
                            <span className="block text-[11px] uppercase tracking-wider">{item.label}</span>
                            <span className="block text-[7px] text-slate-455 font-medium mt-0.5">{item.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Departure Date */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Ngày khởi hành *</label>
                      <input
                        type="date"
                        required
                        min={tomorrowStr}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent h-[46px]"
                      />
                    </div>
                  </div>

                  {/* Select Cabins & Quantities */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                      Chọn loại phòng & số lượng
                    </label>
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1.5 scrollbar-thin border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                      {mockCabins.map((cabin, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors shadow-xs"
                        >
                          <div className="text-left pr-4">
                            <span className="font-semibold text-xs text-slate-800 block leading-tight">{cabin.name}</span>
                            <span className="text-[10px] text-slate-450 block mt-1">
                              {formatPrice(cabin.price)} / đêm • {cabin.size} • tối đa {cabin.capacity}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setBookingCabinsQty((prev) => {
                                  const next = [...prev];
                                  next[idx] = Math.max(0, next[idx] - 1);
                                  return next;
                                });
                              }}
                              className="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer shadow-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-slate-850 min-w-[14px] text-center">{bookingCabinsQty[idx] || 0}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setBookingCabinsQty((prev) => {
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
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Số lượng hành khách</label>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Adults */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center space-y-1 shadow-xs">
                        <span className="text-[9px] font-bold text-slate-700 block">Người lớn</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setBookingAdults((prev) => Math.max(1, prev - 1))}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800">{bookingAdults}</span>
                          <button
                            type="button"
                            onClick={() => setBookingAdults((prev) => prev + 1)}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {/* Children */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center space-y-1 shadow-xs">
                        <div className="space-y-0">
                          <span className="text-[9px] font-bold text-slate-700 block">Trẻ em</span>
                          <span className="text-[7px] text-slate-400 block -mt-0.5">4 - 11 tuổi</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setBookingChildren((prev) => Math.max(0, prev - 1))}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800">{bookingChildren}</span>
                          <button
                            type="button"
                            onClick={() => setBookingChildren((prev) => prev + 1)}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {/* Infants */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center space-y-1 shadow-xs">
                        <div className="space-y-0">
                          <span className="text-[9px] font-bold text-slate-700 block">Em bé</span>
                          <span className="text-[7px] text-slate-400 block -mt-0.5">Dưới 4 tuổi</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setBookingInfants((prev) => Math.max(0, prev - 1))}
                            className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 hover:border-slate-400 font-bold text-xs select-none cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800">{bookingInfants}</span>
                          <button
                            type="button"
                            onClick={() => setBookingInfants((prev) => prev + 1)}
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
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Họ và tên *</label>
                        <input
                          type="text"
                          required
                          placeholder="Nguyễn Văn A..."
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Số điện thoại *</label>
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

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Địa chỉ Email</label>
                      <input
                        type="email"
                        placeholder="email@example.com..."
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                      />
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Yêu cầu đặc biệt</label>
                      <textarea
                        rows={2}
                        placeholder="Ví dụ: Đón rước tại Hà Nội, phòng có nôi trẻ em, ăn kiêng..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Submission buttons on Mobile (stacked) */}
                  <div className="block md:hidden pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={!bookingCabinsQty.some((q) => q > 0)}
                      className={`w-full py-4 text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                        bookingCabinsQty.some((q) => q > 0)
                          ? "bg-[#001226] hover:bg-accent text-white hover:text-[#001226] cursor-pointer"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Gửi yêu cầu đặt lịch
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

                  {/* Cabin Preview Image (Show first selected cabin, or default to first cabin) */}
                  {(() => {
                    const firstSelectedIdx = bookingCabinsQty.findIndex((q) => q > 0);
                    const activeCabinForImage = firstSelectedIdx !== -1 ? mockCabins[firstSelectedIdx] : mockCabins[0];
                    return (
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-200 shadow-inner relative">
                        <img
                          src={activeCabinForImage?.image || cruise.imageGallery[0]}
                          alt="Cabin Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[8px] font-bold text-slate-900 shadow-xs uppercase tracking-wider">
                          {bookingItinerary === "3n2d" ? "3 Ngày 2 Đêm" : bookingItinerary === "4n3d" ? "4 Ngày 3 Đêm" : "2 Ngày 1 Đêm"}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Details summary text */}
                  <div className="space-y-4 text-xs text-slate-650">
                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Du thuyền:</span>
                      <span className="font-bold text-slate-800 text-right">{cruise.name}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Ngày khởi hành:</span>
                      <span className="font-bold text-[#001226] text-right">
                        {bookingDate
                          ? new Date(bookingDate).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" })
                          : "Chưa chọn"}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">Hành khách:</span>
                      <span className="font-bold text-slate-800 text-right">
                        {bookingAdults} NL
                        {bookingChildren > 0 && `, ${bookingChildren} TE`}
                        {bookingInfants > 0 && `, ${bookingInfants} EB`}
                      </span>
                    </div>

                    {/* Rooms List */}
                    <div className="space-y-2 border-b border-slate-150 pb-3">
                      <span className="font-medium text-slate-500 block">Danh sách phòng:</span>

                      {!bookingCabinsQty.some((q) => q > 0) ? (
                        <span className="text-red-500 font-semibold block text-[11px] italic">Chưa chọn phòng nghỉ nào</span>
                      ) : (
                        <div className="space-y-1.5 pl-2 border-l-2 border-accent/40">
                          {mockCabins.map((cabin, idx) => {
                            const qty = bookingCabinsQty[idx] || 0;
                            if (qty === 0) return null;
                            return (
                              <div
                                key={idx}
                                className="flex justify-between text-[11px]"
                              >
                                <span className="font-semibold text-slate-800 max-w-[170px] truncate">
                                  {cabin.name} <span className="text-slate-455 font-normal text-[10px]">x{qty}</span>
                                </span>
                                <span className="font-medium text-slate-700">{formatPrice(cabin.price * qty)}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Itinerary multiplier display */}
                    <div className="flex justify-between text-[11px] border-b border-slate-150 pb-2">
                      <span className="font-medium text-slate-500">
                        Hệ số ngày đi ({bookingItinerary === "3n2d" ? "3N2Đ" : bookingItinerary === "4n3d" ? "4N3Đ" : "2N1Đ"}):
                      </span>
                      <span className="font-semibold text-slate-800">
                        x {bookingItinerary === "3n2d" ? "1.8" : bookingItinerary === "4n3d" ? "2.5" : "1.0"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 pt-6 border-t border-slate-200 mt-6">
                  {/* Dynamic Total Price Display */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 block font-bold">Tổng chi phí dự kiến</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl md:text-2xl font-bold font-serif text-[#001226]">
                        {formatPrice(
                          mockCabins.reduce((sum, cabin, i) => {
                            const qty = bookingCabinsQty[i] || 0;
                            const mult = bookingItinerary === "3n2d" ? 1.8 : bookingItinerary === "4n3d" ? 2.5 : 1.0;
                            return sum + cabin.price * qty * mult;
                          }, 0),
                        )}
                      </span>
                      <span className="text-[9px] text-slate-455 uppercase font-medium">Tổng tiền</span>
                    </div>
                  </div>

                  {/* Informational Warning Banner */}
                  <div className="bg-amber-50 border border-amber-250 p-3 rounded-lg text-[10px] text-amber-800 leading-relaxed font-medium">
                    * Giá báo trên đã bao gồm hệ số hành trình nhưng chưa tính các phụ thu trẻ em hoặc phí dịch vụ cao cấp khác. Tư vấn viên
                    TRAVEL sẽ liên hệ sớm nhất.
                  </div>

                  {/* Submission button on Desktop */}
                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={!bookingCabinsQty.some((q) => q > 0)}
                    className={`hidden md:flex w-full py-4 text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-300 items-center justify-center gap-2 shadow-md ${
                      bookingCabinsQty.some((q) => q > 0)
                        ? "bg-[#001226] hover:bg-accent text-white hover:text-[#001226] cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Gửi yêu cầu đặt lịch
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
  );
}
