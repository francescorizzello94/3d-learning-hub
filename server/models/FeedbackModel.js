import mongoose from "mongoose";

const feedbackModelSchema = new mongoose.Schema({
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ObjectModel",
    required: true,
  },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

const FeedbackModel = mongoose.model("FeedbackModel", feedbackModelSchema);
export default FeedbackModel;
