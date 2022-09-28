import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1664323579835 implements MigrationInterface {
    name = 'migration1664323579835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "actor" ("id_actor" character varying NOT NULL, "name" character varying NOT NULL, "lastname" character varying NOT NULL, CONSTRAINT "PK_7ad3aade234cc7ea3b02bf7ce68" PRIMARY KEY ("id_actor"))`);
        await queryRunner.query(`CREATE TABLE "videos_actors" ("id_video" character varying NOT NULL, "id_actor" character varying NOT NULL, CONSTRAINT "PK_044bbfbde964f81f724a9003d52" PRIMARY KEY ("id_video", "id_actor"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5c09c1ecc2a82dbcb8373c412a" ON "videos_actors" ("id_video") `);
        await queryRunner.query(`CREATE INDEX "IDX_2f622fc3e93542e6bef151ef05" ON "videos_actors" ("id_actor") `);
        await queryRunner.query(`ALTER TABLE "videos_actors" ADD CONSTRAINT "FK_5c09c1ecc2a82dbcb8373c412a7" FOREIGN KEY ("id_video") REFERENCES "video"("id_video") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "videos_actors" ADD CONSTRAINT "FK_2f622fc3e93542e6bef151ef054" FOREIGN KEY ("id_actor") REFERENCES "actor"("id_actor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos_actors" DROP CONSTRAINT "FK_2f622fc3e93542e6bef151ef054"`);
        await queryRunner.query(`ALTER TABLE "videos_actors" DROP CONSTRAINT "FK_5c09c1ecc2a82dbcb8373c412a7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f622fc3e93542e6bef151ef05"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c09c1ecc2a82dbcb8373c412a"`);
        await queryRunner.query(`DROP TABLE "videos_actors"`);
        await queryRunner.query(`DROP TABLE "actor"`);
    }

}
