import { GoogleGenAI } from "@google/genai";
import { SearchResult, WebSource, VideoMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractVideoID = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const findViralContent = async (query: string): Promise<SearchResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // We specifically use the Search Tool to find *current* viral content.
    // We ask for a structured markdown response to make it easier to read.
    const prompt = `
      You are a YouTube Growth Expert specializing in variety shows like America's Got Talent (AGT) and Britain's Got Talent (BGT).
      
      User Query: "${query}"
      
      Your Goal:
      1. Search for the most viral, trending, or highly discussed clips/acts related to the query. Focus on finding actual VIDEO content.
      2. Identify specifically *why* they are viral (e.g., emotional story, incredible skill, funny fail).
      3. Provide specific editing advice for a YouTube Short (e.g., "Start with the judge's shocked face", "Caption the punchline", "Use the 'Golden Buzzer' sound effect").
      
      Format your response in clean Markdown. Use headers (###) for each viral opportunity found.
      Do NOT return JSON.
      Ensure you utilize the Google Search tool to get the latest information and video links.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is NOT set because we are using googleSearch
      },
    });

    const text = response.text || "No analysis generated.";
    
    // Extract grounding chunks (sources)
    const sources: WebSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title
        });
      }
    });

    // Remove duplicates from sources based on URI
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    // Extract Video IDs and match with titles from sources
    const videos: VideoMetadata[] = [];
    const seenIds = new Set<string>();

    uniqueSources.forEach(source => {
      const id = extractVideoID(source.uri);
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        videos.push({
          id,
          title: source.title || "Viral Video Clip"
        });
      }
    });

    return {
      text,
      sources: uniqueSources,
      videos
    };

  } catch (error) {
    console.error("Error fetching viral content:", error);
    throw error;
  }
};