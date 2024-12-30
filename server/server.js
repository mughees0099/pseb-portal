import {
  Course,
  User,
  TempUser,
  UserInformation,
  TempOtp,
} from "./Model/User.js";
import { SendResetEmail, SendVerificationCode } from "./middleware/Email.js";
import express from "express";
import connectDB from "./DB/db.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const App = express();

App.use(express.json());
App.use(cors());
App.use(cookieParser());

connectDB();

const JWT_SECRET = process.env.JWT_TOKEN;

App.get("/", (req, res) => {
  res.send("Hello World!");
});

App.get("/user/:id", async (req, res) => {
  const user = await User.findOne({ cnic: req.params.id }).select("-password");

  if (user) {
    const userInformation = await UserInformation.findOne({
      cnic: req.params.id,
    });
    if (userInformation) {
      res.status(200).json({ ...user._doc, ...userInformation._doc });
    } else {
      res.status(200).json({ ...user._doc });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

App.post("/user", async (req, res) => {
  try {
    const userInformation = await UserInformation.create(req.body);

    res.status(201).json(userInformation);
  } catch (error) {
    res.status(400).json({ message: "Invalid user data" });
  }
});

App.post("/register", async (req, res) => {
  const { fullName, email, cnic, mobile, password, userName } = req.body;

  try {
    // Check for existing users
    if (await User.findOne({ cnic })) {
      return res.status(400).json({ message: "CNIC already exists" });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (await User.findOne({ mobile })) {
      return res.status(400).json({ message: "Mobile already exists" });
    }

    if (await TempUser.findOne({ cnic })) {
      await TempUser.deleteOne({ cnic });
    }
    if (await TempUser.findOne({ email })) {
      await TempUser.deleteOne({ email });
    }
    if (await TempUser.findOne({ mobile })) {
      await TempUser.deleteOne({ mobile });
    }

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Temporarily store the user details
    const tempUser = {
      fullName,
      email,
      cnic,
      mobile,
      password: hashedPassword,
      userName,
      verificationCode,
      verificationExpires: Date.now() + 10 * 60 * 1000, // Valid for 10 minutes
    };

    // Use a temporary storage or a dedicated model (e.g., TempUser)
    await TempUser.create(tempUser);

    // Send the verification email
    await SendVerificationCode(email, verificationCode);

    res.status(201).json({
      message: "Registration initiated. Verification code sent to email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

App.post("/verify-otp/:email", async (req, res) => {
  const { otp } = req.body;

  try {
    // Find the temp user
    const tempUser = await TempUser.findOne({ email: req.params.email });

    if (!tempUser) {
      return res.status(404).json({ message: "No registration found." });
    }

    if (tempUser.verificationCode == otp) {
      // Create the final user account

      const user = await User.create({
        fullName: tempUser.fullName,
        email: tempUser.email,
        cnic: tempUser.cnic,
        mobile: tempUser.mobile,
        password: tempUser.password,
        userName: tempUser.userName,
        isVerified: true,
      });

      // Delete the temporary user entry
      await TempUser.deleteOne({ email: req.params.email });

      res
        .status(200)
        .json({ message: "Account verified and created successfully." });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

App.post("/signin", async (req, res) => {
  const { cnic, password } = req.body;

  try {
    const user = await User.findOne({ cnic });
    if (!user) {
      return res.status(400).json({ message: "Account not Found." });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(400).json({ message: "Account not verified." });
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res
        .cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          cnic: user.cnic,
          mobile: user.mobile,
          token,
          message: "Login successful",
        });
    } else {
      res.status(400).json({ message: "Invalid CNIC or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

App.post("/forgot-password", async (req, res) => {
  const { cnic } = req.body;

  try {
    const user = await User.findOne({ cnic: cnic });

    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    } else {
      const resetToken = Math.floor(100000 + Math.random() * 900000);
      const resetExpires = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes

      const tempOtp = await TempOtp.findOne({ cnic });
      if (tempOtp) {
        await TempOtp.deleteOne({ cnic: cnic });
      }
      // Store the reset token and expiry in the database
      await TempOtp.create({
        cnic: cnic,
        resetToken: resetToken,
        resetExpires: resetExpires,
      });

      // Send the reset email
      await SendResetEmail(user.email, resetToken);

      res.status(200).json({
        message: "Password reset link sent to email.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

App.post("/course", async (req, res) => {
  try {
    const checkCourse = await Course.find({ cnic: req.body.cnic });
    if (checkCourse.length >= 2) {
      return res
        .status(400)
        .json({ message: "You can't apply for more than 2 courses" });
    }
    if (checkCourse.some((course) => course.trade === req.body.trade)) {
      return res.status(400).json({ message: "Course already exists" });
    }
    const course = await Course.create(req.body);

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: "Invalid course data" });
  }
});

App.get("/course/:id", async (req, res) => {
  try {
    const course = await Course.find({ cnic: req.params.id });
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

App.post("/resetOtp/:cnic", async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    const tempOtp = await TempOtp.findOne({ cnic: req.params.cnic });

    if (!tempOtp) {
      return res.status(404).json({ message: "No reset request found." });
    }

    if (tempOtp.resetToken == otp) {
      // Delete the OTP entry
      await TempOtp.deleteOne({ cnic: req.params.cnic });

      res.status(200).json({ message: "OTP verified successfully." });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

App.patch("/user/:cnic", async (req, res) => {
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate(
      { cnic: req.params.cnic },
      { password: hashedPassword }
    );
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

App.get("/admin", async (req, res) => {
  const user = await Course.find({});

  if (!user) {
    return res.status(404).json({ message: "No applications found." });
  }

  res.status(200).json(user);
});

App.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    const userData = await Promise.all(
      users.map(async (user) => {
        const userInformation = await UserInformation.findOne({
          cnic: user.cnic,
        });
        const courses = await Course.find({ cnic: user.cnic });
        return {
          ...user._doc,
          ...userInformation?._doc,
          courses,
        };
      })
    );
    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

App.get("/courses", async (req, res) => {
  const courses = await Course.find({});
  if (!courses) {
    return res.status(404).json({ message: "No courses found." });
  }

  res.status(200).json(courses);
});

App.patch("/user/:id/:trade", async (req, res) => {
  const {
    fullName,
    email,
    cnic,
    mobile,
    fatherName,
    category,
    cnicFrontUrl,
    cnicBackUrl,
    educationLevel,
    institute,
    percentage,
    isCompleted,
    degreeUrl,
    profileImageUrl,
    status,
    gender,
    dateOfBirth,
    address,
  } = req.body;

  const isCompletedBoolean =
    isCompleted === "Yes" ? true : isCompleted === "No" ? false : isCompleted;

  try {
    // Update User collection
    const user = await User.findOneAndUpdate(
      { cnic },
      {
        $set: {
          fullName,
          email,
          cnic,
          mobile,
        },
      },

      { new: true, runValidators: true, select: "-password" }
    );

    const userInformation = await UserInformation.findOneAndUpdate(
      { cnic },
      {
        $set: {
          fatherName,
          gender,
          category,
          cnicFrontUrl,
          cnicBackUrl,
          educationLevel,
          institute,
          percentage,
          degreeUrl,
          profileImageUrl,
          isCompleted: isCompletedBoolean,
          dateOfBirth,
          address,
        },
      },
      { new: true, runValidators: true }
    );

    const course = await Course.findOneAndUpdate(
      { cnic, trade: req.params.trade },
      {
        $set: {
          trade: req.params.trade,
          status,
          category,
        },
      },
      { new: true, runValidators: true }
    );

    if (user && userInformation && course) {
      res.status(200).json({ message: "User updated successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
});

const PORT = process.env.PORT || 4000;

App.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
