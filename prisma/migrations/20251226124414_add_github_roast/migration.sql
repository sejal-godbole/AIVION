-- CreateTable
CREATE TABLE "GithubRoast" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubRoast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GithubRoast_userId_idx" ON "GithubRoast"("userId");

-- AddForeignKey
ALTER TABLE "GithubRoast" ADD CONSTRAINT "GithubRoast_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
