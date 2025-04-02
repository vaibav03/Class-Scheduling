import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { mongoconnect } from "./db/mongodb.js";
import cookieParser from "cookie-parser";
import { sendOTP, verifyOTP } from "./controllers/otpController.js"
import { verifyToken } from "./middleware/authmiddleware.js";
import { refresh, login } from "./routes/auth.js";
import { getUsers, writeGroups , deleteGroups} from "./routes/admin.js";

const app = express();
mongoconnect();
app.listen(5000, () => {
  console.log("server is running on port 5000");
});

const router = express.Router();
dotenv.config();
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Middleware running")
  next();
})
app.use(router)

router.post("/generateotp", sendOTP);
router.post("/verifyotp", verifyOTP);
router.get("/refresh", refresh);
router.post("/login", login)


router.get("/admin", getUsers);
router.post("/writeGroups", writeGroups);
router.post("/deleteGroups", deleteGroups)
// router.get("/student",getClasses)


// router.get("/teacher",)