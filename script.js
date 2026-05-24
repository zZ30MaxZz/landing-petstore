// Import THREE
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ======================================================
// ESCENA
// ======================================================

let scene;
let camera;
let renderer;
let particles;
let animalGroup = [];
let mouseX = 0;
let mouseY = 0;
const clock = new THREE.Clock();

// ======================================================
// INIT
// ======================================================

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);
  document.getElementById('threejs-container').appendChild(renderer.domElement);

  // Luces
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  createParticles();
  createAnimals();

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onMouseMove);

  animate();
}

// ======================================================
// PARTÍCULAS
// ======================================================

function createParticles() {
  const geometry = new THREE.BufferGeometry();
  const particlesCount = 3500;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 120;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.16,
    color: 0x4fc3f7,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

// ======================================================
// PECES REALISTAS
// ======================================================

function createFish() {
  const group = new THREE.Group();
  
  // Colores variados para peces
  const fishColors = [
    { body: 0xff6b35, emissive: 0xff3300 },
    { body: 0x00bcd4, emissive: 0x006064 },
    { body: 0x4caf50, emissive: 0x1b5e20 },
    { body: 0xffeb3b, emissive: 0xf57f17 },
    { body: 0xe91e63, emissive: 0x880e4f }
  ];
  const colorSet = fishColors[Math.floor(Math.random() * fishColors.length)];

  // Cuerpo principal del pez - forma elongada
  const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 16);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: colorSet.body,
    emissive: colorSet.emissive,
    emissiveIntensity: 0.3,
    metalness: 0.4,
    roughness: 0.3
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  body.scale.set(1, 0.5, 0.4);
  group.add(body);

  // Cola del pez - forme de corazón/chorrito
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0, 0);
  tailShape.quadraticCurveTo(0.4, 0.5, 0.8, 0.7);
  tailShape.quadraticCurveTo(1.0, 0.5, 1.0, 0);
  tailShape.quadraticCurveTo(1.0, -0.5, 0.8, -0.7);
  tailShape.quadraticCurveTo(0.4, -0.5, 0, 0);
  
  const tailGeometry = new THREE.ShapeGeometry(tailShape);
  const tailMaterial = new THREE.MeshStandardMaterial({
    color: colorSet.body,
    emissive: colorSet.emissive,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide
  });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.x = -1.0;
  tail.name = 'tail';
  group.add(tail);

  // Aleta dorsal
  const dorsalShape = new THREE.Shape();
  dorsalShape.moveTo(0, 0);
  dorsalShape.quadraticCurveTo(0.2, 0.5, 0.5, 0.6);
  dorsalShape.quadraticCurveTo(0.3, 0.3, 0, 0);
  
  const dorsalGeometry = new THREE.ShapeGeometry(dorsalShape);
  const dorsalMaterial = new THREE.MeshStandardMaterial({
    color: colorSet.body,
    emissive: colorSet.emissive,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide
  });
  const dorsal = new THREE.Mesh(dorsalGeometry, dorsalMaterial);
  dorsal.position.set(0, 0.35, 0);
  dorsal.name = 'dorsal';
  group.add(dorsal);

  // Aleta pectoral
  const pectoralShape = new THREE.Shape();
  pectoralShape.moveTo(0, 0);
  pectoralShape.quadraticCurveTo(0.3, 0.3, 0.5, 0.1);
  pectoralShape.quadraticCurveTo(0.3, -0.1, 0, 0);
  
  const pectoralGeometry = new THREE.ShapeGeometry(pectoralShape);
  const pectoral = new THREE.Mesh(pectoralGeometry, tailMaterial);
  pectoral.position.set(0.2, -0.2, 0.25);
  pectoral.name = 'pectoral';
  group.add(pectoral);

  // Ojo grande
  const eyeGeometry = new THREE.SphereGeometry(0.18, 16, 16);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.3
  });
  const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eye.position.set(0.7, 0.1, 0.2);
  group.add(eye);

  // Pupila
  const pupilGeometry = new THREE.SphereGeometry(0.1, 12, 12);
  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x000000,
    emissiveIntensity: 0.8
  });
  const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  pupil.position.set(0.8, 0.1, 0.25);
  group.add(pupil);

  // Branquia (linea en el lado)
  const gillGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.01);
  const gillMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.5
  });
  const gill = new THREE.Mesh(gillGeometry, gillMaterial);
  gill.position.set(0.3, 0, 0.22);
  group.add(gill);

  return group;
}

// ======================================================
// MARIPOSAS REALISTAS
// ======================================================

function createButterfly() {
  const group = new THREE.Group();

  // Colores variados para mariposas
  const butterflyColors = [
    { wings: 0x9c27b0, spots: 0xff9800 },  // Morada con naranja
    { wings: 0x2196f3, spots: 0xffffff }, // Azul con blanco
    { wings: 0xff5722, spots: 0xffffff }, // Naranja con blanco
    { wings: 0x4caf50, spots: 0xffeb3b }, // Verde con amarillo
    { wings: 0xe91e63, spots: 0xffffff }  // Rosa con blanco
  ];
  const colorSet = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];

  const wingMaterial = new THREE.MeshStandardMaterial({
    color: colorSet.wings,
    side: THREE.DoubleSide,
    emissive: colorSet.wings,
    emissiveIntensity: 0.2,
    metalness: 0.1,
    roughness: 0.4,
    transparent: true,
    opacity: 0.95
  });

  // ALA IZQUIERDA - forma de mariposa real
  const leftWingShape = new THREE.Shape();
  leftWingShape.moveTo(0, 0);
  leftWingShape.bezierCurveTo(0.2, 0.4, 0.5, 0.9, 0.8, 1.1);
  leftWingShape.bezierCurveTo(1.2, 1.3, 1.6, 1.2, 1.7, 0.8);
  leftWingShape.bezierCurveTo(1.8, 0.4, 1.5, -0.3, 1.2, -0.6);
  leftWingShape.bezierCurveTo(0.8, -0.9, 0.4, -0.7, 0.2, -0.4);
  leftWingShape.bezierCurveTo(0, -0.2, 0, 0, 0, 0);

  const leftWingGeometry = new THREE.ShapeGeometry(leftWingShape);
  const leftWing = new THREE.Mesh(leftWingGeometry, wingMaterial);
  leftWing.position.x = -0.05;
  leftWing.name = 'leftWing';
  group.add(leftWing);

  // ALA DERECHA - espejo
  const rightWingShape = new THREE.Shape();
  rightWingShape.moveTo(0, 0);
  rightWingShape.bezierCurveTo(-0.2, 0.4, -0.5, 0.9, -0.8, 1.1);
  rightWingShape.bezierCurveTo(-1.2, 1.3, -1.6, 1.2, -1.7, 0.8);
  rightWingShape.bezierCurveTo(-1.8, 0.4, -1.5, -0.3, -1.2, -0.6);
  rightWingShape.bezierCurveTo(-0.8, -0.9, -0.4, -0.7, -0.2, -0.4);
  rightWingShape.bezierCurveTo(0, -0.2, 0, 0, 0, 0);

  const rightWingGeometry = new THREE.ShapeGeometry(rightWingShape);
  const rightWing = new THREE.Mesh(rightWingGeometry, wingMaterial);
  rightWing.position.x = 0.05;
  rightWing.name = 'rightWing';
  group.add(rightWing);

  // Manchas en alas
  const spotMaterial = new THREE.MeshStandardMaterial({
    color: colorSet.spots,
    side: THREE.DoubleSide,
    emissive: colorSet.spots,
    emissiveIntensity: 0.4
  });

  // Manchas grandes
  const largeSpotGeometry = new THREE.CircleGeometry(0.18, 16);
  const spot1 = new THREE.Mesh(largeSpotGeometry, spotMaterial);
  spot1.position.set(-0.6, 0.5, 0.01);
  group.add(spot1);

  const spot2 = new THREE.Mesh(largeSpotGeometry, spotMaterial);
  spot2.position.set(0.6, 0.5, 0.01);
  group.add(spot2);

  // Manchas pequeñas
  const smallSpotGeometry = new THREE.CircleGeometry(0.1, 12);
  const spot3 = new THREE.Mesh(smallSpotGeometry, spotMaterial);
  spot3.position.set(-1.1, 0.3, 0.01);
  group.add(spot3);

  const spot4 = new THREE.Mesh(smallSpotGeometry, spotMaterial);
  spot4.position.set(1.1, 0.3, 0.01);
  group.add(spot4);

  // Cuerpo segmented
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    emissive: 0x000000,
    roughness: 0.8
  });

  // Torax
  const thoraxGeometry = new THREE.SphereGeometry(0.12, 12, 12);
  const thorax = new THREE.Mesh(thoraxGeometry, bodyMaterial);
  thorax.scale.set(1, 1.5, 1);
  thorax.position.x = 0.15;
  group.add(thorax);

  // Abdomen
  const abdomenGeometry = new THREE.CapsuleGeometry(0.08, 0.6, 8, 12);
  const abdomen = new THREE.Mesh(abdomenGeometry, bodyMaterial);
  abdomen.rotation.z = Math.PI / 2;
  abdomen.position.x = -0.4;
  group.add(abdomen);

  // Cabeza
  const headGeometry = new THREE.SphereGeometry(0.1, 12, 12);
  const head = new THREE.Mesh(headGeometry, bodyMaterial);
  head.position.x = 0.5;
  group.add(head);

  // Ojos compuestos
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x222222
  });
  const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
  eye1.position.set(0.55, 0.04, 0.06);
  group.add(eye1);

  const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
  eye2.position.set(0.55, -0.04, 0.06);
  group.add(eye2);

  // Antenas largas y delgadas
  const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  
  const antennaCurve1 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.5, 0.1, 0),
    new THREE.Vector3(0.8, 0.4, 0),
    new THREE.Vector3(1.0, 0.6, 0)
  );
  const antennaPoints1 = antennaCurve1.getPoints(20);
  const antennaGeometry1 = new THREE.BufferGeometry().setFromPoints(antennaPoints1);
  const antenna1 = new THREE.Line(antennaGeometry1, antennaMaterial);
  group.add(antenna1);

  const antennaCurve2 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.5, -0.1, 0),
    new THREE.Vector3(0.8, -0.4, 0),
    new THREE.Vector3(1.0, -0.6, 0)
  );
  const antennaPoints2 = antennaCurve2.getPoints(20);
  const antennaGeometry2 = new THREE.BufferGeometry().setFromPoints(antennaPoints2);
  const antenna2 = new THREE.Line(antennaGeometry2, antennaMaterial);
  group.add(antenna2);

  // Extremidades
  for (let i = 0; i < 3; i++) {
    const legGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 6);
    const leg = new THREE.Mesh(legGeom, antennaMaterial);
    leg.position.set(-0.2 - i * 0.15, -0.15, 0);
    leg.rotation.z = 0.3;
    group.add(leg);
  }

  return group;
}

// ======================================================
// CREAR ANIMALES
// ======================================================

function createAnimals() {
  // 12 Peces
  for (let i = 0; i < 12; i++) {
    const fish = createFish();
    fish.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 30
    );
    fish.rotation.y = Math.random() * Math.PI * 2;
    fish.userData = {
      speed: 0.2 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
      type: 'fish'
    };
    animalGroup.push(fish);
    scene.add(fish);
  }

  // 8 Mariposas
  for (let i = 0; i < 8; i++) {
    const butterfly = createButterfly();
    butterfly.position.set(
      (Math.random() - 0.5) * 45,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20
    );
    butterfly.rotation.y = Math.random() * Math.PI * 2;
    butterfly.userData = {
      speed: 0.1 + Math.random() * 0.2,
      offset: Math.random() * Math.PI * 2,
      type: 'butterfly'
    };
    animalGroup.push(butterfly);
    scene.add(butterfly);
  }
}

// ======================================================
// EVENTOS
// ======================================================

function onMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.00008;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.00008;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ======================================================
// ANIMACIÓN
// ======================================================

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Partículas
  if (particles) {
    particles.rotation.y += 0.0008;
    particles.rotation.y += (mouseX - particles.rotation.y) * 0.02;
    particles.rotation.x += (mouseY - particles.rotation.x) * 0.02;
  }

  // Animales
  animalGroup.forEach((animal, index) => {
    const data = animal.userData;
    if (!data || !data.type) return;

    // Movimiento flotante
    animal.position.x += Math.sin(elapsed * data.speed + data.offset) * 0.02;
    animal.position.y += Math.cos(elapsed * data.speed + data.offset) * 0.015;
    animal.position.z += Math.sin(elapsed * data.speed * 0.5 + data.offset) * 0.01;

    // Peces
    if (data.type === 'fish') {
      const tail = animal.getObjectByName('tail');
      if (tail) {
        tail.rotation.y = Math.sin(elapsed * 10 + data.offset) * 0.3;
      }
      const dorsal = animal.getObjectByName('dorsal');
      if (dorsal) {
        dorsal.rotation.z = Math.sin(elapsed * 8 + data.offset) * 0.1;
      }
    }

    // Mariposas - aleteo
    if (data.type === 'butterfly') {
      const flap = Math.sin(elapsed * 12 + data.offset) * 0.6;
      
      const leftWing = animal.getObjectByName('leftWing');
      const rightWing = animal.getObjectByName('rightWing');
      
      if (leftWing) {
        leftWing.rotation.y = flap;
      }
      if (rightWing) {
        rightWing.rotation.y = -flap;
      }
    }

    // Reacción al mouse
    animal.position.x += mouseX * 8;
    animal.position.y -= mouseY * 8;

    // Mantener dentro del área
    if (animal.position.x > 35) animal.position.x = -35;
    if (animal.position.x < -35) animal.position.x = 35;
    if (animal.position.y > 20) animal.position.y = -20;
    if (animal.position.y < -20) animal.position.y = 20;
  });

  renderer.render(scene, camera);
}

// ======================================================
// LOAD
// ======================================================

window.addEventListener('load', init);