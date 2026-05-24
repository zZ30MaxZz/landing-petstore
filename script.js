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
// PECES MEJORADOS
// ======================================================

function createFish() {
  const group = new THREE.Group();

  // Cuerpo del pez - forma más orgánica usando Sphere escalado
  const bodyGeometry = new THREE.SphereGeometry(0.8, 16, 12);
  bodyGeometry.scale(1.8, 0.6, 0.4);
  
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b35,
    emissive: 0xff3300,
    emissiveIntensity: 0.3,
    metalness: 0.3,
    roughness: 0.4
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.name = 'body';
  group.add(body);

  // Cola del pez
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0, 0);
  tailShape.lineTo(-0.8, 0.6);
  tailShape.lineTo(-0.8, -0.6);
  tailShape.lineTo(0, 0);
  
  const tailGeometry = new THREE.ShapeGeometry(tailShape);
  const tailMaterial = new THREE.MeshStandardMaterial({
    color: 0xff8c42,
    side: THREE.DoubleSide,
    emissive: 0xff5500,
    emissiveIntensity: 0.2
  });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.x = -1.4;
  tail.name = 'tail';
  group.add(tail);

  // Aleta dorsal
  const dorsalShape = new THREE.Shape();
  dorsalShape.moveTo(0, 0);
  dorsalShape.lineTo(-0.3, 0.7);
  dorsalShape.lineTo(-0.6, 0);
  dorsalShape.lineTo(0, 0);
  
  const dorsalGeometry = new THREE.ShapeGeometry(dorsalShape);
  const dorsalMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b35,
    side: THREE.DoubleSide,
    emissive: 0xff3300,
    emissiveIntensity: 0.2
  });
  const dorsal = new THREE.Mesh(dorsalGeometry, dorsalMaterial);
  dorsal.position.set(0, 0.5, 0);
  dorsal.name = 'dorsal';
  group.add(dorsal);

  // Ojo
  const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.5
  });
  const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eye.position.set(1.0, 0.1, 0.25);
  group.add(eye);

  // Pupila
  const pupilGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x000000,
    emissiveIntensity: 1
  });
  const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  pupil.position.set(1.1, 0.1, 0.3);
  group.add(pupil);

  return group;
}

// ======================================================
// MARIPOSA MEJORADA
// ======================================================

function createButterfly() {
  const group = new THREE.Group();

  // Ala izquierda - forma de mariposa
  const leftWingShape = new THREE.Shape();
  leftWingShape.moveTo(0, 0);
  leftWingShape.bezierCurveTo(0.3, 0.8, 1.2, 1.0, 1.4, 0.5);
  leftWingShape.bezierCurveTo(1.5, 0, 1.2, -0.8, 0.8, -1.0);
  leftWingShape.bezierCurveTo(0.4, -0.8, 0, -0.3, 0, 0);

  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0x9c27b0,
    side: THREE.DoubleSide,
    emissive: 0x4a148c,
    emissiveIntensity: 0.4,
    metalness: 0.1,
    roughness: 0.3
  });

  const leftWingGeometry = new THREE.ShapeGeometry(leftWingShape);
  const leftWing = new THREE.Mesh(leftWingGeometry, wingMaterial);
  leftWing.position.x = -0.1;
  leftWing.rotation.y = -0.2;
  leftWing.name = 'leftWing';
  group.add(leftWing);

  // Ala derecha - espejo
  const rightWingGeometry = new THREE.ShapeGeometry(leftWingShape);
  const rightWing = new THREE.Mesh(rightWingGeometry, wingMaterial);
  rightWing.scale.x = -1;
  rightWing.position.x = 0.1;
  rightWing.rotation.y = 0.2;
  rightWing.name = 'rightWing';
  group.add(rightWing);

  // Patrón en alas (manchas naranjas)
  const spotMaterial = new THREE.MeshStandardMaterial({
    color: 0xff9800,
    side: THREE.DoubleSide,
    emissive: 0xff6600,
    emissiveIntensity: 0.5
  });

  const spotGeometry = new THREE.CircleGeometry(0.15, 16);
  
  const spot1 = new THREE.Mesh(spotGeometry, spotMaterial);
  spot1.position.set(-0.7, 0.3, 0.01);
  spot1.name = 'spot1';
  group.add(spot1);

  const spot2 = new THREE.Mesh(spotGeometry, spotMaterial);
  spot2.position.set(0.7, 0.3, 0.01);
  spot2.name = 'spot2';
  group.add(spot2);

  // Cuerpo de la mariposa
  const bodyGeometry = new THREE.CapsuleGeometry(0.08, 0.8, 4, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x212121,
    emissive: 0x000000,
    emissiveIntensity: 0.1
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  body.name = 'body';
  group.add(body);

  // Cabeza
  const headGeometry = new THREE.SphereGeometry(0.12, 12, 12);
  const head = new THREE.Mesh(headGeometry, bodyMaterial);
  head.position.x = 0.5;
  group.add(head);

  // Antenas
  const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x212121 });
  
  const antenna1Geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 8);
  const antenna1 = new THREE.Mesh(antenna1Geometry, antennaMaterial);
  antenna1.position.set(0.5, 0.15, 0);
  antenna1.rotation.z = -0.5;
  group.add(antenna1);

  const antenna2 = new THREE.Mesh(antenna1Geometry, antennaMaterial);
  antenna2.position.set(0.5, -0.15, 0);
  antenna2.rotation.z = 0.5;
  group.add(antenna2);

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

    // Rotación suave
    animal.rotation.y = Math.sin(elapsed + index) * 0.4;

    // Peces - animación de cola
    if (data.type === 'fish') {
      const tail = animal.getObjectByName('tail');
      if (tail) {
        tail.rotation.z = Math.sin(elapsed * 8 + data.offset) * 0.4;
      }
    }

    // Mariposas - aleteo de alas
    if (data.type === 'butterfly') {
      const flap = Math.sin(elapsed * 10 + data.offset) * 0.5;
      
      const leftWing = animal.getObjectByName('leftWing');
      const rightWing = animal.getObjectByName('rightWing');
      
      if (leftWing) {
        leftWing.rotation.y = -0.2 + flap;
      }
      if (rightWing) {
        rightWing.rotation.y = 0.2 - flap;
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