import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

const formats = [".jpg", ".jpeg", ".png", "jfif", "pjpeg", "pjp"];

var storageImage = multer.diskStorage({
  destination: "actors",
  filename: function (req, file, cb) {
    let name = uuid();
    cb(null, name + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: storageImage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (!formats.includes(ext)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
}).single("actor");

export function uploadImage(req: Request, res: Response, next: NextFunction) {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(409).json({ message: "Error in upload video" });
    }
    if (err) {
      return res.status(409).json({ message: "Error in upload" });
    }
    next();
  });
}
