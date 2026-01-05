import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KKAM_BIZ - AI 트렌드 리서치",
  description: "키워드 입력 → AI 트렌드 리서치 → PPT + Excel 자동 생성",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
