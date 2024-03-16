import axios from "axios";
import { handleSubmit, submitFeedback } from "./submitFeedback";

export const loadFeedback = (modelId) => {
  const feedbackContainer =
    document.getElementById("feedback-container") || createFeedbackContainer();
  axios
    .get(`/api/feedback/${modelId}`)
    .then((response) => {
      feedbackContainer.innerHTML = "";

      const avgRatingDisplayValue = `Average Rating: ${parseFloat(
        response.data.avgRating
      )} / 5`;

      const avgRatingDisplay = document.createElement("div");
      avgRatingDisplay.className = "average-rating-display";
      avgRatingDisplay.innerHTML = avgRatingDisplayValue;
      feedbackContainer.appendChild(avgRatingDisplay);

      if (response.data.feedback && response.data.feedback.length > 0) {
        const recentComment =
          response.data.feedback[response.data.feedback.length - 1].comment;
        const recentCommentDisplay = document.createElement("p");
        recentCommentDisplay.className = "recent-comment-display";
        recentCommentDisplay.textContent = `Most Recent Comment: ${recentComment}`;
        feedbackContainer.appendChild(recentCommentDisplay);
      }

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
  form.className = "feedback-form";

  const starContainer = document.createElement("div");
  starContainer.className = "star-rating-container";

  const ratingInput = document.createElement("input");
  ratingInput.type = "hidden";

  const commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.placeholder = "Leave a comment...";
  commentInput.className = "comment-input";

  const submitButton = document.createElement("button");
  submitButton.type = "button";
  submitButton.textContent = "Submit Feedback";
  submitButton.className = "submit-feedback-button";

  const loadingSpinner = document.createElement("span");
  loadingSpinner.className = "loading-spinner";
  loadingSpinner.textContent = "Loading...";
  loadingSpinner.style.display = "none";

  const feedbackMessageContainer = document.createElement("div");
  feedbackMessageContainer.className = "feedback-message-container";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.dataset.value = i;
    star.innerHTML = "★";
    star.onclick = () => updateStarRating(starContainer, i, ratingInput);
    starContainer.appendChild(star);
  }

  form.appendChild(starContainer);
  form.appendChild(ratingInput);
  form.appendChild(commentInput);
  form.appendChild(submitButton);
  form.appendChild(loadingSpinner);
  form.appendChild(feedbackMessageContainer);

  container.appendChild(form);

  submitButton.onclick = () =>
    handleSubmit(
      modelId,
      ratingInput.value,
      commentInput.value,
      submitButton,
      loadingSpinner,
      feedbackMessageContainer
    );
};

const updateStarRating = (starContainer, value, ratingInput) => {
  ratingInput.value = value;
  Array.from(starContainer.children).forEach((star) => {
    star.style.color = star.dataset.value <= value ? "#ffc107" : "#e4e5e9";
  });
};
