/*
  Warnings:

  - You are about to drop the column `action_taken` on the `article_reports` table. All the data in the column will be lost.
  - The values [reviewed] on the enum `article_reports_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `moderation_status` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(6))` to `Enum(EnumId(1))`.
  - You are about to drop the column `message` on the `notifications` table. All the data in the column will be lost.
  - The values [report_result] on the enum `notifications_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `category` to the `article_reports` table without a default value. This is not possible if the table is not empty.

*/
UPDATE `articles` SET `moderation_status` = 'public' WHERE `moderation_status` = 'approved';

-- Chuyển 'rejected' (cũ) thành 'hidden_by_admin' (mới)
UPDATE `articles` SET `moderation_status` = 'hidden_by_admin' WHERE `moderation_status` = 'rejected';

-- Chuyển 'pending' (cũ) thành 'public' (mới)
UPDATE `articles` SET `moderation_status` = 'public' WHERE `moderation_status` = 'pending';
-- AlterTable
ALTER TABLE `article_reports` DROP COLUMN `action_taken`,
    ADD COLUMN `category` ENUM('spam', 'hate_speech', 'adult_content', 'violence', 'fake_news', 'other') NOT NULL,
    MODIFY `status` ENUM('pending', 'dismissed', 'confirmed') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `articles` MODIFY `moderation_status` ENUM('public', 'private', 'hidden_by_admin', 'deleted') NOT NULL DEFAULT 'public';

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `message`,
    ADD COLUMN `metadata` JSON NULL,
    MODIFY `type` ENUM('like', 'comment', 'follow', 'new_article_from_followed', 'article_hidden_by_admin', 'appeal_approved', 'appeal_rejected') NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `article_appeals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_id` INTEGER NOT NULL,
    `author_id` INTEGER NOT NULL,
    `appeal_note` TEXT NOT NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `admin_id` INTEGER NULL,
    `admin_review_note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewed_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article_appeals` ADD CONSTRAINT `article_appeals_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_appeals` ADD CONSTRAINT `article_appeals_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_appeals` ADD CONSTRAINT `article_appeals_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
