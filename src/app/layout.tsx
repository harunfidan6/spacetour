import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { SpaceExperienceWrapper } from "@/components/space/SpaceExperienceWrapper";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceTour TR — 3D Sinematik Uzay Yolculuğu & Planetaryum",
  description:
    "spacetour.com.tr — Gerçek zamanlı 3D Güneş Sistemi yolculuğu, 360° interaktif gökyüzü haritası, planetaryum ve derin uzay gözlemevi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SpaceExperienceWrapper>
          <AnalyticsTracker />
          <Navbar />
          <main className="flex-1">{children}</main>
        </SpaceExperienceWrapper>
      </body>
    </html>
  );
}
