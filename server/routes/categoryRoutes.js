import express from "express";
import ObjectModel from "../models/ObjectModel.js";

export const categoryRouter = express.Router();

// get categories

categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await ObjectModel.distinct("category");
    res.json(categories);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Endpoint to get all models in a specific category

categoryRouter.get("/:categoryName/models", async (req, res) => {
  const { categoryName } = req.params;
  try {
    const models = await ObjectModel.find({ category: categoryName });
    res.json(models);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
