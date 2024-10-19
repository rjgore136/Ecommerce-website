import User from "../../models/User.js";
import bycrypt from "bcryptjs";

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
