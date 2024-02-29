import { ModelViewer } from "./ModelViewer";

export const ModelViewerPage = (params) => {
  const modelDetailsContainer = document.getElementById(
    "model-details-container"
  );
  modelDetailsContainer.innerHTML = "<p>Loading model details...</p>";
  fetchModelDetails(params.id);
};

function fetchModelDetails(modelId) {
  axios
    .get(`/api/objects/${modelId}`)
    .then((response) => {
      console.log("Model Viewer Page Response: ", response.data);
      const modelDetailsContainer = document.getElementById(
        "model-details-container"
      );
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
    });
}
