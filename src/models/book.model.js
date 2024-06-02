import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    bookImage: {
      type: String,
      required: true,
    },
    bookPdf : {
      type: String,
      required : true
    },
    bookname: {
      type: String,
      required: true,
    },
    bookPrice: {
      type: Number,
      default: 0,
    },
    bookAuthor: {
      type: String,
      required : true
    },
    bookDescription: {
      type: String,
      default : "these is very interesting book you have read it carefully"
    },
    bookGenre: {
      type: String,
      enum :  ["Fiction", "Non-fiction", "Mystery", "Romance", "Sci-fi", "Fantasy", "Biography", "History", "Self-help", "Business"],
      required : true
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
