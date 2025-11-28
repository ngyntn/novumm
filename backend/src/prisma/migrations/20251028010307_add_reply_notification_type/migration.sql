-- AlterTable
ALTER TABLE `notifications` MODIFY `type` ENUM('like', 'comment', 'reply', 'follow', 'new_article_from_followed', 'article_hidden_by_admin', 'appeal_approved', 'appeal_rejected') NOT NULL;
