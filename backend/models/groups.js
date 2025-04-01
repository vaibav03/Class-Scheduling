import mongoose from "mongoose";

const groupSchema  = new mongoose.Schema({
  teacher : String,
  students : [String],
  classTimings : [{day : String, startTime : String, endTime : String}],
  subject : String
})

const groups = mongoose.model('groups', groupSchema);
export default groups;