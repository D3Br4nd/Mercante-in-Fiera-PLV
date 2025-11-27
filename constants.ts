

import { CardArchetype } from './types';

export const MERCANTE_CARDS: CardArchetype[] = [
  // --- Humans ---
  {
    id: 'lattante',
    nameIT: 'Il Lattante',
    nameEN: 'The Infant',
    category: 'human',
    description: 'A baby in a vintage cradle or swaddling clothes, bonnet, looking innocent.',
    icon: '👶'
  },
  {
    id: 'giapponesina',
    nameIT: 'La Giapponesina',
    nameEN: 'The Japanese Girl',
    category: 'human',
    description: 'A young woman in traditional kimono holding a fan, vintage orientalist style.',
    icon: '👘'
  },
  {
    id: 'bersagliere',
    nameIT: 'Il Bersagliere',
    nameEN: 'The Bersagliere',
    category: 'human',
    description: 'An Italian soldier with the distinctive feathered hat (vaira) and uniform.',
    icon: '🎖️'
  },
  {
    id: 'moro',
    nameIT: 'Il Moro',
    nameEN: 'The Moor',
    category: 'human',
    description: 'A figure in turban and rich oriental robes, traditional exoticized depiction.',
    icon: '👳🏿'
  },
  {
    id: 'beduino',
    nameIT: 'Il Beduino',
    nameEN: 'The Bedouin',
    category: 'human',
    description: 'A desert nomad with keffiyeh and flowing robes.',
    icon: '🐪'
  },
  {
    id: 'cinesino',
    nameIT: 'Il Cinesino',
    nameEN: 'The Chinese Boy',
    category: 'human',
    description: 'A figure in traditional Qing dynasty attire with a queue hairstyle.',
    icon: '👲'
  },
  {
    id: 'spagnola',
    nameIT: 'La Spagnola',
    nameEN: 'The Spanish Woman',
    category: 'human',
    description: 'A flamenco dancer or woman in traditional Spanish dress with a mantilla and rose.',
    icon: '💃'
  },
  {
    id: 'moschettiere',
    nameIT: 'Il Moschettiere',
    nameEN: 'The Musketeer',
    category: 'human',
    description: 'A swordsman in 17th-century French attire with plumed hat and rapier.',
    icon: '⚔️'
  },
  {
    id: 'contadina',
    nameIT: 'La Contadina',
    nameEN: 'The Peasant Woman',
    category: 'human',
    description: 'A woman in traditional Italian folk costume carrying a basket.',
    icon: '🧺'
  },
  {
    id: 'ancella',
    nameIT: 'L\'Ancella',
    nameEN: 'The Handmaiden',
    category: 'human',
    description: 'A servant girl in classical or exotic attire, carrying a jug or tray.',
    icon: '🏺'
  },

  // --- Animals ---
  {
    id: 'cane',
    nameIT: 'Il Cane',
    nameEN: 'The Dog',
    category: 'animal',
    description: 'A loyal hunting dog or pet, sitting faithfully.',
    icon: '🐕'
  },
  {
    id: 'gatto',
    nameIT: 'Il Gatto',
    nameEN: 'The Cat',
    category: 'animal',
    description: 'A domestic cat, elegant and slightly mischievous.',
    icon: '🐈'
  },
  {
    id: 'cavallo',
    nameIT: 'Il Cavallo',
    nameEN: 'The Horse',
    category: 'animal',
    description: 'A majestic stallion, possibly rearing up or trotting.',
    icon: '🐎'
  },
  {
    id: 'bue',
    nameIT: 'Il Bue',
    nameEN: 'The Ox',
    category: 'animal',
    description: 'A sturdy ox standing in a field.',
    icon: '🐂'
  },
  {
    id: 'cervo',
    nameIT: 'Il Cervo',
    nameEN: 'The Stag',
    category: 'animal',
    description: 'A noble deer with large antlers.',
    icon: '🦌'
  },
  {
    id: 'camoscio',
    nameIT: 'Il Camoscio',
    nameEN: 'The Chamois',
    category: 'animal',
    description: 'A mountain goat-antelope standing on a rock.',
    icon: '🐐'
  },
  {
    id: 'tigre',
    nameIT: 'La Tigre',
    nameEN: 'The Tiger',
    category: 'animal',
    description: 'A fierce tiger in a jungle setting.',
    icon: '🐅'
  },
  {
    id: 'leone',
    nameIT: 'Il Leone',
    nameEN: 'The Lion',
    category: 'animal',
    description: 'The king of beasts, majestic with a full mane.',
    icon: '🦁'
  },
  {
    id: 'elefante',
    nameIT: 'L\'Elefante',
    nameEN: 'The Elephant',
    category: 'animal',
    description: 'An elephant, possibly with decorative cloth.',
    icon: '🐘'
  },
  {
    id: 'zebra',
    nameIT: 'La Zebra',
    nameEN: 'The Zebra',
    category: 'animal',
    description: 'A zebra on the savanna.',
    icon: '🦓'
  },
  {
    id: 'giraffa',
    nameIT: 'La Giraffa',
    nameEN: 'The Giraffe',
    category: 'animal',
    description: 'A tall giraffe reaching for leaves.',
    icon: '🦒'
  },
  {
    id: 'struzzo',
    nameIT: 'Lo Struzzo',
    nameEN: 'The Ostrich',
    category: 'animal',
    description: 'A large flightless bird.',
    icon: '🐦'
  },
  {
    id: 'fenicottero',
    nameIT: 'Il Fenicottero',
    nameEN: 'The Flamingo',
    category: 'animal',
    description: 'A pink flamingo standing on one leg.',
    icon: '🦩'
  },
  {
    id: 'cigno',
    nameIT: 'Il Cigno',
    nameEN: 'The Swan',
    category: 'animal',
    description: 'A white swan swimming gracefully.',
    icon: '🦢'
  },
  {
    id: 'fagiano',
    nameIT: 'Il Fagiano',
    nameEN: 'The Pheasant',
    category: 'animal',
    description: 'A colorful game bird.',
    icon: '🦃'
  },
  {
    id: 'pavone',
    nameIT: 'Il Pavone',
    nameEN: 'The Peacock',
    category: 'animal',
    description: 'A peacock displaying its tail feathers.',
    icon: '🦚'
  },
  {
    id: 'pappagallo',
    nameIT: 'Il Pappagallo',
    nameEN: 'The Parrot',
    category: 'animal',
    description: 'A colorful macaw or parrot on a perch.',
    icon: '🦜'
  },
  {
    id: 'aquila',
    nameIT: 'L\'Aquila',
    nameEN: 'The Eagle',
    category: 'animal',
    description: 'An eagle perched or in flight.',
    icon: '🦅'
  },
  {
    id: 'gufo',
    nameIT: 'Il Gufo',
    nameEN: 'The Owl',
    category: 'animal',
    description: 'A wise owl perched on a branch.',
    icon: '🦉'
  },
  {
    id: 'gallo',
    nameIT: 'Il Gallo',
    nameEN: 'The Rooster',
    category: 'animal',
    description: 'A proud rooster crowing.',
    icon: '🐓'
  },
  {
    id: 'farfalla',
    nameIT: 'La Farfalla',
    nameEN: 'The Butterfly',
    category: 'animal',
    description: 'A large, colorful butterfly.',
    icon: '🦋'
  },
  {
    id: 'pesci',
    nameIT: 'I Pesci',
    nameEN: 'The Fish',
    category: 'animal',
    description: 'Stylized fish swimming underwater.',
    icon: '🐟'
  },

  // --- Objects/Nature ---
  {
    id: 'gondola',
    nameIT: 'La Gondola',
    nameEN: 'The Gondola',
    category: 'object',
    description: 'A Venetian gondola on the water.',
    icon: '🛶'
  },
  {
    id: 'caravella',
    nameIT: 'La Caravella',
    nameEN: 'The Caravel',
    category: 'object',
    description: 'An antique sailing ship on the ocean.',
    icon: '⛵'
  },
  {
    id: 'piramide',
    nameIT: 'Le Piramidi',
    nameEN: 'The Pyramids',
    category: 'object',
    description: 'Egyptian pyramids in the desert.',
    icon: '🔺'
  },
  {
    id: 'castello',
    nameIT: 'Il Castello',
    nameEN: 'The Castle',
    category: 'object',
    description: 'A medieval fortress on a hill.',
    icon: '🏰'
  },
  {
    id: 'faro',
    nameIT: 'Il Faro',
    nameEN: 'The Lighthouse',
    category: 'object',
    description: 'A lighthouse guiding ships at night.',
    icon: '🗼'
  },
  {
    id: 'fiori',
    nameIT: 'I Fiori',
    nameEN: 'The Flowers',
    category: 'object',
    description: 'A beautiful bouquet of roses or mixed flowers.',
    icon: '🌹'
  },
  {
    id: 'frutta',
    nameIT: 'La Frutta',
    nameEN: 'The Fruit',
    category: 'object',
    description: 'A basket overflowing with grapes, apples, and pears.',
    icon: '🍇'
  },
  {
    id: 'funghi',
    nameIT: 'I Funghi',
    nameEN: 'The Mushrooms',
    category: 'object',
    description: 'A cluster of forest mushrooms.',
    icon: '🍄'
  }
];