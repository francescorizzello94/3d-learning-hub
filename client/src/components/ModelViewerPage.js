import { addContainer, clearApp } from "../main";
import { loadFeedback } from "../util/loadFeedback";
import { hideLoading, showLoading } from "../util/loading";
import { splitDescription } from "../util/splitDescription";
import { ModelViewer } from "./ModelViewer";
import axios from "axios";

export const ModelViewerPage = (params) => {
  clearApp();
  addContainer("model-container");
  addContainer("model-details-container");
  addContainer("feedback-container");
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
      const formattedDescription = modelData.description
        .split(";")
        .map((section) => {
          const [title, ...content] = section.split(":");
          return `<strong>${title}:</strong>${content.join(":")}`;
        })
        .join("<br/><br/>");
      const detailsHtml = `
        <h2>${modelData.title}</h2>
        <details>
            <summary>View Model Description</summary>
            <p>${formattedDescription}</p>
        </details>
`;
      modelDetailsContainer.innerHTML = detailsHtml;

      const modelDescriptionSplitContentForBoxes = splitDescription(
        modelData.description
      );

      if (modelData.modelUrl) {
        const modelContainer = document.getElementById("model-container");
        ModelViewer.init(
          modelContainer,
          modelData.modelUrl,
          modelDescriptionSplitContentForBoxes
        );
        loadFeedback(modelId);
      }

      window.addEventListener("popstate", function () {
        ModelViewer.cleanup();
      });
    })
    .catch((error) => {
      console.error("Fetching model details failed:", error);
      modelDetailsContainer.innerHTML =
        "<p>An error occurred while loading the model details.</p>";
    })
    .finally(() => {
      hideLoading();
    });

  const scrollButtonHtml = `<button id="scroll-button" title="Scroll Down">↓</button>`;
  document.body.insertAdjacentHTML("beforeend", scrollButtonHtml);

  document
    .getElementById("scroll-button")
    .addEventListener("click", function () {
      const scrollButton = document.getElementById("scroll-button");
      if (scrollButton.innerHTML === "↓") {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        scrollButton.innerHTML = "↑";
        scrollButton.title = "Scroll Up";
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        scrollButton.innerHTML = "↓";
        scrollButton.title = "Scroll Down";
      }
    });
}
