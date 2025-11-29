/*
  Warnings:

  - You are about to drop the column `category_id` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `user_action_logs` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `courses_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `courses_instructor_id_fkey`;

-- DropForeignKey
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_action_logs` DROP FOREIGN KEY `user_action_logs_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_action_logs` DROP FOREIGN KEY `user_action_logs_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_user_id_fkey`;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `category_id`,
    ADD COLUMN `category` ENUM('PROGRAMMING', 'DESIGN', 'MARKETING', 'BUSINESS', 'LANGUAGES', 'OTHER') NOT NULL;

-- AlterTable
ALTER TABLE `user_action_logs` DROP COLUMN `role_id`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT';

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `roles`;

-- DropTable
DROP TABLE `user_roles`;
