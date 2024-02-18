import { ModelViewer } from "./ModelViewer";

document.addEventListener("DOMContentLoaded", (event) => {
  const modelContainer = document.getElementById("model-container");
  const modelUrl = "/models/phonex.gltf";
  ModelViewer(modelContainer, modelUrl);
});
