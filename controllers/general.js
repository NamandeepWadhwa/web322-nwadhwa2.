const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const menuList = require("../models/menu-list");

router.get("/", (req, res) => {
 menuList.menuModel.find()
 .exec()
 .then(data=>{
  val=data.map(value => value.toObject());
  res.render("general/home",{menu:val});
 });
    
  } 
 );
router.get("/menu", (req, res) => {
  menu=menuList.menuModel.find((err,val)=>{
    if(err)
    {
      console.log(err);
  
    }
    else{
     
        var i=0;
        var obj={};
        var final_ary=[];
        var mealKits=[];
        var new_catogery=true;
        var catogery_list=[];
        var catogery;
        for(i=0;i<val.length;i++)
        {
          
            
            if(i!=0)
            {
              
               
              for(var k=0;k<catogery_list.length;k++)
              {
                if(val[i].catogery===catogery_list[k])
                {
                   
                    new_catogery=false; 
                    break;
                }
                else
                {
                    new_catogery=true;
                }
              }  
            }
    
            if(new_catogery===true)
            {
                
                catogery_list.push(val[i].catogery);
                
                
                catogery=val[i].catogery;
                obj.catogery=catogery;
                mealKits.push(val[i]);
                for(var j=i+1;j<val.length;j++)
                {
                    if(val[j].catogery===catogery)
                    {
                        mealKits.push(val[j])
                    }
                }
                obj.mealKits=mealKits;
                 final_ary.push(obj);
              
                
            }
    
            obj={};
            mealKits=[];
        }
       
        res.render("general/menu",{menu:final_ary});
        
    

      
    }
   }).lean()

});

module.exports = router;
