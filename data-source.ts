import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Video } from "./entities/Videos";
dotenv.config();

const { DATABASE_HOST, DATABASE_PORT, DATABASE_PASS, DATABASE_USER } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: <string>DATABASE_HOST,
  port: <any>DATABASE_PORT,
  entities: [Video],
  username: <string>DATABASE_USER,
  password: <string>DATABASE_PASS,
  synchronize: true,
  database: "vodtube",
});
