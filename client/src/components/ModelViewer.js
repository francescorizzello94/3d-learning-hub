import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import * as dat from "dat.gui";
import { createInfoBoxes } from "../util/createInfoBoxes";

const loadingScreen = document.getElementById("loading-screen");

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(new URL("/draco/", import.meta.url).href);
dracoLoader.preload();

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export const ModelViewer = (() => {
  let scene, camera, light, renderer, controls, gui;
  function init(container, modelUrl, infoContent) {
    console.log("init called");
    if (scene || camera || light || renderer || controls || gui) {
      if (renderer) renderer.dispose();
      if (scene) scene.dispose();
      if (controls) controls.dispose();
      if (gui) gui.destroy();
      scene = null;
      camera = null;
      light = null;
      renderer = null;
      controls = null;
      gui = null;
    }

    gui = new dat.GUI();
    const modelSettings = {
      posX: 0,
      posY: 0,
      posZ: 0,
    };
    const positionFolder = gui.addFolder("Position");

    console.log("Initializing ModelViewer with modelUrl:", modelUrl);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      controls.update();
    });

    console.log("Starting model load...");

    let mixer;

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

        modelSettings.posX = gltf.scene.position.x;
        modelSettings.posY = gltf.scene.position.y;
        modelSettings.posZ = gltf.scene.position.z;

        positionFolder
          .add(modelSettings, "posX", -10, 10, 0.1)
          .name("Position X")
          .onChange((value) => {
            gltf.scene.position.x = value;
          });
        positionFolder
          .add(modelSettings, "posY", -10, 10, 0.1)
          .name("Position Y")
          .onChange((value) => {
            gltf.scene.position.y = value;
          });
        positionFolder
          .add(modelSettings, "posZ", -10, 10, 0.1)
          .name("Position Z")
          .onChange((value) => {
            gltf.scene.position.z = value;
          });

        positionFolder.open();

        scene.add(gltf.scene);
        mixer = new THREE.AnimationMixer(gltf.scene);
        const animations = gltf.animations;
        console.log("Animations:", animations);
        console.log("Number of animations:", animations.length);
        if (animations && animations.length) {
          const action = mixer.clipAction(animations[0]);
          action.play();
        }
        const clock = new THREE.Clock();
        function animate() {
          requestAnimationFrame(animate);

          const delta = clock.getDelta();

          if (mixer) mixer.update(delta);

          renderer.render(scene, camera);
        }
        animate();
        createInfoBoxes(infoContent, scene, camera);
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
  }

  function cleanup() {
    console.log("cleanup called");
    if (scene) {
      scene.traverse((object) => {
        if (!object.isMesh) return;

        object.geometry.dispose();

        if (object.material.isMaterial) {
          cleanMaterial(object.material);
        } else {
          for (const material of object.material) cleanMaterial(material);
        }
      });

      scene = null;
      camera = null;
      light = null;
      renderer = null;
      controls = null;
    }

    if (gui) {
      gui.destroy();
      gui = null;
    }
  }

  function cleanMaterial(material) {
    material.dispose();

    // Dispose of any textures the material might have
    for (const key of Object.keys(material)) {
      const value = material[key];
      if (value && typeof value === "object" && "minFilter" in value) {
        value.dispose();
      }
    }
  }

  return { init, cleanup };
})();
