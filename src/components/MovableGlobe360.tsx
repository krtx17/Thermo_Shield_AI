import React, { useState, useEffect, useRef } from "react";
import { Hotspot } from "../types";
import { RotateCcw, Compass, Flame } from "lucide-react";

interface MovableGlobe360Props {
  hotspots?: Hotspot[];
  onSelectHotspot?: (hotspot: Hotspot) => void;
  isAutoRotating?: boolean;
}

export default function MovableGlobe360({
  hotspots = [],
  onSelectHotspot,
  isAutoRotating = true
}: MovableGlobe360Props) {
  // 360-degree rotation angles
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(isAutoRotating);
  const [zoom, setZoom] = useState(1);

  const prevPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Sync external auto-rotate prop
  useEffect(() => {
    setAutoRotate(isAutoRotating);
  }, [isAutoRotating]);

  // Continuous smooth 360-degree rotation animation loop
  useEffect(() => {
    const loop = () => {
      if (autoRotate && !isDragging) {
        setRotY((prev) => (prev + 0.25) % 360);
      } else if (!isDragging && (Math.abs(velocity.current.x) > 0.05 || Math.abs(velocity.current.y) > 0.05)) {
        // Inertia after user flings the globe
        setRotY((prev) => (prev + velocity.current.x) % 360);
        setRotX((prev) => Math.max(-40, Math.min(40, prev + velocity.current.y)));
        velocity.current.x *= 0.94;
        velocity.current.y *= 0.94;
      }
      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [autoRotate, isDragging]);

  // Drag interaction handlers (Mouse & Touch)
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setAutoRotate(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    prevPos.current = { x: clientX, y: clientY };
    velocity.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - prevPos.current.x;
    const deltaY = clientY - prevPos.current.y;

    const speedX = deltaX * 0.45;
    const speedY = -deltaY * 0.35;

    velocity.current = { x: speedX, y: speedY };

    setRotY((prev) => (prev + speedX) % 360);
    setRotX((prev) => Math.max(-40, Math.min(40, prev + speedY)));

    prevPos.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // Resume gentle auto-rotation after 4 seconds of inactivity
    idleTimer.current = setTimeout(() => {
      setAutoRotate(true);
    }, 4000);
  };

  // Hotspot points over India and industrial areas
  const targetHotspots = [
    { id: "EVT-ODISHA", name: "Paradip Petrochem", x: 54, y: 44, color: "#ef4444", severity: "CRITICAL" },
    { id: "EVT-GUJARAT", name: "Dahej Chemical", x: 44, y: 45, color: "#f97316", severity: "HIGH RISK" },
    { id: "EVT-JHARKHAND", name: "Jharkhand Steel", x: 55, y: 41, color: "#f59e0b", severity: "MODERATE" },
    { id: "EVT-DELHI", name: "Northern Enclave", x: 48, y: 34, color: "#ef4444", severity: "CRITICAL" }
  ];

  const handleResetRotation = () => {
    setRotX(0);
    setRotY(0);
    setZoom(1);
    setAutoRotate(true);
  };

  return (
    <div className="relative flex items-center justify-center select-none w-full h-full">
      
      {/* 360° Rotational Interactive Stage */}
      <div
        className="relative cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `scale(${zoom})`,
          touchAction: "none"
        }}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handlePointerUp}
      >
        {/* Globe Container with 3D Perspective & 360 Rotation */}
        <div
          className="relative rounded-full shadow-2xl overflow-hidden w-[290px] h-[290px] sm:w-[440px] sm:h-[440px] md:w-[510px] md:h-[510px]"
          style={{
            perspective: "1200px",
            boxShadow: "0 0 60px rgba(56, 189, 248, 0.4), inset 0 0 50px rgba(14, 165, 233, 0.25)"
          }}
        >
          {/* Rotating Globe Image (Exact Photo from User Reference) */}
          <img
            src="/earth_globe_isolated.png"
            alt="360 Movable Earth Globe"
            draggable={false}
            className="w-full h-full object-cover rounded-full pointer-events-none transition-transform"
            style={{
              transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transformOrigin: "center center",
              filter: "brightness(1.02) contrast(1.04)"
            }}
          />

          {/* 3D Spherical Light & Shadow Shading Overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${65 - rotY * 0.05}% ${25 + rotX * 0.2}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 30%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.65) 100%)`
            }}
          />

          {/* Atmospheric Glowing Rim Light */}
          <div className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-sky-400/40 shadow-[inset_0_0_40px_rgba(56,189,248,0.4)]" />

          {/* Thermal Hotspots Pulsing on Planet Face */}
          {targetHotspots.map((spot) => {
            // Calculate 3D projected position based on current Y rotation
            const baseAngle = ((spot.x - 50) / 50) * 90; // degrees from center
            const currentAngle = baseAngle + rotY;
            const rad = (currentAngle * Math.PI) / 180;
            const isVisible = Math.cos(rad) > 0; // Only visible when facing front hemisphere

            if (!isVisible) return null;

            const projX = 50 + Math.sin(rad) * 44;
            const projY = spot.y + (rotX * 0.25);

            return (
              <div
                key={spot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectHotspot && hotspots.length > 0) {
                    const match = hotspots.find(h => h.id.includes(spot.id)) || hotspots[0];
                    onSelectHotspot(match);
                  }
                }}
                className="absolute z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${projX}%`,
                  top: `${projY}%`
                }}
              >
                {/* Glowing Pulse Rings */}
                <div 
                  className="w-5 h-5 rounded-full absolute -top-1 -left-1 animate-ping opacity-75"
                  style={{ backgroundColor: spot.color }}
                />
                
                {/* Pin Core */}
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-md group-hover:scale-125 transition-transform"
                  style={{ backgroundColor: spot.color }}
                />

                {/* Tooltip on hover */}
                <div className="hidden group-hover:flex absolute left-4 -top-2 px-2 py-1 rounded-md bg-slate-900/90 text-white text-[10px] font-bold whitespace-nowrap backdrop-blur-xs shadow-md">
                  {spot.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick 360 Controls Pill (Floating Below Globe) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 border border-white/80 backdrop-blur-md shadow-sm text-xs text-slate-700">
        <Compass className="h-3.5 w-3.5 text-[#2563eb]" />
        <span className="text-[11px] font-semibold text-slate-600">
          360° Drag to Rotate • {Math.round((((rotY % 360) + 360) % 360))}°
        </span>
        <button
          onClick={handleResetRotation}
          className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Reset to Center"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </div>

    </div>
  );
}
