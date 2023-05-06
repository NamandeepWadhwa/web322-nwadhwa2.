const express = require("express");
const router = express.Router();
const menuList = require("../models/menu-list");
const path = require("path");
router.get("/description/:name",(req,res)=>{
 let title=req.params.name;
 title=title.substring(1);
 menuList.menuModel.findOne({title:title}).lean()
 .then(meal=>{
  if(meal)
  {
   res.render("meal/description",{meal:meal})

  }
  else{
    res.render("meal/description",{meassage:"Meal not found"})
  }
 })
.catch((err)=>{
    res.render("meal/description",{meassage:"Meal not found"})
})
})
module.exports = router;
