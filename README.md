# Mercante in Fiera Persona

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A React application that transforms your photo into a traditional "Mercante in Fiera" playing card using Generative AI.

## Features

-   **AI Powered Transformation**: Uses advanced AI models to generate vintage-style playing cards.
-   **Multi-Provider Support**:
    -   **Google Gemini**: Native Image-to-Image transformation (Best for facial resemblance).
    -   **OpenAI**: DALL-E 3 generation based on detailed face description.
    -   **Ollama**: Experimental support for local models.
-   **Image Cropping**: Built-in tool to crop and center your face.
-   **Customization**: Choose card archetypes, resolution, and aging filters (Sepia, B&W, etc.).
-   **Docker Ready**: Fully containerized for easy deployment.

## Run Locally

**Prerequisites:** Node.js 18+

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the app**:
    ```bash
    npm run dev
    ```

3.  **Open**: [http://localhost:5173](http://localhost:5173)

## Docker Deployment

The application is containerized with Nginx for production serving.

1.  **Build and Start**:
    ```bash
    docker compose up --build -d
    ```

2.  **Access**: [http://localhost:8080](http://localhost:8080)

### Nginx Proxy Manager

To deploy behind Nginx Proxy Manager:

1.  Point your domain to the server IP.
2.  Create a Proxy Host in NPM:
    -   **Forward Hostname**: Your server IP (or `host.docker.internal`).
    -   **Forward Port**: `8080`.
    -   **Websockets**: Optional (not required for production build).

## AI Configuration

Click the **"Configura IA"** button in the top right to select your provider.

| Provider | Pros | Cons |
| :--- | :--- | :--- |
| **Gemini** | Best facial resemblance (Image-to-Image) | Requires Google API Key |
| **OpenAI** | High artistic quality (DALL-E 3) | Generates a *new* face based on description |
| **Ollama** | Free, Local, Private | Experimental, requires powerful hardware |

## License

MIT
