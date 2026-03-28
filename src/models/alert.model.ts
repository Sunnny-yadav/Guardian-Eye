import mongoose from "mongoose";

/**
 * @subschema climateDetailsSchema
 * @description Defines the current climatic data fields required to predict the intensity of disaster
 */

const climateDetailsSchema = new mongoose.Schema(
  {
    humidity: { type: Number, min: 0, max: 100 },
    temperature: { type: Number },
    airPressure: { type: Number, min: 800, max: 1200 },
    windSpeed: { type: Number, min: 0 },
    seaSurfaceTemp: { type: Number },
    rainfall: { type: Number, min: 0 },
    rainfall_3d_sum: { type: Number, min: 0 },
  },
  { _id: false }
);

/**
 * @subschema predictedIntensity
 * @description Predicted intensity of flood, cyclone and rainfall
 */

const IntensityDetails = new mongoose.Schema({
  rainfall:{
    type: String,
      enum: [
        "extreme low",
        "High",
        "Low",
        "Moderate",
        "Normal",
        "Severely High",
        "Very High",
        "Very Low",
      ],
  },
  flood:{
    type: String,
      enum: [
        "extreme low",
        "High",
        "Low",
        "Moderate",
        "Normal",
        "Severely High",
        "Very High",
        "Very Low",
      ],
  },
  cyclone:{
    type: String,
      enum: [
        "extreme low",
        "High",
        "Low",
        "Moderate",
        "Normal",
        "Severely High",
        "Very High",
        "Very Low",
      ],
  },
})

/**
 * @model Alert
 * @description Stores disaster alert data including climate, physical metrics, intensity, and region reference
 */

const alertSchema = new mongoose.Schema(
  {
    climateMetaData: {
      type: climateDetailsSchema,
      required: true,
    },
    
    intensityPredicted: {
      type:IntensityDetails
    },

    regionMetaDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "regionMetaData",
    },

    disasterId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "DisasterEvent"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Alert =
  mongoose.models.Alert || mongoose.model("Alert", alertSchema);
