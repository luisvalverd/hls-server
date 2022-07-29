import { HanddlerVideos } from "../controllers/HanddlerVideos";
import express from "express";

export class VideosRouter extends HanddlerVideos {
  routers(app: express.Express): void {
    app.route("/videos").get(this.getAllVideos);
    app.route("/videos/:id").delete(this.deleteVideo);
  }
}
