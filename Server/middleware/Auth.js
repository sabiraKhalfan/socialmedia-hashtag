import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.cookies["token"]
    ? req.cookies["token"]
    : req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "no token found", expired: true });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "account not verified", unverified: true });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.expiredAt) {
      return res.status(401).json({ message: "token expired", expired: true });
    }
    console.log(error.message);
    return res.status(401).json({ message: "your not authorized" });
  }
};

export default authenticate;
