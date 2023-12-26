-- CreateTable
CREATE TABLE "User2" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "teacherId" INTEGER,

    CONSTRAINT "User2_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User2" ADD CONSTRAINT "User2_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User2"("id") ON DELETE SET NULL ON UPDATE CASCADE;
