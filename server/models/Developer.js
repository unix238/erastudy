import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: [String], required: true },
  rating: { type: String, required: true },
  financialStability: { type: String, required: true },
});

export default mongoose.model("Developer", schema);
