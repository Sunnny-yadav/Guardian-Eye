interface resourceInputType {
  point: string;
  populationDensity: number;
  totalPopulation: number;
  regionArea: number;
  roadDensity: number;
  accessibilityIndex: number;
}

export const resourceInputFormater = (inputVal: resourceInputType) => {
  const {
    point,
    populationDensity,
    totalPopulation,
    regionArea,
    roadDensity,
    accessibilityIndex,
  } = inputVal;

  const formatedData = {
    Region: point,
    Population_Density_per_sqkm: populationDensity,
    Total_Population: totalPopulation,
    Road_Density_km_per_sqkm: roadDensity,
    Accessibility_Index: accessibilityIndex,
    Event_Description: "Heavy rainfall warning",
    Historical_Rescue_Boats: 18.0,
    Historical_Ambulances: 20.0,
    Historical_Human_Rescue_Teams: 50.0,
    Historical_Shelters: 23.0,
    Historical_Civilians_Evacuated: 20000.0,
    Historical_Supply_Trucks: 12.0,
    Historical_Drones: 3.0,
    Area: regionArea,
    Population_Density: populationDensity,
  };

  return formatedData;
};
