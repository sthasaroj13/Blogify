import { Router } from "express";
import authMiddleware from "../middleware/auth.midleware.js";
const router = Router();
import {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
} from "../controller/User.controller.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.post("/changeAvatar", authMiddleware, changeAvatar);
router.patch("/editUser", authMiddleware, editUser);
router.get("/", getAuthors);
export default router;
