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
  orderBy
} from "firebase/firestore";
import { db } from "./config";

// --- SERVICES ---
export const getServices = async () => {
  try {
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error("Error fetching services:", error.message);
    throw new Error(error.message);
  }
};

export const createService = async (data: { title: string, description: string, priceCFA: number }) => {
  try {
    return await addDoc(collection(db, "services"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error("Error creating service:", error.message);
    throw new Error(error.message);
  }
};

// --- BOOKINGS ---
export const getBookings = async (userId?: string) => {
  try {
    const bookingsRef = collection(db, "bookings");
    // Removed orderBy when using where to avoid Composite Index errors on Spark Plan
    const q = userId 
      ? query(bookingsRef, where("userId", "==", userId))
      : query(bookingsRef, orderBy("createdAt", "desc"));
      
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    
    // Sort client-side for userId queries to bypass index requirement
    if (userId) {
      data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
    }
    
    return data;
  } catch (error: any) {
    console.error("Error fetching bookings:", error.message);
    throw new Error(error.message);
  }
};

export const createBooking = async (userId: string, serviceId: string) => {
  try {
    return await addDoc(collection(db, "bookings"), {
      userId,
      serviceId,
      status: "PENDING",
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error("Error creating booking:", error.message);
    throw new Error(error.message);
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status });
  } catch (error: any) {
    console.error("Error updating booking:", error.message);
    throw new Error(error.message);
  }
};

// --- REVIEWS ---
export const createReview = async (userId: string, serviceId: string, rating: number, comment: string) => {
  try {
    return await addDoc(collection(db, "reviews"), {
      userId,
      serviceId,
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error("Error creating review:", error.message);
    throw new Error(error.message);
  }
};
