import groups from '../models/groups.js';
import { user } from '../models/users.js';

export async function getUsers(req, res){
  try {
    const users = await user.find();
    const groups = await groups.find()
    return res.status(200).json({users, groups});
  } catch(e) {
    console.error(e);
    res.status(500).json({message: "Server Error"});
  }
}


export async function writeGroups(req,res){
  try{
    const { group } = req.body; 
    const newGroup = new groups(group);
    await newGroup.save();
    res.status(201).json(newGroup);
  }catch(e){
    console.error(e);
    res.status(500).json({message: "Server Error"});
  }
}
