/*
  Warnings:

  - A unique constraint covering the columns `[user_id,article_id,action]` on the table `user_article_interactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `articles` ADD COLUMN `is_indexed` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `user_article_interactions_user_id_article_id_action_key` ON `user_article_interactions`(`user_id`, `article_id`, `action`);
