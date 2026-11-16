-- Execute apenas uma vez, após backup validado do Neon.
CREATE TABLE IF NOT EXISTS "PortalUser" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL CHECK ("role" IN ('admin', 'operator', 'producer', 'agency')),
  "agencyId" TEXT REFERENCES "Agency"("id") ON DELETE RESTRICT,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "portal_user_agency_scope" CHECK (("role" = 'agency' AND "agencyId" IS NOT NULL) OR ("role" <> 'agency' AND "agencyId" IS NULL))
);
CREATE INDEX IF NOT EXISTS "PortalUser_agencyId_idx" ON "PortalUser" ("agencyId");
CREATE INDEX IF NOT EXISTS "GroupReservation_agencyId_idx" ON "GroupReservation" ("agencyId");
