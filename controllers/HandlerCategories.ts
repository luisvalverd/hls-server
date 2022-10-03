import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { v4 as uuid } from "uuid";
// entities
import { Category } from "../entities/Categories";
import { Video } from "../entities/Videos";

let categoryRepository = AppDataSource.getRepository(Category);
let videoRepository = AppDataSource.getRepository(Video);

export class HandlerCategories {
  protected isExistName = async (name: string): Promise<boolean> => {
    let category = await categoryRepository
      .createQueryBuilder("categories")
      .where("categories.name like :value", {
        value: name,
      })
      .getOne();

    if (!category) {
      return false;
    }

    return true;
  };

  private getNumberVideosOfCategory = async (id: string): Promise<number> => {
    return 0;
  };

  createCategory = async (req: Request, res: Response): Promise<Response> => {
    const { name } = req.body;

    if (name === undefined || name === "" || name === null) {
      return res.status(318).json({
        message: "Error in name of category verify is not null o void",
      });
    }

    // instance data of new Category
    let newCategory = new Category();

    newCategory.id_category = uuid();
    newCategory.name = <string>name;
    newCategory.total_videos = 0;

    try {
      await categoryRepository.save(newCategory);
      return res.json({ message: "Category create successfuly" });
    } catch (error) {
      return res.status(318).json({ message: "Error in save category" });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { name } = req.body;

    // vefiry if name no is used for other category
    let isNameValid = await this.isExistName(<string>name);

    if (!isNameValid) {
      return res
        .status(400)
        .json({ message: "Error in name is used for other category" });
    }
    try {
      await categoryRepository
        .createQueryBuilder()
        .update({
          name,
        })
        .where("id_category = :value", {
          value: <string>id,
        })
        .execute();
      return res.json({ message: "Update category successfuly" });
    } catch (error) {
      return res.status(400).json({ message: "Error in update category" });
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await categoryRepository
        .createQueryBuilder()
        .delete()
        .from(Category)
        .where("id_category = :value", {
          value: <string>id,
        })
        .execute();

      return res.json({ message: "Delete category successfully" });
    } catch (error) {
      return res.status(400).json({ message: "Error in delete category" });
    }
  };

  addVideoToCategory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { categoryId, videoId } = req.query;

    try {
      let category = await categoryRepository
        .createQueryBuilder("categories")
        .where("categories.id_category = :value", {
          value: <string>categoryId,
        })
        .getOne();

      await videoRepository
        .createQueryBuilder()
        .relation(Video, "categories")
        .of(`${videoId}`)
        .add(category);

      return res.json({ message: "Add category in video successfully" });
    } catch (Error) {
      return res
        .status(400)
        .json({ message: "Error in add cateogie to video" });
    }
  };

  getVideosByCategory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { name } = req.params;
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
        .leftJoinAndSelect("videos.categories", "category")
        .where("category.name like :value", {
          value: <string>name,
        })
        .take(take)
        .skip(skip)
        .getManyAndCount();

      return res.json({
        totalPages: count / take,
        actualPage: page,
        list,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error to get video by category" });
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
      let categories = await categoryRepository.createQueryBuilder().getMany();
      return res.json(categories);
    } catch (error) {
      return res.status(400).json({ message: "Donnot get all categories" });
    }
  };
}
