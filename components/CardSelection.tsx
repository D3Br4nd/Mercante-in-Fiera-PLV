

import React, { useMemo } from 'react';
import { CardArchetype } from '../types';
import { MERCANTE_CARDS } from '../constants';

interface CardSelectionProps {
  selectedCardId: string | null;
  onSelect: (card: CardArchetype) => void;
}

const CardSelection: React.FC<CardSelectionProps> = ({ selectedCardId, onSelect }) => {
  
  // Group cards by category
  const groupedCards = useMemo(() => {
    const groups: Record<string, CardArchetype[]> = {
      human: [],
      animal: [],
      object: []
    };
    MERCANTE_CARDS.forEach(card => {
      if (groups[card.category]) {
        groups[card.category].push(card);
      }
    });
    return groups;
  }, []);

  const renderCategory = (title: string, cards: CardArchetype[]) => (
    <div className="mb-10">
      <h3 className="text-2xl vintage-font font-bold text-[#8b1c1c] mb-4 border-b-2 border-[#8b1c1c]/30 pb-2 text-center tracking-widest uppercase shadow-sm">
        <span className="bg-[#f0e6d2] px-4">{title}</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-1">
        {cards.map((card) => {
          const isSelected = selectedCardId === card.id;
          return (
            <button
              key={card.id}
              onClick={() => onSelect(card)}
              className={`
                group relative aspect-[3/4] flex flex-col items-center justify-between p-2
                transition-all duration-300 transform
                ${isSelected 
                  ? 'scale-105 z-10 shadow-2xl ring-4 ring-[#b8860b] bg-[#fffcf5]' 
                  : 'hover:scale-102 hover:shadow-xl bg-[#fffcf5] border border-gray-300 hover:border-[#b8860b]'}
                rounded-lg overflow-hidden
              `}
              style={{
                boxShadow: isSelected ? '0 10px 30px -5px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            >
              {/* Card Frame (Double Border Effect) */}
              <div className={`absolute inset-1.5 border-2 ${isSelected ? 'border-[#b8860b]' : 'border-[#2c1810]/20'} pointer-events-none rounded-md`}></div>
              <div className={`absolute inset-2.5 border ${isSelected ? 'border-[#b8860b]' : 'border-[#2c1810]/10'} pointer-events-none rounded-sm`}></div>

              {/* Number/Corner Detail (Fake) */}
              <div className="w-full flex justify-between px-3 pt-2 opacity-50 text-[10px] font-bold text-[#2c1810]">
                 <span>{(card.id.length * 3) % 100}</span>
                 <span>♦</span>
              </div>

              {/* Main Icon */}
              <div className="flex-grow flex items-center justify-center">
                <div className={`
                  text-5xl sm:text-6xl filter transition-all duration-500
                  ${isSelected ? 'sepia-0 scale-110 drop-shadow-md' : 'sepia-[0.8] grayscale-[0.5] opacity-80 group-hover:sepia-0 group-hover:grayscale-0 group-hover:scale-110'}
                `}>
                  {card.icon}
                </div>
              </div>

              {/* Text Label */}
              <div className="w-full text-center pb-3 px-1 z-10">
                <div className={`
                   vintage-font font-bold text-base leading-none mb-1
                   ${isSelected ? 'text-[#8b1c1c]' : 'text-[#2c1810]'}
                `}>
                  {card.nameIT}
                </div>
                <div className="text-[9px] uppercase tracking-wide opacity-60 font-serif">
                  {card.nameEN}
                </div>
              </div>
              
              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-0 right-0 bg-[#b8860b] text-white p-1 rounded-bl-lg shadow-md z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-2">
      {renderCategory("Personaggi", groupedCards.human)}
      {renderCategory("Animali", groupedCards.animal)}
      {renderCategory("Oggetti", groupedCards.object)}
    </div>
  );
};

export default CardSelection;