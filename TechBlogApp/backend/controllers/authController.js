const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {User}=require('../models');
require('dotenv').config();

exports.register=async(req,res)=>{
  const {username,email,password}=req.body;
  if(!username||!email||!password)return res.status(400).json({error:'All fields required'});
  const hash=bcrypt.hashSync(password,10);
  try{
    const user=await User.create({username,email,password:hash});
    res.json({message:'User registered',user:{id:user.id,username,email,role:user.role}});
  }catch(err){res.status(400).json({error:err.message});}
};

exports.login=async(req,res)=>{
  const {email,password}=req.body;
  const user=await User.findOne({where:{email}});
  if(!user)return res.status(404).json({error:'User not found'});
  const valid=bcrypt.compareSync(password,user.password);
  if(!valid)return res.status(401).json({error:'Invalid credentials'});
  const accessToken=jwt.sign({id:user.id,username:user.username,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
  res.json({accessToken,user:{id:user.id,username:user.username,role:user.role}});
};
