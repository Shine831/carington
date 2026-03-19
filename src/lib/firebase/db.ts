import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs, 
  getDoc,
  query, 
  where, 
  serverTimestamp, 
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./config";

// ============================================================
// SERVICES
// ============================================================

export interface Service {
  id: string;
  title: string;
  description: string;
  priceCFA: number;
  category?: string;
  createdAt?: any;
}

export const getServices = async (): Promise<Service[]> => {
  try {
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("getServices:", err.message);
    return [];
  }
};

export const createService = async (data: { title: string; description: string; priceCFA: number; category?: string }) => {
  return await addDoc(collection(db, "services"), { ...data, createdAt: serverTimestamp() });
};

export const updateService = async (id: string, data: Partial<{ title: string; description: string; priceCFA: number; category: string }>) => {
  await updateDoc(doc(db, "services", id), data);
};

export const deleteService = async (id: string) => {
  await deleteDoc(doc(db, "services", id));
};

// ============================================================
// BOOKINGS
// ============================================================

export interface BookingData {
  userId: string | null;
  clientType: string;
  entity: string;
  email: string;
  phone: string;
  serviceId: string;
  budget: string;
  timeframe: string;
  description: string;
}

export const getBookings = async (userId?: string): Promise<any[]> => {
  try {
    const ref = collection(db, "bookings");
    const q = userId
      ? query(ref, where("userId", "==", userId))
      : query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));
    if (userId) {
      data.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    }
    return data;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("getBookings:", err.message);
    return [];
  }
};

export const createBooking = async (data: BookingData) => {
  return await addDoc(collection(db, "bookings"), {
    ...data,
    status: "PENDING",
    createdAt: serverTimestamp(),
  });
};

export const updateBookingStatus = async (bookingId: string, status: string, adminNote?: string) => {
  const payload: Record<string, unknown> = { status, updatedAt: serverTimestamp() };
  if (adminNote !== undefined) payload.adminNote = adminNote;
  await updateDoc(doc(db, "bookings", bookingId), payload);
};

export const deleteBooking = async (bookingId: string) => {
  await deleteDoc(doc(db, "bookings", bookingId));
};

// ============================================================
// USERS (Admin only)
// ============================================================

export const getUsers = async (): Promise<any[]> => {
  try {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("getUsers:", err.message);
    return [];
  }
};

export const getUserById = async (uid: string): Promise<any | null> => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as any;
    return null;
  } catch {
    return null;
  }
};

export const setUserPin = async (uid: string, pinHash: string) => {
  await updateDoc(doc(db, "users", uid), { 
    pin: pinHash,
    lastPinChange: Date.now()
  });
};

export const updateUserDoc = async (uid: string, data: Partial<{ displayName: string; email: string; phone: string }>) => {
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
};

export const deleteUserDoc = async (uid: string) => {
  try {
    await deleteDoc(doc(db, "users", uid));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("deleteUserDoc:", err.message);
    throw err;
  }
};

// ============================================================
// CONTACT MESSAGES (Admin only)
// ============================================================

export const getMessages = async (): Promise<any[]> => {
  try {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("getMessages:", err.message);
    return [];
  }
};

export const createContactMessage = async (data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) => {
  return await addDoc(collection(db, "messages"), {
    ...data,
    status: "UNREAD",
    createdAt: serverTimestamp(),
  });
};

export const updateMessageStatus = async (id: string, status: "UNREAD" | "READ" | "REPLIED") => {
  await updateDoc(doc(db, "messages", id), { status, updatedAt: serverTimestamp() });
};

export const deleteMessage = async (id: string) => {
  await deleteDoc(doc(db, "messages", id));
};

// ============================================================
// REVIEWS
// ============================================================

export const createReview = async (userId: string, authorName: string, serviceId: string, rating: number, comment: string) => {
  return await addDoc(collection(db, "reviews"), {
    userId,       // Firebase Auth UID (for ownership / duplicate prevention)
    authorName,   // Display name for public view
    serviceId,
    rating,
    comment,
    createdAt: serverTimestamp(),
  });
};

export const getReviews = async (serviceId?: string): Promise<any[]> => {
  try {
    const ref = collection(db, "reviews");
    const snap = await getDocs(ref);
    let results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
    if (serviceId) {
      results = results.filter((r) => r.serviceId === serviceId);
    }
    results.sort((a, b) => {
      const aTime = a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.seconds ?? 0;
      return bTime - aTime;
    });
    return results;
  } catch (e: unknown) {
    console.error("getReviews error:", e);
    return [];
  }
};

export const deleteReview = async (id: string) => {
  await deleteDoc(doc(db, "reviews", id));
};

export const updateReview = async (id: string, data: Partial<{ rating: number; comment: string }>) => {
  await updateDoc(doc(db, "reviews", id), { ...data, updatedAt: serverTimestamp() });
};

export const getReviewsByUserId = async (userId: string) => {
  try {
    const q = query(collection(db, "reviews"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("getReviewsByUserId:", e);
    return [];
  }
};
