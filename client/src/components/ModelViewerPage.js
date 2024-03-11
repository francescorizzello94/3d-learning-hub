import { addContainer, clearApp } from "../main";
import { hideLoading, showLoading } from "../util/loading";
import { splitDescription } from "../util/splitDescription";
import { ModelViewer } from "./ModelViewer";
import axios from "axios";

export const ModelViewerPage = (params) => {
  clearApp();
  addContainer("model-container");
  addContainer("model-details-container");
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
        `;
      modelDetailsContainer.innerHTML = detailsHtml;

      const modelDescriptionSplitContentForBoxes = splitDescription(
        modelData.description
      );

      if (modelData.modelUrl) {
        const modelContainer = document.getElementById("model-container");
        ModelViewer(
          modelContainer,
          modelData.modelUrl,
          modelDescriptionSplitContentForBoxes
        );
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
