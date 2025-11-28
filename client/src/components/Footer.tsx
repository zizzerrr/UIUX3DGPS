import { Heart, Satellite } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-4 px-4 relative z-10 mt-auto">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Satellite className="w-4 h-4 text-primary" />
          <span>Clicklife GPS System</span>
          <Heart className="w-4 h-4 text-destructive animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground/60 mt-1">
          نظام تتبع وتنبيهات المركبات المتقدم
        </p>
      </div>
    </footer>
  );
}
