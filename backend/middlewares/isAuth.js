import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
  try {
    //  get token from cookies
    let { token } = req.cookies;
    // is token not present
    if (!token) {
      return res.status(400).json({ message: "user doesn't have token" });
    }
    // if token present then verify it
    let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    // if token was not verified
    if (!verifyToken) {
      return res.status(400).json({ message: "user doesn't have valid token" });
    }
    // if verified then store it as userID
    req.userId = verifyToken.userId;
    // handle work to next middleware
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `is auth error ${error}` });
  }
};
export default isAuth;
