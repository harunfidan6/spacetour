import { LostInSpace } from '@/components/ui/LostInSpace';

export default function NotFound() {
  return (
    <LostInSpace
      title="Gök cismi bulunamadı"
      text="Aradığın gezegen, yıldız ya da uydu arşivimizde yok. Belki de bir kara deliğin olay ufkundan geçti."
      href="/ansiklopedi"
      cta="Arşive dön"
    />
  );
}
