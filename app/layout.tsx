import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  display: "swap",
});
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});
const jbMono = JetBrains_Mono({
  variable: "--font-jb-mono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinSplit — Personal Finance + Group Splitting",
  description: "จัดการเงินส่วนตัว + หารค่าใช้จ่ายกับเพื่อน",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      className={`h-full antialiased ${plexThai.variable} ${grotesk.variable} ${jbMono.variable}`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
