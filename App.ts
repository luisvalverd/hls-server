import express from "express";
import * as http from "http";
import dotenv from "dotenv";
//router
import { VideosRouter } from "./routers/Videos";
import { ActorsRouter } from "./routers/Actors";
import { CategoriesRouter } from "./routers/Categories";

import cors from "cors";
import { json, urlencoded } from "body-parser";
import { AppDataSource } from "./data-source";
import { Socket } from "net";
import path from "path";

import morgan from "morgan";

dotenv.config();

export class ServerSocketConnection {
  public socket: Socket;

  constructor() {
    this.socket = new Socket();
    this.socket.setEncoding("utf-8");
  }

  startConnection() {
    try {
      this.socket.connect(<any>{
        host: process.env.HLS_HOST,
        port: process.env.HLS_PORT,
      });
    } catch (e: any) {
      console.error("Server HLS not connected...");
      console.log(e.message);
    }
  }

  converVideo(nameVideo: string) {
    this.socket.write(nameVideo + "\n");
    this.socket.on("data", (data) => {
      console.log(data);
    });
  }
}

/**
 * * Server of handle information
 */

class Server {
  public app: express.Express;
  public server: http.Server;
  private port: number;
  public serverSocket: ServerSocketConnection = new ServerSocketConnection();
  // categories instance
  public videosRouter: VideosRouter = new VideosRouter(this.serverSocket);
  public actorsRouter: ActorsRouter = new ActorsRouter();
  public categoriesRouter: CategoriesRouter = new CategoriesRouter();

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = <any>process.env.PORT;
    this.middlewares();
    this.routers();
    this.serverSocket.startConnection();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use("/videos", express.static(path.join(__dirname, "videos")));
    this.app.use("/images", express.static(path.join(__dirname, "images")));
    this.app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    this.app.use("/actors", express.static(path.join(__dirname, "actors")));
    this.app.use(morgan("dev"));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  routers(): void {
    this.videosRouter.routers(this.app);
    this.actorsRouter.routers(this.app);
    this.categoriesRouter.routers(this.app);
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
