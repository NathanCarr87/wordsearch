import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const corpus = JSON.parse(
  readFileSync("./data/corpus.json", "utf8")
);

const COLLECTION = "wordCorpora";

async function uploadCorpus() {
  const grades = Object.entries(corpus).filter(
    ([key]) => key !== "_meta"
  );

  console.log(`Uploading ${grades.length} grade corpora...`);

  for (const [grade, data] of grades) {
    const ref = db.collection(COLLECTION).doc(grade);

    await ref.set({
      ...(data as object),
      updatedAt: new Date(),
      version: corpus._meta?.version ?? 1,
    });

    const wordCount = Array.isArray((data as any).words)
      ? (data as any).words.length
      : 0;

    console.log(`✓ ${grade}: ${wordCount} words`);
  }

  // Store metadata separately
  await db.collection(COLLECTION).doc("_meta").set({
    ...corpus._meta,
    updatedAt: new Date(),
  });

  console.log("\nCorpus upload complete.");
}

uploadCorpus().catch((error) => {
  console.error("Corpus upload failed:");
  console.error(error);
  process.exit(1);
});