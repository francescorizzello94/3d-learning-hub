import axios from "axios";
import { navigateTo } from "../router";

export function CategoryPage(params) {
  const modelsContainer = document.getElementById("model-container");
  modelsContainer.innerHTML = "<p>Loading...</p>";
  fetchCategoryModels(params.categoryName);
}

function fetchCategoryModels(categoryName) {
  axios
    .get(`/api/categories/${categoryName}/models`)
    .then((response) => {
      console.log("Category Page Response: ", response.data);
      const modelsContainer = document.getElementById("model-container");
      modelsContainer.innerHTML = "";

      if (response.data.length === 0) {
        modelsContainer.innerHTML = "<p>No models found in this category.</p>";
        return;
      }

      response.data.forEach((model) => {
        const modelElement = document.createElement("div");
        const previewButton = document.createElement("button");

        previewButton.textContent = model.title;
        previewButton.onclick = () => {
          navigateTo(`/model/${model._id}`);
        };

        modelElement.appendChild(previewButton);
        modelsContainer.appendChild(modelElement);
      });
    })
    .catch((error) => {
      console.error("Fetching models failed:", error);
      modelsContainer.innerHTML =
        "<p>An error occurred while loading the models.</p>";
    });
}
