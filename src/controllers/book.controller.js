import { Book } from "../models/book.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespnse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudianary } from "../utils/uploadOnCloudianary.js";

const createBook = asyncHandler(async (req, res) => {
  const { bookname, bookPrice, bookAuthor, bookDescription, bookGenre } =
    req.body;

  if (
    [bookname, bookAuthor, bookDescription, bookGenre].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are necessary");
  }

  if(!bookPrice)
    throw new ApiError(400, "Book Price is required")

  if (
    !(req.files &&
    Array.isArray(req.files.bookImage) &&
    req.files.bookImage.length > 0 &&
    Array.isArray(req.files.bookPdf) &&
    req.files.bookPdf.length > 0)
  ) {
    throw new ApiError(400, "book image and book pdf are required")
  }

  const bookImageLocalPath = req.files.bookImage[0].path
  const bookPdfLocalPath = req.files.bookPdf[0].path

  const bookImage = await uploadOnCloudianary(bookImageLocalPath)
  const bookPdf = await uploadOnCloudianary(bookPdfLocalPath)

  if(!(bookImage && bookPdf)){
    throw new ApiError(400, "book image and book pdf are required")
  }

  const book = await Book.create({
    bookname,
    bookPrice,
    bookAuthor,
    bookDescription,
    bookGenre,
    bookImage : bookImage.url,
    bookPdf : bookPdf.url
  })

  res.status(200).json(new ApiResponse(
    200,
    book,
    "Book was successfully created"
    ))
});

export { createBook };
