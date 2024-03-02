import { addContainer, clearApp } from "../main";
import { loadCategories } from "../util/loadCategories";

export const Homepage = () => {
  clearApp();
  addContainer("categories-container");
  loadCategories();
};
