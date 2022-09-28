import { Column, Entity, PrimaryColumn, ManyToMany } from "typeorm";
import { Video } from "./Videos";

// * gender ["masculine", "femenine", "other"];

@Entity()
export class Actor {
  @PrimaryColumn({ unique: true, nullable: false })
  id_actor: string;

  @Column({ unique: false })
  name: string;

  @Column({ unique: false })
  lastname: string;

  @Column({ type: "int", unique: true })
  ranking: number;

  @Column({ unique: false })
  gender: string;

  @Column({ unique: false })
  avatar: string;

  @ManyToMany(() => Video, (video) => video.actors)
  videos: Video[];
}
