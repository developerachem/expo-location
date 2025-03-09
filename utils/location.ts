export const fetchAddress = async (latitude: number, longitude: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
  
    try {
      const response = await fetch(url);
      const json = await response.json();
  
      if (json && json.display_name) {
        return (
          json.address.quarter +
          " " +
          json.address.suburb +
          ", " +
          json.address.city +
          ", " +
          json.address.country
        ); // Full address
      } else {
        return "Address not found";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error retrieving address";
    }
  };
  