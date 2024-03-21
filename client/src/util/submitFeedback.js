import axios from "axios";
import { loadFeedback } from "./loadFeedback";

export const submitFeedback = (modelId, rating, comment) => {
  return axios.post("/api/feedback", { modelId, rating, comment });
};

export const handleSubmit = (
  modelId,
  rating,
  comment,
  submitButton,
  loadingSpinner,
  feedbackContainer,
  feedbackMessageContainer
) => {
  submitButton.disabled = true;
  loadingSpinner.style.display = "block";
  feedbackMessageContainer ? (feedbackMessageContainer.textContent = "") : null;

  submitFeedback(modelId, rating, comment)
    .then((response) => {
      console.log("Feedback submitted", response.data);
      feedbackContainer.innerHTML = `<p>Thank you for your feedback!</p>`;
      rating = "";
      comment = "";
    })
    .catch((error) => {
      console.error("Failed to submit feedback:", error);
      feedbackMessageContainer.textContent =
        "Failed to submit feedback. Please try again.";
      feedbackMessageContainer.style.color = "red";
    })
    .finally(() => {
      submitButton.disabled = false;
      loadingSpinner.style.display = "none";
      loadFeedback(modelId);
    });
};
