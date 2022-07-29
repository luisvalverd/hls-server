import express from "express";
import * as http from "http";
import dotenv from "dotenv";
import { VideosRouter } from "./routers/Videos";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import "reflect-metadata";
import { AppDataSource } from "./data-source";

import morgan from "morgan";

dotenv.config();

class Server {
  public app: express.Express;
  public server: http.Server;
  private port: number;
  public videosRouter: VideosRouter = new VideosRouter();

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = <any>process.env.PORT;
    this.routers();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  routers(): void {
    this.videosRouter.routers(this.app);
  }

  listen(): void {
    this.server.listen(this.port, () => {
      console.log(`listen on port ${this.port}`);
    });
  }
}

AppDataSource.initialize()
  .then(() => {
    console.log("database is connected");
    const app = new Server();
    app.listen();
  })
  .catch((err) => {
    console.log(err);
  });
