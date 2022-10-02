import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1664679189748 implements MigrationInterface {
    name = 'migration1664679189748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos_categories" DROP CONSTRAINT "FK_360e8bd40aa7c948767384df234"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "total_videos" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "videos_categories" ADD CONSTRAINT "FK_360e8bd40aa7c948767384df234" FOREIGN KEY ("id_category") REFERENCES "category"("id_category") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos_categories" DROP CONSTRAINT "FK_360e8bd40aa7c948767384df234"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "total_videos"`);
        await queryRunner.query(`ALTER TABLE "videos_categories" ADD CONSTRAINT "FK_360e8bd40aa7c948767384df234" FOREIGN KEY ("id_category") REFERENCES "category"("id_category") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
