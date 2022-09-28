import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1664378866567 implements MigrationInterface {
    name = 'migration1664378866567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actor" ADD "ranking" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "actor" ADD CONSTRAINT "UQ_e3a29a07285afc61043ad080189" UNIQUE ("ranking")`);
        await queryRunner.query(`ALTER TABLE "video" ADD "duration" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "actor" DROP CONSTRAINT "UQ_e3a29a07285afc61043ad080189"`);
        await queryRunner.query(`ALTER TABLE "actor" DROP COLUMN "ranking"`);
    }

}
