import mongoose from "mongoose";

const role = {
  admin: "admin",
  teacher: "teacher",
  student: "student"
}
const userSchema = new mongoose.Schema({
  email: { String, required: true, unique: true },
  password: String,
  role: [role.admin, role.teacher, role.student],
});