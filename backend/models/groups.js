import mongoose from "mongoose";

const groupSchema  = new mongoose.Schema({
  groupName : {type: String, required: true},
  members : [{email: String, role: String , _id: String}],
  classTimings : [{day : String, startTime : String, endTime : String}],
})

const groups = mongoose.model('groups', groupSchema);
export default groups;