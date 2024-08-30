import { useEffect, useState } from "react";
import { LocationType } from "../components/weather/types";

export function useLocation(): [string | null, LocationType] {
  const [location, setLocation] = useState<LocationType>({
    lat: null,
    lon: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const data = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setLocation({ ...data });
        },
        (error) => {
          console.log(error);
          setError("Geolocation not supported or permission denied");
        }
      );
    } else {
      setError("Geolocation not supported by this browser");
    }
  }, []);

  return [error, location];
}
