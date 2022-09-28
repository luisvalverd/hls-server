import { Column, Entity, PrimaryColumn, ManyToMany } from "typeorm";
import { Video } from "./Videos";

@Entity()
export class Category {
  @PrimaryColumn({ unique: true, nullable: false })
  id_category: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Video, (video) => video.categories)
  videos: Video[];
}
