import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
// entities
import { Actor } from "../entities/Actors";
import { Video } from "../entities/Videos";

import { v4 as uuid } from "uuid";

/**
 * TODO: Update Actor
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
    const { nickname, gender } = req.body;

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
    newActor.nickname = <string>nickname;
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

  deleteActor = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await actorRepository
        .createQueryBuilder()
        .delete()
        .from(Actor)
        .where("id_actor = :value", { value: `${id}` })
        .execute();
      return res.json({ message: "delete successfulty" });
    } catch (error) {
      return res.status(418).json({ message: "can not delete actor" });
    }
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
        .leftJoinAndSelect("videos.categories", "category")
        .where("actor.id_actor like :value", {
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
    let { page, notPagination } = req.query;
    let take = 12;

    let expreg = /[^A-Za-z\W\w]+$/g;

    if (page === undefined || expreg.test(<any>page)) {
      page = <any>1;
    }

    // get all dont pagination
    if (notPagination !== undefined && notPagination === "true") {
      try {
        let actors = await actorRepository.createQueryBuilder().getMany();
        return res.json(actors);
      } catch (err) {
        return res.status(400).json({ message: "Error in get all actors" });
      }
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
    const { videoId } = req.query;
    const { actorsIds } = req.body;

    if (actorsIds.length === 0) {
      return res.status(400).json({ message: "Error not have actors" });
    }

    try {
      for (let actorId of actorsIds) {
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
      }

      return res.json({ message: "update successfulty" });
    } catch (error) {
      return res.status(304).json({ message: "not found add actor to video" });
    }
  };

  findActor = async (req: Request, res: Response): Promise<Response> => {
    const { nickname } = req.body;
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
        .where("LOWER(actors.nickname) like :value", {
          value: `%${nickname.toLowerCase()}%`,
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
      return res.status(204).json({ message: "dont find any actor" });
    }
  };

  getActorById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      let actor = await actorRepository
        .createQueryBuilder("actor")
        .where("actor.id_actor like :value", {
          value: <string>id,
        })
        .getOne();

      return res.json(actor);
    } catch (error) {
      return res.status(400).json({ message: "Error in find actor" });
    }
  };
}
