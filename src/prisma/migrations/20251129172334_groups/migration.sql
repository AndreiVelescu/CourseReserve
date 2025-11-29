-- DropIndex
DROP INDEX `courses_instructor_id_fkey` ON `courses`;

-- DropIndex
DROP INDEX `reservations_course_id_fkey` ON `reservations`;

-- DropIndex
DROP INDEX `user_action_logs_user_id_fkey` ON `user_action_logs`;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `allow_groups` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `max_students` INTEGER NULL DEFAULT 30;

-- AlterTable
ALTER TABLE `user_action_logs` ADD COLUMN `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `course_id` INTEGER NOT NULL,
    `max_members` INTEGER NULL DEFAULT 10,
    `min_members` INTEGER NULL DEFAULT 2,
    `status` ENUM('ACTIVE', 'ARCHIVED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `group_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_leader` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `group_members_group_id_user_id_key`(`group_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
