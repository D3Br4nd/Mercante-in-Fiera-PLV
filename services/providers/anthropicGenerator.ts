import { ImageResolution, AgingFilter } from "../../types";
import { ImageGenerator, ProviderConfig } from "../types";

export class AnthropicGenerator implements ImageGenerator {
    async generate(
        imageBase64: string,
        cardName: string,
        cardDescription: string,
        resolution: ImageResolution,
        agingFilter: AgingFilter,
        config: ProviderConfig
    ): Promise<string> {
        const apiKey = config.apiKey;
        if (!apiKey) throw new Error("Anthropic API Key is required");

        // Step 1: Describe the image
        const description = await this.describeImage(imageBase64, apiKey, config.modelName || "claude-3-5-sonnet-20240620");

        // Step 2: Generate (Error)
        throw new Error(`Claude (Model: ${config.modelName}) successfully described the image: "${description.substring(0, 50)}...". However, Claude does not support image generation natively. Please use Gemini or OpenAI for the final step.`);
    }

    private async describeImage(base64: string, apiKey: string, model: string): Promise<string> {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
                "dangerously-allow-browser": "true" // Required for client-side usage
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image",
                                source: {
                                    type: "base64",
                                    media_type: "image/jpeg",
                                    data: base64,
                                },
                            },
                            {
                                type: "text",
                                text: "Describe the person's face in this image in extreme detail. Focus on facial features, expression, age, hair."
                            }
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Anthropic Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }
}
