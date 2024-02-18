import express from "express";
import FeedbackModel from "../models/FeedbackModel.js";
import ObjectModel from "../models/ObjectModel.js";

const feedbackRouter = express.Router();

// post feedback for a model

feedbackRouter.post("/", async (req, res) => {
  const { modelId, rating, comment } = req.body;

  try {
    const model = await ObjectModel.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    const feedback = new FeedbackModel({ modelId, rating, comment });
    await feedback.save();

    // update the feedbackValue of the model

    const feedbacks = await FeedbackModel.find({ modelId: modelId });
    const averageRating = feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );

    model.feedbackValue = averageRating / feedbacks.length;
    await model.save();

    res.json(feedback);
  } catch (e) {
    if (e.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid model ID format" });
    }
    res.status(500).json({ message: e.message });
  }
});

// get feedback for a model

feedbackRouter.get("/:modelId", async (req, res) => {
  try {
    const model = await ObjectModel.findById(req.params.modelId);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    const feedback = await FeedbackModel.find({ modelId: req.params.modelId });
    res.json(feedback);
  } catch (e) {
    if (e.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid model ID format" });
    }
    res.status(500).json({ message: e.message });
  }
});

export default feedbackRouter;
