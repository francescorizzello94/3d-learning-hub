import express from "express";
import ObjectModel from "../models/ObjectModel.js";

const objectRouter = express.Router();

// get all objects if not category is specified or get objects by category

objectRouter.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    let query = {};
    if (category) {
      query.category = category;
    }

    const models = await ObjectModel.find(query);
    res.json(models);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// get object by id

objectRouter.get("/:id", async (req, res) => {
  try {
    const model = await ObjectModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.json(model);
  } catch (e) {
    if (e.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid model ID format" });
    }
    res.status(500).json({ message: e.message });
  }
});

export default objectRouter;
