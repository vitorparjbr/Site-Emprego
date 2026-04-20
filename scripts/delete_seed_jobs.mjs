// Script temporário para remover as vagas fictícias do Firestore
// Execute com: node scripts/delete_seed_jobs.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBqlUA3O-hVbBUHwrr_7-QYCPYrqYeYaLQ',
  authDomain: 'site-de-empregos-3e981.firebaseapp.com',
  projectId: 'site-de-empregos-3e981',
  storageBucket: 'site-de-empregos-3e981.firebasestorage.app',
  messagingSenderId: '500171034656',
  appId: '1:500171034656:web:76a7cf36c1922719dcac45',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const SEED_EMAIL = 'demo.vagas@jobfinderpro.seed';
const SEED_PASSWORD = 'SeedDemo@2026!';

async function deleteSeedJobs() {
  const cred = await signInWithEmailAndPassword(auth, SEED_EMAIL, SEED_PASSWORD);
  const uid = cred.user.uid;
  console.log(`Autenticado (uid: ${uid})`);

  const q = query(collection(db, 'jobs'), where('employerId', '==', uid));
  const snap = await getDocs(q);

  if (snap.empty) {
    console.log('Nenhuma vaga fictícia encontrada.');
    process.exit(0);
  }

  console.log(`Removendo ${snap.size} vagas...`);
  for (const docSnap of snap.docs) {
    await deleteDoc(doc(db, 'jobs', docSnap.id));
    console.log(`✓ Removida: "${docSnap.data().title}"`);
  }

  console.log('\nPronto! Todas as vagas fictícias foram removidas.');
  process.exit(0);
}

deleteSeedJobs().catch((err) => {
  console.error('Erro:', err);
  process.exit(1);
});
