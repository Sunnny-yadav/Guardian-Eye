import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

// User Schema with validations
const userSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team/Organization name is required"],
      trim: true,
      minlength: [3, "Team name must be at least 3 characters"],
      maxlength: [100, "Team name cannot exceed 100 characters"],
    },
    
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    avatar:{
      type: String
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [
        /^[0-9]{10}$/,
        "Phone number must contain 10 digits",
      ],
    },
    location: {
      actual_Address: {
        type: String,
        required: true,
        trim: true,
      },
      captured_Address: {
        type: String,
        required: true,
        trim: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true, 
      },
    },
    rescueBoats: {
      type: Number,
      default: 0,
      min: [0, "Rescue boats cannot be negative"],
    },
    ambulances: {
      type: Number,
      default: 0,
      min: [0, "Ambulances cannot be negative"],
    },
    humanRescueTeamSize: {
      type: Number,
      required: true,
      default: 0,
      min: [10, "Team size cannot be less than 10"],
    },
    supplyTrucks: {
      type: Number,
      required: true,
      default: 0,
      min: [1, "Supply trucks cannot be less than 1"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false
    },
  },
  {
    timestamps: true,
    toJSON:{virtuals: true},
    toObject: { virtuals: true}
  }
);

userSchema.pre("save",async function (next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password: string){
  const status = await bcrypt.compare(password, this.password);
  return status;
};

userSchema.methods.getAccessToken = function (){
  return jwt.sign(
    {
      _id:this._id
    },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
    {
      expiresIn:"1D"
    }
  );
};

export const User = mongoose.models.users ||  mongoose.model("users", userSchema);
