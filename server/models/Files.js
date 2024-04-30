import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  property: { type: mongoose.Schema.ObjectId, ref: "Property", required: true },
  payment: { type: mongoose.Schema.ObjectId, ref: "Payment", required: true },
  file: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", schema);
