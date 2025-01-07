import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1736261579771 implements MigrationInterface {
    name = 'InitialSchema1736261579771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "body" varchar NOT NULL, "taglist" text NOT NULL, "createdAt" varchar NOT NULL, "updatedAt" varchar NOT NULL, "favorited" boolean NOT NULL, "favoritesCount" integer NOT NULL, "authorId" integer)`);
        await queryRunner.query(`CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "mileage" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (1), "token" varchar, "bio" varchar, "image" varchar, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_article" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "body" varchar NOT NULL, "taglist" text NOT NULL, "createdAt" varchar NOT NULL, "updatedAt" varchar NOT NULL, "favorited" boolean NOT NULL, "favoritesCount" integer NOT NULL, "authorId" integer, CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_article"("id", "slug", "title", "description", "body", "taglist", "createdAt", "updatedAt", "favorited", "favoritesCount", "authorId") SELECT "id", "slug", "title", "description", "body", "taglist", "createdAt", "updatedAt", "favorited", "favoritesCount", "authorId" FROM "article"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`ALTER TABLE "temporary_article" RENAME TO "article"`);
        await queryRunner.query(`CREATE TABLE "temporary_report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "mileage" integer NOT NULL, "userId" integer, CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_report"("id", "approved", "price", "make", "model", "year", "lng", "lat", "mileage", "userId") SELECT "id", "approved", "price", "make", "model", "year", "lng", "lat", "mileage", "userId" FROM "report"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`ALTER TABLE "temporary_report" RENAME TO "report"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" RENAME TO "temporary_report"`);
        await queryRunner.query(`CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "mileage" integer NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "report"("id", "approved", "price", "make", "model", "year", "lng", "lat", "mileage", "userId") SELECT "id", "approved", "price", "make", "model", "year", "lng", "lat", "mileage", "userId" FROM "temporary_report"`);
        await queryRunner.query(`DROP TABLE "temporary_report"`);
        await queryRunner.query(`ALTER TABLE "article" RENAME TO "temporary_article"`);
        await queryRunner.query(`CREATE TABLE "article" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "body" varchar NOT NULL, "taglist" text NOT NULL, "createdAt" varchar NOT NULL, "updatedAt" varchar NOT NULL, "favorited" boolean NOT NULL, "favoritesCount" integer NOT NULL, "authorId" integer)`);
        await queryRunner.query(`INSERT INTO "article"("id", "slug", "title", "description", "body", "taglist", "createdAt", "updatedAt", "favorited", "favoritesCount", "authorId") SELECT "id", "slug", "title", "description", "body", "taglist", "createdAt", "updatedAt", "favorited", "favoritesCount", "authorId" FROM "temporary_article"`);
        await queryRunner.query(`DROP TABLE "temporary_article"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "article"`);
    }

}
