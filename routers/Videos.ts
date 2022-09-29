import { HanddlerVideos } from "../controllers/HanddlerVideos";
import { uploadVideos } from "../middlewares/uploadVideos";
import express from "express";
import { ServerSocketConnection } from "../App";

export class VideosRouter extends HanddlerVideos {
  constructor(server: ServerSocketConnection) {
    super(server);
  }

  routers(app: express.Express): void {
    app.route("/all-videos").get(this.getAllVideos);
    app.route("/upload-video").post(uploadVideos, this.uploadVideo);
    app.route("/videos/:id").delete(this.deleteVideo);
    app.route("/videos").post(this.findVideos);
    app.route("/video/:id").get(this.getVideo);
    app.route("/recomendations").get(this.getRecomendations);
    app.route("/download/:id").get(this.downloadVideo);
  }
}
