import { Alert } from "@/models/alert.model";
import { regionMetaData } from "@/models/regionMetaData.model";

interface Coordinates {
  lat: number;
  lon: number;
}
export async function PredictDisasterIntensity(geoCode: Coordinates) {
  try {
    const currentWeather_URI = `https://api.openweathermap.org/data/2.5/weather?lat=${geoCode.lat}&lon=${geoCode.lon}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;
    const rainfall_URI = `https://api.open-meteo.com/v1/forecast?latitude=${geoCode.lat}&longitude=${geoCode.lon}&daily=precipitation_sum&past_days=6&forecast_days=0`;
    const seaSurface_URI = `https://marine-api.open-meteo.com/v1/marine?latitude=${geoCode.lat}&longitude=${geoCode.lon}&current=sea_surface_temperature`;

    const [currentWeatherData, rainfallData, seaSurfaceData] =
      await Promise.all([
        fetch(currentWeather_URI).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch current weather data");
          return res.json();
        }),
        fetch(rainfall_URI).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch rainfall data");
          return res.json();
        }),
        fetch(seaSurface_URI).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch sea surface data");
          return res.json();
        }),
      ]);

      if (
        Object.keys(currentWeatherData).length === 0 ||
        Object.keys(rainfallData).length === 0 ||
        Object.keys(seaSurfaceData).length === 0
      ) {
        throw new Error("Incomplete climate data received");
      }

    const precipitationArray: number[] = rainfallData.daily?.precipitation_sum ?? [];

    const climateData = {
      humidity: currentWeatherData.main?.humidity,
      temperature: currentWeatherData.main?.temp,
      airPressure: currentWeatherData.main?.pressure,
      windSpeed: currentWeatherData.wind?.speed,
      rainfall: currentWeatherData.rain?.["1h"] || 0,
      rainfall_3d_sum: precipitationArray
        .slice(-3)
        .reduce((a: number, b: number) => a + b, 0),
      cumulative_rainfall: precipitationArray.reduce(
        (a: number, b: number) => a + b,
        0
      ),
      seaSurfaceTemp: seaSurfaceData.current?.sea_surface_temperature,
    };

    // pass this collected climateData to model and output will be 3 intensity values for flood, cyclone, rainfall

    // region information for which the intensity is going to be calculated
    const regionData = await regionMetaData.findOne({
      "coordinates.lat": geoCode.lat,
      "coordinates.lon": geoCode.lon,
    });
    if (!regionData) {
      throw new Error("Region metadata not found in database");
    }

    const alertObj = await Alert.create({
      climateMetaData: climateData,
      regionMetaDataId: regionData._id,
      intensityPredicted: { flood: "Normal", cyclone: "High", rainfall: "Low" }, // replace this obj with actulal predicted output
    });

    if (!alertObj) {
      throw new Error("Failed to create Alert record");
    }

    const successObj = {
      intensity: alertObj.intensityPredicted,
      status: true,
    };

    return successObj;
  } catch (error) {
    let errMsg = error instanceof Error ? error.message : "unexpected error";
    return { err: errMsg, status: false };
  }
}
