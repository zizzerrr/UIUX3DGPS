import { MapPin, Satellite } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full py-6 px-4 relative z-10">
      <div className="max-w-lg mx-auto flex items-center justify-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
          <div className="relative p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full border border-primary/30">
            <Satellite className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-l from-primary via-secondary to-primary bg-clip-text text-transparent flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" />
            Clicklife GPS
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            نظام تنبيهات المركبات الذكي
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-secondary/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="relative p-3 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full border border-secondary/30">
            <MapPin className="w-6 h-6 text-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
}
