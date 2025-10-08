import mongoose from "mongoose";

/**
 * @subschema PredictedResources
 * @description Defines resource requirements for disaster response i.e predicted values
 */

const predictedResourcesSchema = new mongoose.Schema(
  {
    rescueBoats: {
      type: Number,
      min: 0,
      required: true,
    },
    ambulances: {
      type: Number,
      min: 0,
      required: true,
    },
    humanRescueTeams: {
      type: Number,
      min: 0,
      required: true,
    },
    shelters: {
      count: {
        type: Number,
        min: 0,
        required: true,
      },
      capacity: {
        type: Number,
        min: 0,
        required: true,
      },
    },
    civiliansToEvacuate: {
      type: Number,
      min: 0,
      required: true,
    },
    supplyTrucks: {
      type: Number,
      min: 0,
      required: true,
    },
    drones: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { _id: false }
); // no need to create extra _id for sub-schema

/**
 * @model ResourcePlan
 * @description Stores predicted resource requirements linked to a specific alert.
 */

const resourcePlanSchema = new mongoose.Schema(
  {
    predictedResources: {
      type: predictedResourcesSchema,
      required: true,
    },
    alertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alert",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const ResourcePlan =
  mongoose.models.ResourcePlan ||
  mongoose.model("ResourcePlan", resourcePlanSchema);
