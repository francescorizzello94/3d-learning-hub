import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
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

      // Calculate the bounding box of the model
      const bbox = new THREE.Box3().setFromObject(gltf.scene);
      const size = bbox.getSize(new THREE.Vector3());
      const center = bbox.getCenter(new THREE.Vector3());
      controls.target.copy(center);

      // Move the model to the origin
      gltf.scene.position.x += gltf.scene.position.x - center.x;
      gltf.scene.position.y += gltf.scene.position.y - center.y;
      gltf.scene.position.z += gltf.scene.position.z - center.z;

      // Adjust the camera's position to frame the entire model
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs((maxDim / 2) * Math.tan(fov * 2)); // Half the frustum height
      cameraZ *= 1.2; // Apply factor for some "breathing room" around the model

      // Set the camera to frame the model nicely
      camera.position.z = center.z + cameraZ;

      scene.add(gltf.scene);
      modelCache[modelUrl] = gltf.scene;
      loadingScreen.style.display = "none";

      camera.updateProjectionMatrix();

      // Update controls to orbit around the center of the model
      if (controls) {
        controls.target.set(center.x, center.y, center.z);
        controls.update();
      }
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
