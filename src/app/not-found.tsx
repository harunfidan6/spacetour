import { LostInSpace } from '@/components/ui/LostInSpace';

export default function NotFound() {
  return (
    <LostInSpace
      title="Bu koordinatta hiçbir şey yok"
      text="Aradığın sayfa yörüngeden çıkmış olabilir. Ana sayfaya dön ve yolculuğa oradan devam et."
      href="/"
      cta="Ana sayfaya dön"
    />
  );
}
