import { Request, Response } from "express";

export class HanddlerVideos {
  getAllVideos(req: Request, res: Response) {
    res.json({ message: "hello world" });
  }

  deleteVideo(req: Request, res: Response) {
    let { id } = req.params;
    res.json(id);
  }

  uploadVideo(req: Request, res: Response): Response {
    let video = req.file?.path;

    if (!video) {
      return res.status(406).json({ message: "Error in find video" });
    }

    return res.json({ message: "image upload successfuly" });
  }
}
