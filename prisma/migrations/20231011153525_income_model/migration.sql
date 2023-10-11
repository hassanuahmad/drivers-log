-- CreateTable
CREATE TABLE `Income` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `income` INTEGER NOT NULL,
    `incomeMethod` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `instructorClerkId` VARCHAR(191) NULL,

    INDEX `Income_instructorClerkId_idx`(`instructorClerkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
