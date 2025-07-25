import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);
  const cameraRef = useRef(null); // Track camera
  const rendererRef = useRef(null); // Track renderer
  const particlesRef = useRef(null); // Track particles

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particles (Rain)
    const particlesCount = 400;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10; // x
      positions[i * 3 + 1] = Math.random() * 10;         // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      velocities[i] = 0.002 + Math.random() * 0.003;       // speed
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.001 : 0.002, // Adjust size based on screen width
      color: new THREE.Color('white'),
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Animate particles (rainfall)
    const animate = () => {
      requestAnimationFrame(animate);
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < particlesCount; i++) {
        pos[i * 3 + 1] -= velocities[i]; // fall down

        if (pos[i * 3 + 1] < -5) {
          pos[i * 3 + 1] = 5; // reset to top
        }
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler - optimized
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;

      // Only update camera and renderer if needed
      if (camera.aspect !== aspectRatio) {
        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
      }
      if (renderer.domElement.width !== width || renderer.domElement.height !== height) {
        renderer.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array ensures this effect runs once after component mount

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThreeBackground;
