ALTER TYPE "TradingSession" RENAME TO "TradingSession_old";
CREATE TYPE "TradingSession" AS ENUM ('Q1','Q2','Q3','Q4');
ALTER TABLE "Trade" ALTER COLUMN "session" TYPE "TradingSession" USING (CASE "session"::text WHEN 'ASIA' THEN 'Q1' WHEN 'LONDON' THEN 'Q2' WHEN 'NEW_YORK' THEN 'Q3' ELSE 'Q4' END)::"TradingSession";
ALTER TABLE "CaseStudy" ALTER COLUMN "session" TYPE "TradingSession" USING (CASE "session"::text WHEN 'ASIA' THEN 'Q1' WHEN 'LONDON' THEN 'Q2' WHEN 'NEW_YORK' THEN 'Q3' ELSE 'Q4' END)::"TradingSession";
ALTER TABLE "TradingPlan" DROP COLUMN "sessionFocus";
ALTER TABLE "TradingPlan" ADD COLUMN "sessionFocus" "TradingSession"[] DEFAULT '{}';
DROP TYPE "TradingSession_old";
ALTER TABLE "Trade" ADD COLUMN "plannedTarget" DECIMAL(14,4);
