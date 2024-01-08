/*
  Warnings:

  - You are about to drop the column `lastMessageInChatId` on the `messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_lastMessageInChatId_fkey";

-- DropIndex
DROP INDEX "messages_lastMessageInChatId_key";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "lastMessageInChatId";
