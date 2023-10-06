-- AlterTable
ALTER TABLE `Instructor` MODIFY `instructorClerkId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Lesson` MODIFY `instructorClerkId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `StudentInstructor` MODIFY `instructorClerkId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `VehicleMaintenance` MODIFY `instructorClerkId` VARCHAR(191) NULL;
