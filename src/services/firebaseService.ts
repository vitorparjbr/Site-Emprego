import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
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
  getDoc,
  deleteField,
  limit,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

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
let storage: ReturnType<typeof getStorage> | null = null;

if (enabled) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export const isEnabled = () => enabled;

// ──────────────────────────────────────────────────────────────
// Auth helpers
// ──────────────────────────────────────────────────────────────

export const signUp = async (companyName: string, email: string, password: string) => {
  if (!enabled || !auth || !db) throw new Error('Firebase not configured');
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;
  // Envia e-mail de verificação imediatamente após o cadastro
  await sendEmailVerification(user);
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

/**
 * Envia e-mail de redefinição de senha.
 * Chame com o e-mail do empregador quando clicar em "Esqueci minha senha".
 */
export const resetPassword = async (email: string) => {
  if (!enabled || !auth) throw new Error('Firebase not configured');
  await sendPasswordResetEmail(auth, email);
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

  // Campos opcionais de topo: se undefined/null, usar deleteField() para removê-los do Firestore
  const OPTIONAL_TOP = ['companyName', 'area', 'duration', 'salary', 'benefits', 'workHours', 'workSchedule', 'workScale', 'description', 'aboutCompany', 'courseContact'];
  // Campos opcionais dentro de requirements: usar notação de ponto
  const OPTIONAL_REQ = ['education', 'experience', 'profile'];

  const dataToUpdate: any = {
    jobType: jobData.jobType,
    title: jobData.title,
    location: jobData.location,
    resumePreference: jobData.resumePreference,
    updatedAt: serverTimestamp(),
  };

  for (const field of OPTIONAL_TOP) {
    dataToUpdate[field] = jobData[field] !== undefined ? jobData[field] : deleteField();
  }

  const req = jobData.requirements || {};
  for (const field of OPTIONAL_REQ) {
    dataToUpdate[`requirements.${field}`] = req[field] !== undefined ? req[field] : deleteField();
  }

  await updateDoc(doc(db, 'jobs', id), dataToUpdate);
};

export const deleteJob = async (id: string) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, 'jobs', id));
};

export const renewJob = async (id: string) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  await updateDoc(doc(db, 'jobs', id), { createdAt: serverTimestamp() });
};

// ──────────────────────────────────────────────────────────────
// Storage helper — upload de currículo
// ──────────────────────────────────────────────────────────────

/**
 * Faz upload do arquivo de currículo para o Firebase Storage.
 * @returns URL pública permanente para download
 */
export const uploadResume = async (file: File, jobId: string): Promise<string> => {
  if (!enabled || !storage) throw new Error('Firebase Storage não configurado');
  // Caminho: curriculos/{jobId}/{timestamp}_{nomeDoArquivo}
  const path = `curriculos/${jobId}/${Date.now()}_${file.name}`;
  const fileRef = storageRef(storage, path);
  const snapshot = await uploadBytes(fileRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};

// ──────────────────────────────────────────────────────────────
// Applications helpers
// ──────────────────────────────────────────────────────────────

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

/**
 * Leitura única das vagas, limitada a `max` documentos.
 * Use no lugar de listenJobs para visitantes — evita cobranças de leitura
 * a cada atualização no Firestore.
 */
export const getJobs = async (max = 50) => {
  if (!enabled || !db) return [];
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Feedback helpers
export const addFeedback = async (feedback: any) => {
  if (!enabled || !db) throw new Error('Firebase not configured');
  const cleaned = cleanData(feedback);
  const feedbackToSave = {
    ...cleaned,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, 'feedback'), feedbackToSave);
  return { id: ref.id, ...feedbackToSave };
};

export const listenFeedback = (cb: (feedbacks: any[]) => void) => {
  if (!enabled || !db) return () => {};
  const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
  const unsub = onSnapshot(q, snapshot => {
    const feedbacks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(feedbacks as any[]);
  });
  return unsub;
};
