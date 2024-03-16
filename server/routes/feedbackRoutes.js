import express from "express";
import FeedbackModel from "../models/FeedbackModel.js";
import ObjectModel from "../models/ObjectModel.js";
import mongoose from "mongoose";

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
    const modelId = req.params.modelId;

    if (!mongoose.Types.ObjectId.isValid(modelId)) {
      return res.status(400).json({ message: "Invalid model ID format" });
    }

    const feedback = await FeedbackModel.find({ modelId });

    const avgRating = await FeedbackModel.aggregate([
      { $match: { modelId: new mongoose.Types.ObjectId(modelId) } }, // Correct usage if needed
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    console.log("avgRating", avgRating);

    res.json({
      feedback,
      avgRating:
        avgRating.length > 0
          ? avgRating[0].avgRating.toFixed(1)
          : "No feedback yet",
    });
  } catch (e) {
    console.error("An error occurred while fetching feedback", e);
    res.status(500).json({
      message: "An error occurred while fetching feedback",
      error: e.toString(),
    });
  }
});

export default feedbackRouter;
