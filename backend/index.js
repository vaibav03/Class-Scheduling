import express from "express";
import dotnev from "dotenv";
import cors from "cors";
import { mongoconnect } from "./db/mongodb";
import { generateotp , verifyotp } from "./routes/auth";
const app = express();
mongoconnect();
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
const router = express.Router();
dotenv.config();
app.use(cors())
app.use(express.json());

router.get("/generateotp",generateotp);
router.post("/verifyotp",verifyotp);

router.post("/login",login)


router.get("/admin",getAdmin); 