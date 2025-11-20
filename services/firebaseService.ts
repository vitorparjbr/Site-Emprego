import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  getDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const enabled = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let persistenceAvailable = false;

if (enabled) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  // Try to set auth persistence to local (keeps session across reloads).
  // Some privacy-focused browsers may reject this; we record availability.
  setPersistence(auth, browserLocalPersistence).then(() => {
    persistenceAvailable = true;
  }).catch(() => {
    persistenceAvailable = false;
  });
}

export const isEnabled = () => enabled;
export const isPersistenceAvailable = () => persistenceAvailable;

// Auth helpers
export const signUp = async (companyName: string, email: string, password: string) => {
  if (!enabled || !auth || !db) throw new Error('Firebase not configured');
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;
  const employer = {
    id: user.uid,
    companyName,
    email,
  };
  await setDoc(doc(db, 'employers', user.uid), employer);
  return employer;
};

export const signIn = async (email: string, password: string) => {
  if (!enabled || !auth) throw new Error('Firebase not configured');
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};

export const signOutUser = async () => {
  if (!enabled || !auth) throw new Error('Firebase not configured');
  await signOut(auth);
};

export const onAuthChanged = (cb: (user: User | null) => void) => {
  if (!enabled || !auth) return () => {};
  return onAuthStateChanged(auth, cb);
};

// Employer helpers
export const getEmployer = async (uid: string) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  const ref = doc(db, 'employers', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as any) : null;
};

// Jobs helpers
export const addJob = async (job: any, employerId: string) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  const jobToSave = {
    ...job,
    employerId,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, 'jobs'), jobToSave);
  return { id: ref.id, ...jobToSave };
};

export const updateJob = async (id: string, jobData: any) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  const ref = doc(db, 'jobs', id);
  await updateDoc(ref, { ...jobData, updatedAt: serverTimestamp() });
};

export const deleteJob = async (id: string) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, 'jobs', id));
};

export const addApplication = async (jobId: string, application: any) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  const ref = doc(db, 'jobs', jobId);
  const appWithMeta = { ...application, id: `app-${Date.now()}`, date: new Date().toISOString() };
  await updateDoc(ref, { applications: arrayUnion(appWithMeta) });
};

export const listenJobs = (cb: (jobs: any[]) => void) => {
  if (!enabled || !db) return () => {};
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  const unsub = onSnapshot(q, snapshot => {
    const jobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(jobs as any[]);
  });
  return unsub;
};
