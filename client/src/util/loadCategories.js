import axios from "axios";
import { navigateTo } from "../router";

export const loadCategories = () => {
  axios
    .get("/api/categories")
    .then((response) => {
      console.log("response", response.data);
      const categoriesContainer = document.getElementById(
        "categories-container"
      );
      response.data.forEach((category) => {
        const categoryButton = document.createElement("button");
        categoryButton.textContent = category;
        categoryButton.onclick = () =>
          navigateTo(`/category/${category}/models`);
        categoriesContainer.appendChild(categoryButton);
      });
    })
    .catch((error) => console.error("Fetching categories failed:", error));
};
