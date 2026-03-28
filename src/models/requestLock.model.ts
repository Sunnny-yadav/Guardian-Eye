import mongoose from "mongoose";

/**
 * @model RequestLock
 * @description Stores request lock data to track user locks on disaster events
 */
const requestLockSchema = new mongoose.Schema(
  {
    isLocked: {
      type: Boolean,
      default: false,
    },

    geoCode:{
      lat:{
        type:Number,
        required:true,
        trim:true
      },
      lon:{
        type:Number,
        required:true,
        trim:true
      }
    },

    disasterEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DisasterEvent",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    _id:true,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const requestLock =
  mongoose.models.RequestLock ||
  mongoose.model("RequestLock", requestLockSchema);


  