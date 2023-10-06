/*
  Warnings:

  - A unique constraint covering the columns `[instructorClerkId]` on the table `Instructor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instructorClerkId` to the `Instructor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructorClerkId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructorClerkId` to the `StudentInstructor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructorClerkId` to the `VehicleMaintenance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Instructor_id_idx` ON `Instructor`;

-- DropIndex
DROP INDEX `Lesson_instructorId_idx` ON `Lesson`;

-- DropIndex
DROP INDEX `StudentInstructor_instructorId_idx` ON `StudentInstructor`;

-- DropIndex
DROP INDEX `VehicleMaintenance_instructorId_idx` ON `VehicleMaintenance`;

-- AlterTable
ALTER TABLE `Instructor` ADD COLUMN `instructorClerkId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `instructorClerkId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `StudentInstructor` ADD COLUMN `instructorClerkId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `VehicleMaintenance` ADD COLUMN `instructorClerkId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Instructor_instructorClerkId_key` ON `Instructor`(`instructorClerkId`);

-- CreateIndex
CREATE INDEX `Instructor_instructorClerkId_idx` ON `Instructor`(`instructorClerkId`);

-- CreateIndex
CREATE INDEX `Lesson_instructorClerkId_idx` ON `Lesson`(`instructorClerkId`);

-- CreateIndex
CREATE INDEX `StudentInstructor_instructorClerkId_idx` ON `StudentInstructor`(`instructorClerkId`);

-- CreateIndex
CREATE INDEX `VehicleMaintenance_instructorClerkId_idx` ON `VehicleMaintenance`(`instructorClerkId`);
