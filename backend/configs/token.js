import jwt from "jsonwebtoken";
export const genToken = async (userId) => {
  try {
    // create token
    let token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token; // must return token
  } catch (error) {
    console.log("token error");
  }
};
