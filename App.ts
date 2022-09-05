import express from "express";
import * as http from "http";
import dotenv from "dotenv";
import { VideosRouter } from "./routers/Videos";
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
    this.socket.write(nameVideo);
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
  public videosRouter: VideosRouter = new VideosRouter(this.serverSocket);

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
    this.app.use(express.static(path.join(__dirname, "videos")));
    this.app.use(express.static(path.join(__dirname, "uploads")));
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
