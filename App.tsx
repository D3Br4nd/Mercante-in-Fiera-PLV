
import React, { useState, useEffect } from 'react';
import { CardArchetype, ImageResolution, AgingFilter } from './types';
import { checkApiKey, promptSelectKey, generateMercanteCard } from './services/geminiService';
import { AIProvider, ProviderConfig } from './services/types';
import CardSelection from './components/CardSelection';
import ImageCropper from './components/ImageCropper';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean>(false);

  // Provider Config State
  const [provider, setProvider] = useState<AIProvider>(AIProvider.GEMINI);
  const [apiKey, setApiKey] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>(''); // Default depends on provider
  const [modelName, setModelName] = useState<string>('');
  const [imageModelName, setImageModelName] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Image State
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [croppedBase64, setCroppedBase64] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);

  const [selectedCard, setSelectedCard] = useState<CardArchetype | null>(null);
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution.RES_1K);
  const [agingFilter, setAgingFilter] = useState<AgingFilter>(AgingFilter.NONE);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initKey = async () => {
    try {
      const exists = await checkApiKey();
      if (exists) {
        setHasKey(true);
        setProvider(AIProvider.GEMINI);
      }
    } catch (e) {
      console.error("Failed to check API key status", e);
    }
  };

  useEffect(() => {
    initKey();
  }, []);

  // Update defaults when provider changes
  useEffect(() => {
    if (provider === AIProvider.OLLAMA) {
      setBaseUrl('http://localhost:11434');
      setModelName('llava');
      setImageModelName(''); // Ollama typically uses the same model for vision
    } else if (provider === AIProvider.OPENROUTER) {
      setBaseUrl('https://openrouter.ai/api/v1');
      setModelName('google/gemini-2.0-flash-exp:free'); // Good vision model
      setImageModelName('black-forest-labs/flux-1-schnell'); // Good image model
    } else if (provider === AIProvider.OPENAI) {
      setBaseUrl('https://api.openai.com/v1');
      setModelName('gpt-4o');
      setImageModelName('dall-e-3');
    } else if (provider === AIProvider.ANTHROPIC) {
      setBaseUrl(''); // Anthropic has a default base URL
      setModelName('claude-3-5-sonnet-20240620');
      setImageModelName(''); // Anthropic doesn't have a separate image model for generation
    } else if (provider === AIProvider.GEMINI) {
      setBaseUrl(''); // Gemini has a default base URL
      setModelName('gemini-2.0-flash-exp');
      setImageModelName(''); // Gemini uses the same model for vision
    }
  }, [provider]);

  const handleKeySelection = async () => {
    try {
      await promptSelectKey();
      setHasKey(true);
    } catch (e) {
      console.error("Failed to select key", e);
      // Fallback to manual entry if extension fails or user cancels
      enterWithProvider(AIProvider.GEMINI);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUploadedFileUrl(url);
      setShowCropper(true);
      setGeneratedImage(null);
    }
  };

  const handleCropConfirm = (base64: string) => {
    setCroppedBase64(base64);
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    if (!croppedBase64) {
      setUploadedFileUrl(null);
    }
  };

  const handleReCrop = () => {
    if (uploadedFileUrl) {
      setShowCropper(true);
    }
  };

  const handleGenerate = async () => {
    if (!croppedBase64 || !selectedCard) {
      setError("Assicurati di aver ritagliato la foto e selezionato una carta.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Scroll to result area if visible or prepare for it
    setTimeout(() => {
      document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const config: ProviderConfig = {
        provider,
        apiKey: apiKey || undefined, // Allow empty if using injected key (Gemini)
        baseUrl: baseUrl || undefined,
        modelName: modelName || undefined,
        imageModelName: imageModelName || undefined,
      };

      const resultImage = await generateMercanteCard(
        croppedBase64,
        selectedCard.nameIT,
        selectedCard.description,
        resolution,
        agingFilter,
        config
      );
      setGeneratedImage(resultImage);
    } catch (err: any) {
      setError(err.message || "Si è verificato un errore durante la generazione.");
    } finally {
      setIsLoading(false);
    }
  };

  // If using Gemini via extension, we might show the landing page.
  // But now we allow other providers, so we should always show the main UI
  // and let the user configure the provider in settings.
  // However, to keep the "Entrance" feel, we can keep the landing page
  // but add a "Configure other providers" option or just bypass it if they want to use OpenAI/Ollama.

  // For simplicity, let's treat "hasKey" as "isReadyToEnter".
  // If they select another provider, we set hasKey = true.

  const enterWithProvider = (p: AIProvider) => {
    setProvider(p);
    setHasKey(true);
    setShowConfig(true); // Open config immediately
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0e6d2] text-[#2c1810] pattern-bg">
        <div className="max-w-md w-full bg-[#fffcf5] p-10 rounded-xl shadow-2xl border-4 border-double border-[#8b1c1c]/40 text-center">
          <h1 className="text-3xl vintage-font font-bold mb-4 text-[#8b1c1c]">Mercante in Fiera<br />Pro Loco Venticanese</h1>
          <div className="w-16 h-1 bg-[#b8860b] mx-auto mb-6"></div>
          <p className="mb-8 text-lg opacity-80 italic">
            "Entra nel mondo del Mercante in Fiera." <br />
            Scegli il tuo Artista Artificiale.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleKeySelection}
              className="w-full py-3 bg-[#8b1c1c] hover:bg-[#6b1616] text-[#fffcf5] vintage-font tracking-widest text-lg font-bold rounded shadow-lg border border-[#4a0e0e] transition-all"
            >
              ENTRA CON GOOGLE GEMINI
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => enterWithProvider(AIProvider.OPENAI)} className="py-2 bg-[#2c1810] hover:bg-[#1a0e09] text-[#e4d5b7] vintage-font font-bold rounded shadow border border-[#b8860b]">OPENAI</button>
              <button onClick={() => enterWithProvider(AIProvider.ANTHROPIC)} className="py-2 bg-[#2c1810] hover:bg-[#1a0e09] text-[#e4d5b7] vintage-font font-bold rounded shadow border border-[#b8860b]">CLAUDE</button>
              <button onClick={() => enterWithProvider(AIProvider.OPENROUTER)} className="py-2 bg-[#2c1810] hover:bg-[#1a0e09] text-[#e4d5b7] vintage-font font-bold rounded shadow border border-[#b8860b]">OPENROUTER</button>
              <button onClick={() => enterWithProvider(AIProvider.OLLAMA)} className="py-2 bg-[#2c1810] hover:bg-[#1a0e09] text-[#e4d5b7] vintage-font font-bold rounded shadow border border-[#b8860b]">OLLAMA</button>
            </div>
          </div>

          <p className="mt-6 text-sm text-[#8b5a2b] font-serif italic">
            Gemini richiede una chiave API Google Cloud o l'estensione AI Studio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-serif pb-20">

      {/* Cropper Modal */}
      {showCropper && uploadedFileUrl && (
        <ImageCropper
          src={uploadedFileUrl}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      {/* Header */}
      <header className="bg-[#2c1810] text-[#f0e6d2] p-6 shadow-xl sticky top-0 z-50 border-b-4 border-[#b8860b]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-2xl md:text-3xl vintage-font font-bold tracking-wider text-[#e4d5b7] drop-shadow-md">
              Mercante in Fiera <span className="block md:inline text-[#b8860b]">Pro Loco Venticanese</span>
            </h1>
            <div className="h-0.5 w-full bg-[#b8860b]/50 mt-1"></div>
            <p className="text-sm text-[#f0e6d2] italic mt-1 opacity-80">
              Trasforma la tua foto in una carta tradizionale del Mercante in Fiera
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="bg-[#b8860b] text-[#2c1810] px-4 py-2 rounded font-bold vintage-font shadow-md border border-[#f0e6d2]/20 hover:bg-[#9a7009]"
            >
              {showConfig ? 'Chiudi Config' : 'Configura IA'}
            </button>
          </div>
        </div>
      </header>

      {/* Config Panel */}
      {showConfig && (
        <div className="max-w-6xl mx-auto p-4 animate-fade-in">
          <div className="bg-[#fffcf5] p-6 rounded-lg shadow-xl border border-[#8b1c1c]/20">
            <h3 className="text-xl vintage-font font-bold mb-4 text-[#8b1c1c]">Configurazione Artista ({provider})</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-1">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as AIProvider)}
                  className="w-full p-2 border border-[#d4c5a9] rounded bg-[#f0e6d2] text-[#2c1810]"
                >
                  <option value={AIProvider.GEMINI}>Google Gemini</option>
                  <option value={AIProvider.OPENAI}>OpenAI</option>
                  <option value={AIProvider.ANTHROPIC}>Anthropic (Claude)</option>
                  <option value={AIProvider.OPENROUTER}>OpenRouter</option>
                  <option value={AIProvider.OLLAMA}>Ollama (Locale)</option>
                </select>
              </div>

              {/* API Key for all except Ollama (usually) */}
              {provider !== AIProvider.OLLAMA && (
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-1">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={provider === AIProvider.GEMINI ? "Opzionale se usi estensione" : "sk-..."}
                    className="w-full p-2 border border-[#d4c5a9] rounded bg-white text-[#2c1810]"
                  />
                </div>
              )}

              {/* Base URL for Ollama, OpenRouter, or Custom OpenAI */}
              {(provider === AIProvider.OLLAMA || provider === AIProvider.OPENROUTER || provider === AIProvider.OPENAI) && (
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-1">Base URL</label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 border border-[#d4c5a9] rounded bg-white text-[#2c1810]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[#2c1810] mb-1">Modello Descrizione (Vision)</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="es. gpt-4o, gemini-1.5-flash"
                  className="w-full p-2 border border-[#d4c5a9] rounded bg-white text-[#2c1810]"
                />
                <p className="text-xs text-[#8b5a2b] mt-1">Modello che "guarda" la tua foto.</p>
              </div>

              {/* Image Model for OpenAI/OpenRouter */}
              {(provider === AIProvider.OPENAI || provider === AIProvider.OPENROUTER) && (
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-1">Modello Generazione (Image)</label>
                  <input
                    type="text"
                    value={imageModelName}
                    onChange={(e) => setImageModelName(e.target.value)}
                    placeholder="es. dall-e-3, flux-1-schnell"
                    className="w-full p-2 border border-[#d4c5a9] rounded bg-white text-[#2c1810]"
                  />
                  <p className="text-xs text-[#8b5a2b] mt-1">Modello che crea la carta.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">

        <div className="grid md:grid-cols-12 gap-8 items-start">

          {/* Left Column: Settings & Upload (Width 4/12) */}
          <div className="md:col-span-4 space-y-8 sticky top-32">

            {/* Step 1: Upload */}
            <section className="bg-[#fffcf5] p-6 rounded-lg shadow-xl border border-[#8b1c1c]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b1c1c] to-transparent opacity-50"></div>
              <h2 className="text-2xl vintage-font font-bold mb-6 text-[#8b1c1c] flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#8b1c1c] text-[#8b1c1c] text-sm">I</span>
                Il Volto
              </h2>

              <div className="flex flex-col items-center justify-center w-full">
                {croppedBase64 ? (
                  <div className="relative group w-full">
                    <div className="p-2 bg-white border border-gray-200 shadow-inner rounded-sm rotate-1">
                      <img
                        src={`data:image/jpeg;base64,${croppedBase64}`}
                        alt="Cropped Preview"
                        className="w-full h-64 object-cover sepia-[.3] contrast-125"
                      />
                    </div>
                    <div className="absolute inset-0 bg-[#2c1810]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                      <button onClick={handleReCrop} className="bg-[#f0e6d2] text-[#2c1810] px-4 py-2 vintage-font text-sm font-bold shadow hover:bg-white border border-[#2c1810]">Modifica</button>
                      <label className="bg-[#b8860b] text-white px-4 py-2 vintage-font text-sm font-bold shadow cursor-pointer hover:bg-[#9a7009] border border-[#2c1810]">
                        Nuova Foto
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                    <p className="text-center text-xs mt-3 italic text-[#8b5a2b]">"Una somiglianza perfetta."</p>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-[#b8860b] border-dashed rounded-lg cursor-pointer bg-[#f0e6d2]/30 hover:bg-[#f0e6d2]/60 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <div className="w-16 h-16 rounded-full bg-[#e4d5b7] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-[#8b1c1c]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                      </div>
                      <p className="text-lg vintage-font text-[#2c1810]">Carica Ritratto</p>
                      <p className="text-xs text-[#8b5a2b] mt-1 font-serif">Accettiamo Dagherrotipi.</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </section>

            {/* Step 3: Config */}
            <section className="bg-[#fffcf5] p-6 rounded-lg shadow-xl border border-[#8b1c1c]/20 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b1c1c] to-transparent opacity-50"></div>
              <h2 className="text-2xl vintage-font font-bold mb-6 text-[#8b1c1c] flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#8b1c1c] text-[#8b1c1c] text-sm">III</span>
                Finitura
              </h2>

              <div className="space-y-6">
                {/* Resolution */}
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-3 uppercase tracking-wider">Qualità</label>
                  <div className="flex gap-2 bg-[#f0e6d2] p-1 rounded">
                    {Object.values(ImageResolution).map((res) => (
                      <button
                        key={res}
                        onClick={() => setResolution(res)}
                        className={`
                          flex-1 py-1.5 px-2 rounded font-serif text-sm transition-all
                          ${resolution === res
                            ? 'bg-[#fffcf5] text-[#8b1c1c] shadow border border-[#b8860b]'
                            : 'text-[#8b5a2b] hover:text-[#2c1810]'}
                        `}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aging Filter */}
                <div>
                  <label className="block text-sm font-bold text-[#2c1810] mb-3 uppercase tracking-wider">Stile Anticato</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(AgingFilter).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setAgingFilter(filter)}
                        className={`
                            py-2 px-3 text-xs font-bold transition-all border
                            ${agingFilter === filter
                            ? 'bg-[#2c1810] text-[#e4d5b7] border-[#2c1810]'
                            : 'bg-white text-[#5c4a3b] border-[#d4c5a9] hover:border-[#b8860b]'}
                          `}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Card Selection (Width 8/12) */}
          <div className="md:col-span-8 space-y-6">
            <section className="bg-[#fffcf5] p-6 rounded-lg shadow-xl border border-[#8b1c1c]/20 min-h-[600px] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b1c1c] to-transparent opacity-50"></div>
              <h2 className="text-2xl vintage-font font-bold mb-6 text-[#8b1c1c] flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#8b1c1c] text-[#8b1c1c] text-sm">II</span>
                La Carta
              </h2>
              <div className="max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                <CardSelection selectedCardId={selectedCard?.id || null} onSelect={setSelectedCard} />
              </div>
            </section>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center justify-center pt-8 border-t-2 border-[#b8860b]/20" id="result-area">
          {error && (
            <div className="mb-8 p-4 bg-[#fff5f5] border-l-4 border-red-800 text-red-900 w-full max-w-2xl rounded shadow-sm">
              <p className="font-bold vintage-font">Errore</p>
              <p className="font-serif italic">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!croppedBase64 || !selectedCard || isLoading}
            className={`
              group relative overflow-hidden px-16 py-6 text-2xl vintage-font font-bold tracking-widest shadow-2xl transition-all
              ${!croppedBase64 || !selectedCard || isLoading
                ? 'bg-[#d4c5a9] text-[#fffcf5] cursor-not-allowed grayscale'
                : 'bg-[#8b1c1c] text-[#e4d5b7] hover:scale-105 hover:bg-[#7a1616] border-4 border-double border-[#b8860b]'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-4">
                <div className="w-6 h-6 border-4 border-[#e4d5b7] border-t-transparent rounded-full animate-spin"></div>
                CREAZIONE...
              </span>
            ) : (
              "CREA LA CARTA"
            )}

            {/* Button Shine Effect */}
            {!isLoading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>}
          </button>
        </div>

        {/* Result Area */}
        {generatedImage && (
          <section className="mt-16 flex flex-col items-center animate-fade-in pb-16">
            <h2 className="text-4xl vintage-font font-bold text-[#2c1810] mb-8 relative">
              <span className="relative z-10 px-4 bg-[#f0e6d2]">Il Capolavoro</span>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#2c1810]/30 -z-0"></div>
            </h2>

            <div className="relative group p-4 bg-white shadow-2xl rotate-1 transform transition-transform hover:rotate-0 duration-500">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#b8860b] -translate-x-1 -translate-y-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#b8860b] translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#b8860b] -translate-x-1 translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#b8860b] translate-x-1 translate-y-1"></div>

              <div className="relative p-1 border-2 border-[#2c1810] bg-white">
                <img
                  src={generatedImage}
                  alt="Generated Mercante Card"
                  className="max-h-[70vh] object-contain shadow-inner"
                />
              </div>
            </div>

            <div className="flex gap-6 mt-10">
              <a
                href={generatedImage}
                download={`mercante-${selectedCard?.id}-${agingFilter.toLowerCase().replace(/\s/g, '_')}.png`}
                className="px-8 py-3 bg-[#2c1810] text-[#e4d5b7] vintage-font font-bold shadow-lg hover:bg-[#1a0e09] flex items-center gap-3 transition-colors border border-[#b8860b]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Salva
              </a>
              <button
                onClick={() => {
                  setGeneratedImage(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-[#f0e6d2] text-[#2c1810] border-2 border-[#8b1c1c] vintage-font font-bold shadow-lg hover:bg-[#e4d5b7] transition-colors"
              >
                Nuova Carta
              </button>
            </div>
          </section>
        )}

      </main>

      <footer className="text-center py-8 text-[#8b5a2b] text-sm opacity-80 vintage-font border-t border-[#b8860b]/20 mt-12">
        <p>Copyright <a href="https://www.prolocoventicano.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b1c1c] underline decoration-[#8b1c1c]/50 underline-offset-4">Pro Loco Venticanese</a></p>
      </footer>
    </div>
  );
};

export default App;
