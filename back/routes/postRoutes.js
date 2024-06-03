import { Router } from "express";
import {
  createPost,
  getPosts,
  getPost,
  getCatPost,
  getUserPost,
  eidtPost,
  deletePost,
} from "../controller/posts.controller.js";
import authMiddleware from "../middleware/auth.midleware.js";
import upload from "../middleware/Multer.middleware.js";
const router = Router();

router.post(
  "/",
  authMiddleware,

  createPost
);
router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/categories/:category", getCatPost);
router.get("/users/:id", getUserPost);
router.patch("/:id", authMiddleware, eidtPost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
