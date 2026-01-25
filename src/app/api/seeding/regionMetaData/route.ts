import { regionMetaData } from "@/models/regionMetaData.model";
import dbConnect from "@/dbConfig/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/helpers/errorHandeller";

dbConnect();

// Array of 32 regionMetaData documents ready for MongoDB insertMany()
const regionMetaDataDocuments = [
    {
      point: 1,
      coordinates: { lat: 20.51, lon: 86.42 },
      regionName: "Sujanagar",
      taluka: "Kendrapara Sadar",
      neighboringNodes: [2, 3, 4],
      populationDensity: 2225.433931,
      totalPopulation: 158985,
      regionArea: 71.44,
      roadDensity: 0.328499,
      accessibilityIndex: 0.142012
    },
    {
      point: 2,
      coordinates: { lat: 20.51, lon: 86.45 },
      regionName: "Jajpur border",
      taluka: "Kendrapara Sadar",
      neighboringNodes: [1, 4, 15, 25],
      populationDensity: 896.7510858,
      totalPopulation: 158985,
      regionArea: 177.29,
      roadDensity: 0.29288,
      accessibilityIndex: 0.113113
    },
    {
      point: 3,
      coordinates: { lat: 20.51, lon: 86.48 },
      regionName: "Fakirabad",
      taluka: "Kendrapara Sadar",
      neighboringNodes: [11, 19, 4, 1],
      populationDensity: 1962.051092,
      totalPopulation: 158985,
      regionArea: 81.03,
      roadDensity: 0.561669,
      accessibilityIndex: 0.14287
    },
    {
      point: 4,
      coordinates: { lat: 20.51, lon: 86.51 },
      regionName: "Purusottampur",
      taluka: "Kendrapara Sadar",
      neighboringNodes: [1, 2, 3, 15],
      populationDensity: 3112.470634,
      totalPopulation: 158985,
      regionArea: 51.08,
      roadDensity: 0.642416,
      accessibilityIndex: 0.16199
    },
    {
      point: 5,
      coordinates: { lat: 20.51, lon: 86.54 },
      regionName: "Ayaba",
      taluka: "Kendrapara Sadar",
      neighboringNodes: [6, 8, 31, 7, 24, 29],
      populationDensity: 2971.126892,
      totalPopulation: 158985,
      regionArea: 53.51,
      roadDensity: 1.359206,
      accessibilityIndex: 0.106629
    },
    {
      point: 6,
      coordinates: { lat: 20.51, lon: 86.57 },
      regionName: "Badajaria",
      taluka: "Pattamundai",
      neighboringNodes: [8, 5, 29],
      populationDensity: 8524.590164,
      totalPopulation: 182000,
      regionArea: 21.35,
      roadDensity: 1.171049,
      accessibilityIndex: 0.149118
    },
    {
      point: 7,
      coordinates: { lat: 20.51, lon: 86.6 },
      regionName: "Nayakot",
      taluka: "Pattamundai",
      neighboringNodes: [5, 14, 13, 24],
      populationDensity: 2135.899542,
      totalPopulation: 182000,
      regionArea: 85.21,
      roadDensity: 0.51846,
      accessibilityIndex: 0.105486
    },
    {
      point: 8,
      coordinates: { lat: 20.51, lon: 86.63 },
      regionName: "Saanta pur",
      taluka: "Pattamundai",
      neighboringNodes: [30, 31, 5, 6],
      populationDensity: 6361.412094,
      totalPopulation: 182000,
      regionArea: 28.61,
      roadDensity: 1.765624,
      accessibilityIndex: 0.088019
    },
    {
      point: 9,
      coordinates: { lat: 20.54, lon: 86.42 },
      regionName: "jajpur road",
      taluka: "kendrapara sadar",
      neighboringNodes: [10, 12, 11, 19, 17],
      populationDensity: 5253.965631,
      totalPopulation: 158985,
      regionArea: 30.26,
      roadDensity: 1.599058,
      accessibilityIndex: 0.124247
    },
    {
      point: 10,
      coordinates: { lat: 20.54, lon: 86.45 },
      regionName: "Trilochanpur",
      taluka: "Kendrapara",
      neighboringNodes: [12, 22, 21, 18, 17, 9],
      populationDensity: 7647.186147,
      totalPopulation: 158985,
      regionArea: 20.79,
      roadDensity: 3.053516,
      accessibilityIndex: 0.111453
    },
    {
      point: 11,
      coordinates: { lat: 20.54, lon: 86.48 },
      regionName: "Itipur",
      taluka: "Nikirai",
      neighboringNodes: [12, 9, 19, 3],
      populationDensity: 888.0669194,
      totalPopulation: 67946,
      regionArea: 76.51,
      roadDensity: 0.465129,
      accessibilityIndex: 0.138706
    },
    {
      point: 12,
      coordinates: { lat: 20.54, lon: 86.51 },
      regionName: "Panturi",
      taluka: "Pattamundai",
      neighboringNodes: [20, 22, 10, 9, 11],
      populationDensity: 821.2625784,
      totalPopulation: 182000,
      regionArea: 221.61,
      roadDensity: 0.232584,
      accessibilityIndex: 0.125232
    },
    {
      point: 13,
      coordinates: { lat: 20.54, lon: 86.54 },
      regionName: "Dihapada",
      taluka: "Pattamundai",
      neighboringNodes: [14, 16, 19, 15, 24, 7],
      populationDensity: 4717.470192,
      totalPopulation: 182000,
      regionArea: 38.58,
      roadDensity: 2.1555,
      accessibilityIndex: 0.094205
    },
    {
      point: 14,
      coordinates: { lat: 20.54, lon: 86.57 },
      regionName: "Khadianta",
      taluka: "Pattamundai",
      neighboringNodes: [13, 7, 18, 17, 16],
      populationDensity: 7259.672916,
      totalPopulation: 182000,
      regionArea: 25.07,
      roadDensity: 3.045967,
      accessibilityIndex: 0.099987
    },
    {
      point: 15,
      coordinates: { lat: 20.54, lon: 86.6 },
      regionName: "Osangara",
      taluka: "Pattamundai",
      neighboringNodes: [13, 19, 15, 2, 25, 24],
      populationDensity: 1723.484848,
      totalPopulation: 182000,
      regionArea: 105.6,
      roadDensity: 0.778276,
      accessibilityIndex: 0.056505
    },
    {
      point: 16,
      coordinates: { lat: 20.54, lon: 86.63 },
      regionName: "Mulagain",
      taluka: "Pattamundai",
      neighboringNodes: [14, 13, 17, 19],
      populationDensity: 20357.94183,
      totalPopulation: 182000,
      regionArea: 8.94,
      roadDensity: 11.139251,
      accessibilityIndex: 0.04502
    },
    {
      point: 17,
      coordinates: { lat: 20.57, lon: 86.42 },
      regionName: "Jamara",
      taluka: "Nikirai",
      neighboringNodes: [18, 10, 9, 19, 16, 14],
      populationDensity: 4110.46582,
      totalPopulation: 67946,
      regionArea: 16.53,
      roadDensity: 8.643103,
      accessibilityIndex: 0.051108
    },
    {
      point: 18,
      coordinates: { lat: 20.57, lon: 86.45 },
      regionName: "Palakana",
      taluka: "Nikirai",
      neighboringNodes: [31, 32, 21, 10, 17, 14],
      populationDensity: 2958.032216,
      totalPopulation: 67946,
      regionArea: 22.97,
      roadDensity: 3.787719,
      accessibilityIndex: 0.084301
    },
    {
      point: 19,
      coordinates: { lat: 20.57, lon: 86.48 },
      regionName: "Bharsing",
      taluka: "Pattamundai",
      neighboringNodes: [16, 17, 9, 11, 3, 15, 13],
      populationDensity: 6801.195815,
      totalPopulation: 182000,
      regionArea: 26.76,
      roadDensity: 4.192676,
      accessibilityIndex: 0.083025
    },
    {
      point: 20,
      coordinates: { lat: 20.57, lon: 86.51 },
      regionName: "Pattamundai",
      taluka: "Pattamundai",
      neighboringNodes: [30, 32, 21, 22, 12],
      populationDensity: 854.8614373,
      totalPopulation: 182000,
      regionArea: 212.9,
      roadDensity: 0.177094,
      accessibilityIndex: 0.190927
    },
    {
      point: 21,
      coordinates: { lat: 20.57, lon: 86.54 },
      regionName: "Gandakul",
      taluka: "Pattamundai",
      neighboringNodes: [32, 20, 22, 10, 18],
      populationDensity: 12330.62331,
      totalPopulation: 182000,
      regionArea: 14.76,
      roadDensity: 2.611023,
      accessibilityIndex: 0.178199
    },
    {
      point: 22,
      coordinates: { lat: 20.57, lon: 86.57 },
      regionName: "College Rd, Pattamundai",
      taluka: "Pattamundai",
      neighboringNodes: [20, 12, 10, 21],
      populationDensity: 11023.62205,
      totalPopulation: 182000,
      regionArea: 16.51,
      roadDensity: 2.159158,
      accessibilityIndex: 0.140771
    },
    {
      point: 23,
      coordinates: { lat: 20.57, lon: 86.6 },
      regionName: "narendrapur",
      taluka: "Marshaghai",
      neighboringNodes: [24, 26],
      populationDensity: 583.9704136,
      totalPopulation: 108163,
      regionArea: 185.22,
      roadDensity: 0.116632,
      accessibilityIndex: 0.176009
    },
    {
      point: 24,
      coordinates: { lat: 20.57, lon: 86.63 },
      regionName: "Malipur",
      taluka: "Pattamundai",
      neighboringNodes: [29, 5, 7, 15, 25, 23],
      populationDensity: 1189.076179,
      totalPopulation: 182000,
      regionArea: 153.06,
      roadDensity: 0.612166,
      accessibilityIndex: 0.098812
    },
    {
      point: 25,
      coordinates: { lat: 20.6, lon: 86.42 },
      regionName: "DhumatSasan",
      taluka: "Pattamundai",
      neighboringNodes: [26, 24, 15],
      populationDensity: 1191.645387,
      totalPopulation: 182000,
      regionArea: 152.73,
      roadDensity: 0.342441,
      accessibilityIndex: 0.092057
    },
    {
      point: 26,
      coordinates: { lat: 20.6, lon: 86.45 },
      regionName: "Indupur",
      taluka: "Nikirai",
      neighboringNodes: [23, 25],
      populationDensity: 158.7152534,
      totalPopulation: 67946,
      regionArea: 428.1,
      roadDensity: 0.054823,
      accessibilityIndex: 0.122982
    },
    {
      point: 27,
      coordinates: { lat: 20.6, lon: 86.48 },
      regionName: "Dakhina",
      taluka: "Pattamundai",
      neighboringNodes: [30],
      populationDensity: 0,
      totalPopulation: 182000,
      regionArea: 0,
      roadDensity: 0,
      accessibilityIndex: 0.095027
    },
    {
      point: 28,
      coordinates: { lat: 20.6, lon: 86.51 },
      regionName: "Musadia",
      taluka: "Pattamundai",
      neighboringNodes: [29],
      populationDensity: 17105.26316,
      totalPopulation: 182000,
      regionArea: 10.64,
      roadDensity: 0.355705,
      accessibilityIndex: 0.264222
    },
    {
      point: 29,
      coordinates: { lat: 20.6, lon: 86.54 },
      regionName: "Nilakanthapur",
      taluka: "Pattamundai",
      neighboringNodes: [28, 8, 6, 5, 24],
      populationDensity: 2552.236713,
      totalPopulation: 182000,
      regionArea: 71.31,
      roadDensity: 0.808927,
      accessibilityIndex: 0.112984
    },
    {
      point: 30,
      coordinates: { lat: 20.6, lon: 86.57 },
      regionName: "Pattamundai",
      taluka: "Pattamundai",
      neighboringNodes: [20, 32, 31, 8],
      populationDensity: 2133.896119,
      totalPopulation: 182000,
      regionArea: 85.29,
      roadDensity: 0.440639,
      accessibilityIndex: 0.153795
    },
    {
      point: 31,
      coordinates: { lat: 20.6, lon: 86.6 },
      regionName: "Bilikana",
      taluka: "Pattamundai",
      neighboringNodes: [8, 30, 32, 18, 5],
      populationDensity: 9229.208925,
      totalPopulation: 182000,
      regionArea: 19.72,
      roadDensity: 3.398316,
      accessibilityIndex: 0.11567
    },
    {
      point: 32,
      coordinates: { lat: 20.6, lon: 86.63 },
      regionName: "Palapatana",
      taluka: "Pattamundai",
      neighboringNodes: [30, 20, 21, 18, 31],
      populationDensity: 10687.0229,
      totalPopulation: 182000,
      regionArea: 17.03,
      roadDensity: 4.778174,
      accessibilityIndex: 0.063293
    }
  ];
  

export async function POST(req: NextRequest){
    try {
        const result = await regionMetaData.insertMany(regionMetaDataDocuments);

        return NextResponse.json({message:`Total inserted documents : ${result.length}`},{status: 200})
    } catch (error) {
        return handleApiError(error, "Document seeding failed", "Document seeding failed: api/seeding/regionMetaData");
    }
};

export async function GET(req: NextRequest){
  try {
     await regionMetaData.updateMany(
      {}, // apply to all documents
      [
        {
          $set: {
            point: { $toString: "$point" },
          },
        },
      ]
    );
      return NextResponse.json({message:`documents updated : `},{status: 200})
  } catch (error) {
      return handleApiError(error, "Document seeding failed", "Document seeding failed: api/seeding/regionMetaData");
  }
};
