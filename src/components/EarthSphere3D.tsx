import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Hotspot } from "../types";
import { Compass, RotateCcw, Play } from "lucide-react";

interface EarthSphere3DProps {
  hotspots?: Hotspot[];
  onSelectHotspot?: (hotspot: Hotspot) => void;
  isAutoRotating?: boolean;
  onToggleAutoRotate?: () => void;
}

export default function EarthSphere3D({
  hotspots = [],
  onSelectHotspot,
  isAutoRotating = true,
  onToggleAutoRotate
}: EarthSphere3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hudAngle, setHudAngle] = useState(0);

  // References to communicate with Three.js animate loop
  const rotControl = useRef<{
    earthGroup: THREE.Group | null;
    autoRotate: boolean;
    reset: () => void;
  }>({
    earthGroup: null,
    autoRotate: isAutoRotating,
    reset: () => {}
  });

  useEffect(() => {
    rotControl.current.autoRotate = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 550;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.85;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 2. Earth Group (Rotates in 360 degrees)
    const earthGroup = new THREE.Group();
    // Default orientation centered right on India & South Asia
    earthGroup.rotation.y = -1.6;
    earthGroup.rotation.x = 0.2;
    scene.add(earthGroup);
    rotControl.current.earthGroup = earthGroup;

    // 3. Load High-Resolution Light-Blue Equirectangular Earth Texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/earth_texture_map.jpg", () => {
      renderer.render(scene, camera);
    });
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = 8;

    // 4. True 3D Sphere Geometry (Crisp Vibrant Light-Blue Oceans & Landmasses)
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.62,
      metalness: 0.08,
      color: 0xffffff // Preserves exact light-blue ocean and continent colors
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    earthGroup.add(earthMesh);

    // 5. Atmospheric Outer Rim Glow (Electric Cyan/Light-Blue Fresnel Shell)
    const glowGeo = new THREE.SphereGeometry(1.026, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.35, 0.78, 1.0, 1.0) * intensity * 2.0;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    earthGroup.add(glowMesh);

    // 6. Orbital Trajectory Arc (Angled cyan ring)
    const orbitRadius = 1.36;
    const orbitCurve = new THREE.EllipseCurve(
      0, 0,
      orbitRadius, orbitRadius * 0.88,
      0, 2 * Math.PI,
      false,
      0
    );
    const orbitPoints = orbitCurve.getPoints(140);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(
      orbitPoints.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
    const orbitMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.07,
      gapSize: 0.035,
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    orbitLine.rotation.x = Math.PI / 3.2;
    orbitLine.rotation.y = Math.PI / 6;
    earthGroup.add(orbitLine);

    // 7. Interactive 3D Thermal Hotspot Beacons
    const latLongToVector3 = (lat: number, lon: number, radius = 1.015) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const targetPoints = [
      { id: "EVT-20260903-0042", name: "Paradip Petrochem", lat: 20.12, lon: 85.76, color: 0xef4444, size: 0.035 },
      { id: "EVT-20260903-0089", name: "Dahej Chemical", lat: 21.70, lon: 72.58, color: 0xf97316, size: 0.03 },
      { id: "EVT-20260902-0031", name: "Jharkhand Steel", lat: 22.79, lon: 86.18, color: 0xf59e0b, size: 0.028 },
      { id: "EVT-2861-DEL", name: "Northern Enclave", lat: 28.61, lon: 77.20, color: 0xef4444, size: 0.032 }
    ];

    const pulsingHalos: THREE.Mesh[] = [];

    targetPoints.forEach((tp) => {
      const pos = latLongToVector3(tp.lat, tp.lon);

      // Core sphere beacon
      const pinGeo = new THREE.SphereGeometry(tp.size, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: tp.color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      earthGroup.add(pinMesh);

      // Expanding radiant ring
      const ringGeo = new THREE.RingGeometry(tp.size * 1.3, tp.size * 2.5, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: tp.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      earthGroup.add(ringMesh);

      pulsingHalos.push(ringMesh);
    });

    // 8. Balanced Lighting (Rich Light-Blue Saturation, Zero White Blowout)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(5, 4, 4);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    fillLight.position.set(-4, -2, 2);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // 9. Interactive 360° Drag & Rotate (Mouse & Touch with Inertia)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let idleTimer: NodeJS.Timeout | null = null;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      rotControl.current.autoRotate = false;
      if (idleTimer) clearTimeout(idleTimer);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      velocityX = deltaX * 0.005;
      velocityY = deltaY * 0.005;

      earthGroup.rotation.y += velocityX;
      earthGroup.rotation.x += velocityY;

      // Clamp vertical tilt
      earthGroup.rotation.x = Math.max(-0.75, Math.min(0.75, earthGroup.rotation.x));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      // Resume slow auto-rotation after 4 seconds of idle
      idleTimer = setTimeout(() => {
        rotControl.current.autoRotate = true;
      }, 4000);
    };

    const domElement = renderer.domElement;
    domElement.style.cursor = "grab";
    domElement.addEventListener("mousedown", onPointerDown);
    domElement.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    domElement.addEventListener("touchstart", onPointerDown, { passive: true });
    domElement.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    rotControl.current.reset = () => {
      earthGroup.rotation.y = -1.6;
      earthGroup.rotation.x = 0.2;
      camera.position.z = 2.85;
      rotControl.current.autoRotate = true;
    };

    // 10. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();
    let lastHudUpdate = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Continuous 360° Auto-Rotation
      if (rotControl.current.autoRotate && !isDragging) {
        earthGroup.rotation.y += 0.0018;
      } else if (!isDragging && (Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001)) {
        // Smooth inertia
        earthGroup.rotation.y += velocityX;
        earthGroup.rotation.x = Math.max(-0.75, Math.min(0.75, earthGroup.rotation.x + velocityY));
        velocityX *= 0.94;
        velocityY *= 0.94;
      }

      // Update angle HUD throttled
      if (time - lastHudUpdate > 0.15) {
        const degrees = Math.round(((((-earthGroup.rotation.y * 180) / Math.PI) % 360) + 360) % 360);
        setHudAngle(degrees);
        lastHudUpdate = time;
      }

      // Pulse hotspot beacons
      pulsingHalos.forEach((halo, idx) => {
        const scale = 1 + Math.sin(time * 3 + idx) * 0.28;
        halo.scale.set(scale, scale, 1);
      });

      // Orbit spin
      orbitLine.rotation.z += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousedown", onPointerDown);
      domElement.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      domElement.removeEventListener("touchstart", onPointerDown);
      domElement.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Three.js 3D Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* 360° Sphere Orbit HUD + Live Monitoring Placed Side-by-Side (No Overlap) */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-auto">
        {/* 360° Angle HUD Control Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-white/80 backdrop-blur-md shadow-md text-xs text-slate-700 shrink-0">
          <Compass className="h-3.5 w-3.5 text-[#2563eb]" />
          <span className="text-[11px] font-semibold text-slate-700 whitespace-nowrap">
            360° Orbit • {hudAngle}°
          </span>
          <button
            onClick={() => rotControl.current.reset()}
            className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Reset Sphere to Center"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>

        {/* Live Monitoring Option Placed Directly Beside 360° Pill */}
        {onToggleAutoRotate && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-white/80 backdrop-blur-md shadow-md text-xs text-slate-800 shrink-0">
            <Play className="h-3 w-3 fill-current opacity-70" />
            <span className="text-[11px] font-semibold text-slate-700 whitespace-nowrap">
              Live
            </span>
            <button
              onClick={onToggleAutoRotate}
              className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                isAutoRotating ? "bg-emerald-500" : "bg-slate-300"
              }`}
              aria-label="Toggle Live Monitoring"
              title="Toggle Live Earth Rotation"
            >
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-xs ${
                isAutoRotating ? "left-3.5" : "left-0.5"
              }`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
