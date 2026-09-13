import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    publishProduct,
    unpublishProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public products listing (users can view published-only)
router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);

// Admin-only operations
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.patch("/:id/publish", protect, adminOnly, publishProduct);
router.patch("/:id/unpublish", protect, adminOnly, unpublishProduct);

export default router;