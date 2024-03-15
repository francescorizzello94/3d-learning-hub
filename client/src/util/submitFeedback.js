import axios from "axios";
import { loadFeedback } from "./loadFeedback";

export const submitFeedback = (modelId, rating, comment) => {
  axios
    .post("/api/feedback", { modelId, rating, comment })
    .then((response) => {
      console.log("Feedback submitted", response.data);
      loadFeedback(modelId);
    })
    .catch((error) => console.error("Failed to submit feedback:", error));
};
