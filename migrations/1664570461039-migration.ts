import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1664570461039 implements MigrationInterface {
    name = 'migration1664570461039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actor" DROP CONSTRAINT "UQ_e3a29a07285afc61043ad080189"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "actor" ADD CONSTRAINT "UQ_e3a29a07285afc61043ad080189" UNIQUE ("ranking")`);
    }

}
