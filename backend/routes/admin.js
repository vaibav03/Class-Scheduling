import groups from '../models/groups.js';
import { user } from '../models/users.js';

export async function getUsers(req, res) {
  try {
    let users = await user.find();
    
    users = users.map((user) => {
      return {
        email: user.email,
        role: user.role,
        _id : user.id
      };
    });
    
    const groupss = await groups.find()
    return res.status(200).json({ users, groups: groupss });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server Error" });
  }
}


export async function writeGroups(req, res) {
  try {
    const  group  = req.body;
    const newGroup = new groups(group);
    await newGroup.save();
    console.log(req.body)
    return res.status(201).json(newGroup);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server Error" });
  }
}
