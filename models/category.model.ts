import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a category name"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
