-- CreateEnum
CREATE TYPE "follow_status" AS ENUM ('requested', 'accepted');

-- CreateEnum
CREATE TYPE "tag_type" AS ENUM ('video', 'sound', 'text', 'image');

-- CreateEnum
CREATE TYPE "perm_type" AS ENUM ('public', 'private', 'protected');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "status" "follow_status" NOT NULL DEFAULT 'requested',
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urls" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "type" "tag_type" NOT NULL,
    "scope" "perm_type" NOT NULL DEFAULT 'public',
    "meta" JSONB,
    "note" TEXT,
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "image_url" TEXT,
    "color" TEXT,
    "user_id" INTEGER NOT NULL,
    "url_id" INTEGER NOT NULL,
    "hash_tags_title" TEXT[],

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hash_tags_tags" (
    "id" SERIAL NOT NULL,
    "hash_tagsId" INTEGER NOT NULL,
    "tagsId" INTEGER NOT NULL,

    CONSTRAINT "hash_tags_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hash_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "hash_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "urls_address_key" ON "urls"("address");

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hash_tags_tags" ADD CONSTRAINT "hash_tags_tags_hash_tagsId_fkey" FOREIGN KEY ("hash_tagsId") REFERENCES "hash_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hash_tags_tags" ADD CONSTRAINT "hash_tags_tags_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
