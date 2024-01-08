-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_lastMessageInChatId_fkey";

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "lastMessageInChatId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_lastMessageInChatId_fkey" FOREIGN KEY ("lastMessageInChatId") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
