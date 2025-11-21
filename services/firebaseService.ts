import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
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
  getDocs,
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

// Função para limpar dados recursivamente, removendo undefined, null e objetos vazios
const cleanData = (obj: any): any => {
  if (obj === null || obj === undefined) return undefined;
  
  if (typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    const cleaned = obj.map(cleanData).filter(v => v !== undefined);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  
  const cleaned: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !(value instanceof Date)) {
        const cleanedNested = cleanData(value);
        if (cleanedNested !== undefined) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  });
  
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};


let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (enabled) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const isEnabled = () => enabled;

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
  const cleaned = cleanData(job);
  const jobToSave = {
    ...cleaned,
    employerId,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, 'jobs'), jobToSave);
  return { id: ref.id, ...jobToSave };
};

export const updateJob = async (id: string, jobData: any) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  const cleaned = cleanData(jobData);
  const dataToUpdate = {
    ...cleaned,
    updatedAt: serverTimestamp(),
  };
  const ref = doc(db, 'jobs', id);
  await updateDoc(ref, dataToUpdate);
};

export const deleteJob = async (id: string) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, 'jobs', id));
};

export const addApplication = async (jobId: string, application: any) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  // Store applications in a subcollection under the job to avoid leaking candidates
  const appsCol = collection(db, 'jobs', jobId, 'applications');
  const cleaned = cleanData(application);
  const appToSave = { 
    ...cleaned, 
    date: new Date().toISOString() 
  };
  const ref = await addDoc(appsCol, appToSave);
  return { id: ref.id, ...appToSave };
};

export const getApplications = async (jobId: string) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  const appsCol = collection(db, 'jobs', jobId, 'applications');
  const snap = await getDocs(appsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const listenApplications = (jobId: string, cb: (apps: any[]) => void) => {
  if (!enabled || !db) return () => {};
  const q = query(collection(db, 'jobs', jobId, 'applications'), orderBy('date', 'desc'));
  const unsub = onSnapshot(q, snapshot => {
    const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(apps as any[]);
  });
  return unsub;
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
