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

 // Escena
 scene = new THREE.Scene();

 // Cámara
 camera = new THREE.PerspectiveCamera(
 75,
 window.innerWidth / window.innerHeight,
 0.1,
 1000
 );

 camera.position.z = 30;

 // Renderer
 renderer = new THREE.WebGLRenderer({
 antialias: true,
 alpha: true
 });

 renderer.setSize(
 window.innerWidth,
 window.innerHeight
 );

 renderer.setPixelRatio(
 Math.min(window.devicePixelRatio, 2)
 );

 renderer.setClearColor(0x000000, 1);

 document
 .getElementById('threejs-container')
 .appendChild(renderer.domElement);

 // ======================================================
 // LUCES
 // ======================================================

 const ambientLight = new THREE.AmbientLight(
 0xffffff,
 1.5
 );

 scene.add(ambientLight);

 const directionalLight = new THREE.DirectionalLight(
 0xffffff,
 2
 );

 directionalLight.position.set(5, 5, 5);

 scene.add(directionalLight);

 // ======================================================
 // PARTÍCULAS
 // ======================================================

 createParticles();

 // ======================================================
 // ANIMALES
 // Inspirado en ejemplos de flocking / birds de la
 // comunidad Three.js
 // ======================================================

 createAnimals();

 // ======================================================
 // EVENTOS
 // ======================================================

 window.addEventListener(
 'resize',
 onWindowResize
 );

 document.addEventListener(
 'mousemove',
 onMouseMove
 );

 // ======================================================
 // START
 // ======================================================

 animate();
}

// ======================================================
// PARTÍCULAS
// ======================================================

function createParticles() {

 const geometry = new THREE.BufferGeometry();

 const particlesCount = 3500;

 const positions = new Float32Array(
 particlesCount * 3
 );

 for (let i = 0; i < particlesCount * 3; i++) {

 positions[i] =
 (Math.random() - 0.5) * 120;
 }

 geometry.setAttribute(
 'position',
 new THREE.BufferAttribute(
 positions,
 3
 )
 );

 const material = new THREE.PointsMaterial({
 size: 0.16,
 color: 0x4fc3f7,
 transparent: true,
 opacity: 0.9,
 blending: THREE.AdditiveBlending
 });

 particles = new THREE.Points(
 geometry,
 material
 );

 scene.add(particles);
}

// ======================================================
// ANIMALES
// ======================================================

function createAnimals() {

 // --------------------------------------------------
 // PECES
 // --------------------------------------------------

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

 // --------------------------------------------------
 // MARIPOSAS
 // --------------------------------------------------

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
// PEZ
// ======================================================

function createFish() {

 const group = new THREE.Group();

 const bodyGeometry = new THREE.ConeGeometry(
 0.5,
 2,
 8
 );

 const bodyMaterial = new THREE.MeshStandardMaterial({
 color: 0x00ffff,
 emissive: 0x0077aa,
 emissiveIntensity: 0.8
 });

 const body = new THREE.Mesh(
 bodyGeometry,
 bodyMaterial
 );

 body.rotation.z = Math.PI / 2;

 group.add(body);

 // Cola

 const tailGeometry = new THREE.BoxGeometry(
 0.7,
 0.5,
 0.1
 );

 const tail = new THREE.Mesh(
 tailGeometry,
 bodyMaterial
 );

 tail.position.x = -1.1;

 group.add(tail);

 return group;
}

// ======================================================
// MARIPOSA
// ======================================================

function createButterfly() {

 const group = new THREE.Group();

 const wingGeometry = new THREE.PlaneGeometry(
 1,
 1.3
 );

 const wingMaterial = new THREE.MeshStandardMaterial({
 color: 0xff66ff,
 side: THREE.DoubleSide,
 emissive: 0x551155,
 emissiveIntensity: 1
 });

 // Ala izquierda

 const leftWing = new THREE.Mesh(
 wingGeometry,
 wingMaterial
 );

 leftWing.position.x = -0.5;

 group.add(leftWing);

 // Ala derecha

 const rightWing = new THREE.Mesh(
 wingGeometry,
 wingMaterial
 );

 rightWing.position.x = 0.5;

 group.add(rightWing);

 // Cuerpo

 const bodyGeometry = new THREE.CylinderGeometry(
 0.08,
 0.08,
 1.4
 );

 const bodyMaterial = new THREE.MeshStandardMaterial({
 color: 0xffffff,
 emissive: 0x444444
 });

 const body = new THREE.Mesh(
 bodyGeometry,
 bodyMaterial
 );

 body.rotation.z = Math.PI / 2;

 group.add(body);

 group.userData = {
 leftWing,
 rightWing
 };

 return group;
}

// ======================================================
// MOUSE
// ======================================================

function onMouseMove(event) {

 mouseX =
 (event.clientX - window.innerWidth / 2) * 0.00008;

 mouseY =
 (event.clientY - window.innerHeight / 2) * 0.00008;
}

// ======================================================
// RESIZE
// ======================================================

function onWindowResize() {

 camera.aspect =
 window.innerWidth / window.innerHeight;

 camera.updateProjectionMatrix();

 renderer.setSize(
 window.innerWidth,
 window.innerHeight
 );
}

// ======================================================
// ANIMACIÓN
// ======================================================

function animate() {

 requestAnimationFrame(animate);

 const elapsed = clock.getElapsedTime();

 // ====================================================
 // PARTÍCULAS
 // ====================================================

 if (particles) {

 // Movimiento base

 particles.rotation.y += 0.0008;

 // Movimiento suave con mouse

 particles.rotation.y +=
 (mouseX - particles.rotation.y) * 0.02;

 particles.rotation.x +=
 (mouseY - particles.rotation.x) * 0.02;
 }

 // ====================================================
 // ANIMALES
 // ====================================================

 animalGroup.forEach((animal, index) => {

 const data = animal.userData;

 // Movimiento flotante

 animal.position.x +=
 Math.sin(elapsed * data.speed + data.offset) * 0.02;

 animal.position.y +=
 Math.cos(elapsed * data.speed + data.offset) * 0.015;

 animal.position.z +=
 Math.sin(elapsed * data.speed * 0.5 + data.offset) * 0.01;

 // Rotación suave

 animal.rotation.y =
 Math.sin(elapsed + index) * 0.4;

 // Peces
 if (data.type === 'fish') {

 animal.rotation.z =
 Math.sin(elapsed * 4 + data.offset) * 0.15;
 }

 // Mariposas

 if (data.type === 'butterfly') {

 const flap =
 Math.sin(elapsed * 10 + data.offset) * 0.7;

 animal.userData.leftWing.rotation.y = flap;

 animal.userData.rightWing.rotation.y = -flap;
 }

 // Reacción al mouse

 animal.position.x += mouseX * 8;
 animal.position.y -= mouseY * 8;

 // Mantenerlos dentro del área

 if (animal.position.x > 35) animal.position.x = -35;
 if (animal.position.x < -35) animal.position.x = 35;

 if (animal.position.y > 20) animal.position.y = -20;
 if (animal.position.y < -20) animal.position.y = 20;
 });

 // ====================================================
 // RENDER
 // ====================================================

 renderer.render(scene, camera);
}

// ======================================================
// LOAD
// ======================================================

window.addEventListener('load', () => {

 init();
});