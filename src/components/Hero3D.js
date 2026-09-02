import * as THREE from 'three';

export function initHero3D() {
  const container = document.getElementById('canvas-3d-container');
  const canvas = document.getElementById('canvas-3d');
  if (!container || !canvas) return;

  // Setup Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080c, 0.035);

  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(3.2, 1.8, 4.2);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  // Lighting Setup
  const ambientLight = new THREE.AmbientLight(0x222a3a, 2.5);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);

  // Red Broadcast Accent Rim Light
  const rimLightRed = new THREE.PointLight(0xff2a44, 5.0, 10);
  rimLightRed.position.set(-3, 2, -2);
  scene.add(rimLightRed);

  // Studio Gold Fill Light
  const fillLightGold = new THREE.PointLight(0xf59e0b, 2.8, 8);
  fillLightGold.position.set(3, -1, 3);
  scene.add(fillLightGold);

  // Cool Cyan Under-Glow
  const underGlowCyan = new THREE.PointLight(0x38bdf8, 1.5, 6);
  underGlowCyan.position.set(0, -3, 0);
  scene.add(underGlowCyan);

  // Master Camera Rig Assembly Group
  const rigGroup = new THREE.Group();
  scene.add(rigGroup);

  // Material Library
  const materials = {
    cameraBody: new THREE.MeshStandardMaterial({
      color: 0x141822,
      metalness: 0.85,
      roughness: 0.25,
      name: 'cameraBody'
    }),
    carbonFiber: new THREE.MeshStandardMaterial({
      color: 0x0f1117,
      metalness: 0.4,
      roughness: 0.5,
      name: 'carbonFiber'
    }),
    metallicChrome: new THREE.MeshStandardMaterial({
      color: 0xdde4ed,
      metalness: 0.95,
      roughness: 0.15,
      name: 'metallicChrome'
    }),
    matteBlack: new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.2,
      roughness: 0.8,
      name: 'matteBlack'
    }),
    lensGlass: new THREE.MeshPhysicalMaterial({
      color: 0x0a1420,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 1.2,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      name: 'lensGlass'
    }),
    tallyOff: new THREE.MeshStandardMaterial({
      color: 0x4a0a12,
      emissive: 0x220000,
      roughness: 0.3,
      name: 'tallyOff'
    }),
    tallyOn: new THREE.MeshStandardMaterial({
      color: 0xff334b,
      emissive: 0xff1a35,
      emissiveIntensity: 2.8,
      roughness: 0.1,
      name: 'tallyOn'
    }),
    lcdDisplay: new THREE.MeshBasicMaterial({
      color: 0x061826,
      name: 'lcdDisplay'
    }),
    goldMount: new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.3,
      name: 'goldMount'
    })
  };

  // Wireframe Blueprint Material for X-Ray toggle
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true
  });
  const wireframeRedMaterial = new THREE.MeshBasicMaterial({
    color: 0xff2a44,
    wireframe: true
  });

  // Track parts for Exploded View & Animation
  const parts = {
    body: null,
    lens: new THREE.Group(),
    matteBox: new THREE.Group(),
    viewfinder: new THREE.Group(),
    battery: new THREE.Group(),
    rodsAndBase: new THREE.Group(),
    focusGearRing: null,
    tallyMesh: null,
    tallyLight: null,
    lensFrontGlass: null
  };

  // 1. MAIN CAMERA BODY (Sony HDC / Venice style broadcast block)
  const bodyGeo = new THREE.BoxGeometry(1.2, 1.0, 1.6);
  parts.body = new THREE.Mesh(bodyGeo, materials.cameraBody);
  parts.body.position.set(0, 0, 0);
  parts.body.castShadow = true;
  parts.body.receiveShadow = true;
  rigGroup.add(parts.body);

  // Side ventilation ribs & audio XLR ports
  const ribGeo = new THREE.BoxGeometry(0.04, 0.6, 0.08);
  for (let i = -0.4; i <= 0.4; i += 0.15) {
    const rib = new THREE.Mesh(ribGeo, materials.metallicChrome);
    rib.position.set(0.61, i * 0.5, i);
    parts.body.add(rib);
  }

  // Camera Sensor Block & Lens Mount Ring
  const mountRingGeo = new THREE.CylinderGeometry(0.42, 0.45, 0.15, 32);
  mountRingGeo.rotateX(Math.PI / 2);
  const mountRing = new THREE.Mesh(mountRingGeo, materials.metallicChrome);
  mountRing.position.set(0, 0, 0.85);
  parts.body.add(mountRing);

  // 2. BROADCAST CINEMA LENS (stepped barrel, zoom / focus rings)
  // Base lens barrel
  const lensBarrel1Geo = new THREE.CylinderGeometry(0.38, 0.42, 0.7, 32);
  lensBarrel1Geo.rotateX(Math.PI / 2);
  const lensBarrel1 = new THREE.Mesh(lensBarrel1Geo, materials.matteBlack);
  lensBarrel1.position.set(0, 0, 0.35);
  parts.lens.add(lensBarrel1);

  // Focus Gear Ring (to animate with Focus Rack)
  const focusRingGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.22, 36);
  focusRingGeo.rotateX(Math.PI / 2);
  parts.focusGearRing = new THREE.Mesh(focusRingGeo, materials.metallicChrome);
  parts.focusGearRing.position.set(0, 0, 0.65);
  parts.lens.add(parts.focusGearRing);

  // Aperture/Zoom markings ring
  const irisRingGeo = new THREE.CylinderGeometry(0.40, 0.40, 0.12, 32);
  irisRingGeo.rotateX(Math.PI / 2);
  const irisRing = new THREE.Mesh(irisRingGeo, materials.carbonFiber);
  irisRing.position.set(0, 0, 0.82);
  parts.lens.add(irisRing);

  // Front flared optic housing
  const frontBarrelGeo = new THREE.CylinderGeometry(0.55, 0.40, 0.5, 32);
  frontBarrelGeo.rotateX(Math.PI / 2);
  const frontBarrel = new THREE.Mesh(frontBarrelGeo, materials.cameraBody);
  frontBarrel.position.set(0, 0, 1.1);
  parts.lens.add(frontBarrel);

  // Front Optical Glass Element
  const glassGeo = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35);
  glassGeo.rotateX(-Math.PI / 2);
  parts.lensFrontGlass = new THREE.Mesh(glassGeo, materials.lensGlass);
  parts.lensFrontGlass.position.set(0, 0, 1.32);
  parts.lens.add(parts.lensFrontGlass);

  parts.lens.position.set(0, 0, 0.9);
  rigGroup.add(parts.lens);

  // 3. MATTE BOX & SUNSHADE
  const mbFrameGeo = new THREE.BoxGeometry(1.4, 1.1, 0.3);
  const mbFrame = new THREE.Mesh(mbFrameGeo, materials.matteBlack);
  mbFrame.position.set(0, 0, 0.15);
  parts.matteBox.add(mbFrame);

  // French Flag (Top Visor)
  const topFlagGeo = new THREE.BoxGeometry(1.45, 0.04, 0.6);
  const topFlag = new THREE.Mesh(topFlagGeo, materials.carbonFiber);
  topFlag.position.set(0, 0.56, 0.38);
  topFlag.rotation.x = -0.25;
  parts.matteBox.add(topFlag);

  // Side Flags (Barn Doors)
  const sideFlagGeo = new THREE.BoxGeometry(0.04, 1.0, 0.5);
  const leftFlag = new THREE.Mesh(sideFlagGeo, materials.carbonFiber);
  leftFlag.position.set(-0.73, 0, 0.35);
  leftFlag.rotation.y = 0.3;
  parts.matteBox.add(leftFlag);

  const rightFlag = new THREE.Mesh(sideFlagGeo, materials.carbonFiber);
  rightFlag.position.set(0.73, 0, 0.35);
  rightFlag.rotation.y = -0.3;
  parts.matteBox.add(rightFlag);

  parts.matteBox.position.set(0, 0, 2.3);
  rigGroup.add(parts.matteBox);

  // 4. TOP HANDLE & VIEW FINDER
  const handleBridgeGeo = new THREE.BoxGeometry(0.18, 0.12, 1.2);
  const handleBridge = new THREE.Mesh(handleBridgeGeo, materials.metallicChrome);
  handleBridge.position.set(0, 0.95, -0.1);
  rigGroup.add(handleBridge);

  const handlePillar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16), materials.metallicChrome);
  handlePillar1.position.set(0, 0.72, 0.35);
  rigGroup.add(handlePillar1);

  const handlePillar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16), materials.metallicChrome);
  handlePillar2.position.set(0, 0.72, -0.55);
  rigGroup.add(handlePillar2);

  // Swivel LCD Viewfinder / Field Monitor
  const vfMountArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12);
  vfMountArmGeo.rotateZ(Math.PI / 2);
  const vfMountArm = new THREE.Mesh(vfMountArmGeo, materials.metallicChrome);
  vfMountArm.position.set(-0.4, 0.8, 0.3);
  parts.viewfinder.add(vfMountArm);

  const monitorBezelGeo = new THREE.BoxGeometry(0.08, 0.7, 0.9);
  const monitorBezel = new THREE.Mesh(monitorBezelGeo, materials.matteBlack);
  monitorBezel.position.set(-0.68, 0.8, 0.3);
  monitorBezel.rotation.y = -0.35;
  parts.viewfinder.add(monitorBezel);

  // LCD Screen with glowing camera HUD graphics
  const lcdScreenGeo = new THREE.PlaneGeometry(0.8, 0.6);
  lcdScreenGeo.rotateY(Math.PI / 2);
  const lcdScreen = new THREE.Mesh(lcdScreenGeo, materials.lcdDisplay);
  lcdScreen.position.set(-0.63, 0.8, 0.3);
  lcdScreen.rotation.y = -0.35;
  parts.viewfinder.add(lcdScreen);

  // Monitor Tally Dot
  const monTallyGeo = new THREE.SphereGeometry(0.03, 12, 12);
  const monTally = new THREE.Mesh(monTallyGeo, materials.tallyOn);
  monTally.position.set(-0.62, 1.1, 0.65);
  parts.viewfinder.add(monTally);

  rigGroup.add(parts.viewfinder);

  // 5. MASTER TALLY LIGHT ON CAMERA ROOF
  const tallyHouseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.14, 16);
  const tallyHouse = new THREE.Mesh(tallyHouseGeo, materials.metallicChrome);
  tallyHouse.position.set(0, 0.56, 0.6);
  rigGroup.add(tallyHouse);

  const tallyLampGeo = new THREE.SphereGeometry(0.1, 16, 16);
  parts.tallyMesh = new THREE.Mesh(tallyLampGeo, materials.tallyOn);
  parts.tallyMesh.position.set(0, 0.65, 0.6);
  rigGroup.add(parts.tallyMesh);

  parts.tallyLight = new THREE.PointLight(0xff1a35, 3.5, 4);
  parts.tallyLight.position.set(0, 0.7, 0.6);
  rigGroup.add(parts.tallyLight);

  // 6. GOLD MOUNT / V-MOUNT BROADCAST BATTERY (Rear)
  const batteryGeo = new THREE.BoxGeometry(1.05, 0.8, 0.45);
  const batteryMesh = new THREE.Mesh(batteryGeo, materials.matteBlack);
  batteryMesh.position.set(0, 0, -0.25);
  parts.battery.add(batteryMesh);

  // Battery pins & connector
  const battPlateGeo = new THREE.BoxGeometry(0.6, 0.5, 0.06);
  const battPlate = new THREE.Mesh(battPlateGeo, materials.goldMount);
  battPlate.position.set(0, 0, -0.01);
  parts.battery.add(battPlate);

  // LED Gauge on Battery
  for (let b = 0; b < 4; b++) {
    const ledGeo = new THREE.BoxGeometry(0.04, 0.08, 0.02);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.35, -0.15 + b * 0.12, -0.48);
    parts.battery.add(ledMesh);
  }

  parts.battery.position.set(0, 0, -0.9);
  rigGroup.add(parts.battery);

  // 7. 15mm SUPPORT RODS & BASEPLATE (Bottom)
  const baseplateGeo = new THREE.BoxGeometry(0.9, 0.16, 2.4);
  const baseplate = new THREE.Mesh(baseplateGeo, materials.carbonFiber);
  baseplate.position.set(0, -0.58, 0.2);
  parts.rodsAndBase.add(baseplate);

  // Dual Stainless Steel 15mm Rods
  const rodGeo = new THREE.CylinderGeometry(0.045, 0.045, 3.2, 16);
  rodGeo.rotateX(Math.PI / 2);

  const leftRod = new THREE.Mesh(rodGeo, materials.metallicChrome);
  leftRod.position.set(-0.3, -0.66, 0.4);
  parts.rodsAndBase.add(leftRod);

  const rightRod = new THREE.Mesh(rodGeo, materials.metallicChrome);
  rightRod.position.set(0.3, -0.66, 0.4);
  parts.rodsAndBase.add(rightRod);

  rigGroup.add(parts.rodsAndBase);

  // 8. BACKGROUND 3D SIGNAL PARTICLES & CONSTELLATION
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0xff2a44), // red
    new THREE.Color(0xf59e0b), // amber
    new THREE.Color(0x38bdf8), // cyan
    new THREE.Color(0xffffff)  // white
  ];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 16;
    const y = (Math.random() - 0.5) * 12;
    const z = (Math.random() - 0.5) * 14 - 2;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    particleColors[i * 3] = chosenColor.r;
    particleColors[i * 3 + 1] = chosenColor.g;
    particleColors[i * 3 + 2] = chosenColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particleCloud = new THREE.Points(particleGeo, particleMat);
  scene.add(particleCloud);

  // Camera Rig Starting Transform
  rigGroup.position.set(0, -0.15, 0);
  rigGroup.rotation.y = -0.55;
  rigGroup.rotation.x = 0.15;

  // State Management
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };
  let targetRotation = { x: 0.15, y: -0.55 };
  let autoRotate = true;
  let isTallyActive = true;
  let isWireframe = false;
  let isExploded = false;
  let focusRackProgress = 0;

  // Mouse / Touch Interaction Handlers
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
    autoRotate = false;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMousePos.x;
    const deltaY = e.clientY - prevMousePos.y;

    targetRotation.y += deltaX * 0.007;
    targetRotation.x += deltaY * 0.007;

    // Limit vertical pitch
    targetRotation.x = Math.max(-0.6, Math.min(0.7, targetRotation.x));

    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      autoRotate = false;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePos.x;
    const deltaY = e.touches[0].clientY - prevMousePos.y;

    targetRotation.y += deltaX * 0.009;
    targetRotation.x += deltaY * 0.009;
    targetRotation.x = Math.max(-0.6, Math.min(0.7, targetRotation.x));

    prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  // Zoom with Wheel
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.003;
    camera.position.z = Math.max(2.8, Math.min(6.5, camera.position.z));
  }, { passive: false });

  // Wireframe Switch Function
  function toggleWireframe() {
    isWireframe = !isWireframe;
    rigGroup.traverse((child) => {
      if (child.isMesh) {
        if (isWireframe) {
          child.userData.origMat = child.material;
          child.material = child.name === 'tallyMesh' ? wireframeRedMaterial : wireframeMaterial;
        } else if (child.userData.origMat) {
          child.material = child.userData.origMat;
        }
      }
    });
    return isWireframe;
  }

  // Tally REC Toggle
  function toggleTally() {
    isTallyActive = !isTallyActive;
    if (parts.tallyMesh) {
      parts.tallyMesh.material = isTallyActive ? materials.tallyOn : materials.tallyOff;
    }
    if (parts.tallyLight) {
      parts.tallyLight.intensity = isTallyActive ? 3.5 : 0;
    }
    const recIndicator = document.getElementById('hud-rec-indicator');
    if (recIndicator) {
      recIndicator.style.opacity = isTallyActive ? '1' : '0.25';
    }
    return isTallyActive;
  }

  // Exploded View Toggle
  function toggleExploded() {
    isExploded = !isExploded;
    return isExploded;
  }

  // Focus Rack Action
  function triggerFocusRack() {
    focusRackProgress = 1.0;
  }

  // Reset View Action
  function resetView() {
    targetRotation = { x: 0.15, y: -0.55 };
    camera.position.set(3.2, 1.8, 4.2);
    autoRotate = true;
    isExploded = false;
  }

  // Bind Buttons in HTML
  const btnTally = document.getElementById('btn-3d-tally');
  const btnWire = document.getElementById('btn-3d-wireframe');
  const btnExplode = document.getElementById('btn-3d-explode');
  const btnFocus = document.getElementById('btn-3d-focus');
  const btnReset = document.getElementById('btn-3d-reset');

  if (btnTally) {
    btnTally.addEventListener('click', () => {
      const active = toggleTally();
      btnTally.classList.toggle('active', active);
    });
  }

  if (btnWire) {
    btnWire.addEventListener('click', () => {
      const active = toggleWireframe();
      btnWire.classList.toggle('active', active);
    });
  }

  if (btnExplode) {
    btnExplode.addEventListener('click', () => {
      const active = toggleExploded();
      btnExplode.classList.toggle('active', active);
    });
  }

  if (btnFocus) {
    btnFocus.addEventListener('click', () => {
      triggerFocusRack();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetView);
  }

  // Resize Listener
  function handleResize() {
    if (!container || !canvas) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', handleResize);

  // Render Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Smooth rotation dampening
    if (autoRotate) {
      targetRotation.y += delta * 0.25;
    }

    rigGroup.rotation.y += (targetRotation.y - rigGroup.rotation.y) * 0.08;
    rigGroup.rotation.x += (targetRotation.x - rigGroup.rotation.x) * 0.08;

    // Gentle floating breathing animation
    rigGroup.position.y = -0.15 + Math.sin(time * 1.5) * 0.04;

    // Exploded View target interpolation
    const explodeDist = isExploded ? 1.0 : 0.0;
    parts.lens.position.z += ((0.9 + explodeDist * 1.1) - parts.lens.position.z) * 0.1;
    parts.matteBox.position.z += ((2.3 + explodeDist * 2.2) - parts.matteBox.position.z) * 0.1;
    parts.battery.position.z += ((-0.9 - explodeDist * 1.2) - parts.battery.position.z) * 0.1;
    parts.viewfinder.position.x += ((-explodeDist * 0.9) - parts.viewfinder.position.x) * 0.1;

    // Focus Rack gear spin animation
    if (focusRackProgress > 0) {
      if (parts.focusGearRing) {
        parts.focusGearRing.rotation.z += delta * 8.0;
      }
      focusRackProgress -= delta * 0.8;
      if (focusRackProgress < 0) focusRackProgress = 0;
    }

    // Tally light pulse
    if (isTallyActive && parts.tallyLight) {
      parts.tallyLight.intensity = 3.2 + Math.sin(time * 6.0) * 1.2;
    }

    // Particle field slow drift
    particleCloud.rotation.y = time * 0.03;
    particleCloud.rotation.x = Math.sin(time * 0.02) * 0.05;

    renderer.render(scene, camera);
  }

  animate();
}
