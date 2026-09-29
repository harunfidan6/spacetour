import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpaceProvider } from "@/components/space/SpaceContext";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { PageTransitionProvider } from "@/components/motion/PageTransition";
import { Preloader } from "@/components/motion/Preloader";
import { StarfieldBackdrop } from "@/components/motion/StarfieldBackdrop";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "SpaceTour TR — Kinetik Uzay Atlası",
  description:
    "spacetour.com.tr — Hareket eden bir uzay atlası: 3D Güneş Sistemi yolculuğu, 360° planetaryum, gök olayları takvimi, gezegen ansiklopedisi, astroloji ve çok dalgaboylu gözlemevi.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${archivo.variable} ${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{if(sessionStorage.getItem('spacetour:intro')==='1')document.documentElement.dataset.introSeen=''}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full bg-ink text-paper">
        <SpaceProvider>
          <PageTransitionProvider>
            <AnalyticsTracker />
            <StarfieldBackdrop />
            <Navbar />
            <main className="relative z-10 min-h-screen">{children}</main>
            <Footer />
            <Preloader />
            <div aria-hidden className="grain" />
          </PageTransitionProvider>
        </SpaceProvider>
      </body>
    </html>
  );
}
