import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function GPSGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.05 - 0.3;
      gridRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.02;
    }
  });

  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    const size = 20;
    const divisions = 15;
    const step = size / divisions;
    
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      const pos = i * step;
      lines.push(
        <line key={`h-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-size / 2, pos, 0, size / 2, pos, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00d4ff" transparent opacity={0.15} />
        </line>,
        <line key={`v-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([pos, -size / 2, 0, pos, size / 2, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffc8" transparent opacity={0.15} />
        </line>
      );
    }
    return lines;
  }, []);

  return (
    <group ref={gridRef} position={[0, 0, -5]}>
      {gridLines}
    </group>
  );
}

function GPSMarker({ position, delay }: { position: [number, number, number]; delay: number }) {
  const markerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (markerRef.current) {
      markerRef.current.scale.setScalar(0.8 + Math.sin(clock.elapsedTime * 2 + delay) * 0.2);
    }
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.5 + delay) * 0.3);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 
        0.3 + Math.sin(clock.elapsedTime * 1.5 + delay) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={markerRef}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#00ffc8" />
        </mesh>
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.25, 0.35, 32]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

function MovingVehicle({ startPos, endPos, duration }: { 
  startPos: [number, number, number]; 
  endPos: [number, number, number]; 
  duration: number;
}) {
  const vehicleRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Line>(null);
  
  useFrame(({ clock }) => {
    if (vehicleRef.current) {
      const t = ((clock.elapsedTime / duration) % 1);
      vehicleRef.current.position.x = THREE.MathUtils.lerp(startPos[0], endPos[0], t);
      vehicleRef.current.position.y = THREE.MathUtils.lerp(startPos[1], endPos[1], t);
      vehicleRef.current.position.z = THREE.MathUtils.lerp(startPos[2], endPos[2], t);
    }
  });

  return (
    <group>
      <mesh ref={vehicleRef}>
        <boxGeometry args={[0.3, 0.15, 0.2]} />
        <meshBasicMaterial color="#00ffc8" />
      </mesh>
    </group>
  );
}

function Scene() {
  const markers = useMemo(() => [
    { position: [-3, 2, -3] as [number, number, number], delay: 0 },
    { position: [4, -1, -4] as [number, number, number], delay: 1 },
    { position: [-2, -3, -2] as [number, number, number], delay: 2 },
    { position: [3, 3, -5] as [number, number, number], delay: 3 },
    { position: [0, 1, -3] as [number, number, number], delay: 1.5 },
    { position: [-4, 0, -4] as [number, number, number], delay: 2.5 },
  ], []);

  const vehicles = useMemo(() => [
    { startPos: [-5, 2, -3] as [number, number, number], endPos: [5, 2, -3] as [number, number, number], duration: 8 },
    { startPos: [5, -2, -4] as [number, number, number], endPos: [-5, -2, -4] as [number, number, number], duration: 10 },
    { startPos: [-3, -4, -2] as [number, number, number], endPos: [-3, 4, -2] as [number, number, number], duration: 12 },
  ], []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[-10, -10, 5]} intensity={0.3} color="#00ffc8" />
      
      <Stars 
        radius={50} 
        depth={50} 
        count={1000} 
        factor={3} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      
      <GPSGrid />
      
      {markers.map((marker, i) => (
        <GPSMarker key={i} position={marker.position} delay={marker.delay} />
      ))}
      
      {vehicles.map((vehicle, i) => (
        <MovingVehicle 
          key={i} 
          startPos={vehicle.startPos} 
          endPos={vehicle.endPos} 
          duration={vehicle.duration} 
        />
      ))}
    </>
  );
}

export default function GPSBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1628]" />
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
    </div>
  );
}
