import { loadCategories } from "../util/loadCategories";

export const Homepage = () => {
  const categoriesContainer = document.getElementById("categories-container");
  categoriesContainer.innerHTML = "";
  loadCategories();
};
