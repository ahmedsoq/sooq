/**
 * تخزين ملفات كبيرة (الفيديو) داخل IndexedDB بدل localStorage
 * لأن localStorage حجمه محدود (~5 ميجا) وكان يفشل بصمت مع الفيديو.
 */
const DB_NAME = "elsoooq_media";
const STORE = "files";
export const IDB_PREFIX = "idb://";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveMedia(key: string, file: Blob): Promise<string> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return `${IDB_PREFIX}${key}`;
}

export async function getMediaUrl(ref: string): Promise<string | null> {
  if (!ref.startsWith(IDB_PREFIX)) return ref;
  const key = ref.slice(IDB_PREFIX.length);
  const db = await openDB();
  const blob = await new Promise<Blob | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return blob ? URL.createObjectURL(blob) : null;
}

export async function deleteMedia(ref: string) {
  if (!ref.startsWith(IDB_PREFIX)) return;
  const key = ref.slice(IDB_PREFIX.length);
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(key);
  db.close();
}
