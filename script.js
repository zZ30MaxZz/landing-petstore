// Import THREE as ES module
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

let scene;
let camera;
let renderer;
let particles;

let mouseX = 0;
let mouseY = 0;

// Inicializar
function init(){

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
 antialias:true,
 alpha:true
 });

 renderer.setSize(
 window.innerWidth,
 window.innerHeight
 );

 renderer.setPixelRatio(
 Math.min(window.devicePixelRatio,2)
 );

 renderer.setClearColor(0x000000, 1);

 document
 .getElementById('threejs-container')
 .appendChild(renderer.domElement);

// Luces
 const ambientLight = new THREE.AmbientLight(
 0xffffff,
 1.2
 );

 scene.add(ambientLight);

 const directionalLight =
 new THREE.DirectionalLight(
 0xffffff,
 1
 );

 directionalLight.position.set(5,5,5);

 scene.add(directionalLight);

// Crear partículas
 createParticles();

// Eventos
 window.addEventListener(
 'resize',
 onWindowResize
 );

 document.addEventListener(
 'mousemove',
 onMouseMove
 );

 // Animación
 animate();
}

// Partículas
function createParticles(){

 const geometry =
 new THREE.BufferGeometry();

 const particlesCount = 2500;

 const positions =
 new Float32Array(
 particlesCount * 3
 );

 for(let i = 0; i < particlesCount * 3; i++){

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

 const material =
 new THREE.PointsMaterial({
 size:0.18,
 color:0x4fc3f7,
 transparent:true,
 opacity:0.8,
 blending:THREE.AdditiveBlending
 });

 particles =
 new THREE.Points(
 geometry,
 material
 );

 scene.add(particles);
}

// Mouse
function onMouseMove(event){

 mouseX =
 (event.clientX - window.innerWidth / 2) * 0.0005;

 mouseY =
 (event.clientY - window.innerHeight / 2) * 0.0005;
}

// Resize
function onWindowResize(){

 camera.aspect =
 window.innerWidth / window.innerHeight;

 camera.updateProjectionMatrix();

 renderer.setSize(
 window.innerWidth,
 window.innerHeight
 );
}

// Animación
function animate(){

 requestAnimationFrame(animate);

 if(particles){

 particles.rotation.y += 0.001;
 particles.rotation.x += 0.0003;

 particles.rotation.y += mouseX;
 particles.rotation.x += mouseY;
 }

 renderer.render(scene, camera);
}

// Esperar carga
window.addEventListener('load', () => {
 init();
});