import { createClient } from "@supabase/supabase-js";
import { ICP, Prospect, PersonalizedMessage } from "../types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase credentials. Check your .env.local file."
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Analyze a website URL and generate an ICP
 */
export async function analyzeWebsite(
  url: string,
  language: string = "en"
): Promise<ICP> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "analyze-website",
      {
        body: { url, language },
      }
    );

    if (error) throw error;
    return data.analysis;
  } catch (error: any) {
    console.error("Error analyzing website:", error);
    throw new Error(error.message || "Failed to analyze website");
  }
}

/**
 * Get 15 daily prospects based on ICP
 */
export async function getProspectsForDay(
  icp: ICP,
  language: string = "en",
  limit: number = 15
): Promise<Prospect[]> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "get-prospects",
      {
        body: {
          icp,
          language,
          limit,
        },
      }
    );

    if (error) throw error;
    return data.prospects || [];
  } catch (error: any) {
    console.error("Error getting prospects:", error);
    throw new Error(error.message || "Failed to get prospects");
  }
}

/**
 * Generate a personalized message for a prospect
 */
export async function generatePersonalizedMessage(
  prospect: Prospect,
  icp: ICP,
  language: string = "en"
): Promise<PersonalizedMessage> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "generate-message",
      {
        body: {
          prospect,
          icp,
          language,
        },
      }
    );

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error generating message:", error);
    throw new Error(error.message || "Failed to generate message");
  }
}

/**
 * Analyze a prospect's pain points based on their activity
 */
export async function analyzeProspectPainPoints(
  prospect: Prospect,
  icp: ICP
): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "analyze-prospect",
      {
        body: { prospect, icp },
      }
    );

    if (error) throw error;
    return data.painPoints || [];
  } catch (error: any) {
    console.error("Error analyzing prospect pain points:", error);
    return [];
  }
}

export default supabase;
