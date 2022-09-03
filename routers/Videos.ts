import { HanddlerVideos } from "../controllers/HanddlerVideos";
import { uploadVideos } from "../middlewares/uploadVideos";
import express from "express";
import { ServerSocketConnection } from "../App";

export class VideosRouter extends HanddlerVideos {
  constructor(server: ServerSocketConnection) {
    super(server);
  }

  routers(app: express.Express): void {
    app.route("/videos").get(this.getAllVideos);
    app.route("/upload-video").post(uploadVideos, this.uploadVideo);
    app.route("/videos/:id").delete(this.deleteVideo);
  }
}
