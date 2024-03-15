import axios from "axios";
import { submitFeedback } from "./submitFeedback";

export const loadFeedback = (modelId) => {
  axios
    .get(`/api/feedback/${modelId}`)
    .then((response) => {
      const feedbackContainer =
        document.getElementById("feedback-container") ||
        createFeedbackContainer();
      feedbackContainer.innerHTML = "";

      response.data.forEach((feedback) => {
        const feedbackElement = document.createElement("div");
        const ratingElement = document.createElement("p");
        const commentElement = document.createElement("p");

        // textContent for security against XSS
        ratingElement.textContent = `Average Rating: ${feedback.rating}`;
        commentElement.textContent = `Most Recent Comment: ${feedback.comment}`;

        feedbackElement.appendChild(ratingElement);
        feedbackElement.appendChild(commentElement);
        feedbackContainer.appendChild(feedbackElement);
      });

      appendFeedbackForm(modelId, feedbackContainer);
    })
    .catch((error) => console.error("Fetching feedback failed:", error));
};

const createFeedbackContainer = () => {
  const feedbackContainer = document.createElement("div");
  feedbackContainer.id = "feedback-container";
  document.body.appendChild(feedbackContainer);
  return feedbackContainer;
};

const appendFeedbackForm = (modelId, container) => {
  const form = document.createElement("form");
  const ratingInput = document.createElement("input");
  const commentInput = document.createElement("input");
  const submitButton = document.createElement("button");

  ratingInput.type = "number";
  ratingInput.min = "1";
  ratingInput.max = "5";
  commentInput.type = "text";
  submitButton.type = "submit";
  submitButton.textContent = "Submit Feedback";

  form.appendChild(ratingInput);
  form.appendChild(commentInput);
  form.appendChild(submitButton);

  form.onsubmit = (e) => {
    e.preventDefault();
    submitFeedback(modelId, ratingInput.value, commentInput.value);
  };

  container.appendChild(form);
};
