import mongoose from "mongoose";

/**
 * @model regionMetaData
 * @description Stores static region data including pointNumber,point coordinates, taluka, regionName, population density, total population and the neighboruing node metrix for future use i.e evacuation route estimation
 */
const regionMetaDataSchema = new mongoose.Schema(
  {
    point: {
      type: String,
      required: true,
    },

    coordinates: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },

    regionName: {
      type: String,
      required: true,
      trim: true,
    },

    taluka: {
      type: String,
      required: true,
    },

    neighboringNodes: [
      {
        type: Number,
        required: true,
      },
    ],

    populationDensity: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPopulation: {
      type: Number,
      required: true,
      min: 0,
    },

    regionArea: {
      type: Number,
      required: true,
    },

    roadDensity: { type: Number , required: true},
    accessibilityIndex: { type: Number , required: true},
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const regionMetaData =
  mongoose.models.regionMetaData ||
  mongoose.model("regionMetaData", regionMetaDataSchema);
