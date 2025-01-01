import mongoose from "mongoose";

// User Schema
const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Temporary User Schema for Unverified Users
const tempUserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    verificationExpires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// User Information Schema
const userInformationSchema = mongoose.Schema(
  {
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    category: {
      type: String,
      required: true,
    },
    cnicFrontUrl: {
      type: String,
      required: true,
    },
    cnicBackUrl: {
      type: String,
      required: true,
    },
    educationLevel: {
      type: String,
      required: true,
    },
    institute: {
      type: String,
      required: true,
    },
    percentage: {
      type: String,
      required: true,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    degreeUrl: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    organization: {
      type: String,
    },
    designation: {
      type: String,
    },
  },

  { timestamps: true }
);

// User Application Schema
const userApplicationSchema = mongoose.Schema(
  {
    cnic: {
      type: String,
      required: true,
    },
    trade: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      default: "PSEB",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
  },
  { timestamps: true }
);

const TempOtpSchema = mongoose.Schema(
  {
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    resetToken: {
      type: String,
      required: true,
    },
    resetExpires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const TempUser = mongoose.model("TempUser", tempUserSchema);
const UserInformation = mongoose.model(
  "UserInformation",
  userInformationSchema
);
const TempOtp = mongoose.model("TempOtp", TempOtpSchema);
const Course = mongoose.model("UserApplications", userApplicationSchema);

export { User, TempUser, UserInformation, Course, TempOtp };
