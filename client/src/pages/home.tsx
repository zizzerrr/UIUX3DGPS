import GPSBackground from '@/components/three/GPSBackground';
import Header from '@/components/Header';
import AlertCard from '@/components/AlertCard';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <GPSBackground />
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <AlertCard />
      </main>
      <Footer />
    </div>
  );
}
