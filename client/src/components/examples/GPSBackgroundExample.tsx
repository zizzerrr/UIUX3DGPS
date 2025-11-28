import GPSBackground from '../three/GPSBackground';

export default function GPSBackgroundExample() {
  return (
    <div className="w-full h-screen relative">
      <GPSBackground />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-foreground">
          <h2 className="text-2xl font-bold mb-2">GPS Background</h2>
          <p className="text-muted-foreground">3D animated grid with GPS markers</p>
        </div>
      </div>
    </div>
  );
}
