-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'medium';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" DROP DEFAULT;
