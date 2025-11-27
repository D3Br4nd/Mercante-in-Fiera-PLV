import { ImageResolution, AgingFilter } from "../../types";
import { ImageGenerator, ProviderConfig } from "../types";

export class OllamaGenerator implements ImageGenerator {
    async generate(
        imageBase64: string,
        cardName: string,
        cardDescription: string,
        resolution: ImageResolution,
        agingFilter: AgingFilter,
        config: ProviderConfig
    ): Promise<string> {
        const baseUrl = config.baseUrl || "http://localhost:11434";
        const model = config.modelName || "llava";

        // Step 1: Describe the image
        const description = await this.describeImage(imageBase64, baseUrl, model);

        // Step 2: Generate (Placeholder/Error)
        // Ollama is primarily text/vision-to-text. It doesn't generate images natively unless using a specific plugin or proxy.
        // For now, we will throw an error explaining this limitation or return a placeholder if we want to test the flow.
        // Let's return a placeholder text as an image or throw.
        // Better: Throw an error saying Image Generation not supported on Ollama yet.

        throw new Error(`Ollama (Model: ${model}) successfully described the image: "${description.substring(0, 50)}...". However, Ollama does not support image generation natively yet. Please use Gemini or OpenAI for the final step.`);
    }

    private async describeImage(base64: string, baseUrl: string, model: string): Promise<string> {
        const response = await fetch(`${baseUrl}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,
                prompt: "Describe the person's face in this image in extreme detail. Focus on facial features, expression, age, hair.",
                images: [base64],
                stream: false,
            }),
        });

        if (!response.ok) throw new Error(`Ollama Error: ${response.statusText}`);
        const data = await response.json();
        return data.response;
    }
}
