import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import { mkdirSync } from "fs";

const formats = [".mp4", ".mov", ".wmv", ".avi", ".flv"];

function makeDir(name: string) {
  let path = `videos/${name}`;
  mkdirSync(path, { recursive: true });
}

var storageVideos = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    let name = uuid();

    makeDir(name);

    cb(null, name + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: storageVideos,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (!formats.includes(ext)) {
      return cb(new Error("Only videos are allowed"));
    }
    cb(null, true);
  },
}).single("video");

// send error if not uploaded video
// * verify if ths is a video
export function uploadVideos(req: Request, res: Response, next: NextFunction) {
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
