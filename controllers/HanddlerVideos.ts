import { Request, Response } from "express";
import { Video } from "../entities/Videos";
import { AppDataSource } from "../data-source";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { ServerSocketConnection } from "../App";
import { resolve, basename } from "path";
import mime from "mime";
import fs from "fs";
import { getVideoDurationInSeconds } from "get-video-duration";

dotenv.config();

var videoRepository = AppDataSource.getRepository(Video);

export class HanddlerVideos {
  server: ServerSocketConnection;

  constructor(server: ServerSocketConnection) {
    this.server = server;
  }

  startWorker = (name: string) => {
    this.server.converVideo(name);
  };

  getAllVideos = async (req: Request, res: Response): Promise<Response> => {
    let { page } = req.query;
    const take = 10;

    let expreg = /[^A-Za-z\W\w]+$/g;

    if (page === undefined || expreg.test(<any>page)) {
      page = <any>1;
    }

    let skip = (Number(page) - 1) * take;

    try {
      let [list, count] = await videoRepository
        .createQueryBuilder()
        .take(take)
        .skip(skip)
        .getManyAndCount();

      return res.status(200).json({
        totalPage: count / take,
        actualPage: Number(page),
        videos: list,
      });
    } catch (error) {
      return res.status(409).json({ message: "Error not find any videos" });
    }
  };

  // TODO: delete video
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
    newVideo.path_stream = `videos/${nameFolder}/output.m3u8`;
    newVideo.path_image = `images/${nameFolder}.jpg`;
    let duration: any = await this.getDuration(<string>req.file?.path);
    newVideo.minutes = <number>duration.minutes;
    newVideo.seconds = <number>duration.seconds;

    try {
      await videoRepository.save(newVideo);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error in save data of video" });
    }

    // change this name
    this.startWorker(<string>resolve(`${req.file?.path}`));

    return res.status(201).json({ message: "video upload successfuly" });
  };

  private getDuration = async (path: string) => {
    let getpath = resolve(path);
    let duration = await getVideoDurationInSeconds(getpath);

    let minutes = duration / 60;
    let getSeconds = duration / 60 - Math.floor(minutes);
    let seconds = getSeconds * 60;

    return {
      minutes: Math.floor(minutes),
      seconds: Math.floor(seconds),
    };
  };

  getVideo = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      let path_stream = await videoRepository.findOne({
        where: {
          id_video: id,
        },
      });

      return res.status(200).json(path_stream);
    } catch (error) {
      return res.status(403);
    }
  };

  /**
   * * find videos for title
   * ? this find relations in searchs_values with titles of videos
   * @param req
   * @param res
   * @returns
   */
  findVideos = async (req: Request, res: Response): Promise<Response> => {
    const { search_value } = req.body;
    let { page } = req.query;
    let take = 12;

    let expreg = /[^A-Za-z\W\w]+$/g;

    if (page === undefined || expreg.test(<any>page)) {
      page = <any>1;
    }

    let skip = (Number(page) - 1) * take;

    try {
      let [list, count] = await videoRepository
        .createQueryBuilder("videos")
        .where("LOWER(videos.title) like :value", {
          value: `%${search_value.toLowerCase()}%`,
        })
        .take(take)
        .skip(skip)
        .getManyAndCount();

      return res.json({
        totalPages: count / take,
        actualPage: Number(page),
        search_value,
        videos: list,
      });
    } catch (error) {
      return res.status(403);
    }
  };

  getRecomendations = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      let videos = await videoRepository
        .createQueryBuilder("videos")
        .orderBy("RANDOM()")
        .limit(12)
        .getMany();

      return res.json(videos);
    } catch (error) {
      return res.status(403);
    }
  };

  downloadVideo = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      let data = await videoRepository
        .createQueryBuilder("videos")
        .where("videos.id_video like :id", {
          id,
        })
        .getOne();
      let file = resolve(<string>data?.path_video);

      let filename = basename(file);
      let minetype = mime.lookup(file);

      res.setHeader("Content-disposition", "attachmen; filename=" + filename);
      res.setHeader("Content-type", minetype);

      res.download(file);
    } catch (error) {
      return res.status(403);
    }
  };
}
