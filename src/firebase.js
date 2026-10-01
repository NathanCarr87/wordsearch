import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { AVAILABLE_GRADES, LOCAL_CORPUS_DATA } from './data/wordCorpus';

/**
 * @typedef {Object} CorpusWord
 * @property {string} word
 * @property {1 | 2 | 3} difficulty
 * @property {boolean} enabled
 */

/**
 * @typedef {string} GeneratorWord
 */

/**
 * @typedef {Object} GradeCorpusDoc
 * @property {string} label
 * @property {string} description
 * @property {number} gridSize
 * @property {number} maxWords
 * @property {string[]} allowedDirections
 * @property {CorpusWord[]} words
 * @property {import('firebase/firestore').Timestamp} [updatedAt]
 * @property {number} [version]
 */

/**
 * @typedef {Object} GradeCorpus
 * @property {string} grade
 * @property {string} label
 * @property {string} description
 * @property {number} gridSize
 * @property {number} maxWords
 * @property {string[]} allowedDirections
 * @property {GeneratorWord[]} words - Filtered list of enabled word strings
 * @property {('firebase'|'local')} source
 */

// Default configuration with Vite env variables or fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let db = null;
let isFirebaseInitialized = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseInitialized = true;
} catch (error) {
  console.warn("Firebase initialization error:", error.message);
}

// In-memory cache for loaded grade corpora
/** @type {Record<string, GradeCorpus>} */
const corpusCache = {};

/**
 * Clears the in-memory cache (primarily used for testing)
 */
export function clearCorpusCache() {
  for (const key of Object.keys(corpusCache)) {
    delete corpusCache[key];
  }
}

/**
 * Transforms corpus words (array of CorpusWord objects or strings) into a clean array of string words.
 * Filters for enabled === true and extracts .word string safely. Handles malformed data gracefully.
 *
 * @param {unknown} words - Corpus words list (CorpusWord[], string[], or malformed data)
 * @returns {GeneratorWord[]} Array of valid word strings
 */
export function extractPlayableWords(words) {
  if (!Array.isArray(words)) {
    return [];
  }

  const result = [];
  for (const entry of words) {
    if (!entry) continue;

    if (typeof entry === 'string') {
      const trimmed = entry.trim();
      if (trimmed.length > 0) {
        result.push(trimmed);
      }
    } else if (typeof entry === 'object') {
      if (entry.enabled === true && typeof entry.word === 'string') {
        const trimmed = entry.word.trim();
        if (trimmed.length > 0) {
          result.push(trimmed);
        }
      }
    }
  }

  return result;
}

/**
 * Returns local fallback corpus data for a given grade level.
 *
 * @param {string} gradeKey
 * @returns {GradeCorpus}
 */
function getLocalFallbackCorpus(gradeKey) {
  const defaultData = LOCAL_CORPUS_DATA[gradeKey] || LOCAL_CORPUS_DATA['grade1'];
  return {
    grade: gradeKey,
    label: defaultData.label,
    description: defaultData.description,
    gridSize: defaultData.gridSize,
    maxWords: defaultData.maxWords,
    allowedDirections: defaultData.allowedDirections,
    words: extractPlayableWords(defaultData.words),
    source: 'local'
  };
}

/**
 * Fetch corpus configuration and enabled words for a specific grade level.
 * Reads document from `wordCorpora/{gradeKey}` via Firebase client SDK.
 * Uses in-memory cache to avoid unnecessary Firestore requests.
 * Falls back to local corpus data if Firestore fetch fails or client is offline.
 *
 * @param {string} gradeKey - Key of the grade (e.g. 'kindergarten', 'grade1', etc.)
 * @returns {Promise<GradeCorpus>}
 */
export async function getGradeCorpus(gradeKey = 'grade1') {
  // Return cached corpus if available
  if (corpusCache[gradeKey]) {
    return corpusCache[gradeKey];
  }

  if (!isFirebaseInitialized || !db) {
    console.info(`Firebase not initialized. Using local corpus for '${gradeKey}'.`);
    const fallback = getLocalFallbackCorpus(gradeKey);
    corpusCache[gradeKey] = fallback;
    return fallback;
  }

  try {
    const docRef = doc(db, 'wordCorpora', gradeKey);
    const fetchPromise = getDoc(docRef);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore fetch timeout')), 3000)
    );

    const docSnap = await Promise.race([fetchPromise, timeoutPromise]);

    if (docSnap.exists()) {
      /** @type {GradeCorpusDoc} */
      const data = docSnap.data();

      const result = {
        grade: gradeKey,
        label: data.label || gradeKey,
        description: data.description || '',
        gridSize: data.gridSize || 10,
        maxWords: data.maxWords || 8,
        allowedDirections: Array.isArray(data.allowedDirections) && data.allowedDirections.length > 0
          ? data.allowedDirections
          : ['horizontal', 'vertical'],
        words: extractPlayableWords(data?.words),
        source: 'firebase'
      };

      corpusCache[gradeKey] = result;
      return result;
    }
  } catch (error) {
    console.log(error)
    console.info(`Firestore fetch failed or document not found for grade '${gradeKey}'. Using local corpus.`, error.message);
  }

  // Fallback to local corpus data if Firestore failed or doc didn't exist
  const fallback = getLocalFallbackCorpus(gradeKey);
  corpusCache[gradeKey] = fallback;
  return fallback;
}

/**
 * Returns available grades list with metadata
 */
export function getAvailableGrades() {
  return AVAILABLE_GRADES;
}

export { db };
