-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'VILLA', 'COMMERCIAL', 'LAND', 'MIXED');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('UNDER_50K', 'FROM_50K_TO_100K', 'FROM_100K_TO_250K', 'FROM_250K_TO_500K', 'ABOVE_500K');

-- CreateEnum
CREATE TYPE "InvestmentGoal" AS ENUM ('CAPITAL_GROWTH', 'RENTAL_INCOME', 'BOTH', 'RESIDENCY');

-- CreateEnum
CREATE TYPE "InvestmentDuration" AS ENUM ('SHORT', 'MEDIUM', 'LONG');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "videoUrl" TEXT,
    "googleMapsUrl" TEXT,
    "startingPrice" DOUBLE PRECISION NOT NULL,
    "minInvestment" DOUBLE PRECISION NOT NULL,
    "maxInvestment" DOUBLE PRECISION NOT NULL,
    "expectedReturn" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "residency" BOOLEAN NOT NULL DEFAULT false,
    "financing" BOOLEAN NOT NULL DEFAULT false,
    "developer" TEXT,
    "pros" TEXT[],
    "cons" TEXT[],
    "tags" TEXT[],
    "matchingRules" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "budget" "BudgetRange" NOT NULL,
    "goal" "InvestmentGoal" NOT NULL,
    "rentalIncome" BOOLEAN NOT NULL,
    "duration" "InvestmentDuration" NOT NULL,
    "countries" TEXT[],
    "riskLevel" "RiskLevel" NOT NULL,
    "needsFinancing" BOOLEAN NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "residency" BOOLEAN NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_assessmentId_key" ON "Booking"("assessmentId");

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
