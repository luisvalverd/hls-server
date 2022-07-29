import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

var storageVideos = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    cb(null, uuid() + path.extname(file.originalname));
  },
});

export var uploadVideos = multer({ storage: storageVideos });
