
interface intensityInputType {
    humidity: number,
    temperature: number,
    airPressure: number,
    windSpeed: number,
    rainfall: number,
    rainfall_3d_sum: number,
    cumulative_rainfall: number,
    seaSurfaceTemp: number,
  };
  
export const  intensityInputFormater = (inputVal: intensityInputType)=>{
    const {humidity, temperature, airPressure, windSpeed, rainfall, rainfall_3d_sum, cumulative_rainfall, seaSurfaceTemp} = inputVal;

    const formatedInput = {
        "Rainfall_mm": rainfall,
        "Rainfall_3d_sum_mm": rainfall_3d_sum,
        "Cumulative_Rainfall_mm":cumulative_rainfall ,
        "Wind_Speed_kmh": windSpeed,
        "Air_Pressure_hPa": airPressure,
        "Humidity_percent": humidity,
        "Temperature_celsius": temperature,
        "Sea_Surface_Temperature_celsius": seaSurfaceTemp 
    };

    return formatedInput;
    
};