const {Post,User,Category}=require('../models');

exports.getAllPosts=async(req,res)=>{
  const posts=await Post.findAll({
    include:[{model:User,attributes:['id','username','role']},{model:Category}],
    order:[['createdAt','DESC']]
  });
  res.json(posts);
};

exports.createPost=async(req,res)=>{
  const {title,content,excerpt,categoryId}=req.body;
  const post=await Post.create({title,content,excerpt,categoryId,authorId:req.user.id});
  res.json(post);
};

exports.updatePost=async(req,res)=>{
  const {id}=req.params;
  const {title,content,excerpt,categoryId}=req.body;
  const post=await Post.findByPk(id);
  if(!post)return res.status(404).json({error:'Post not found'});
  if(post.authorId!==req.user.id)return res.status(403).json({error:'Unauthorized'});
  await post.update({title,content,excerpt,categoryId});
  res.json(post);
};

exports.deletePost=async(req,res)=>{
  const {id}=req.params;
  const post=await Post.findByPk(id);
  if(!post)return res.status(404).json({error:'Post not found'});
  if(post.authorId!==req.user.id && req.user.role!=='ADMIN') return res.status(403).json({error:'Unauthorized'});
  await post.destroy();
  res.json({message:'Post deleted'});
};
