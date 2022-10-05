import { HandlerActors } from "../controllers/HandlerActors";
import { uploadImageActor } from "../middlewares/uploadPhotosActor";
import express from "express";

export class ActorsRouter extends HandlerActors {
  routers(app: express.Express): void {
    app.route("/actor").post(uploadImageActor, this.createActor);
    app.route("/actor/:id").delete(this.deleteActor);
    app.route("/videos-of-actor/:id").get(this.getVideosOfActor);
    app.route("/all-actors").get(this.getAllActors);
    app.route("/add-actor-in-video").get(this.addActorsToVideo);
    app.route("/actor-find").post(this.findActor);
    app.route("/actor-by-id/:id").get(this.getActorById);
  }
}
