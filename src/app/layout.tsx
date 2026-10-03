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
import { CosmicTerminal } from "@/components/ui/CosmicTerminal";
import { FilmMode } from "@/components/film/FilmMode";

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
  title: {
    default: "SpaceTour TR — Kinetik Uzay Atlası",
    template: "%s — SpaceTour TR",
  },
  applicationName: "SpaceTour TR",
  openGraph: {
    siteName: "SpaceTour TR",
    locale: "tr_TR",
    type: "website",
  },
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
              "document.documentElement.classList.add('js');try{if(/[?&]film=1/.test(location.search)){document.documentElement.dataset.film='';sessionStorage.setItem('spacetour:intro','1')}if(sessionStorage.getItem('spacetour:intro')==='1')document.documentElement.dataset.introSeen=''}catch(e){}",
          }}
        />
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-yn8cD-_8qia_GwJOYv-e8.js" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();",
          }}
        />
        {/* Google Analytics 4 (GA4) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5F797S90G9" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5F797S90G9',{send_page_view:true});",
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
            <CosmicTerminal />
            <FilmMode />
            <div aria-hidden className="grain" />
          </PageTransitionProvider>
        </SpaceProvider>
      </body>
    </html>
  );
}
