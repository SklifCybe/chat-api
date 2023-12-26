/*
  Warnings:

  - You are about to drop the `User2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_contacts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User2" DROP CONSTRAINT "User2_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "_contacts" DROP CONSTRAINT "_contacts_A_fkey";

-- DropForeignKey
ALTER TABLE "_contacts" DROP CONSTRAINT "_contacts_B_fkey";

-- DropTable
DROP TABLE "User2";

-- DropTable
DROP TABLE "_contacts";

-- CreateTable
CREATE TABLE "_Contacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Contacts_AB_unique" ON "_Contacts"("A", "B");

-- CreateIndex
CREATE INDEX "_Contacts_B_index" ON "_Contacts"("B");

-- AddForeignKey
ALTER TABLE "_Contacts" ADD CONSTRAINT "_Contacts_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Contacts" ADD CONSTRAINT "_Contacts_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
