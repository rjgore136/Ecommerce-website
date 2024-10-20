import User from "../../models/User.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    //validate the input fields
    if (!userName || !email || !password) {
      return res.json({
        success: false,
        message: "Fill in all fields!!",
      });
    }

    //check if user already exists
    const checkUser = await User.findOne({ email });
    console.log(checkUser);

    if (checkUser) {
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }

    //hashing password
    const salt = await bycrypt.genSalt(12);
    const hashedPass = await bycrypt.hash(password, salt);

    //save the new user in database
    const newUser = new User({
      userName,
      email,
      password: hashedPass,
    });
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //validating the inputs
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Fill in all details!!",
      });
    }

    const checkUser = await User.findOne({ email });
    console.log(checkUser);

    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please try again.",
      });
    } else {
      //comparing password with password stored in db
      const isPasswordValid = await bycrypt.compare(
        password,
        checkUser.password
      );
      console.log(isPasswordValid);

      if (isPasswordValid) {
        //create a token
        const token = jwt.sign(
          {
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            userName: checkUser.userName,
          },
          process.env.SECRET_KEY,
          { expiresIn: "1m" }
        );

        //send the token via cookie
        res.cookie("token", token, { httpOnly: true, secure: false }).json({
          success: true,
          message: "Logged in successfully",
          user: {
            email: checkUser.email,
            role: checkUser.role,
            id: checkUser._id,
            userName: checkUser.userName,
          },
        });
      } else {
        return res.json({
          success: false,
          message: "Incorrect Password!! Please try again.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};
