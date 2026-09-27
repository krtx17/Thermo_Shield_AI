import dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  geminiApiKey: string | undefined;
  geminiModel: string;
  isGeminiConfigured: boolean;
  databaseUrl: string | undefined;
  pgHost: string;
  pgPort: number;
  pgUser: string;
  pgPassword: string | undefined;
  pgDatabase: string;
}

const geminiApiKey = process.env.GEMINI_API_KEY;
const isGeminiConfigured = Boolean(
  geminiApiKey &&
  geminiApiKey !== "MY_GEMINI_API_KEY" &&
  geminiApiKey.trim().length > 0
);

export const config: AppConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  geminiApiKey,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  isGeminiConfigured,
  databaseUrl: process.env.DATABASE_URL,
  pgHost: process.env.PGHOST || "localhost",
  pgPort: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  pgUser: process.env.PGUSER || "postgres",
  pgPassword: process.env.PGPASSWORD,
  pgDatabase: process.env.PGDATABASE || "thermo_shield",
};
