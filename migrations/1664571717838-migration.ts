import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1664571717838 implements MigrationInterface {
    name = 'migration1664571717838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos_actors" DROP CONSTRAINT "FK_2f622fc3e93542e6bef151ef054"`);
        await queryRunner.query(`ALTER TABLE "videos_actors" ADD CONSTRAINT "FK_2f622fc3e93542e6bef151ef054" FOREIGN KEY ("id_actor") REFERENCES "actor"("id_actor") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos_actors" DROP CONSTRAINT "FK_2f622fc3e93542e6bef151ef054"`);
        await queryRunner.query(`ALTER TABLE "videos_actors" ADD CONSTRAINT "FK_2f622fc3e93542e6bef151ef054" FOREIGN KEY ("id_actor") REFERENCES "actor"("id_actor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
