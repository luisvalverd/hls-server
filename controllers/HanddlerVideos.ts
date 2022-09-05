import { Request, Response } from "express";
import { Video } from "../entities/Videos";
import { AppDataSource } from "../data-source";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { ServerSocketConnection } from "../App";
import { resolve } from "path";

dotenv.config();

var videoRepository = AppDataSource.getRepository(Video);

export class HanddlerVideos {
  //videoRepository = AppDataSource.getRepository(Video);
  server: ServerSocketConnection;

  constructor(server: ServerSocketConnection) {
    this.server = server;
  }

  startWorker = (name: string) => {
    this.server.converVideo(name);
  };

  getAllVideos = async (req: Request, res: Response): Promise<Response> => {
    let videos;
    try {
      videos = await videoRepository.find();
    } catch (error) {
      return res.status(409).json({ message: "Error not find videos" });
    }

    return res.json({ videos });
  };

  deleteVideo = (req: Request, res: Response) => {
    let { id } = req.params;
    res.json(id);
  };

  /**
   *  * upload videos and save information in database
   * @param req
   * @param res
   * @returns
   */
  uploadVideo = async (req: Request, res: Response): Promise<Response> => {
    let video = req.file?.path;
    const { title, description } = req.body;

    if (!video) {
      return res.status(409).json({ message: "Error in find video" });
    }

    let name = req.file?.path.split("/")[1];
    let nameFolder = name?.split(".")[0];

    // instance data of video
    let newVideo = new Video();

    newVideo.id_video = uuid();
    newVideo.title = <string>title;
    newVideo.description = <string>description;
    newVideo.path_video = <string>req.file?.path;
    newVideo.path_stream = `/upload/${nameFolder}/output.m3u8`;

    try {
      await videoRepository.save(newVideo);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error in save data of video" });
    }

    this.startWorker(<string>name);

    return res.status(201).json({ message: "image upload successfuly" });
  };

  getVideo = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.body;

    try {
      let path_stream = await videoRepository.findOne({
        where: {
          id_video: id,
        },
      });

      let resolve_path: any = resolve(<string>path_stream?.path_stream);

      return <any>res.sendFile(resolve_path);
    } catch (error) {
      return res.status(403);
    }
  };

  // TODO: make pagination
  findVideos = async (req: Request, res: Response): Promise<Response> => {
    const { search_value } = req.body;
    const { skip } = req.query;

    try {
      let videos = await videoRepository
        .createQueryBuilder("videos")
        .where("videos.title like :value", { value: `%${search_value}%` })
        .take(10)
        .skip(<any>skip)
        .getMany();

      return res.json(videos);
    } catch (error) {
      return res.status(403);
    }
  };
}
