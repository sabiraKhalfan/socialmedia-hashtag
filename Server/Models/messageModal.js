import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    text: String,
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
