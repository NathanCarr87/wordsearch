import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { GRADE_CORPUS } from './data/wordCorpus';

// Default configuration with safe fallback or Vite env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForWordSearchApp12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "word-search-grade-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "word-search-grade-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "word-search-grade-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

let db = null;
let isFirebaseInitialized = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseInitialized = true;
} catch (error) {
  console.warn("Firebase initialization warning (using local fallback corpus):", error.message);
}

/**
 * Fetch corpus configuration and words for a specific grade level.
 * Attempts Firestore fetch first, falling back gracefully to local GRADE_CORPUS.
 *
 * @param {string} gradeKey - Key of the grade (e.g. 'kindergarten', 'grade1', etc.)
 * @returns {Promise<{grade: string, label: string, description: string, words: string[], gridSize: number, maxWords: number, allowedDirections: string[]}>}
 */
export async function getGradeCorpus(gradeKey = 'grade1') {
  const defaultData = GRADE_CORPUS[gradeKey] || GRADE_CORPUS.grade1;

  if (!isFirebaseInitialized || !db) {
    return { grade: gradeKey, ...defaultData, source: 'local' };
  }

  try {
    const docRef = doc(db, 'corpora', gradeKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        grade: gradeKey,
        label: data.label || defaultData.label,
        description: data.description || defaultData.description,
        gridSize: data.gridSize || defaultData.gridSize,
        maxWords: data.maxWords || defaultData.maxWords,
        allowedDirections: data.allowedDirections || defaultData.allowedDirections,
        words: Array.isArray(data.words) && data.words.length > 0 ? data.words : defaultData.words,
        source: 'firebase'
      };
    }
  } catch (error) {
    console.info(`Firestore fetch failed or document not found for grade '${gradeKey}'. Using local corpus.`, error.message);
  }

  return { grade: gradeKey, ...defaultData, source: 'local' };
}

/**
 * Returns available grades list with metadata
 */
export function getAvailableGrades() {
  return Object.keys(GRADE_CORPUS).map(key => ({
    key,
    label: GRADE_CORPUS[key].label,
    description: GRADE_CORPUS[key].description,
    gridSize: GRADE_CORPUS[key].gridSize,
    wordCount: GRADE_CORPUS[key].words.length
  }));
}

export { db };
