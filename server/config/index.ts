import dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  geminiApiKey: string | undefined;
  geminiModel: string;
  isGeminiConfigured: boolean;
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
};
