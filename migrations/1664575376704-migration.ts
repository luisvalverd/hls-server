import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1664575376704 implements MigrationInterface {
    name = 'migration1664575376704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actor" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "actor" DROP COLUMN "lastname"`);
        await queryRunner.query(`ALTER TABLE "actor" ADD "nickname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "actor" ADD CONSTRAINT "UQ_12831778923166d096d19d07f19" UNIQUE ("nickname")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actor" DROP CONSTRAINT "UQ_12831778923166d096d19d07f19"`);
        await queryRunner.query(`ALTER TABLE "actor" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "actor" ADD "lastname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "actor" ADD "name" character varying NOT NULL`);
    }

}
