import { useCallback, useState } from "react";

export type Position = {
  lat: number;
  lng: number;
};

export default function useLocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    setError(null);

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
  }, []);

  return { position, error, loading, requestLocation };
}
