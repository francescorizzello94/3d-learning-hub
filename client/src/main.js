// main.js
export const clearApp = () => {
  const app = document.getElementById("app");
  while (app.firstChild) {
    app.firstChild.remove();
  }
};

export const addContainer = (id) => {
  const app = document.getElementById("app");
  if (!document.getElementById(id)) {
    const container = document.createElement("div");
    container.id = id;
    app.appendChild(container);
  }
};
