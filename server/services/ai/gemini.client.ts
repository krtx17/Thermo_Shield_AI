import { GoogleGenAI } from "@google/genai";
import { config } from "../../config/index.js";

let clientInstance: GoogleGenAI | null = null;

export class GeminiClientFactory {
  public static isConfigured(): boolean {
    return config.isGeminiConfigured;
  }

  public static getClient(): GoogleGenAI {
    if (!GeminiClientFactory.isConfigured()) {
      throw new Error(
        "GEMINI_API_KEY environment variable is not configured with a valid key. Fallback heuristics should be engaged."
      );
    }

    if (!clientInstance) {
      clientInstance = new GoogleGenAI({
        apiKey: config.geminiApiKey!,
        httpOptions: {
          headers: {
            "User-Agent": "thermo-shield-ai",
          },
        },
      });
    }

    return clientInstance;
  }

  /**
   * For testing purposes: resets the cached client instance
   */
  public static resetInstance(): void {
    clientInstance = null;
  }
}
