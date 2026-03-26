import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import authRouter from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import aiRouter from "./routes/aiRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
dotenv.config();

let port = process.env.PORT;
let app = express();

app.use(express.json());
app.use(cookieParser());
// corse to connect frontend with backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
// routes path
app.use("/api/auth", authRouter); // route for Auth
app.use("/api/user", userRouter); // route for user
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRouter);  
app.use("/api/ai", aiRouter);
app.use("/api/review", reviewRouter);
// main route
app.get("/", (req, res) => {
  res.send("Hello From Server");
});

// port
app.listen(port, () => {
  console.log("Server Started");
  connectDb();
});
