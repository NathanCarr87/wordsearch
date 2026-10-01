// Available grade definitions for GradeSelector UI
export const AVAILABLE_GRADES = [
  { key: 'kindergarten', label: 'Kindergarten', description: 'Simple 3-4 letter words, sight words, and basic concepts.', gridSize: 8 },
  { key: 'grade1', label: 'Grade 1', description: 'Fundamental vocabulary, short vowels, and high-frequency sight words.', gridSize: 10 },
  { key: 'grade2', label: 'Grade 2', description: 'Everyday objects, animals, nature, and early phonics blends.', gridSize: 10 },
  { key: 'grade3', label: 'Grade 3', description: 'Expanded vocabulary, compound words, science and social terms.', gridSize: 12 },
  { key: 'grade4', label: 'Grade 4', description: 'Academic terms, multi-syllable vocabulary, and literature words.', gridSize: 12 },
  { key: 'grade5', label: 'Grade 5', description: 'Advanced vocabulary, scientific concepts, and social studies.', gridSize: 14 },
  { key: 'grade6', label: 'Grade 6+', description: 'Challenging academic vocabulary, STEM concepts, and complex structures.', gridSize: 15 },
];

/**
 * Local fallback word lists for each grade when offline or Firestore fetching fails.
 */
export const LOCAL_CORPUS_DATA = {
  kindergarten: {
    label: 'Kindergarten',
    description: 'Simple 3-4 letter words, sight words, and basic concepts.',
    gridSize: 8,
    maxWords: 6,
    allowedDirections: ['horizontal', 'vertical'],
    words: ['CAT', 'DOG', 'SUN', 'HAT', 'BALL', 'BOOK', 'STAR', 'RED', 'BLUE', 'TREE', 'FISH', 'BOY', 'GIRL', 'TOY']
  },
  grade1: {
    label: 'Grade 1',
    description: 'Fundamental vocabulary, short vowels, and high-frequency sight words.',
    gridSize: 10,
    maxWords: 8,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down'],
    words: ['APPLE', 'WATER', 'HOUSE', 'GREEN', 'HAPPY', 'SMILE', 'FRIEND', 'SCHOOL', 'BIRD', 'GRASS', 'PAPER', 'RIVER', 'CLOUD', 'MONEY']
  },
  grade2: {
    label: 'Grade 2',
    description: 'Everyday objects, animals, nature, and early phonics blends.',
    gridSize: 10,
    maxWords: 8,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down'],
    words: ['ANIMAL', 'FLOWER', 'WINTER', 'SUMMER', 'SPRING', 'GARDEN', 'DOCTOR', 'FARMER', 'PENCIL', 'YELLOW', 'MONKEY', 'RABBIT', 'PURPLE', 'ORANGE']
  },
  grade3: {
    label: 'Grade 3',
    description: 'Expanded vocabulary, compound words, science and social terms.',
    gridSize: 12,
    maxWords: 10,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'],
    words: ['BUTTERFLY', 'MOUNTAIN', 'OCEAN', 'FOREST', 'PLANET', 'WEATHER', 'RECYCLE', 'TEACHER', 'STUDENT', 'LIBRARY', 'COMPASS', 'ISLAND', 'REPTILE', 'ENERGY']
  },
  grade4: {
    label: 'Grade 4',
    description: 'Academic terms, multi-syllable vocabulary, and literature words.',
    gridSize: 12,
    maxWords: 10,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up', 'reverse-horizontal'],
    words: ['GEOGRAPHY', 'DISCOVERY', 'EXPLORER', 'INVENTION', 'ECOSYSTEM', 'FRACTION', 'SYLLABLE', 'METAPHOR', 'HISTORY', 'VOLCANO', 'SATELLITE', 'HABITAT']
  },
  grade5: {
    label: 'Grade 5',
    description: 'Advanced vocabulary, scientific concepts, and social studies.',
    gridSize: 14,
    maxWords: 12,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up', 'reverse-horizontal', 'reverse-vertical'],
    words: ['ATMOSPHERE', 'BIODIVERSITY', 'CIVILIZATION', 'DEMOCRACY', 'EXPERIMENT', 'GRAVITATION', 'HEMISPHERE', 'PHOTOSYNTHESIS', 'REVOLUTION', 'SOLUTION']
  },
  grade6: {
    label: 'Grade 6+',
    description: 'Challenging academic vocabulary, STEM concepts, and complex structures.',
    gridSize: 15,
    maxWords: 12,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up', 'reverse-horizontal', 'reverse-vertical', 'reverse-diagonal-down', 'reverse-diagonal-up'],
    words: ['ARCHITECTURE', 'BIOTECHNOLOGY', 'CONSTITUTION', 'ELECTROMAGNET', 'GENETICS', 'HYPOTHESIS', 'INFRASTRUCTURE', 'METAMORPHOSIS', 'OSMOSIS', 'PROBABILITY']
  }
};
