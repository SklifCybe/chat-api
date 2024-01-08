/*
  Warnings:

  - A unique constraint covering the columns `[lastMessageInChatId]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "lastMessageInChatId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "messages_lastMessageInChatId_key" ON "messages"("lastMessageInChatId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_lastMessageInChatId_fkey" FOREIGN KEY ("lastMessageInChatId") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
