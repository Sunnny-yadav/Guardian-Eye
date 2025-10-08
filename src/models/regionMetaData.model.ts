import mongoose from "mongoose";

/**
 * @model regionMetaData
 * @description Stores static region data including coordinates, taluka, region, population density, and total population
 */
const regionMetaDataSchema = new mongoose.Schema(
  {
    coordinates: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },

    taluka: {
      type: String,
      required: true,
      trim: true,
    },

    region: {
      type: String,
      required: true,
      trim: true,
    },

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
