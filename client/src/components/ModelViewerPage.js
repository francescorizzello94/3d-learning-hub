import { addContainer, clearApp } from "../main";
import { hideLoading, showLoading } from "../util/loading";
import { ModelViewer } from "./ModelViewer";
import axios from "axios";

export const ModelViewerPage = (params) => {
  clearApp();
  addContainer("model-details-container");
  addContainer("model-container");
  fetchModelDetails(params.id);
};

function fetchModelDetails(modelId) {
  const modelDetailsContainer = document.getElementById(
    "model-details-container"
  );
  showLoading();
  axios
    .get(`/api/objects/${modelId}`)
    .then((response) => {
      console.log("Model Viewer Page Response: ", response.data);

      modelDetailsContainer.innerHTML = "";

      const modelData = response.data;
      const detailsHtml = `
          <h2>${modelData.title}</h2>
          <p>${modelData.description}</p>
          // Additional model details here
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
    })
    .finally(() => {
      hideLoading();
    });
}
