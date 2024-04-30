import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: [String], required: true },
  image: { type: String, required: true },
  totalOffers: { type: Number, required: true },
});

export default mongoose.model("Countries", schema);
