-- CreateTable
CREATE TABLE `RoadTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `testTime` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `instructorClerkId` VARCHAR(191) NULL,
    `studentId` INTEGER NOT NULL,

    INDEX `RoadTest_instructorClerkId_idx`(`instructorClerkId`),
    INDEX `RoadTest_studentId_idx`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
