import { ImageResolution, AgingFilter } from "../../types";
import { ImageGenerator, ProviderConfig } from "../types";

export class OpenAIGenerator implements ImageGenerator {
    async generate(
        imageBase64: string,
        cardName: string,
        cardDescription: string,
        resolution: ImageResolution,
        agingFilter: AgingFilter,
        config: ProviderConfig
    ): Promise<string> {
        const apiKey = config.apiKey;
        if (!apiKey) throw new Error("API Key is required");

        const baseUrl = config.baseUrl || "https://api.openai.com/v1";
        const chatModel = config.modelName || "gpt-4o";
        const imageModel = config.imageModelName || "dall-e-3";

        // Step 1: Describe the image
        const description = await this.describeImage(imageBase64, apiKey, baseUrl, chatModel);

        // Step 2: Generate the card
        return await this.generateImage(description, cardName, cardDescription, agingFilter, apiKey, baseUrl, imageModel);
    }

    private async describeImage(base64: string, apiKey: string, baseUrl: string, model: string): Promise<string> {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                // OpenRouter specific headers
                "HTTP-Referer": window.location.origin,
                "X-Title": "Mercante in Fiera Persona",
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Describe the person's face in this image in extreme detail. Focus on facial features, expression, age, hair, and distinctive marks. Do not describe the background or clothing." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 300,
            }),
        });

        const data = await response.json();
        if (data.error) throw new Error(`API Error (Vision): ${data.error.message}`);
        return data.choices[0].message.content;
    }

    private async generateImage(
        faceDescription: string,
        cardName: string,
        cardDescription: string,
        agingFilter: AgingFilter,
        apiKey: string,
        baseUrl: string,
        model: string
    ): Promise<string> {
        let filterInstruction = "";
        switch (agingFilter) {
            case AgingFilter.SEPIA: filterInstruction = "sepia tone, vintage"; break;
            case AgingFilter.FADED: filterInstruction = "faded colors, worn out"; break;
            case AgingFilter.BW: filterInstruction = "black and white lithograph"; break;
            case AgingFilter.WARM: filterInstruction = "warm golden hues"; break;
            default: filterInstruction = "vintage 19th century colors";
        }

        const prompt = `
      A vintage playing card of 'Mercante in Fiera'.
      Subject: ${cardName} (${cardDescription}).
      Character appearance: ${faceDescription}.
      Style: Antique 19th-century lithograph, thick hand-drawn outlines, parchment background. ${filterInstruction}.
      The image should look like a scanned antique card.
    `;

        const response = await fetch(`${baseUrl}/images/generations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.origin,
                "X-Title": "Mercante in Fiera Persona",
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                response_format: "b64_json",
            }),
        });

        const data = await response.json();
        if (data.error) throw new Error(`API Error (Image): ${data.error.message}`);
        return `data:image/png;base64,${data.data[0].b64_json}`;
    }
}
