// Three.js escena mejorada
let scene, camera, renderer, particles;

function init() {
    // Crear escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Crear partículas flotantes (como en ChaingPT)
    createParticles();

    // Animar
    animate();

    // Manejar redimensionamiento
    window.addEventListener('resize', onWindowResize, false);
}

function createParticles() {
    // Geometría para partículas
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;

    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Posiciones aleatorias en un espacio 3D
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material de partículas
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x4fc3f7,
        transparent: true,
        opacity: 0.6
    });

    // Crear el sistema de partículas
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotar ligeramente las partículas
    if (particles) {
        particles.rotation.y += 0.0005;
    }

    renderer.render(scene, camera);
}

// Inicializar cuando cargue la página
window.addEventListener('load', init);