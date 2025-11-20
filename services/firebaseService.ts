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

  try {
    const unsub = onSnapshot(q, snapshot => {
      const jobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      cb(jobs as any[]);
    }, err => {
      console.warn('Firestore onSnapshot error, switching to REST polling fallback:', err);
    });
    // Return a combined unsubscribe that also stops polling if it was started.
    let polling = false;
    let pollTimer: any = null;
    const stop = () => {
      try { unsub(); } catch (e) {}
      if (polling && pollTimer) clearInterval(pollTimer);
    };
    return stop;
  } catch (e) {
    console.warn('onSnapshot threw, will use REST polling fallback', e);
  }

  // Fallback: poll the REST API periodically. Useful for browsers that block
  // Firestore realtime features (privacy browsers or restricted contexts).
  const restUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/jobs?key=${firebaseConfig.apiKey}`;
  let stopped = false;
  const fetchAndCb = async () => {
    try {
      const resp = await fetch(restUrl);
      if (!resp.ok) {
        console.warn('Firestore REST list failed with status', resp.status);
        return;
      }
      const data = await resp.json();
      const docs = (data.documents || []).map((d: any) => {
        // transform Firestore REST document format into app-friendly object
        const fields = d.fields || {};
        const normalize = (f: any) => {
          if (!f) return undefined;
          if (f.stringValue !== undefined) return f.stringValue;
          if (f.timestampValue !== undefined) return f.timestampValue;
          if (f.arrayValue !== undefined) return (f.arrayValue.values || []).map((v: any) => normalize(v));
          return undefined;
        };
        return {
          id: d.name ? d.name.split('/').pop() : undefined,
          title: normalize(fields.title),
          employerId: normalize(fields.employerId),
          companyName: normalize(fields.companyName),
          location: normalize(fields.location),
          salary: normalize(fields.salary),
          benefits: normalize(fields.benefits),
          workHours: normalize(fields.workHours),
          workSchedule: normalize(fields.workSchedule),
          workScale: normalize(fields.workScale),
          requirements: {
            education: fields.requirements?.mapValue?.fields?.education?.stringValue,
            experience: fields.requirements?.mapValue?.fields?.experience?.stringValue,
            profile: fields.requirements?.mapValue?.fields?.profile?.stringValue,
          },
          postedDate: normalize(fields.createdAt) || normalize(fields.postedDate) || new Date().toISOString(),
          applications: [],
          resumePreference: normalize(fields.resumePreference) || 'file',
        };
      });
      cb(docs as any[]);
    } catch (err) {
      console.warn('Error polling Firestore REST API', err);
    }
  };

  // initial fetch
  fetchAndCb();
  const timer = setInterval(() => { if (!stopped) fetchAndCb(); }, 5000);
  return () => { stopped = true; clearInterval(timer); };
};
