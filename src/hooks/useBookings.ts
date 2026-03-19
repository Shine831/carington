"use client";

import { useState, useEffect, useCallback } from "react";
import { getBookings, createBooking, updateBookingStatus } from "@/lib/firebase/db";
import { useAuth } from "./useAuth";

export function useBookings() {
  const { user, role } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Admins see all bookings, clients see only their own
      const targetUserId = role === "ADMIN" ? undefined : user.uid;
      const data = await getBookings(targetUserId);
      setBookings(data);
      setError(null);
    } catch (err: any) {
      console.error("useBookings Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Expose mutation wrappers allowing for an immediate refetch
  const submitBooking = async (serviceId: string) => {
    if (!user) throw new Error("Must be logged in to book.");
    try {
      await createBooking(user.uid, serviceId);
      await fetchBookings();
    } catch (err: any) {
      throw err;
    }
  };

  const updateStatus = async (bookingId: string, status: string) => {
    if (role !== "ADMIN") throw new Error("Unauthorized to change status.");
    try {
      await updateBookingStatus(bookingId, status);
      await fetchBookings();
    } catch (err: any) {
      throw err;
    }
  };

  return { bookings, loading, error, refetch: fetchBookings, submitBooking, updateStatus };
}
