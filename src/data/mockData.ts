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
  originalPrice?: number;
  category?: string;
  isHotDeal?: boolean;
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
  originalPrice?: number;
  category?: string;
  isHotDeal?: boolean;
  priceFrom?: number;
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
  category?: string;
  isHotDeal?: boolean;
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
    tagline: "Du thuyền xanh 5 sao sang trọng và hiện đại bậc nhất Vịnh Hạ Long",
    description: "Trải nghiệm kỳ nghỉ dưỡng trọn vẹn và thoải mái chuẩn 5 sao quốc tế tại Vịnh Hạ Long. Essence Grand Superyacht sở hữu hồ bơi vô cực nước mặn lớn nhất vịnh, phòng tập golf 3D hiện đại cùng dịch vụ chăm sóc chu đáo phục vụ 24/7.",
    imageGallery: [
      "https://store.duthuyenhalonglanha.com/data/2023/12/EGC-Flycam_-3.jpg", // Warm Hạ Long Bay cruise
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1200", // Friends traveling
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200", // Beach activity
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200"  // Cozy dining
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
    priceFrom: 7900000,
    originalPrice: 8900000,
    category: "cruise",
    isHotDeal: true,
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
    tagline: "Hành trình nghỉ dưỡng đáng nhớ với tiệc tôm hùm không giới hạn",
    description: "Ambassador Cruise là một trong những du thuyền lớn và hiện đại nhất trên Vịnh Hạ Long, nổi tiếng với thiết kế sang trọng, boong tắm nắng 2 tầng khổng lồ rộng tới 600m² và bể sục Jacuzzi ngoài trời. Nơi đây mang đến dịch vụ ẩm thực chuẩn 5 sao cùng các chương trình giải trí ca nhạc sống chất lượng cao mỗi tối.",
    imageGallery: [
      "https://azgotravel.com/storage/tour/7/ambassador-cruise-ha-long-1.jpg", // Real Ambassador Cruise image
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200", // Kayak activity on turquoise water
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200"  // Warm seafood dining
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
    priceFrom: 6200000,
    originalPrice: 7500000,
    category: "cruise",
    isHotDeal: true,
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
    name: "Heritage Cruise Bình Chuẩn Hạ Long",
    tagline: "Du thuyền di sản mang đậm phong cách kiến trúc Đông Dương cổ điển giữa kỳ quan",
    description: "Được thiết kế lấy cảm hứng từ con tàu lịch sử của vua tàu thủy Bạch Thái Bưởi thế kỷ 20, Heritage Bình Chuẩn mang đến một không gian đậm chất mỹ thuật, văn hóa và lịch sử Đông Dương (Indochine). Hành trình đưa quý khách khám phá những vùng biển hoang sơ nhất của quần thể di sản Hạ Long, nơi có bộ sưu tập hơn 100 tác phẩm tranh di sản vô giá.",
    imageGallery: [
      "https://owa.bestprice.vn/images/cruises/uploads/du-thuyen-heritage-binh-chuan-6475c847b78c2.jpg", 
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200", 
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200", 
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200"
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
    destinations: ["Vịnh Hạ Long", "Hang Sửng Sốt", "Hang Sáng Tối", "Bãi biển Ba Trái Đào"],
    durationDays: 3,
    startDates: ["2026-06-10", "2026-06-14", "2026-06-18", "2026-06-22"],
    launchYear: "2020",
    material: "Hợp kim thép bọc gỗ Indochine mỹ thuật",
    cabinCount: 20,
    priceFrom: 6800000,
    originalPrice: 7800000,
    category: "cruise",
    isHotDeal: true,
    itinerary: [
      {
        day: 1,
        title: "Khởi hành từ Tuần Châu - Hạ Long khám phá vùng vịnh hoang sơ",
        location: "Vịnh Hạ Long",
        description: "Đón khách từ cảng Tuần Châu bằng xuồng cao tốc ra tàu Heritage giữa làn nước xanh lục bảo. Thưởng thức bữa trưa đậm hương vị Việt cổ điển, chiều tự do tắm biển và chèo thuyền kayak tại vùng vịnh yên tĩnh, tận hưởng không gian tĩnh lặng của kỳ quan thiên nhiên.",
        activities: ["Xuồng cao tốc ra du thuyền", "Thưởng thức bữa trưa thuần Việt", "Chèo thuyền kayak tắm biển", "Tiệc rượu hoàng hôn trên boong"]
      },
      {
        day: 2,
        title: "Hành trình di sản Làng chài cổ Hạ Long",
        location: "Vịnh Hạ Long",
        description: "Dành trọn vẹn ngày thứ hai để tham quan Làng chài cổ nằm biệt lập giữa vùng vịnh Hạ Long. Quý khách đạp xe dọc theo con đường thung lũng xanh mướt, ngắm nhìn kiến trúc nhà gỗ tranh cổ xưa và cảm nhận nhịp sống chậm rãi giữa lòng di sản.",
        activities: ["Đạp xe khám phá làng chài", "Dùng bữa trưa hải sản trên đầm", "Thăm quan Hang Sáng Tối", "Thưởng thức trà chiều di sản"]
      },
      {
        day: 3,
        title: "Bình minh trên Vịnh & Lớp học ẩm thực",
        location: "Vịnh Hạ Long",
        description: "Thức giấc đón bình minh huyền ảo, tham gia lớp tập Vovinam giải phóng năng lượng. Tìm hiểu nghệ thuật ẩm thực Việt qua lớp gói nem truyền thống trước khi tàu quay trở về cảng Tuần Châu kết thúc hành trình.",
        activities: ["Tập võ Vovinam buổi sáng", "Lớp dạy gói nem rán Việt Nam", "Ăn trưa sớm rời tàu", "Về cảng Tuần Châu"]
      }
    ]
  },
  {
    id: "cruise-capella",
    name: "Capella Cruise Hạ Long",
    tagline: "Du thuyền nghỉ dưỡng hiện đại với máng trượt nước ngoài trời độc đáo",
    description: "Du thuyền Capella mang đến kỳ nghỉ dưỡng vui tươi và thoải mái cho cả gia đình. Với phong cách kiến trúc Đông Dương kết hợp cùng các tiện ích giải trí sôi động như máng trượt nước từ boong tắm nắng xuống biển, hồ bơi Oasis Jacuzzi, sân golf mini và phòng karaoke chất lượng, Capella là điểm đến lý tưởng cho những du khách tìm kiếm trải nghiệm năng động.",
    imageGallery: [
      "https://www.halonghub.com/wp-content/uploads/2025/07/1-20.jpg",
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1200",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200"
    ],
    stars: 5,
    amenities: [
      "Máng trượt nước",
      "Hồ bơi Oasis Jacuzzi",
      "Sân golf mini",
      "Phòng Karaoke",
      "Cigar & Poker Club",
      "Chèo thuyền Kayak"
    ],
    destinations: ["Vịnh Hạ Long", "Vịnh Lan Hạ", "Ao Ếch", "Hang Sáng Tối"],
    durationDays: 2,
    startDates: ["2026-06-11", "2026-06-14", "2026-06-17", "2026-06-20", "2026-06-23"],
    launchYear: "2020",
    material: "Thép bọc thép kết cấu hiện đại",
    cabinCount: 30,
    priceFrom: 6500000,
    originalPrice: 7500000,
    category: "cruise",
    isHotDeal: true,
    itinerary: [
      {
        day: 1,
        title: "Khởi hành từ cảng Tuần Châu & Vui chơi máng trượt nước tại Ao Ếch",
        location: "Vịnh Lan Hạ - Ao Ếch",
        description: "Lên du thuyền Capella đón chào bằng nước mát và khăn lạnh. Tàu hành trình qua những đảo đá vôi kỳ vĩ hướng về vùng vịnh Lan Hạ hoang sơ. Buổi chiều, du khách tham gia các hoạt động giải trí độc đáo: trượt nước từ máng trượt khổng lồ xuống biển, bơi lội tại hồ bơi Oasis ngoài trời hoặc chèo thuyền kayak khám phá khu vực Ao Ếch.",
        activities: ["Thưởng thức đồ uống chào mừng", "Ăn trưa buffet tại nhà hàng Harmony of the Sea", "Trải nghiệm máng trượt nước & Kayak", "Tiệc hoàng hôn Sunset Party"]
      },
      {
        day: 2,
        title: "Khám phá Hang Sáng Tối bằng đò nan & Trở về cảng",
        location: "Hang Sáng Tối - Vịnh Hạ Long",
        description: "Bắt đầu ngày mới với lớp học Taichi thanh lọc cơ thể đón bình minh. Quý khách di chuyển bằng đò nan do người dân địa phương chèo qua Hang Sáng Tối, chiêm ngưỡng thung lũng nước trong xanh phẳng lặng bao bọc bởi vách đá cao sừng sững. Trở về tàu dùng bữa trưa sớm trước khi cập cảng Tuần Châu.",
        activities: ["Tập Taichi đón bình minh", "Khám phá Hang Sáng Tối bằng đò nan", "Dùng bữa trưa buffet sớm rời tàu", "Cập cảng Tuần Châu"]
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
      "https://statics.vinpearl.com/Vinpearl-Resort-va-Spa-Ha-Long-%E2%80%93-Diem-den-hoan-hao-cho-ky-nghi-duong-cuoi-tuan-ben-gia-dinh-hinh-anh-1.png", // Sunny pool
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200", // Comfortable room
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200", // Zen garden
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200"
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
    ],
    priceFrom: 3200000,
    originalPrice: 3800000,
    category: "hotel",
    isHotDeal: true
  },
  {
    id: "hotel-halios-halong",
    name: "Khách sạn Halios Hotel Hạ Long",
    description: "Tọa lạc tại khu vực Hòn Gai sôi động, Halios Hotel Hạ Long mang đến không gian lưu trú hiện đại, ấm cúng và vô cùng thuận tiện cho du khách. Từ khách sạn, bạn có thể dễ dàng di chuyển tham quan bảo tàng Quảng Ninh, chợ Hạ Long và thưởng thức ẩm thực đường phố đặc sắc tại Hòn Gai với mức chi phí vô cùng hợp lý.",
    imageGallery: [
      "https://owa.bestprice.vn/images/hotels/uploads/halios-hotel-halong-64746aedea146.jpg",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"
    ],
    stars: 5,
    amenities: [
      "Gần trung tâm Hòn Gai",
      "Wifi miễn phí",
      "Ăn sáng buffet",
      "Dịch vụ dọn phòng",
      "Lễ tân 24h"
    ],
    location: "Hòn Gai, Hạ Long, Quảng Ninh",
    roomCount: 50,
    roomTypes: [
      {
        name: "Phòng Superior Double/Twin",
        description: "Diện tích 22m² ấm cúng, thiết kế hiện đại, đầy đủ trang thiết bị tiện nghi cơ bản.",
        pricePerNight: 950000,
        capacity: "2 Người lớn",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600"
      },
      {
        name: "Phòng Deluxe City View",
        description: "Diện tích 28m² với cửa sổ rộng hướng nhìn toàn cảnh thành phố Hòn Gai nhộn nhịp.",
        pricePerNight: 1200000,
        capacity: "2 Người lớn, 1 Trẻ em",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600"
      }
    ],
    priceFrom: 950000,
    originalPrice: 1200000,
    category: "hotel",
    isHotDeal: true
  },
  {
    id: "hotel-premier-village-halong",
    name: "Premier Village Ha Long Bay Resort",
    description: "Tọa lạc tại vị trí đắc địa dọc theo bãi biển Bãi Cháy thơ mộng, Premier Village cung cấp các căn biệt thự nghỉ dưỡng đầy đủ tiện nghi với hồ bơi riêng độc lập. Được quản lý bởi tập đoàn Accor danh tiếng thế giới, đây là nơi hội tụ trọn vẹn của những kỳ nghỉ ấm cúng, thư giãn cho đại gia đình hoặc nhóm bạn thân.",
    imageGallery: [
      "https://cdn3.ivivu.com/2022/08/Premier-Village-H%E1%BA%A1-Long-ivivu-1.jpg", // Cozy garden villa
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
    ],
    priceFrom: 8500000,
    originalPrice: 9800000,
    category: "villa",
    isHotDeal: true
  },
  {
    id: "restaurant-hong-hanh",
    name: "Nhà hàng Hải sản Hồng Hạnh 3",
    description: "Nhà hàng ẩm thực hải sản nổi tiếng nhất Hạ Long với tầm nhìn trực diện bờ biển Bãi Cháy. Nơi đây phục vụ các món ăn chế biến từ hải sản tươi sống được đánh bắt trực tiếp từ vịnh trong ngày, không gian hiện đại, sang trọng phù hợp cho đại gia đình và tiếp khách.",
    imageGallery: [
      "https://exotrails.com/explore/wp-content/uploads/2025/01/Nha-hang-Hong-Hanh-3-4.webp", // Cozy dining
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200"
    ],
    stars: 5,
    amenities: [
      "View biển Bãi Cháy",
      "Hải sản tươi sống",
      "Phòng VIP riêng",
      "Bãi đỗ xe rộng",
      "Menu phong phú"
    ],
    location: "Đường Hạ Long, Bãi Cháy, Hạ Long",
    roomCount: 0,
    roomTypes: [
      {
        name: "Set Menu Đặc Sản Vịnh Hạ Long",
        description: "Set menu dành cho nhóm từ 4-6 người gồm: súp cua hải sản, chả mực Hạ Long rán nóng, tôm hùm tre hấp bia, mực xào cần tỏi và lẩu hải sản.",
        pricePerNight: 850000, // 850k VNĐ / người
        capacity: "4-6 Người",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600"
      }
    ],
    priceFrom: 850000,
    originalPrice: 1050000,
    category: "restaurant",
    isHotDeal: true
  },
  {
    id: "restaurant-1958",
    name: "Nhà hàng 1958 Tuần Châu",
    description: "Tọa lạc tại khu biệt thự cảng Tuần Châu sang trọng, Nhà hàng 1958 nổi tiếng với phong cách ẩm thực Bắc Bộ tinh tế kết hợp hiện đại. Không gian nhà hàng được thiết kế theo lối kiến trúc biệt thự Pháp cổ sang trọng, ấm cúng. Nơi đây là điểm hẹn lý tưởng cho những ai muốn thưởng thức các món ăn đặc sản Hạ Long được nâng tầm nghệ thuật chế biến.",
    imageGallery: [
      "https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwwo1z1ppkuxc3", // Cozy dining
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200"
    ],
    stars: 5,
    amenities: [
      "Kiến trúc biệt thự Pháp",
      "Ẩm thực Bắc Bộ tinh tế",
      "Không gian VIP riêng tư",
      "Sân vườn ngoài trời",
      "Gần cảng du thuyền"
    ],
    location: "Khu biệt thự cảng Ngọc Châu, Tuần Châu, Hạ Long",
    roomCount: 0,
    roomTypes: [
      {
        name: "Set Menu Tinh Hoa Ẩm Thực Việt",
        description: "Set menu đặc biệt tôn vinh hương vị truyền thống gồm: gỏi cuốn tôm thịt, chả cá Lã Vọng thơm nồng, cua gạch hấp lá lốt, canh cá nấu chua kiểu Bắc và chè hạt sen long nhãn.",
        pricePerNight: 950000,
        capacity: "2-8 Người",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600"
      }
    ],
    priceFrom: 950000,
    originalPrice: 1200000,
    category: "restaurant",
    isHotDeal: true
  }
];

export const mockCombos: Combo[] = [
  {
    id: "combo-essence-vinpearl",
    name: "Combo Trải Nghiệm Kỳ Quan: Du Thuyền Essence Grand & Vinpearl Đảo Rều",
    tagline: "Hành trình trọn gói 2 ngày 1 đêm trên du thuyền 5 sao và 1 đêm nghỉ dưỡng resort đảo thơ mộng",
    description: "Kỳ nghỉ trọn vẹn kết hợp hoàn hảo giữa đất liền và biển khơi: Nghỉ dưỡng 1 đêm thoải mái tại Vinpearl Đảo Rều thơ mộng, thưởng thức trà chiều lãng mạn, sau đó di chuyển lên du thuyền Essence Grand Hạ Long khám phá kỳ quan thiên nhiên trong hành trình 2 ngày 1 đêm.",
    cruiseId: "cruise-essence-grand",
    hotelId: "hotel-vinpearl-halong",
    salePrice: 7990000, // 7.99 triệu VNĐ / khách
    netPrice: 9900000,  // Giá gốc
    patternOptions: {
      hotelStayBeforeDays: 1,
      hotelStayAfterDays: 0
    },
    category: "combo",
    isHotDeal: true
  },
  {
    id: "combo-ambassador-halios",
    name: "Combo Tiết Kiệm: Du Thuyền Ambassador & Khách Sạn Halios Hạ Long",
    tagline: "Sự kết hợp hoàn hảo giữa du thuyền 5 sao sang trọng và khách sạn hiện đại tại trung tâm Hòn Gai",
    description: "Gói combo nghỉ dưỡng giá tốt: Trải nghiệm hải trình ẩm thực tôm hùm không giới hạn trên du thuyền Ambassador Hạ Long, kết hợp với 1 đêm lưu trú thoải mái tại Halios Hotel Hạ Long tiện nghi ngay trung tâm Hòn Gai.",
    cruiseId: "cruise-ambassador",
    hotelId: "hotel-halios-halong",
    salePrice: 4500000, // 4.5 triệu VNĐ / khách
    netPrice: 5500000,
    patternOptions: {
      hotelStayBeforeDays: 0,
      hotelStayAfterDays: 1
    },
    category: "combo",
    isHotDeal: true
  },
  {
    id: "combo-capella-1958",
    name: "Combo Kỳ Nghỉ Vui Vẻ: Du Thuyền Capella & Trải Nghiệm Nhà Hàng 1958",
    tagline: "Vui chơi máng trượt nước độc đáo trên biển và thưởng thức set menu hương vị Việt ấm cúng tại Tuần Châu",
    description: "Sự kết hợp tuyệt vời giữa các hoạt động giải trí ngoài khơi và ẩm thực truyền thống ấm cúng: Hành trình 2 ngày 1 đêm trên du thuyền Capella vui chơi cực đã với máng trượt nước, sau đó thưởng thức bữa tối set menu hấp dẫn tại nhà hàng 1958 Tuần Châu.",
    cruiseId: "cruise-capella",
    hotelId: "restaurant-1958",
    salePrice: 6990000,
    netPrice: 8500000,
    patternOptions: {
      hotelStayBeforeDays: 0,
      hotelStayAfterDays: 1
    },
    category: "combo",
    isHotDeal: true
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
    image: "https://cdn3.ivivu.com/2023/11/du-lich-ha-long-ivivu.jpg",
    readTime: "5 phút đọc"
  },
  {
    id: "blog-luxury-cruising-halong",
    title: "Xu Hướng Nghỉ Dưỡng Trên Các Du Thuyền Cao Cấp 5 Sao Tại Vịnh Hạ Long",
    excerpt: "Tìm hiểu lý do tại sao du lịch nghỉ đêm trên du thuyền lại trở thành lựa chọn yêu thích thu hút nhiều du khách trong và ngoài nước.",
    content: "Những năm gần đây, Vịnh Hạ Long chứng kiến sự bùng nổ của dịch vụ nghỉ dưỡng trên du thuyền cao cấp như Essence Grand hay Ambassador. Với hồ bơi vô cực rộng lớn, phòng ngủ tiện nghi có ban công riêng hướng vịnh, chuyến đi của bạn sẽ là hành trình thư giãn trọn vẹn và đáng nhớ giữa lòng kỳ quan...",
    category: "Trải nghiệm du thuyền",
    publishedAt: "2026-05-22",
    image: "https://store.duthuyenhalonglanha.com/data/2023/12/EGC-Flycam_-3.jpg",
    readTime: "4 phút đọc"
  },
  {
    id: "blog-onsens-quang-hanh-experience",
    title: "Liệu Pháp Tắm Khoáng Nóng Chuẩn Nhật Bản Hồi Phục Thân - Tâm - Trí",
    excerpt: "Khám phá quy trình tắm Onsen chuẩn 7 bước Nhật Bản và những tác dụng chữa lành tuyệt diệu của nguồn nước khoáng tự nhiên tại Hạ Long Quảng Ninh.",
    content: "Tắm khoáng nóng trị liệu (Onsen) là nét văn hóa truyền thống của Nhật Bản giúp loại bỏ độc tố, lưu thông khí huyết và tái tạo năng lượng hiệu quả. Tại Yoko Onsen Hạ Long, nguồn khoáng nóng brom tự nhiên được khai thác từ độ sâu hàng trăm mét dưới lòng đất vôi cổ xưa, mang hàm lượng khoáng chất quý hiếm đứng đầu thế giới. Bài viết sẽ hướng dẫn bạn quy trình tắm khoáng ngâm nóng, lạnh và xông hơi muối đá Himalaya đúng chuẩn thiền định...",
    category: "Kinh nghiệm du hành",
    publishedAt: "2026-05-10",
    image: "https://onlinebooking.vn/wp-content/uploads/khoang-nong-onsen-yoko-quang-hanh-quang-ninh-1.jpg",
    readTime: "6 phút đọc"
  },
  {
    id: "blog-lanha-itinerary",
    title: "Hải Trình Khám Phá Vịnh Hạ Long 3 Ngày 2 Đêm Độc Bản",
    excerpt: "Gợi ý lịch trình khám phá vùng vịnh phía Nam Hạ Long, chèo thuyền kayak qua Hang Sáng Tối và tham quan làng chài yên bình.",
    content: "Vùng biển phía Nam Vịnh Hạ Long mang vẻ đẹp hoang sơ, biệt lập với các bãi tắm tự nhiên cát trắng mịn trải dài bên vách núi đá vôi. Với hành trình 3 ngày 2 đêm trên du thuyền Heritage Bình Chuẩn, du khách sẽ được chèo thuyền kayak khám phá Hang Sáng Tối thơ mộng, tắm biển giữa vịnh cát Ba Trái Đào lộng gió và khám phá những cung đường thung lũng xanh mướt dẫn vào ngôi làng chài cổ...",
    category: "Cẩm nang du lịch",
    publishedAt: "2026-05-05",
    image: "https://owa.bestprice.vn/images/cruises/uploads/du-thuyen-heritage-binh-chuan-6475c847b78c2.jpg",
    readTime: "5 phút đọc"
  },
  {
    id: "blog-essence-experiences",
    title: "Top 5 Trải Nghiệm Thú Vị Trên Du Thuyền Essence Grand",
    excerpt: "Khám phá phòng mô phỏng sân golf 3D, tắm hồ bơi vô cực nước mặn trực diện kỳ quan thế giới, và thưởng thức ẩm thực phong phú.",
    content: "Essence Grand Hạ Long được xem là biểu tượng nghỉ dưỡng hiện đại tại Vịnh Hạ Long. Không chỉ là phương tiện ngắm vịnh, du thuyền này sở hữu nhiều tiện ích giải trí thú vị: phòng mô phỏng chơi golf 3D hiện đại, khu vực ẩm thực phong phú, hồ bơi vô cực nước mặn rộng hơn 150m² lộng gió...",
    category: "Trải nghiệm du thuyền",
    publishedAt: "2026-04-28",
    image: "https://www.halonghub.com/wp-content/uploads/2025/07/1-20.jpg",
    readTime: "4 phút đọc"
  },
  {
    id: "blog-combo-booking-tips",
    title: "Kinh Nghiệm Đặt Gói Combo Du Thuyền & Resort Đảo Rều Tiết Kiệm Hè 2026",
    excerpt: "Làm thế nào để đặt combo nghỉ dưỡng trọn gói tiết kiệm tới 30% chi phí nhưng vẫn hưởng trọn vẹn đặc quyền VIP đưa đón riêng biệt.",
    content: "Sự kết hợp giữa du thuyền thám hiểm vịnh và khách sạn nghỉ dưỡng biệt lập luôn là xu hướng hot nhất mỗi dịp hè về. Bài viết chia sẻ các mẹo đặt dịch vụ sớm trước 45 ngày để nhận mức chiết khấu Early Bird cực tốt, tận dụng các chính sách khuyến mại ngày thường trong tuần và phương án đăng ký nâng hạng phòng Suite miễn phí tại Vinpearl Resort & Spa Hạ Long...",
    category: "Kinh nghiệm du hành",
    publishedAt: "2026-04-15",
    image: "https://statics.vinpearl.com/Vinpearl-Resort-va-Spa-Ha-Long-%E2%80%93-Diem-den-hoan-hao-cho-ky-nghi-duong-cuoi-tuan-ben-gia-dinh-hinh-anh-1.png",
    readTime: "6 phút đọc"
  }
];

export const mockReviews: Review[] = [
  {
    id: "rev-1",
    userName: "Nguyễn Hoàng Nam",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
    rating: 5,
    comment: "Chuyến nghỉ dưỡng 2 ngày 1 đêm trên du thuyền Essence Grand vượt ngoài mong đợi của tôi. Bể bơi vô cực nước mặn quá đẹp, phòng ốc hiện đại và đầy đủ tiện nghi như resort trên đất liền. Đội ngũ nhân viên rất chu đáo, chăm sóc nhiệt tình từng bữa ăn.",
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
    userName: "Lê Hoài Nam",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150",
    rating: 5,
    comment: "Gia đình tôi 8 người đã có kỳ nghỉ tuyệt vời tại biệt thự sát biển của Premier Village Ha Long. Căn biệt thự vô cùng rộng rãi, hồ bơi riêng tư tuyệt đối cho các bé vui chơi. Dịch vụ Accor chuyên nghiệp, xe điện phục vụ nội khu rất nhanh chóng.",
    date: "2026-05-28",
    stayType: "Premier Village Ha Long Bay Resort"
  },
  {
    id: "rev-4",
    userName: "Ngô Quốc Khánh",
    userAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150",
    rating: 5,
    comment: "Nhà hàng Hồng Hạnh 3 có đồ hải sản cực kỳ tươi ngon, chế biến vừa miệng. Chúng tôi đi nhóm 6 người đặt set menu đặc sản rất đầy đặn. View nhìn trực diện biển Bãi Cháy buổi tối lộng gió và lãng mạn. Giá cả vô cùng xứng đáng với chất lượng phục vụ.",
    date: "2026-05-30",
    stayType: "Nhà hàng Hải sản Hồng Hạnh 3"
  },
  {
    id: "rev-5",
    userName: "Hoàng Kim Chi",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
    rating: 5,
    comment: "Gói combo Trải Nghiệm Kỳ Quan thực sự rất tuyệt vời. Việc kết hợp 1 đêm trên du thuyền Essence Grand và 1 đêm nghỉ dưỡng tại Vinpearl Đảo Rều giúp chúng tôi trải nghiệm trọn vẹn cả biển cả và đất liền Hạ Long mà không phải tự lên lịch trình phức tạp.",
    date: "2026-06-02",
    stayType: "Combo Trải Nghiệm Kỳ Quan"
  }
];
