import groups from "../models/groups.js";


export async function getGroups(req, res){
   try{
    const {email} = req.body;
    const groupsOfTeacher = groups.find({ "members.email" : email });
   return res.status(200).json({groups: groupsOfTeacher})  
   }catch(e){
    console.log(e)
    return res.status(500).json({"message" : "Internal server error"})
   }
}
export async function addClass(){
  try{
    const { classTimings , _id } = req.body;
    const group = groups.updateOne({_id : _id}, { $push : { classTimings : classTimings }});
    return res.status(200).json({"message" : "Class added successfully"})
  }catch(e){
    console.log(e)
    return res.status(500).json({"message" : "Internal server error"})
  }    
}

export async function removeTiming(){
  try{
    const { classTimings , _id } = req.body;
    const group = groups.updateOne({_id : _id}, { $pull : { classTimings : classTimings }});
    return res.status(200).json({"message" : "Class cancelled successfully"})
  }catch(e){
    console.log(e)
    return res.status(500).json({"message" : "Internal server error"})
  }
}

export async function cancelClass(){
  const { classTimings , _id } = req.body;
  const group = groups.findOne({_id})
  
}