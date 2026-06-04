export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  description: string;
  activities: string[];
}

export interface Cruise {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageGallery: string[];
  stars: number;
  amenities: string[];
  destinations: string[];
  durationDays: number;
  startDates: string[]; // Định dạng YYYY-MM-DD
  itinerary: ItineraryDay[];
  launchYear: string;
  material: string;
  cabinCount: number;
  priceFrom: number;
}

export interface RoomType {
  name: string;
  description: string;
  pricePerNight: number;
  capacity: string;
  image: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  imageGallery: string[];
  stars: number;
  amenities: string[];
  roomTypes: RoomType[];
  location: string;
  roomCount: number;
}

export interface Combo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cruiseId: string;
  hotelId: string;
  salePrice: number; // Giá bán khuyến mãi (VNĐ per person)
  netPrice: number;  // Giá gốc (VNĐ)
  patternOptions: {
    hotelStayBeforeDays: number; // Số ngày ở khách sạn trước khi đi du thuyền
    hotelStayAfterDays: number;  // Số ngày ở khách sạn sau khi đi du thuyền
  };
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  image: string;
  readTime: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  stayType: string; // Tên của du thuyền hoặc khách sạn đã trải nghiệm
}

// MOCK DATA ARRAYS

export const mockCruises: Cruise[] = [
  {
    id: "cruise-essence-grand",
    name: "Essence Grand Hạ Long Superyacht",
    tagline: "Siêu du thuyền xanh 6 sao lớn và sang trọng bậc nhất Vịnh Hạ Long",
    description: "Trải nghiệm đỉnh cao của sự xa hoa và phong cách sống thượng lưu tại Vịnh Hạ Long. Essence Grand Superyacht sở hữu hồ bơi vô cực nước mặn lớn nhất vịnh, sân đỗ trực thăng, phòng tập golf 3D hiện đại, hầm rượu vang và xì-gà sang trọng cùng dịch vụ quản gia cá nhân phục vụ 24/7.",
    imageGallery: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200", // Hạ Long Bay view
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200", // Cruise Pool
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200", // Modern deck
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200"  // Luxury dining
    ],
    stars: 5, // Hiển thị 5 sao trong UI
    amenities: [
      "Bể bơi vô cực",
      "Sân trực thăng",
      "Phòng Golf 3D",
      "Hầm rượu & Cigar",
      "Quản gia 24/7",
      "Rạp phim mini",
      "Spa thảo dược"
    ],
    destinations: ["Vịnh Hạ Long", "Hang Sửng Sốt", "Đảo Ti Tốp", "Hang Luồn"],
    durationDays: 2,
    startDates: ["2026-06-10", "2026-06-12", "2026-06-15", "2026-06-18", "2026-06-20"],
    launchYear: "2023",
    material: "Thép bọc thép đóng tàu chuyên dụng",
    cabinCount: 55,
    priceFrom: 135000000,
    itinerary: [
      {
        day: 1,
        title: "Khởi hành từ Tuần Châu & Khám phá Hang Luồn",
        location: "Vịnh Hạ Long",
        description: "Lên du thuyền Essence Grand tại cảng quốc tế Tuần Châu. Sau bữa trưa buffet hải sản thượng vị, tàu di chuyển sâu vào vùng lõi di sản. Trải nghiệm chèo thuyền kayak khám phá Hang Luồn nơi có những đàn khỉ hoang dã cư ngụ.",
        activities: ["Làm thủ tục lên tàu", "Ăn trưa buffet hải sản", "Chèo thuyền kayak tại Hang Luồn", "Thưởng thức tiệc trà hoàng hôn"]
      },
      {
        day: 2,
        title: "Hang Sửng Sốt - Đảo Ti Tốp - Trở về Tuần Châu",
        location: "Vịnh Hạ Long",
        description: "Khởi đầu ngày mới với lớp học Thái Cực Quyền trên boong tàu. Tham quan Hang Sửng Sốt - hang động lớn và đẹp nhất vịnh, sau đó chinh phục đỉnh núi đảo Ti Tốp ngắm nhìn toàn cảnh vịnh 360 độ từ trên cao trước khi làm thủ tục check-out rời tàu.",
        activities: ["Tập Thái Cực Quyền", "Tham quan Hang Sửng Sốt", "Leo núi Đảo Ti Tốp", "Dùng bữa trưa nhẹ", "Cập cảng Tuần Châu"]
      }
    ]
  },
  {
    id: "cruise-ambassador",
    name: "Ambassador Cruise Hạ Long",
    tagline: "Tuyệt tác nghỉ dưỡng nổi với ẩm thực tôm hùm thượng hạng không giới hạn",
    description: "Ambassador Cruise là một trong những siêu du thuyền lớn nhất trên Vịnh Hạ Long, nổi tiếng với thiết kế hiện đại sang trọng bậc nhất, boong tắm nắng 2 tầng khổng lồ rộng tới 600m² và bể sục Jacuzzi ngoài trời cao cấp. Nơi đây mang đến dịch vụ ẩm thực tôm hùm chuẩn 5 sao cùng các chương trình giải trí ca nhạc sống chất lượng cao mỗi tối.",
    imageGallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200", // Sunny beach/water view
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1200", // Cruise deck view
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1200", // Limestone islets
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200"  // Dining with views
    ],
    stars: 5,
    amenities: [
      "Sundeck 600m²",
      "Bể sục Jacuzzi",
      "Buffet tôm hùm",
      "Nhạc sống tối",
      "Thang máy kính",
      "Piano Lounge"
    ],
    destinations: ["Vịnh Hạ Long", "Hang Sửng Sốt", "Đảo Ti Tốp", "Làng chài Cửa Vạn"],
    durationDays: 2,
    startDates: ["2026-06-11", "2026-06-13", "2026-06-16", "2026-06-19", "2026-06-22"],
    launchYear: "2021",
    material: "Thép kết hợp hợp kim cao cấp",
    cabinCount: 46,
    priceFrom: 115000000,
    itinerary: [
      {
        day: 1,
        title: "Đón cảng quốc tế Hạ Long & Tiệc tối tôm hùm",
        location: "Vịnh Hạ Long",
        description: "Lên tàu tại cảng khách quốc tế Hạ Long (Bãi Cháy). Nhận phòng cabin sang trọng có ban công riêng. Buổi chiều ngắm cảnh hoàng hôn buông xuống trên vịnh đá vôi kỳ vĩ và tham gia tiệc tối buffet ẩm thực tôm hùm thượng hạng, thưởng thức âm nhạc acoustic lãng mạn.",
        activities: ["Check-in cabin riêng", "Ngắm cảnh Vịnh Hạ Long", "Tiệc tối ẩm thực tôm hùm", "Hát Live Acoustic tại Lounge"]
      },
      {
        day: 2,
        title: "Tham quan Hang Sửng Sốt & Tắm biển Ti Tốp",
        location: "Vịnh Hạ Long",
        description: "Buổi sáng tham quan Hang Sửng Sốt với hàng triệu khối thạch nhũ độc đáo. Tiếp tục di chuyển tới đảo Ti Tốp để tắm biển hoặc leo núi ngắm toàn cảnh kỳ quan thiên nhiên. Sau đó dùng bữa trưa buffet nhẹ trên đường di chuyển về cảng.",
        activities: ["Khám phá Hang Sửng Sốt", "Tắm biển hoặc leo núi Ti Tốp", "Bữa trưa nhẹ tự chọn", "Rời tàu về cảng"]
      }
    ]
  },
  {
    id: "cruise-heritage-binh-chuan",
    name: "Heritage Cruise Bình Chuẩn Cát Bà",
    tagline: "Du thuyền di sản mang đậm phong cách kiến trúc Đông Dương cổ điển",
    description: "Được thiết kế lấy cảm hứng từ con tàu lịch sử của vua tàu thủy Bạch Thái Bưởi thế kỷ 20, Heritage Bình Chuẩn mang đến một không gian đậm chất mỹ thuật, văn hóa và lịch sử Đông Dương (Indochine). Nơi đây như một bảo tàng nghệ thuật nổi giữa Vịnh Lan Hạ với bộ sưu tập hơn 100 tác phẩm tranh của họa sĩ huyền thoại Phạm Lực.",
    imageGallery: [
      "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200", // Ship in water
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200", // Indy room style
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200", // Heritage deck pool
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200"  // Fine arts dining
    ],
    stars: 5,
    amenities: [
      "Triển lãm tranh",
      "Thư viện cổ",
      "Bể bơi 4 mùa",
      "Lớp nấu ăn",
      "Tiệc trà chiều",
      "Chèo Kayak"
    ],
    destinations: ["Vịnh Lan Hạ", "Đảo Cát Bà", "Hang Sáng Tối", "Bãi biển Ba Trái Đào"],
    durationDays: 3,
    startDates: ["2026-06-10", "2026-06-14", "2026-06-18", "2026-06-22"],
    launchYear: "2020",
    material: "Hợp kim thép bọc gỗ Indochine mỹ thuật",
    cabinCount: 20,
    priceFrom: 95000000,
    itinerary: [
      {
        day: 1,
        title: "Khởi hành từ Tuần Châu sang Vịnh Lan Hạ hoang sơ",
        location: "Vịnh Lan Hạ",
        description: "Đón khách từ Tuần Châu bằng xuồng cao tốc ra tàu Heritage giữa làn nước xanh lục bảo của vịnh Lan Hạ. Thưởng thức bữa trưa đậm hương vị Việt cổ điển, chiều tự do tắm biển và chèo thuyền kayak tại vùng vịnh hoang sơ, yên tĩnh ít tàu bè qua lại.",
        activities: ["Xuồng cao tốc ra du thuyền", "Thưởng thức bữa trưa thuần Việt", "Chèo thuyền kayak tắm biển", "Tiệc rượu hoàng hôn trên boong"]
      },
      {
        day: 2,
        title: "Khám phá Làng cổ Việt Hải & Đảo Cát Bà",
        location: "Đảo Cát Bà",
        description: "Dành trọn vẹn ngày thứ hai để tham quan Làng cổ Việt Hải nằm biệt lập giữa rừng quốc gia Cát Bà. Quý khách đạp xe dọc theo con đường thung lũng xanh mướt, ngắm nhìn kiến trúc nhà gỗ tranh cổ xưa và giao lưu với người dân bản địa.",
        activities: ["Đạp xe khám phá Làng Việt Hải", "Dùng bữa trưa hải sản trên đầm", "Thăm quan Hang Sáng Tối", "Thưởng thức trà chiều di sản"]
      },
      {
        day: 3,
        title: "Lớp học nấu ăn & Kết thúc hành trình di sản",
        location: "Vịnh Lan Hạ",
        description: "Thức giấc đón bình minh huyền ảo trên Vịnh Lan Hạ, tham gia lớp tập Vovinam giải phóng năng lượng. Tìm hiểu nghệ thuật ẩm thực Việt qua lớp gói nem truyền thống trước khi check-out rời tàu về cảng.",
        activities: ["Tập võ Vovinam buổi sáng", "Lớp dạy gói nem rán Việt Nam", "Ăn trưa sớm rời tàu", "Về cảng Tuần Châu"]
      }
    ]
  }
];

export const mockHotels: Hotel[] = [
  {
    id: "hotel-vinpearl-halong",
    name: "Vinpearl Resort & Spa Hạ Long",
    description: "Nằm trọn vẹn trên hòn đảo Rều biệt lập thơ mộng, Vinpearl Resort & Spa Hạ Long được thiết kế mô phỏng theo hình dáng kiến trúc tân cổ điển hoàng gia của Nhà hát lớn Rennes (Pháp). Đây là khu nghỉ dưỡng 4 mặt hướng biển 360 độ độc nhất vô nhị mang đến trải nghiệm yên bình tách biệt hẳn với sự náo nhiệt của đất liền.",
    imageGallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200", // Resort exterior castle
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200", // Luxury hotel room
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200", // Inside indoor pool
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200"  // Premium room view
    ],
    stars: 5,
    amenities: [
      "3 bãi tắm riêng",
      "Bể bơi 1200m²",
      "Vincharm Spa",
      "Nhà hàng 5 sao",
      "Cano đưa đón 24/7",
      "Kid's Club"
    ],
    location: "Đảo Rều, Bãi Cháy, Hạ Long",
    roomCount: 384,
    roomTypes: [
      {
        name: "Phòng Deluxe Hướng Biển",
        description: "Diện tích 38m² với ban công riêng hướng thẳng ra kỳ quan Vịnh Hạ Long hùng vĩ, đầy đủ tiện nghi cao cấp.",
        pricePerNight: 3200000, // 3.2 triệu VNĐ
        capacity: "2 Người lớn, 2 Trẻ em",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600"
      },
      {
        name: "Phòng Executive Suite",
        description: "Căn hộ suite rộng 76m² có phòng khách riêng biệt sang trọng, bồn tắm nằm và tầm nhìn panorama ra vịnh biển từ trên cao.",
        pricePerNight: 6500000, // 6.5 triệu VNĐ
        capacity: "2 Người lớn, 2 Trẻ em",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600"
      }
    ]
  },
  {
    id: "hotel-yoko-onsen-quang-hanh",
    name: "Yoko Onsen Quang Hanh Resort",
    description: "Nằm yên bình giữa những thung lũng đá vôi trùng điệp của vùng Quang Hanh, Yoko Onsen là khu nghỉ dưỡng suối khoáng nóng chuẩn Nhật Bản đầu tiên tại Việt Nam. Nguồn khoáng chất tự nhiên chứa hàm lượng Brom cao và các chất vi lượng quý giúp phục hồi sức khỏe, cân bằng Thân - Tâm - Trí giữa không gian thiền định yên ả.",
    imageGallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200", // Zen water garden view
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200", // Japanese room tatami
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200"  // Spa massage treat
    ],
    stars: 5,
    amenities: [
      "Tắm khoáng Onsen",
      "Xông hơi đá muối",
      "Phòng Washitsu",
      "Vườn Nhật Bản",
      "Nhà hàng Ryu-an",
      "Trà đạo & Thiền"
    ],
    location: "Quang Hanh, Cẩm Phả, Quảng Ninh",
    roomCount: 68,
    roomTypes: [
      {
        name: "Phòng nghỉ Washitsu Omotenashi",
        description: "Phòng nghỉ phong cách Nhật Bản truyền thống với chiếu Tatami, nệm nằm kiểu Nhật và lối đi dẫn ra bể tắm khoáng riêng ngoài trời.",
        pricePerNight: 5500000, // 5.5 triệu VNĐ
        capacity: "2 Người lớn",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600"
      },
      {
        name: "Biệt thự Washitsu Yama (Hướng Núi)",
        description: "Biệt thự khoáng nóng cao cấp riêng biệt rộng 90m² ẩn mình sát vách đá vôi tĩnh lặng, trang bị 2 bể tắm Onsen nóng và lạnh riêng tư.",
        pricePerNight: 12000000, // 12 triệu VNĐ
        capacity: "4 Người lớn",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600"
      }
    ]
  },
  {
    id: "hotel-premier-village-halong",
    name: "Premier Village Ha Long Bay Resort",
    description: "Tọa lạc tại vị trí đắc địa dọc theo bãi biển Bãi Cháy thơ mộng, Premier Village cung cấp các căn biệt thự nghỉ dưỡng sang trọng bậc nhất với hồ bơi riêng độc lập. Được quản lý bởi tập đoàn Accor danh tiếng thế giới, đây là nơi hội tụ trọn vẹn của những kỳ nghỉ đẳng cấp thượng lưu cho đại gia đình hoặc nhóm bạn thân.",
    imageGallery: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200", // Beachfront villa pools
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200", // Villa interior
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"  // Outdoor lounge
    ],
    stars: 5,
    amenities: [
      "Hồ bơi riêng",
      "Bãi cát riêng",
      "Corallo BBQ",
      "Bể bơi trung tâm",
      "Gym & Kid's Club",
      "Xe điện nội khu"
    ],
    location: "Bãi Cháy, Hạ Long",
    roomCount: 225,
    roomTypes: [
      {
        name: "Biệt thự Premium 3 Phòng Ngủ",
        description: "Biệt thự rộng 280m² hướng vườn xanh mát, trang bị hồ bơi riêng, phòng khách rộng rãi và khu bếp nấu tiện nghi.",
        pricePerNight: 8500000, // 8.5 triệu VNĐ
        capacity: "6 Người lớn, 3 Trẻ em",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600"
      },
      {
        name: "Biệt thự Beachfront 4 Phòng Ngủ (Sát Biển)",
        description: "Siêu biệt thự 450m² nằm trực diện bãi biển cát trắng, ngắm hoàng hôn vịnh Hạ Long tuyệt đẹp với hồ bơi vô cực riêng.",
        pricePerNight: 18000000, // 18 triệu VNĐ
        capacity: "8 Người lớn, 4 Trẻ em",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600"
      }
    ]
  }
];

export const mockCombos: Combo[] = [
  {
    id: "combo-essence-vinpearl",
    name: "Combo Tinh Hoa Đất Trời: Siêu Du Thuyền Essence Grand & Vinpearl Đảo Rều",
    tagline: "Trải nghiệm trọn gói 2 ngày 1 đêm siêu du thuyền 6 sao và 1 đêm nghỉ dưỡng lâu đài đảo biệt lập",
    description: "Kỳ nghỉ đẳng cấp tối thượng kết hợp hoàn mỹ giữa dịch vụ hàng không nghỉ dưỡng cao cấp: Nghỉ dưỡng 1 đêm sang trọng tại Executive Suite Vinpearl Đảo Rều thơ mộng, thưởng thức trà chiều lãng mạn, sau đó di chuyển lên siêu du thuyền Essence Grand Hạ Long Superyacht khám phá kỳ quan thế giới trong hành trình 2 ngày 1 đêm.",
    cruiseId: "cruise-essence-grand",
    hotelId: "hotel-vinpearl-halong",
    salePrice: 7990000, // 7.99 triệu VNĐ / khách
    netPrice: 9900000,  // Giá gốc
    patternOptions: {
      hotelStayBeforeDays: 1,
      hotelStayAfterDays: 0
    }
  },
  {
    id: "combo-ambassador-yoko",
    name: "Combo Thư Giãn Tuyệt Đối: Du Thuyền Ambassador & Trị Liệu Khoáng Nóng Yoko Onsen",
    tagline: "Sự kết hợp hoàn hảo giữa du ngoạn ngắm vịnh ăn tối tôm hùm và ngâm khoáng nóng trị liệu chuẩn Nhật",
    description: "Gói đặc quyền hồi phục năng lượng cho Thân - Tâm - Trí: Trải nghiệm hải trình ẩm thực tôm hùm không giới hạn cùng show diễn âm nhạc đỉnh cao trên du thuyền 5 sao Ambassador Hạ Long, tiếp nối bằng 1 đêm nghỉ dưỡng phòng Washitsu thiền định và tắm khoáng Onsen tự nhiên tại Yoko Onsen Quang Hanh.",
    cruiseId: "cruise-ambassador",
    hotelId: "hotel-yoko-onsen-quang-hanh",
    salePrice: 8850000, // 8.85 triệu VNĐ / khách
    netPrice: 11000000,
    patternOptions: {
      hotelStayBeforeDays: 0,
      hotelStayAfterDays: 1
    }
  }
];

export const mockBlogs: Blog[] = [
  {
    id: "blog-halong-travel-guide",
    title: "Cẩm Nang Du Lịch Vịnh Hạ Long Từ A Đến Z Cho Năm 2026",
    excerpt: "Khám phá tất tần tật thông tin cần biết khi lên kế hoạch du hí Hạ Long: thời tiết đẹp nhất, cách di chuyển tối ưu và gợi ý các điểm đến nhất định phải ghé qua.",
    content: "Vịnh Hạ Long, một trong bảy kỳ quan thiên nhiên mới của thế giới, luôn sở hữu vẻ đẹp say lòng du khách suốt bốn mùa. Bài viết này sẽ cung cấp cho bạn cẩm nang chi tiết nhất về cách lựa chọn phương tiện di chuyển bằng limousine cao cấp, cự ly đi từ Hà Nội chỉ mất 2 giờ qua đường cao tốc, gợi ý danh sách các hang động hùng vĩ nhất như Hang Sửng Sốt, Hang Đầu Gỗ và hành trình trekking ngắm hoàng hôn đỉnh núi đảo Ti Tốp...",
    category: "Cẩm nang du lịch",
    publishedAt: "2026-05-28",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600",
    readTime: "5 phút đọc"
  },
  {
    id: "blog-luxury-cruising-halong",
    title: "Xu Hướng Trải Nghiệm Siêu Du Thuyền Sang Trọng 5-6 Sao Tại Vịnh Hạ Long",
    excerpt: "Tìm hiểu lý do tại sao dòng siêu du thuyền thế hệ mới lại trở thành lựa chọn nghỉ dưỡng đẳng cấp thu hút giới thượng lưu trong nước và quốc tế.",
    content: "Những năm gần đây, Vịnh Hạ Long chứng kiến sự bùng nổ của thế hệ siêu du thuyền cao cấp như Essence Grand hay Ambassador. Với hồ bơi vô cực nước mặn rộng lớn, các căn phòng tổng thống xa hoa rộng hơn 100m² tích hợp dịch vụ quản gia riêng, chuyến nghỉ dưỡng không còn đơn thuần là ngắm cảnh qua ô kính mà trở thành cuộc tận hưởng phong cách sống đẳng cấp hàng đầu thế giới ngay giữa biển khơi...",
    category: "Trải nghiệm du thuyền",
    publishedAt: "2026-05-22",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
    readTime: "4 phút đọc"
  },
  {
    id: "blog-onsens-quang-hanh-experience",
    title: "Liệu Pháp Tắm Khoáng Nóng Chuẩn Nhật Bản Hồi Phục Thân - Tâm - Trí",
    excerpt: "Khám phá quy trình tắm Onsen chuẩn 7 bước Nhật Bản và những tác dụng chữa lành tuyệt diệu của nguồn nước khoáng tự nhiên Quang Hanh Quảng Ninh.",
    content: "Tắm khoáng nóng trị liệu (Onsen) là nét văn hóa truyền thống của Nhật Bản giúp loại bỏ độc tố, lưu thông khí huyết và tái tạo năng lượng hiệu quả. Tại Yoko Onsen Quang Hanh, nguồn khoáng nóng brom tự nhiên được khai thác từ độ sâu hàng trăm mét dưới lòng đất vôi cổ xưa, mang hàm lượng khoáng chất quý hiếm đứng đầu thế giới. Bài viết sẽ hướng dẫn bạn quy trình tắm khoáng ngâm nóng, lạnh và xông hơi muối đá Himalaya đúng chuẩn thiền định...",
    category: "Kinh nghiệm du hành",
    publishedAt: "2026-05-10",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600",
    readTime: "6 phút đọc"
  },
  {
    id: "blog-lanha-itinerary",
    title: "Hải Trình Khám Phá Vịnh Lan Hạ 3 Ngày 2 Đêm Độc Bản",
    excerpt: "Gợi ý lịch trình khám phá vịnh Lan Hạ, chèo thuyền kayak qua Hang Sáng Tối và đạp xe thăm làng cổ Việt Hải yên bình.",
    content: "Vịnh Lan Hạ nằm liền kề Vịnh Hạ Long mang vẻ đẹp hoang sơ, biệt lập với các bãi tắm tự nhiên cát trắng mịn trải dài bên vách núi đá vôi. Với hành trình 3 ngày 2 đêm trên du thuyền Heritage Bình Chuẩn, du khách sẽ được chèo thuyền kayak khám phá Hang Sáng Tối thơ mộng, tắm biển giữa vịnh cát Ba Trái Đào lộng gió và đạp xe qua các cung đường thung lũng xanh mướt dẫn vào ngôi làng cổ Việt Hải...",
    category: "Cẩm nang du lịch",
    publishedAt: "2026-05-05",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=600",
    readTime: "5 phút đọc"
  },
  {
    id: "blog-essence-experiences",
    title: "Top 5 Trải Nghiệm Thượng Lưu Trên Siêu Du Thuyền Essence Grand",
    excerpt: "Khám phá phòng mô phỏng sân golf 3D, tắm hồ bơi vô cực nước mặn trực diện kỳ quan thế giới, và thưởng thức xì-gà tại hầm rượu vang.",
    content: "Essence Grand Hạ Long Superyacht được xem là định nghĩa mới của phong cách nghỉ dưỡng xa xỉ tại Việt Nam. Không chỉ là phương tiện di chuyển ngắm cảnh, siêu du thuyền này sở hữu một hệ sinh thái giải trí đỉnh cao: phòng mô phỏng chơi golf 3D hiện đại chuẩn PGA quốc tế, hầm rượu vang nhập khẩu phong phú kết hợp phòng Cigar cách âm tuyệt đối, hồ bơi vô cực nước mặn rộng hơn 150m² lộng gió...",
    category: "Trải nghiệm du thuyền",
    publishedAt: "2026-04-28",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=600",
    readTime: "4 phút đọc"
  },
  {
    id: "blog-combo-booking-tips",
    title: "Kinh Nghiệm Đặt Gói Combo Du Thuyền & Resort Đảo Rều Tiết Kiệm Hè 2026",
    excerpt: "Làm thế nào để đặt combo nghỉ dưỡng trọn gói tiết kiệm tới 30% chi phí nhưng vẫn hưởng trọn vẹn đặc quyền VIP đưa đón riêng biệt.",
    content: "Sự kết hợp giữa du thuyền thám hiểm vịnh và khách sạn nghỉ dưỡng biệt lập luôn là xu hướng hot nhất mỗi dịp hè về. Bài viết chia sẻ các mẹo đặt dịch vụ sớm trước 45 ngày để nhận mức chiết khấu Early Bird cực tốt, tận dụng các chính sách khuyến mại ngày thường trong tuần và phương án đăng ký nâng hạng phòng Suite miễn phí tại Vinpearl Resort & Spa Hạ Long...",
    category: "Kinh nghiệm du hành",
    publishedAt: "2026-04-15",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600",
    readTime: "6 phút đọc"
  }
];

export const mockReviews: Review[] = [
  {
    id: "rev-1",
    userName: "Nguyễn Hoàng Nam",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
    rating: 5,
    comment: "Chuyến nghỉ dưỡng 2 ngày 1 đêm trên siêu du thuyền Essence Grand vượt ngoài mong đợi của tôi. Bể bơi vô cực nước mặn quá đẹp, phòng ốc hiện đại đẳng cấp không khác gì resort 6 sao trên đất liền. Dịch vụ quản gia rất tinh tế, chăm sóc chu đáo từng bữa ăn.",
    date: "2026-05-12",
    stayType: "Essence Grand Hạ Long Superyacht"
  },
  {
    id: "rev-2",
    userName: "Trần Thị Thu Trang",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
    rating: 5,
    comment: "Vinpearl Resort & Spa Hạ Long thực sự xứng danh lâu đài nghỉ dưỡng. Nằm độc lập trên Đảo Rều nên không gian cực kỳ yên tĩnh và riêng tư. Khung cảnh hoàng hôn nhìn từ ban công phòng Executive Suite hướng vịnh đẹp đến nao lòng.",
    date: "2026-05-15",
    stayType: "Vinpearl Resort & Spa Hạ Long"
  },
  {
    id: "rev-3",
    userName: "Lâm Minh Triết",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150",
    rating: 5,
    comment: "Ambassador Cruise có boong tắm nắng sundeck siêu lớn, tối đến lên đây nghe nhạc sống acoustic uống ly cocktail và tận hưởng tiệc tôm hùm không giới hạn quả là trải nghiệm thượng lưu đáng tiền. Rất đáng giới thiệu cho bạn bè.",
    date: "2026-05-18",
    stayType: "Ambassador Cruise Hạ Long"
  },
  {
    id: "rev-4",
    userName: "Phạm Minh Thư",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150",
    rating: 4.8,
    comment: "Yoko Onsen Quang Hanh mang lại cảm giác tĩnh lặng tuyệt đối chuẩn thiền Nhật Bản. Ngâm mình trong bể khoáng nóng giữa thung lũng đá vôi mờ sương vào sáng sớm giúp cơ thể thư giãn vô cùng. Dịch vụ chăm sóc khách hàng cực kỳ chu đáo lịch thiệp.",
    date: "2026-05-24",
    stayType: "Yoko Onsen Quang Hanh Resort"
  }
];
