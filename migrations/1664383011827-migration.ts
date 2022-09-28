import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1664383011827 implements MigrationInterface {
    name = 'migration1664383011827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "actor" ADD "gender" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "actor" ADD "avatar" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" ADD "minutes" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" ADD "seconds" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "seconds"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "minutes"`);
        await queryRunner.query(`ALTER TABLE "actor" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "actor" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "duration" integer NOT NULL`);
    }

}
