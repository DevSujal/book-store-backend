import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    bookImage: {
      type: String,
      required: true,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookDescription: {
      type: String,
    },
    bookGenre: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
