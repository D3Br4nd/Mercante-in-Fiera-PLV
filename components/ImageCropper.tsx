
import React, { useState, useRef, useEffect } from 'react';

interface ImageCropperProps {
  src: string;
  onConfirm: (base64: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ src, onConfirm, onCancel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset state when src changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleCrop = () => {
    if (!imageRef.current) return;

    // Use a canvas to perform the crop
    const canvas = document.createElement('canvas');
    // We want the output to be decent resolution, e.g. 600x800 for a 3:4 card ratio
    const outputWidth = 600;
    const outputHeight = 800; 
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, outputWidth, outputHeight);
      
      // Calculate drawing parameters based on the visual viewport
      // The visual viewport is 300x400 (see CSS below)
      // We map the visual transform to the canvas
      
      const visualWidth = 300;
      const visualHeight = 400;
      const ratio = outputWidth / visualWidth; // Map visual pixels to canvas pixels

      // Canvas Center
      ctx.translate(outputWidth / 2, outputHeight / 2);
      
      // Apply user transform (scaled up by ratio)
      ctx.translate(position.x * ratio, position.y * ratio);
      ctx.scale(scale, scale);
      
      // Draw image centered
      const img = imageRef.current;
      ctx.drawImage(
        img, 
        -img.naturalWidth / 2, 
        -img.naturalHeight / 2
      );

      const base64 = canvas.toDataURL('image/jpeg', 0.9);
      // Remove header for the service
      onConfirm(base64.split(',')[1]); 
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full flex flex-col gap-4">
        <h3 className="text-xl font-serif font-bold text-amber-900">Modifica Foto</h3>
        <p className="text-sm text-gray-500">Trascina per spostare, usa lo slider per lo zoom.</p>
        
        {/* Viewport Frame */}
        <div className="relative w-full flex justify-center bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-amber-300">
            {/* Mask/Frame: Aspect Ratio 3:4 */}
            <div 
              ref={containerRef}
              className="relative overflow-hidden cursor-move bg-gray-200 touch-none"
              style={{ width: '300px', height: '400px' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <img
                ref={imageRef}
                src={src}
                alt="To Crop"
                className="absolute max-w-none origin-center pointer-events-none select-none"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
                }}
                draggable={false}
              />
            </div>
            
            {/* Overlay Grid lines for rule of thirds (optional visual aid) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ width: '300px', height: '400px', margin: 'auto' }}>
               <div className="w-full h-full border-2 border-amber-500/30 rounded shadow-inner"></div>
            </div>
        </div>

        {/* Controls */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-amber-900 uppercase">Zoom</label>
            <input 
              type="range" 
              min="0.5" 
              max="3" 
              step="0.1" 
              value={scale} 
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
            />
        </div>

        <div className="flex gap-3 mt-2">
          <button 
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-lg font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors"
          >
            Annulla
          </button>
          <button 
            onClick={handleCrop}
            className="flex-1 py-2 px-4 rounded-lg font-bold text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-md"
          >
            Conferma e Usa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
