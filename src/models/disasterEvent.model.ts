import mongoose from "mongoose";

/**
 * @model DisasterEvent
 * @description Stores information about disaster events
 */
const disasterEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  isBroadCasted: {
    type: Boolean,
    default: false
  },

  // some more fields can be added here like name of publisher, etc 
}, {
  timestamps: true, // automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const DisasterEvent = mongoose.models.DisasterEvent || mongoose.model("DisasterEvent", disasterEventSchema);
