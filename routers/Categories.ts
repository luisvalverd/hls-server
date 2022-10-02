import { HandlerCategories } from "../controllers/HandlerCategories";
import express from "express";

export class CategoriesRouter extends HandlerCategories {
  routers(app: express.Express): void {
    app.route("/create-category").post(this.createCategory);
    app.route("/category/:id").delete(this.deleteCategory);
    app.route("/category/:id").put(this.updateCategory);
    app.route("/add-video-to-category").get(this.addVideoToCategory);
    app.route("/videos-by-category/:id").get(this.getVideosByCategory);
    app.route("/all-categories").get(this.getAllCategories);
  }
}
