import axios from "axios";
import { handleSubmit } from "./submitFeedback";

export const loadFeedback = (modelId) => {
  const feedbackContainer =
    document.getElementById("feedback-container") || createFeedbackContainer();
  axios
    .get(`/api/feedback/${modelId}`)
    .then((response) => {
      feedbackContainer.innerHTML = "";
      feedbackContainer.className = "feedback-container";

      const avgRatingDisplayValue =
        !isNaN(response.data.avgRating) && response.data.avgRating !== 0
          ? `Average Rating: ${parseFloat(response.data.avgRating)} / 5`
          : "No rating has been entered for this model yet";

      const avgRatingDisplay = document.createElement("div");
      avgRatingDisplay.className = "average-rating-display";
      avgRatingDisplay.innerHTML = avgRatingDisplayValue;
      feedbackContainer.appendChild(avgRatingDisplay);

      if (response.data.feedback && response.data.feedback.length > 0) {
        const feedbacksWithComments = response.data.feedback.filter(
          (fb) => fb.comment && fb.comment.trim() !== ""
        );

        if (feedbacksWithComments.length > 0) {
          const recentComment =
            feedbacksWithComments[feedbacksWithComments.length - 1].comment;
          const recentCommentDisplay = document.createElement("p");
          recentCommentDisplay.className = "recent-comment-display";
          recentCommentDisplay.textContent = `Most Recent Comment: ${recentComment}`;
          feedbackContainer.appendChild(recentCommentDisplay);
        }
      }

      appendFeedbackForm(modelId, feedbackContainer);
    })
    .catch((error) => console.error("Fetching feedback failed:", error));
};

const createFeedbackContainer = () => {
  let feedbackContainer = document.getElementById("feedback-container");
  if (!feedbackContainer) {
    feedbackContainer = document.createElement("div");
    feedbackContainer.id = "feedback-container";
    feedbackContainer.className = "feedback-container";
    document.body.appendChild(feedbackContainer);
  }

  return feedbackContainer;
};

const appendFeedbackForm = (modelId, container) => {
  const form = document.createElement("form");
  form.className = "feedback-form";

  const starContainer = document.createElement("div");
  starContainer.className = "star-rating-container";

  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";

  const ratingInput = document.createElement("input");
  ratingInput.type = "hidden";

  const commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.placeholder = "Help us improve your learning experience!";
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

  inputContainer.appendChild(starContainer);
  inputContainer.appendChild(commentInput);
  inputContainer.appendChild(submitButton);

  form.appendChild(inputContainer);
  form.appendChild(loadingSpinner);
  form.appendChild(feedbackMessageContainer);

  container.appendChild(form);

  submitButton.onclick = () => {
    if (ratingInput.value === "") {
      feedbackMessageContainer.textContent =
        "Please select a rating before submitting.";
      feedbackMessageContainer.style.color = "red";
      return;
    }

    handleSubmit(
      modelId,
      ratingInput.value,
      commentInput.value,
      submitButton,
      loadingSpinner,
      feedbackMessageContainer
    );
  };
};

const updateStarRating = (starContainer, value, ratingInput) => {
  ratingInput.value = value;
  Array.from(starContainer.children).forEach((star) => {
    star.style.color = star.dataset.value <= value ? "#ffc107" : "#e4e5e9";
  });
};
