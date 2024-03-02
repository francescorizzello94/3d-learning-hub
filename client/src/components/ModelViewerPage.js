import { addContainer, clearApp } from "../main";
import { ModelViewer } from "./ModelViewer";
import axios from "axios";

export function ModelViewerPage(params) {
  clearApp();
  addContainer("model-details-container");
  addContainer("model-container");
  fetchModelDetails(params.id);
}

function fetchModelDetails(modelId) {
  const modelDetailsContainer = document.getElementById(
    "model-details-container"
  );
  axios
    .get(`/api/objects/${modelId}`)
    .then((response) => {
      console.log("Model Viewer Page Response: ", response.data);

      modelDetailsContainer.innerHTML = "";

      const modelData = response.data;
      const detailsHtml = `
          <h2>${modelData.title}</h2>
          <p>${modelData.description}</p>
        `;
      modelDetailsContainer.innerHTML = detailsHtml;

      if (modelData.modelUrl) {
        const modelContainer = document.getElementById("model-container");
        ModelViewer(modelContainer, modelData.modelUrl);
      }
    })
    .catch((error) => {
      console.error("Fetching model details failed:", error);
      modelDetailsContainer.innerHTML =
        "<p>An error occurred while loading the model details.</p>";
    });
}
