/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `followers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hash_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hash_tags_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `urls` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_follower_id_fkey";

-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "hash_tags_tags" DROP CONSTRAINT "hash_tags_tags_hash_tagsId_fkey";

-- DropForeignKey
ALTER TABLE "hash_tags_tags" DROP CONSTRAINT "hash_tags_tags_tagsId_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_url_id_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_user_id_fkey";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- DropTable
DROP TABLE "followers";

-- DropTable
DROP TABLE "hash_tags";

-- DropTable
DROP TABLE "hash_tags_tags";

-- DropTable
DROP TABLE "tags";

-- DropTable
DROP TABLE "urls";

-- DropEnum
DROP TYPE "follow_status";

-- DropEnum
DROP TYPE "perm_type";

-- DropEnum
DROP TYPE "tag_type";

-- CreateTable
CREATE TABLE "uploads" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "language" TEXT NOT NULL,
    "inputs" TEXT[],
    "enable" INTEGER NOT NULL,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "executed_date" TIMESTAMP(3) NOT NULL,
    "output" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "upload_id" INTEGER NOT NULL,
    "job" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
