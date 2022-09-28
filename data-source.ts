import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// entities
import { Video } from "./entities/Videos";
import { Actor } from "./entities/Actors";
import { Category } from "./entities/Categories";

dotenv.config();
import path from "path";

const { DATABASE_HOST, DATABASE_PORT, DATABASE_PASS, DATABASE_USER } =
  process.env;

const migration = path.join(__dirname, "/migrations/*{.ts, .js}");
const entity = path.join(__dirname, "/entities/*{.ts, .js}");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: <string>DATABASE_HOST,
  port: <any>DATABASE_PORT,
  entities: [entity],
  username: <string>DATABASE_USER,
  password: <string>DATABASE_PASS,
  synchronize: false,
  database: "vodtube",
  migrations: [migration],
  migrationsTableName: "migrations",
});
