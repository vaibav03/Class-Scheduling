import mongoose from "mongoose";

const role = {
  admin: "admin",
  teacher: "teacher",
  student: "student"
}
 const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: [role.admin, role.teacher, role.student] },
  refreshToken: { type: String }
});

export const user = new mongoose.model("user",userSchema)
