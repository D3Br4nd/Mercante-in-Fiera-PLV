import { GoogleGenAI } from "@google/genai";
import { ImageResolution, AgingFilter } from "../../types";
import { ImageGenerator, ProviderConfig } from "../types";

export class GeminiGenerator implements ImageGenerator {
    async generate(
        imageBase64: string,
        cardName: string,
        cardDescription: string,
        resolution: ImageResolution,
        agingFilter: AgingFilter,
        config: ProviderConfig
    ): Promise<string> {
        // Use provided key or fall back to env/injected
        const apiKey = config.apiKey || process.env.API_KEY;

        // If we are in the browser extension context, we might rely on window.aistudio
        // But here we assume we have a key or the library handles it if configured correctly.
        // The original code used `process.env.API_KEY` or relied on the extension injecting it?
        // Actually the original code did: `const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });`
        // And also had helpers for `window.aistudio`.

        // For this refactor, we accept the key from config if present.
        const ai = new GoogleGenAI({ apiKey: apiKey });

        let filterInstruction = "";
        switch (agingFilter) {
            case AgingFilter.SEPIA:
                filterInstruction = "Apply a strong vintage sepia tone effect to the entire image.";
                break;
            case AgingFilter.FADED:
                filterInstruction = "Make the colors look faded, worn, and washed out by time. Low saturation.";
                break;
            case AgingFilter.BW:
                filterInstruction = "Render the image in black and white, resembling an old lithograph.";
                break;
            case AgingFilter.WARM:
                filterInstruction = "Apply a warm, golden sunlight hue to the image.";
                break;
            default:
                filterInstruction = "Use natural vintage colors common in 19th-century card decks.";
        }

        const prompt = `
      Create a vintage playing card in the style of the traditional Italian game 'Mercante in Fiera'.
      
      Subject: ${cardName} (${cardDescription}).
      
      The character (or main element) in the card MUST incorporate the face provided in the input image.
      If the subject is an animal or object, anthropomorphize it slightly or place the face on a central figure interacting with the subject.
      
      Style Guidelines:
      - Antique, 19th-century lithograph aesthetic.
      - Thick, hand-drawn outline style typical of Modiano or Trevisan cards.
      - Background should be simple, parchment-colored or a simple gradient.
      - The image should look like a scanned antique card.
      - ${filterInstruction}
    `;

        try {
            const response = await ai.models.generateContent({
                // Use the config modelName if provided, else default to 'gemini-2.0-flash-exp'
                model: config.modelName || 'gemini-2.0-flash-exp',
                contents: {
                    parts: [
                        {
                            inlineData: {
                                mimeType: 'image/jpeg',
                                data: imageBase64,
                            },
                        },
                        {
                            text: prompt,
                        },
                    ],
                },
                config: {
                    imageConfig: {
                        // @ts-ignore - types might not be fully updated for imageConfig in all versions
                        imageSize: resolution,
                        aspectRatio: "3:4",
                    },
                },
            });

            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData && part.inlineData.data) {
                        return `data:image/png;base64,${part.inlineData.data}`;
                    }
                }
            }

            throw new Error("No image data found in response");
        } catch (error: any) {
            console.error("Gemini API Error:", error);
            throw new Error(error.message || "Failed to generate image");
        }
    }
}
