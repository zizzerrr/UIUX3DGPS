import AlertCard from '../AlertCard';
import { Toaster } from '@/components/ui/toaster';

export default function AlertCardExample() {
  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <AlertCard />
      <Toaster />
    </div>
  );
}
