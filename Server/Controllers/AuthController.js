import User from "../Models/userModal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Post from "../Models/postModal.js";
import transporter from "../config/nodemailer.js";

const sendVerificationMail = async (userId, email) => {
  //making a unique link with jwt with 30m expiration
  const token = jwt.sign(
    {
      userId,
      email,
      isVerifying: true,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
  const info = await transporter.sendMail({
    to: email,
    subject: "Account verification:", // Subject line
    html:
      "<h3>Please click on the below link to Verify your account </h3>" +
      `<a style='font-weight:bold;' href=http://localhost:3000/verify?account=${userId}&token=${token}>Verify account</a>`,
  });
  console.log("mail send success");
  return info;
};

export const registerUser = async (req, res) => {
  const { email, username, password, firstName, lastName } = req.body;
  if (!(email && username && password && firstName && lastName)) {
    return res.status(401).json({ message: "all filed are required" });
  }
  try {
    const isUserExist = await User.findOne({ username });
    if (isUserExist) {
      return res
        .status(401)
        .json({ message: "This username is already exist" });
    }
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(401).json({ message: "this email is already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
    });
    await user.save();

    //creating verification token
    const info = await sendVerificationMail(user.id, user.email);
    
    console.log("Message sent: %s", info.messageId);
    user.password = undefined;
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        userId: user._id,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    //cookie section
    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    };
    res.status(201).cookie("token", token, options).json({
      user,
      token,
      message: "account created and verification mail send successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(401).json({ message: "all filed are required" });
  }
  try {
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(400).json({ message: "Invalid credential" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credential" });
    }
    const totalPosts = await Post.find({ userId: user._id }).countDocuments();
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        userId: user._id,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //cookie section
    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    };
    user.totalPosts = totalPosts;
    user.password = undefined;
    res.status(200).cookie("token", token, options).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const { userId, token } = req.body;
    if (!(userId && token)) {
      return res
        .status(401)
        .json({ message: "verification link is not valid" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.isVerified) {
      return res.status(401).json({ message: "user already verified" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!(decoded.isVerifying && userId === decoded.userId)) {
      return res
        .status(401)
        .json({ message: "verification link is not valid" });
    }

    //updating verified status
    user.isVerified = true;
    await user.save();
    //generating new jwt token with to update user verification status
    const newToken = jwt.sign(
      {
        username: user.username,
        email: user.email,
        userId: user._id,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    //cookie section
    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    };

    return res.status(201).cookie("token", newToken, options).json({
      message: "account verified successfully",
      success: true,
      token: newToken,
    });
  } catch (err) {
    if (err.expiredAt) {
      return res.json(401).json({ message: "verification link expired" });
    }
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const resendVerification = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(401).json({ message: "userId missing" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  //checking whether the user is already verified or not
  if (user.isVerified) {
    return res.status(401).json({ message: "user already verified" });
  }
  try {
    //sending verification mail
    const info = await sendVerificationMail(userId, user.email);
    console.log("Message sent: %s", info.messageId);
    res
      .status(200)
      .json({ message: "account verification mail send successful" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
    console.log(err);
  }
};
