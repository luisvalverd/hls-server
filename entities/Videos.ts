import { Column, Entity, PrimaryColumn } from "typeorm";

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
}
