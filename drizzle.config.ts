// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_eT0UZJ3rNXWA@ep-patient-haze-ab7s4gtd.eu-west-2.aws.neon.tech/neondb?sslmode=require",
  },
} satisfies Config;