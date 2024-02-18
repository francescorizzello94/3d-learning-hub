import mongoose from "mongoose";

const objectModelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  modelUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: Date,
  feedbackValue: { type: Number, default: 0 },
});

const ObjectModel = mongoose.model("ObjectModel", objectModelSchema);
export default ObjectModel;
