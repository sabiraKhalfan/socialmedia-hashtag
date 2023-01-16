import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    reporter: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: String,
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
