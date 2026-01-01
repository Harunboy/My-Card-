
import React, { useRef, useEffect, ReactNode } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

interface PhoneSceneProps {
  children: ReactNode;
}

const PhoneScene: React.FC<PhoneSceneProps> = ({ children }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const htmlContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || !htmlContainerRef.current) return;

    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 1.8;

    // WebGL Renderer (for the phone model)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // CSS3D Renderer (for the interactive screen)
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    cssRenderer.domElement.className = 'css3d-renderer';
    currentMount.appendChild(cssRenderer.domElement);
    
    // --- Phone Model ---
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // Constants for phone dimensions
    const phoneWidth = 1;
    const phoneHeight = phoneWidth * 2.1; // Aspect ratio
    const phoneDepth = 0.08;
    const bezelWidth = 0.05;

    // Phone Body
    const bodyGeometry = new RoundedBoxGeometry(phoneWidth, phoneHeight, phoneDepth, 6, 0.02);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.3,
    });
    const phoneBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    phoneGroup.add(phoneBody);
    
    // --- Interactive Screen ---
    const screenWidth = phoneWidth - bezelWidth;
    const screenHeight = phoneHeight - bezelWidth;

    const htmlObject = new CSS3DObject(htmlContainerRef.current);
    htmlObject.scale.set(0.001, 0.001, 0.001);
    htmlObject.position.set(0, 0, phoneDepth / 2 + 0.001); // Slightly in front of the body
    phoneGroup.add(htmlObject);
    
    // Set fixed size for HTML content to enable consistent scaling
    htmlContainerRef.current.style.width = `${screenWidth * 1000}px`;
    htmlContainerRef.current.style.height = `${screenHeight * 1000}px`;


    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = 2 * Math.PI / 3;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Handle window resize
    const handleResize = () => {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        cssRenderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        cssRenderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        if (renderer.domElement.parentElement === currentMount) {
          currentMount.removeChild(renderer.domElement);
        }
        if (cssRenderer.domElement.parentElement === currentMount) {
          currentMount.removeChild(cssRenderer.domElement);
        }
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative">
      <div ref={htmlContainerRef} className="absolute opacity-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default PhoneScene;
