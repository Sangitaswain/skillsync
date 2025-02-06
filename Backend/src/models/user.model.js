import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    first_Name: {
      type: String,
      required: true,
    },
    last_Name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date, 
      required: true,
    },
    phone_number: {
      type: String, 
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    confirm_Password: {
      type: String,
      required: true,
      minlength: 6,
    },
    state_of_residence: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now
  },
  isVerified: {
      type: Boolean,
      default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  verificationTokenExpire: Date,


  googleId: {
    type: String,
    unique: true,
    },

  googleEmail: {
    type: String,
    unique: true,
    },

    googleDisplayName: {
      type: String,
      trim: true
    },
    googleProfilePicture: {
      type: String,
      trim: true
    },
    authMethod: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
  
  
  
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
