import mongoose from "mongoose";
export const PROPERTY_TYPES = [
  "Книги",
  "Курсы",
  "Менторы",
];

const schema = new mongoose.Schema({
  title: { type: [String], required: true },
  images: { type: [String], required: true },
  area: { type: Number, required: true },
  onMainPage: { type: Boolean, default: false },
  address: { type: [String], required: true },
  book: { type: Number, required: true, default: 300000 },
  filePrice: { type: Number, default: 7000 },
  isBooked: { type: Boolean, default: false },
  isSold: { type: Boolean, default: false },
  coords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  map: {
    near: [
      {
        title: { type: [String], required: false },
        distance: { type: [String], required: false },
      },
    ],
  },
  file: { type: String, required: false },
  saleType: {
    type: String,
    enum: ["saleStart", "auccion", "bussiness", "investOffer"],
    required: true,
  },
  timer: { type: Date, required: false },
  isTimer: { type: Boolean, default: false },
  video: { type: String, required: false },
  directions: {
    type: String,
    enum: PROPERTY_TYPES,
    required: true,
  },
  price: { type: Number, required: true }, //цена
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Developer",
    required: true,
  },
  info: {
    roi: { type: [String], required: false },
    liquidity: { type: [String], required: false },
    priceOverTime: { type: [String], required: false },
    repairCost: { type: [String], required: false },
    sale: { type: [String], required: false },
    rentalRate: { type: [String], required: false },
    price: { type: [String], required: false },
  },
  building: { type: [String], required: true }, //здание
  description: { type: [String], required: true },
  dealOverview: { type: [String], required: true },
  dealProfitability: { type: [String], required: true },
  dealCapitalIncrease: { type: [String], required: true },
  isCompleted: { type: Boolean, default: true }
});

export default mongoose.model("Property", schema);
