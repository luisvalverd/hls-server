import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const { DATABASE_HOST, DATABASE_PORT, DATABASE_PASS, DATABASE_USER } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DATABASE_HOST,
  port: <any>DATABASE_PORT,
  entities: ["entities/*.ts"],
  username: DATABASE_USER,
  password: DATABASE_PASS,
});
