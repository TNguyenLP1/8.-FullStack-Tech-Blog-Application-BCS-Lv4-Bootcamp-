const {Category}=require('../models');
exports.getAllCategories=async(req,res)=>{
  const categories=await Category.findAll();
  res.json(categories);
};
