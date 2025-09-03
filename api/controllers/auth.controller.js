import User from "../models/User.js";
import Role from "../models/role.js";
import jwt from "jsonwebtoken"; //importing jsonwebtoken for token generation
import UserToken from "../models/UserToken.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"; //importing bcryptjs for hashing passwords
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

//handler for authentication
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    // Validate required fields
    if (!userName || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const role = await Role.findOne({ role: "User" });

    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password: hashPassword,
      role: role ? role._id : null, // Ensure role is set correctly
    });
    // console.log("Creating user with data:", {
    //   firstName,
    //   lastName,
    //   userName,
    //   email,
    //   password: hashPassword,
    //   role: role ? role._id : null,
    // });
     
    await newUser.save();
    return next(CreateSuccess(200, "User registered successfully"));
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during registration." });
  }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate("role", "role");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin, role: user.role },
            process.env.JWT_SECRET // Use your secret key from environment variables
        );

        // Send token in response
        return res.status(200).json({
            status: 200,
            message: "Login Successful",
            token: token,  // Include the token in the response
            data: user,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).send("Something went wrong");
    }
};

export const registerAdmin = async (req, res, next) => {
  const role = await Role.find({});

  //hashing the password
  const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
  const hashPassword = await bcrypt.hash(req.body.password, salt); // Hash the password

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.username,
    email: req.body.email,
    password: hashPassword,
    isAdmin: true,
    role: role,
  });

  await newUser.save();
  return next(CreateSuccess(200, "Admin Register Successfully"));
};

//reset the password

export const sendEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: { $regex: "^" + email + "$", $options: "i" },
  });

  if (!user) {
    return next(CreateError(404, "User not found"));
  }

  const payload = {
    email: user.email,
  };

  //creating the token and it expires after 5mins
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 300 });
  const newToken = new UserToken({
    userId: user._id,
    token: token,
  });

  //installl the nodemailer package and import it
  const mailTransporter = nodemailer.createTransport({
    service: "nkambijuliusforsuh@gmail.com",
    auth: {
      user: "nkambijuliusforsuh@gmail.com", // Your email address
      pass: "pqys nctk zyio pgud", //the pass created from google apps
    },
  });

  let mailDetails = {
    from: "nkambijuliusforsuh@gmail.com",
    to: email,
    subject: "Reset password",
    html: `<html>
            <head>
                <title>Reset Password</title>
            </head>
            <body>
                <h1>Password Reset Request</h1>
                <p>Dear ${user.userName},</p>
                <p>You have requested to reset your password. Please click the link below to reset your password:</p>
                <a href="${process.env.LIVE_URL}/reset/${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none">Reset Password</a>
                <p>You Have 5 mins to reset this email</p>
                <p>Thank you!</p>
                <p>Best regards, SkillWithBooks</p>
            </body>    
        </html>`,
  };

  mailTransporter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      return next(CreateError(500, "Error sending email"));
    } else {
      await newToken.save();
      return res.status(200).json({
        message: "Email sent successfully",
      });
    }
  });
};

export const resetPassword = async (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return next(CreateError(400, "Invalid or expired token"));
    } else {
      const response = data;
      const user = await User.findOne({
        email: { $regex: "^" + response.email + "$", $options: "i" },
      });
      const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
      const encryptedPassword = await bcrypt.hash(newPassword, salt); // Hash the password
      user.password = encryptedPassword;
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: user },
          { new: true } // Return the updated user
        );
        if (!updatedUser) {
          return next(CreateError(404, "User not found"));
        }
        // Delete the token after successful password reset
        await UserToken.deleteOne({ token: token });
        return res.status(200).json({ message: "Password reset successfully" });
      } catch (error) {
        return next(CreateError(500, "Error updating password"));
      }
    }
  });
};
