import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createBook } from "../controllers/book.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/create-book").post(
  verifyJwt,
  upload.fields([
    { name: "bookImage", maxCount: 1 },
    {
      name: "bookPdf",
      maxCount: 1,
    },
  ]),
  createBook
);

export default router;
