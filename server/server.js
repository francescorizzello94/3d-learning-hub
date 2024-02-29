import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config as dotConfig } from "dotenv";
import objectRouter from "./routes/objectRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import { categoryRouter } from "./routes/categoryRoutes.js";

dotConfig();
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.error("Error connecting to MongoDB", error.message)
  );

// Static route for Draco files
app.use(
  "/draco",
  express.static(join(__dirname, "../client/public/libs/draco"))
);

// API routes
app.use("/api/categories", categoryRouter);
app.use("/api/objects", objectRouter);
app.use("/api/feedback", feedbackRouter);

// Static route for compressed model files
app.use("/models", express.static(join(__dirname, "static_output")));

// Serve Vite-built client files
app.use(express.static(join(__dirname, "../client/dist")));

// All other routes should serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../client/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
