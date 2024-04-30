import express from "express";
import PropertyController from "../controllers/PropertyController.js";
import Upload from "../middleware/Upload.js";
import AuthMiddleware from "../middleware/Auth.js";

const router = express.Router();
router.get("/", PropertyController.getAll);
router.get("/id/:id", PropertyController.getById);
router.get("/sales", PropertyController.getAllSales);
router.get("/auctions", PropertyController.getAllAuctions);
router.get("/businesses", PropertyController.getAllBusinesses);
router.get("/investOffers", PropertyController.getAllInvestOffers);
router.get("/developer/:id", PropertyController.getDeveloper);
router.get("/getBought", [AuthMiddleware], PropertyController.getBought);
router.get("/getCities", PropertyController.getCities);
router.get("/getCountries", PropertyController.getCountries);

router.post("/getCountProperties", PropertyController.getCountProperties);
router.post("/getAllProperties", PropertyController.getAllProperties);
router.post("/contact", [AuthMiddleware], PropertyController.contact);
router.post("/getFilters", PropertyController.getFilteredProperties);
router.post(
  "/upload",
  [Upload.array("images")],
  PropertyController.uploadImage
);

export default router;
