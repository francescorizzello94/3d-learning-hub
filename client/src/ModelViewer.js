import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

// cache the model in an object
const modelCache = {};
const loadingScreen = document.getElementById("loading-screen");

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(new URL("/draco/", import.meta.url).href);
dracoLoader.preload();

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export const ModelViewer = (container, modelUrl) => {
  console.log("Initializing ModelViewer with modelUrl:", modelUrl);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  camera.position.z = 10;

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  if (modelCache[modelUrl]) {
    scene.add(modelCache[modelUrl]);
    return;
  }

  loader.load(
    modelUrl,
    function (gltf) {
      console.log("Model loaded successfully");
      scene.add(gltf.scene);
      modelCache[modelUrl] = gltf.scene;
      loadingScreen.style.display = "none";

      // Fit camera to object
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // This factor will depend on the aspect of your model
      const maxSize = Math.max(size.x, size.y, size.z);
      const fitHeightDistance =
        maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = Math.max(fitHeightDistance, fitWidthDistance);

      // Set the camera to frame the object nicely
      camera.position.set(center.x, center.y, distance * 1.2);
      camera.lookAt(center);

      // Update the camera projection matrix
      camera.updateProjectionMatrix();
    },
    function (xhr) {
      const progress = Math.round((xhr.loaded / xhr.total) * 100);
      loadingScreen.innerText = `Loading: ${progress}%`;
    },
    function (error) {
      console.error("An error occurred while loading the model:", error);
    }
  );
};
