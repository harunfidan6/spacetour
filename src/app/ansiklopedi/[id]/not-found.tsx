import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-[120px] drop-shadow-2xl mb-4">
        🕳️
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Gök Cismi <span className="text-[#ff6b35]">Bulunamadı</span>
      </h1>
      <p className="text-[#8a8a9a] max-w-md mx-auto mb-8 text-lg">
        Aradığınız gezegen, yıldız veya gök cismi veritabanımızda bulunmuyor. Belki de bir kara deliğe düşmüştür!
      </p>
      <Link 
        href="/ansiklopedi" 
        className="inline-flex items-center px-6 py-3 bg-[#00d4ff] text-[#0a0a1a] font-semibold rounded-lg hover:bg-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Ansiklopediye Dön
      </Link>
    </div>
  );
}
