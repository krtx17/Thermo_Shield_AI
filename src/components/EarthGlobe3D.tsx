import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Hotspot } from "../types";

interface EarthGlobe3DProps {
  hotspots?: Hotspot[];
  onSelectHotspot?: (hotspot: Hotspot) => void;
  isDark?: boolean;
}

export default function EarthGlobe3D({
  hotspots = [],
  onSelectHotspot,
  isDark = false
}: EarthGlobe3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.75;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Earth Group
    const earthGroup = new THREE.Group();
    // Default orientation centered on India / South Asia (matching the reference photo)
    earthGroup.rotation.y = -1.65;
    earthGroup.rotation.x = 0.22;
    scene.add(earthGroup);

    // 3. High-Detail Procedural Texture (Realistic Blue Marble with Golden City Lights & Thermal Flares)
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Rich Deep Ocean Gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, "#08213d");
    oceanGrad.addColorStop(0.3, "#0e345c");
    oceanGrad.addColorStop(0.7, "#0b2a4c");
    oceanGrad.addColorStop(1, "#071c35");
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Coordinate helpers
    const toX = (lon: number) => ((lon + 180) / 360) * canvas.width;
    const toY = (lat: number) => ((90 - lat) / 180) * canvas.height;

    // Detailed Continents
    const drawLand = (coords: [number, number][], fillColor = "#284a32", strokeColor = "#3d6b49") => {
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      coords.forEach(([lat, lon], idx) => {
        const x = toX(lon);
        const y = toY(lat);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // Indian Subcontinent (Center Stage)
    drawLand(
      [
        [37, 72], [36, 77], [32, 79], [30, 81], [28, 88], [27, 94], [24, 93], [22, 89],
        [19, 86], [16, 82], [13, 80], [8.5, 77.5], [10, 76], [15, 73.8], [20, 72.8],
        [23, 68.8], [25, 68.2], [28, 70], [33, 71.5]
      ],
      "#385e3b",
      "#4a7a4f"
    );

    // Eurasian Landmass & Himalayas
    drawLand(
      [
        [72, 30], [73, 60], [70, 95], [68, 130], [60, 140], [50, 135], [42, 130],
        [35, 120], [25, 118], [20, 110], [12, 105], [10, 98], [18, 96], [22, 91],
        [27, 88], [34, 76], [38, 55], [42, 40], [52, 32], [62, 28]
      ],
      "#2c4c36",
      "#3b6347"
    );

    // Middle East & Arabian Peninsula
    drawLand(
      [
        [32, 35], [30, 48], [25, 55], [23, 58], [15, 53], [12, 44], [18, 40],
        [27, 35], [32, 35]
      ],
      "#5a5238",
      "#6e6445"
    );

    // Southeast Asia & Sunda
    drawLand(
      [
        [18, 100], [12, 102], [4, 103], [-6, 106], [-8, 115], [-5, 120],
        [2, 118], [7, 115], [15, 108], [18, 100]
      ],
      "#2e5635",
      "#3f7247"
    );

    // Africa
    drawLand(
      [
        [36, -5], [37, 11], [32, 32], [22, 38], [11, 45], [2, 42], [-12, 40],
        [-28, 32], [-35, 20], [-25, 15], [-6, 12], [4, 2], [5, -10],
        [15, -17], [28, -12], [36, -5]
      ],
      "#3d4d33",
      "#4d6140"
    );

    // Australia
    drawLand(
      [
        [-14, 128], [-12, 136], [-15, 145], [-25, 153], [-36, 150],
        [-38, 144], [-35, 118], [-22, 114], [-14, 128]
      ],
      "#5c4a30",
      "#735d3d"
    );

    // Golden City Lights & Luminous Thermal Glows (Matching exact reference photo!)
    const addCityCluster = (lat: number, lon: number, radius: number, alpha: number) => {
      const x = toX(lon);
      const y = toY(lat);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, `rgba(255, 240, 180, ${alpha})`);
      grad.addColorStop(0.3, `rgba(255, 175, 50, ${alpha * 0.8})`);
      grad.addColorStop(0.6, `rgba(249, 115, 22, ${alpha * 0.5})`);
      grad.addColorStop(1, "rgba(255, 100, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    // Radiating Golden City Clusters & Thermal Corridors across India
    addCityCluster(28.6, 77.2, 38, 0.95);  // Northern Hub / Delhi
    addCityCluster(19.0, 73.0, 35, 0.9);   // Mumbai / West Coast
    addCityCluster(20.1, 85.8, 36, 1.0);   // Paradip Coastal Refinery
    addCityCluster(21.7, 72.6, 32, 0.9);   // Dahej Petrochem Belt
    addCityCluster(22.8, 86.2, 34, 0.9);   // Jharkhand Industrial
    addCityCluster(13.0, 80.2, 30, 0.85);  // Chennai / Coromandel
    addCityCluster(17.4, 78.5, 28, 0.8);   // Hyderabad
    addCityCluster(12.9, 77.6, 30, 0.85);  // Bangalore
    addCityCluster(22.5, 88.4, 34, 0.9);   // Kolkata
    addCityCluster(25.3, 83.0, 26, 0.8);   // Indo-Gangetic Plain
    addCityCluster(26.9, 75.8, 25, 0.75);  // Rajasthan
    addCityCluster(24.5, 81.0, 28, 0.8);   // Central India

    // Additional East Asian & Middle Eastern Night Lights
    addCityCluster(25.0, 55.0, 28, 0.85);  // Dubai / Gulf
    addCityCluster(13.7, 100.5, 25, 0.75); // Bangkok
    addCityCluster(1.3, 103.8, 24, 0.8);   // Singapore

    // Realistic Cloud Texture Swirls over Planet Surface
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    for (let i = 0; i < 90; i++) {
      const cx = (i * 31) % canvas.width;
      const cy = ((i * 47) % (canvas.height * 0.75)) + (canvas.height * 0.12);
      const rw = 45 + (i % 6) * 22;
      const rh = 12 + (i % 4) * 8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rw, rh, (i % 5) * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 4. Main Earth Sphere Mesh
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.6,
      metalness: 0.15
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    earthGroup.add(earthMesh);

    // 5. Atmospheric Outer Rim Glow (Electric Blue Fresnel Halo matching reference photo)
    const glowGeo = new THREE.SphereGeometry(1.035, 64, 64);
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
          gl_FragColor = vec4(0.35, 0.72, 1.0, 1.0) * intensity * 1.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    earthGroup.add(glowMesh);

    // 6. Orbital Ring around Planet
    const orbitRadius = 1.38;
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
      opacity: 0.8
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    orbitLine.rotation.x = Math.PI / 3.2;
    orbitLine.rotation.y = Math.PI / 6;
    earthGroup.add(orbitLine);

    // 7. Interactive Hotspot 3D Pins with Pulsing Radiant Halos
    const latLongToVector3 = (lat: number, lon: number, radius = 1.015) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const targetPoints = [
      { name: "Paradip Petrochem", lat: 20.12, lon: 85.76, color: 0xef4444, size: 0.035 },
      { name: "Dahej Chemical", lat: 21.70, lon: 72.58, color: 0xf97316, size: 0.03 },
      { name: "Jharkhand Steel", lat: 22.79, lon: 86.18, color: 0xf59e0b, size: 0.028 },
      { name: "Delhi Industrial", lat: 28.61, lon: 77.20, color: 0xef4444, size: 0.032 }
    ];

    const pulsingRings: THREE.Mesh[] = [];

    targetPoints.forEach((tp) => {
      const pos = latLongToVector3(tp.lat, tp.lon);

      // Core pin
      const pinGeo = new THREE.SphereGeometry(tp.size, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: tp.color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      earthGroup.add(pinMesh);

      // Radiant Halo Ring
      const ringGeo = new THREE.RingGeometry(tp.size * 1.3, tp.size * 2.4, 24);
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

      pulsingRings.push(ringMesh);
    });

    // 8. Lighting (Warm Sun light from top-right matching reference photo)
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.6);
    sunLight.position.set(5, 4, 4);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.9);
    fillLight.position.set(-4, -2, 2);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0x1e3a5f, 1.4);
    scene.add(ambientLight);

    // 9. Interactive Dragging / Rotating with Mouse & Touch
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let autoRotate = true;
    let autoRotateTimer: NodeJS.Timeout | null = null;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      autoRotate = false;
      if (autoRotateTimer) clearTimeout(autoRotateTimer);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      earthGroup.rotation.y += deltaX * 0.005;
      earthGroup.rotation.x += deltaY * 0.005;

      // Clamp vertical tilt
      earthGroup.rotation.x = Math.max(-0.75, Math.min(0.75, earthGroup.rotation.x));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      autoRotateTimer = setTimeout(() => {
        autoRotate = true;
      }, 3500);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.0015;
      camera.position.z = Math.max(1.9, Math.min(4.2, camera.position.z));
    };

    const domElement = renderer.domElement;
    domElement.style.cursor = "grab";
    domElement.addEventListener("mousedown", onPointerDown);
    domElement.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    domElement.addEventListener("touchstart", onPointerDown, { passive: true });
    domElement.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    domElement.addEventListener("wheel", onWheel, { passive: false });

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle auto-rotation
      if (autoRotate && !isDragging) {
        earthGroup.rotation.y += 0.0016;
      }

      // Pulse hotspot rings
      pulsingRings.forEach((ring, idx) => {
        const scale = 1 + Math.sin(time * 3 + idx) * 0.28;
        ring.scale.set(scale, scale, 1);
      });

      // Orbit spin
      orbitLine.rotation.z += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Resize handler
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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousedown", onPointerDown);
      domElement.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      domElement.removeEventListener("touchstart", onPointerDown);
      domElement.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      domElement.removeEventListener("wheel", onWheel);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
    />
  );
}
