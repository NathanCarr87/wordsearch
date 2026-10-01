// Default Grade-based Word Corpora for Word Search Generator
export const GRADE_CORPUS = {
  kindergarten: {
    label: "Kindergarten",
    description: "Simple 3-4 letter words, sight words, and basic concepts.",
    gridSize: 8,
    maxWords: 6,
    allowedDirections: ['horizontal', 'vertical'], // Easy directions for young kids
    words: [
      "CAT", "DOG", "SUN", "RED", "BLUE", "RUN", "HOP", "BIG",
      "HAT", "BALL", "STAR", "BOY", "GIRL", "PIG", "COW", "BOX",
      "FISH", "BIRD", "DUCK", "TREE", "BOOK", "TOY", "FUN", "HAPPY"
    ]
  },
  grade1: {
    label: "Grade 1",
    description: "Fundamental vocabulary, short vowels, and high-frequency sight words.",
    gridSize: 10,
    maxWords: 8,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down'],
    words: [
      "APPLE", "BEAR", "FROG", "JUMP", "LION", "MOON", "NEST", "PARK",
      "RAIN", "SNOW", "TIME", "WIND", "SMILE", "FRIEND", "SCHOOL", "DESK",
      "PENCIL", "WATER", "HOUSE", "GRASS", "FLOWER", "GREEN", "YELLOW", "WHITE"
    ]
  },
  grade2: {
    label: "Grade 2",
    description: "Everyday objects, animals, nature, and early phonics blends.",
    gridSize: 10,
    maxWords: 10,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down'],
    words: [
      "ANIMAL", "BRIDGE", "CASTLE", "DRAGON", "FOREST", "GARDEN", "ISLAND", "JUNGLE",
      "MONKEY", "PLANET", "RIVER", "SUMMER", "TIGER", "WINTER", "YELLOW", "ZEBRA",
      "FAMILY", "ORANGE", "PURPLE", "SUNDAY", "SPRING", "AUTUMN", "WINDOW", "RABBIT"
    ]
  },
  grade3: {
    label: "Grade 3",
    description: "Expanded vocabulary, compound words, science and social terms.",
    gridSize: 12,
    maxWords: 12,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'],
    words: [
      "BUTTERFLY", "COMPASS", "EXPLORE", "FEATHER", "GRAVITY", "HARBOR", "JOURNEY", "KINGDOM", "MOUNTAIN", "OCEAN", "PYRAMID", "SCIENCE",
      "TREASURE", "VOLCANO", "WEATHER", "WHISPER", "BEAUTIFUL", "DINOSAUR", "ELEPHANT", "REPTILE"
    ]
  },
  grade4: {
    label: "Grade 4",
    description: "Academic terms, multi-syllable vocabulary, and literature words.",
    gridSize: 12,
    maxWords: 12,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up', 'reverse-horizontal'],
    words: [
      "ASTRONAUT", "BIODIVERSITY", "CHALLENGE", "DISCOVERY", "ECOSYSTEM", "FOSSIL", "GEOGRAPHY", "HERITAGE", "INVENTION", "JUSTICE",
      "KNOWLEDGE", "LANDSCAPE", "MAGNIFY", "NAVIGATION", "OXYGEN", "PARTICLE", "QUADRANT", "RESOURCE"
    ]
  },
  grade5: {
    label: "Grade 5",
    description: "Advanced vocabulary, scientific concepts, and social studies.",
    gridSize: 14,
    maxWords: 14,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up', 'reverse-horizontal', 'reverse-vertical'],
    words: [
      "ATMOSPHERE", "CIVILIZATION", "DEMOCRACY", "EXPEDITION", "FOUNDATION", "GENERATION", "HEMISPHERE", "ILLUSTRATION", "JURISDICTION", "KILOMETER",
      "LABORATORY", "METAMORPHOSIS", "NEBULA", "OBSERVATION", "PHOTOSYNTHESIS", "REVOLUTION", "SATELLITE", "TECHNOLOGY"
    ]
  },
  grade6: {
    label: "Grade 6+",
    description: "Challenging academic vocabulary, STEM concepts, and complex structures.",
    gridSize: 15,
    maxWords: 15,
    allowedDirections: ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up', 'reverse-horizontal', 'reverse-vertical', 'reverse-diagonal-down', 'reverse-diagonal-up'],
    words: [
      "ACCELERATION", "BIODIVERSITY", "CHROMOSOME", "DECIPHER", "ELECTROMAGNET", "FLUORESCENT", "GRAVITATIONAL", "HYPOTHESIS", "INFRASTRUCTURE", "JUXTAPOSITION",
      "KINETIC", "LUMINESCENCE", "MICROORGANISM", "NEUROSCIENCE", "OSMOSIS", "PALEONTOLOGY", "QUANTUM", "RENEWABLE"
    ]
  }
};
