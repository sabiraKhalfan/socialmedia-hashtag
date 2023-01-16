import Chat from "../Models/chatModal.js";

export const createChat = async (req, res) => {
  const { memberId } = req.params;
  const { userId } = req.user;

  if (!memberId) {
    return res.status(401).json({ message: "invalid receiver id" });
  }

  try {
    const isRoomExist = await Chat.findOne({
      members: { $all: [userId, memberId] },
    });

    if (isRoomExist) {
      return res.status(200).json({ message: "Room already exist" });
    }
    const newChat = new Chat({
      members: [userId, memberId],
    });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "something went wrong" });
  }
};

export const userChat = async (req, res) => {
  const { userId } = req.user;
  try {
    const chat = await Chat.find({
      members: { $in: userId },
    });
    res.status(200).json({ chat });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const findChat = async (req, res) => {
  const { receiverId } = req.params;
  const { userId } = req.user;
  try {
    const chat = await Chat.findOne({
      members: { $all: [userId, receiverId] },
    });
    res.status(200).json({ chat });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
