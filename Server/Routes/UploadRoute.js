import express from "express";
import multer from "multer";
import authenticate from "../middleware/Auth.js";
import sharp from "sharp";
const router = express.Router();

const imageStorage = multer.memoryStorage();
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name);
  },
});
const imageUpload = multer({ storage: imageStorage });
const videoUpload = multer({ storage: videoStorage });

router.use(authenticate);

router.post("/image", imageUpload.single("file"), async (req, res) => {
  try {
    const path = `public/images/${req.body.name}`;
    await sharp(req.file.buffer).resize(600, 600).toFile(path);
    return res.status(201).json({ message: "File upload successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/video", videoUpload.single("file"), (req, res) => {
  try {
    return res.status(201).json({ message: "video uploaded successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
