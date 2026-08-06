import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1785975703828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE app.users (
      id uuid PRIMARY KEY DEFAULT uuidv4(),
      email varchar(254) NOT NULL,
      password_hash text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT ck_users_email_canonical CHECK (
        email = btrim(email)
        AND email = lower(email)
        AND octet_length(email) = char_length(email)
        AND email ~ '^[!-~]+@[!-~]+$'
        AND length(email) - length(replace(email, '@', '')) = 1
      ),
      CONSTRAINT uq_users_email UNIQUE (email)
    )
  `);

    await queryRunner.query(`
    GRANT SELECT, INSERT ON TABLE app.users TO trip_runtime
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE app.users");
  }
}
