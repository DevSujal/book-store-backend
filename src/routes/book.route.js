import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createBook } from "../controllers/book.controller.js";

const router = Router()

router.route("/create-book").post(upload.fields([
    {name : "bookImage", maxCount : 1},{
        name : "bookImage", maxCount : 1
    }
]),  createBook)


export {router}