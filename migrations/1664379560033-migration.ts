import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1664379560033 implements MigrationInterface {
    name = 'migration1664379560033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id_category" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9cfdf8d215b7072d300b9bbcafe" PRIMARY KEY ("id_category"))`);
        await queryRunner.query(`CREATE TABLE "videos_categories" ("id_video" character varying NOT NULL, "id_category" character varying NOT NULL, CONSTRAINT "PK_5c10f7ee70608c0dcda609bb2b2" PRIMARY KEY ("id_video", "id_category"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aa791ebc9f5032f3bafc0d3d0d" ON "videos_categories" ("id_video") `);
        await queryRunner.query(`CREATE INDEX "IDX_360e8bd40aa7c948767384df23" ON "videos_categories" ("id_category") `);
        await queryRunner.query(`ALTER TABLE "videos_categories" ADD CONSTRAINT "FK_aa791ebc9f5032f3bafc0d3d0de" FOREIGN KEY ("id_video") REFERENCES "video"("id_video") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "videos_categories" ADD CONSTRAINT "FK_360e8bd40aa7c948767384df234" FOREIGN KEY ("id_category") REFERENCES "category"("id_category") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos_categories" DROP CONSTRAINT "FK_360e8bd40aa7c948767384df234"`);
        await queryRunner.query(`ALTER TABLE "videos_categories" DROP CONSTRAINT "FK_aa791ebc9f5032f3bafc0d3d0de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_360e8bd40aa7c948767384df23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aa791ebc9f5032f3bafc0d3d0d"`);
        await queryRunner.query(`DROP TABLE "videos_categories"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
