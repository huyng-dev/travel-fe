import type { Metadata } from "next";
import { Mulish, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/components/ScrollToTop";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRAVEL Hạ Long | Trải Nghiệm Du Thuyền & Khách Sạn Cao Cấp",
  description: "Đặt lịch trình siêu du thuyền 6 sao và khách sạn resort hạng sang tại Vịnh Hạ Long. Khám phá kỳ nghỉ dưỡng độc bản với dịch vụ chuyên nghiệp 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${mulish.variable} ${montserrat.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-800">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#ffffff",
              color: "#001226",
              border: "1px solid #c5a880",
              fontSize: "13px",
            },
          }}
        />
        <ScrollToTop />
      </body>
    </html>
  );
}
