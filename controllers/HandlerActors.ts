import { Request, Response } from "express";
// entities
import { Video } from "../entities/Videos";
import { Actor } from "../entities/Actors";

/**
 * TODO: create of autor
 * TODO: update info of autor
 * TODO: delete autor
 * TODO: buscador if existe autor
 */

export class HandleAutor {
  /**
   * * create a actor
   */
  addActor = (req: Request, res: Response): Promise<Response> => {
    return res.json();
  };
}
