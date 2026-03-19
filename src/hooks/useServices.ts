"use client";

import { useState, useEffect } from "react";
import { getServices } from "@/lib/firebase/db";

export function useServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    getServices()
      .then((data) => {
        if (isMounted) {
          setServices(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("useServices Error:", err);
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { services, loading, error };
}
