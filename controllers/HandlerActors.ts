import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
// entities
import { Actor } from "../entities/Actors";
import { Video } from "../entities/Videos";

import { v4 as uuid } from "uuid";

/**
 * TODO: create of autor
 * TODO: update info of autor
 * TODO: delete autor
 * TODO: buscador if existe autor
 */

let actorRepository = AppDataSource.getRepository(Actor);
let videoRepository = AppDataSource.getRepository(Video);

export class HandlerActors {
  /**
   * * create a actor
   */

  private genders = ["masculine", "femenine", "other"];

  createActor = async (req: Request, res: Response): Promise<Response> => {
    let actor = req.file?.path;
    const { name, lastname, gender } = req.body;

    if (!actor) {
      return res.status(304).json({ message: "Error in find image" });
    }

    // * if gender is not correct
    if (!this.genders.includes(gender)) {
      return res
        .status(304)
        .json({ message: "Error in create actor gender not correct" });
    }

    let newActor = new Actor();

    newActor.id_actor = uuid();
    newActor.name = <string>name;
    newActor.lastname = <string>lastname;
    newActor.ranking = 0;
    newActor.gender = <string>gender;
    newActor.avatar = <string>req.file?.path;

    try {
      await actorRepository.save(newActor);
    } catch (error: any) {
      console.log(error);
      return res.status(400).json({ message: "Error in save data of actor" });
    }

    return res.status(201).json({ message: "image upload successfuly" });
  };

  // TODO: delete video
  deleteActor = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    return res.json(id);
  };

  /**
   * * get videos from one actor
   * ? this send to param id_actor and query is the page
   */
  getVideosOfActor = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
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
        .leftJoinAndSelect("videos.actors", "actor")
        .relations("actors")
        .where("actors.id_actor like :value", {
          value: `${id}`,
        })
        .take(take)
        .skip(skip)
        .getManyAndCount();

      return res.json({
        totalPages: count / take,
        actualPage: Number(page),
        list,
      });
    } catch (error) {
      return res.status(403);
    }
  };

  getAllActors = async (req: Request, res: Response): Promise<Response> => {
    let { page } = req.query;
    let take = 12;

    let expreg = /[^A-Za-z\W\w]+$/g;

    if (page === undefined || expreg.test(<any>page)) {
      page = <any>1;
    }

    let skip = (Number(page) - 1) * take;

    try {
      let [list, count] = await actorRepository
        .createQueryBuilder("actors")
        .take(take)
        .skip(skip)
        .getManyAndCount();

      return res.json({
        totalPages: count / take,
        actualPage: Number(page),
        actors: list,
      });
    } catch (error) {
      return res.status(403);
    }
  };

  addActorsToVideo = async (req: Request, res: Response): Promise<Response> => {
    const { actorId, videoId } = req.query;

    try {
      let actor = await actorRepository
        .createQueryBuilder("actors")
        .where("actors.id_actor like :value", {
          value: `${actorId}`,
        })
        .getOne();

      await videoRepository
        .createQueryBuilder()
        .relation(Video, "actors")
        .of(`${videoId}`)
        .add(actor);

      return res.json({ message: "update successfulty" });
    } catch (error) {
      return res.status(304).json({ message: "not found add actor to video" });
    }
  };
}
