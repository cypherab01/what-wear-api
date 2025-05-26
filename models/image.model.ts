import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  url: {
    type: String,
    required: [true, "Please provide the image URL"],
  },
});

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;
