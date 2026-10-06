import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Archivo, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpaceProvider } from "@/components/space/SpaceContext";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { PageTransitionProvider } from "@/components/motion/PageTransition";
import { Preloader } from "@/components/motion/Preloader";
import { StarfieldBackdrop } from "@/components/motion/StarfieldBackdrop";
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
  metadataBase: new URL("https://spacetour.com.tr"),
  title: {
    default: "SpaceTour TR — Kinetik Uzay Atlası & 3D Gök Küresi",
    template: "%s — SpaceTour TR",
  },
  applicationName: "SpaceTour TR",
  description:
    "Hareket eden bir uzay atlası: 3D Güneş Sistemi yolculuğu, 3D gök küresi, gök olayları takvimi, gezegen ansiklopedisi, astroloji ve canlı gözlemevi.",
  keywords: [
    "spacetour",
    "spacetour tr",
    "uzay atlası",
    "güneş sistemi",
    "3d gök küresi",
    "iss canlı konum",
    "gök olayları takvimi",
    "astronomi",
    "gezegenler",
    "astroloji",
    "burçlar",
    "doğum haritası",
    "yıldız haritası",
    "uzay simülasyonu",
    "türkiye uzay",
    "gökbilim"
  ],
  authors: [{ name: "SpaceTour TR", url: "https://spacetour.com.tr" }],
  creator: "SpaceTour TR",
  publisher: "SpaceTour TR",
  alternates: {
    canonical: "https://spacetour.com.tr",
  },
  openGraph: {
    title: "SpaceTour TR — Kinetik Uzay Atlası",
    description: "3D Güneş Sistemi yolculuğu, 3D gök küresi, gök olayları takvimi, gezegen ansiklopedisi ve canlı uzay gözlemevi.",
    url: "https://spacetour.com.tr",
    siteName: "SpaceTour TR",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpaceTour TR — Kinetik Uzay Atlası",
    description: "3D Güneş Sistemi yolculuğu, 3D gök küresi ve canlı uzay takibi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
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
        {/* Schema.org JSON-LD Structured Data for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://spacetour.com.tr/#website",
                  "url": "https://spacetour.com.tr",
                  "name": "SpaceTour TR",
                  "description": "Hareket eden bir kinetik uzay atlası: 3D Güneş Sistemi, gök küresi ve canlı gökyüzü takibi.",
                  "inLanguage": "tr-TR"
                },
                {
                  "@type": "Organization",
                  "@id": "https://spacetour.com.tr/#organization",
                  "name": "SpaceTour TR",
                  "url": "https://spacetour.com.tr",
                  "logo": "https://spacetour.com.tr/logo-512.png",
                  "email": "info@spacetour.com.tr"
                },
                {
                  "@type": "ItemList",
                  "@id": "https://spacetour.com.tr/#navigation",
                  "name": "Ana Dizin Menüsü",
                  "itemListElement": [
                    { "@type": "SiteNavigationElement", "position": 1, "name": "Gök Haritası & Gök Küresi", "url": "https://spacetour.com.tr/harita" },
                    { "@type": "SiteNavigationElement", "position": 2, "name": "Gök Olayları Takvimi", "url": "https://spacetour.com.tr/takvim" },
                    { "@type": "SiteNavigationElement", "position": 3, "name": "Gezegen Ansiklopedisi", "url": "https://spacetour.com.tr/ansiklopedi" },
                    { "@type": "SiteNavigationElement", "position": 4, "name": "Astroloji & Zodyak Atlası", "url": "https://spacetour.com.tr/astroloji" },
                    { "@type": "SiteNavigationElement", "position": 5, "name": "Çok Dalgaboylu Gözlemevi", "url": "https://spacetour.com.tr/gozlemevi" },
                    { "@type": "SiteNavigationElement", "position": 6, "name": "Canlı Gökyüzü & ISS", "url": "https://spacetour.com.tr/canli" },
                    { "@type": "SiteNavigationElement", "position": 7, "name": "3D Güneş Sistemi Yolculuğu", "url": "https://spacetour.com.tr/yolculuk" }
                  ]
                }
              ]
            }),
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
            <FilmMode />
            <div aria-hidden className="grain" />
            {/* Google Analytics 4: sayfa yüklendikten sonra; ilk boyamayı ve etkileşimi geciktirmesin */}
            <Script src="https://www.googletagmanager.com/gtag/js?id=G-5F797S90G9" strategy="lazyOnload" />
            <Script id="ga4-init" strategy="lazyOnload">
              {"window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5F797S90G9',{send_page_view:true});"}
            </Script>
          </PageTransitionProvider>
        </SpaceProvider>
      </body>
    </html>
  );
}
