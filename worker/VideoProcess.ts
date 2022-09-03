import { expose } from "comlink";
import { convertVideo } from "../middlewares/ffmpeg";

const worker = {
  convertVideo,
};

export type ConvertVideoWorker = typeof worker;

expose(worker);
