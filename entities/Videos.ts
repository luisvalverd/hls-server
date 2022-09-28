import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";
import { Actor } from "./Actors";
import { Category } from "./Categories";

@Entity()
export class Video {
  @PrimaryColumn({ unique: true, nullable: false })
  id_video: string;

  @Column({ unique: false })
  title: string;

  @Column({ unique: false })
  description: string;

  @Column({ unique: true, nullable: false })
  path_video: string;

  @Column({ unique: true, nullable: false })
  path_stream: string;

  @Column({ unique: true })
  path_image: string;

  // duration
  @Column({ type: "int", unique: false })
  minutes: number;

  @Column({ type: "int", unique: false })
  seconds: number;

  // categorization
  @ManyToMany(() => Category, (category) => category.videos)
  @JoinTable({
    name: "videos_categories",
    joinColumn: {
      name: "id_video",
    },
    inverseJoinColumn: {
      name: "id_category",
    },
  })
  categories: Category[];

  // actors
  @ManyToMany(() => Actor, (actor) => actor.videos)
  @JoinTable({
    name: "videos_actors",
    joinColumn: {
      name: "id_video",
    },
    inverseJoinColumn: {
      name: "id_actor",
    },
  })
  actors: Actor[];
}
