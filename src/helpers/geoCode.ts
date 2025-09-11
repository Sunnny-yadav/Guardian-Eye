// this function gives the [lat, long] for user provided addresss

export async function getCoordinates(address: string) {
  try {
    if (!process.env.NOMINATIM_URI) {
      throw new Error("geoCode.ts ::OpenStreetMap Nominatim key not found");
    }
    const response = await fetch(
      `${process.env.NOMINATIM_URI}${encodeURIComponent(address)}`
    );

    if (!response.ok) {
      throw new Error(`Nominatim request failed: ${response.status}`);
    }
    const data = await response.json();

    if (data.length === 0) {
      throw new Error("no data found for the given address");
    }
    return data[0];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      if (error instanceof Error) {
        console.log("getcoordinates() -> ", error.message);
      } else {
        console.log("getCoordinates() -> ", error);
      }
    }

    return null;
  }
}
