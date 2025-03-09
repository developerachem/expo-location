import { fetchAddress } from "@/utils/location";
import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);

  // * Function to fetch the current location
  const pickCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError(
          "Permission to access location was denied. Please go to settings and give location access."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      setLocation(currentLocation);
      setLocationError("");
    } catch (error) {
      setLocationError("An error occurred while fetching location.");
    } finally {
      setLoading(false);
    }
  };

  // * Fetch location on mount
  useEffect(() => {
    pickCurrentLocation();
  }, []);

  // * Fetch address on location change
  useEffect(() => {
    const fetchCustomerAddress = async () => {
      if (location?.coords?.latitude && location?.coords?.longitude) {
        setIsLoading(true);
        const fetchedAddress = await fetchAddress(
          location.coords.latitude,
          location.coords.longitude
        );
        setAddress(fetchedAddress);
        setIsLoading(false);
      }
    };
    fetchCustomerAddress();
  }, [location]);

  // * Memoize location to prevent unnecessary renders
  const memorizedLocation = useMemo(() => location, [location]);

  // * Return the location and address
  return {
    location: memorizedLocation,
    locationError,
    loading,
    pickCurrentLocation,
    address: isLoading ? "Loading..." : address,
  };
}
