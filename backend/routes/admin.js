import groups from '../models/groups.js';

async function getAdmin(req, res){
  try {
    const groups = await groups.find()
    return res.status(200).json(groups)
  } catch(e) {
    console.error(e);
    res.status(500).json({message: "Server Error"});
  }
}

async function writeGroups(req,res){
  try{
    const group = req.body; 
    const newGroup = new groups(group);
    await newGroup.save();
    res.status(201).json(newGroup);
  }catch(e){
    console.error(e);
    res.status(500).json({message: "Server Error"});
  }
}
