const express = require("express");
const router = express.Router();
const menuList = require("../models/menu-list");
const mongoose = require('mongoose');
const path = require("path");
router.get("/list-mealkits", (req, res) => {
   
    
    if(req.session.user)
    {
        
    if(req.session.check==="clerk")
    {
        menuList.menuModel.find()
        .exec()
        .then(data=>{
            data=data.map(value => value.toObject());
           
            res.render("clerk/list-mealkits",{meal:data})
        })
      
    }
    else
    {
        res.redirect("/")
    }
}
else
{
    res.redirect("/")
}

});
router.get("/add-mealkit",(req,res)=>{
    
   if(req.session.check=="clerk")
   {
    res.render("clerk/add-mealkit")
   }
   else
   {
    res.redirect("/");
   }
   
 
});
router.get("/edit-mealkit/:id",(req,res)=>{
     if(req.session.check==="clerk")
     {
       
       let Hakai=String(req.params.id);
  
       Hakai=Hakai.substring(1);
      
       const id= mongoose.Types.ObjectId(Hakai);

       // true
       menuList.menuModel.findById(id,(err,data)=>{
        if (err)
        {
            res.render("clerk/edit-mealkit",{values:data,message:err})
        }
        else
        {
            
            res.render("clerk/edit-mealkit",{values:data})
        }
       }).lean()
    
     
     
     }
     
});
router.post("/add-mealkit",(req,res)=>
{
    if(req.session.check=="clerk")
    {

    req.body._id=req.params.id;
    let entry=true;
    const topmeal=req.body.top;
    if(topmeal==="topmeal")
    {
        entry=true;
    }
    else
    {
        entry=false;
    }
    
            // Create a unique name for the image, so that it can be stord in the file system.
           
            
            if(!req.files)
            {
                res.render("clerk/add-mealkit",{message:"upload a Meal pic",values:req.body})
            }
else{
    let upload=true;
    

    if(req.files.MealPic.name.match(/\.jpg/i)===null&&
    req.files.MealPic.name.match(/\.png/i)===null &&
    req.files.MealPic.name.match(/\.jpeg/i)===null
    &&req.files.MealPic.name.match(/\.gif/i)===null)
    {
         upload=false;
    }
          
 if(upload===true)

{

const menus =new menuList.menuModel({
        title:req.body.title,
        desc:req.body.desc,
        price:req.body.price,
        includes:req.body.includes,
        servings:req.body.servings,
        cookingTime:req.body.cookingTime,
        catogery:req.body.catogery,
        top:entry
    })
    menus.save()
        .then(menuSaved => {
            

            // Create a unique name for the image, so that it can be stord in the file system.
            let uniqueName = `profile-pic-${menuSaved._id}${path.parse(req.files.MealPic.name).ext}`;


            // Copy the image data to a file in the "/assets/profile-pics" folder.
            req.files.MealPic.mv(`assets/images/Menu/${uniqueName}`)
                .then(() => {
                    // Update the document so it includes the unique name.
                    menuList.menuModel.updateOne({
                        _id: menuSaved._id
                    }, {
                        "imageUrl": uniqueName
                    })
                        .then(() => {
                            // Success
                           
                            res.render("clerk/add-mealkit",{message:"Meal kit added",values:req.body});
                        })
                        .catch(err => {
                            res.render("clerk/add-mealkit",{message:err,values:req.body});
                        });
                })
                .catch(err => {
                    res.render("clerk/add-mealkit",{message:err,values:req.body});
                });
        })
        .catch(err => {
            
            res.render("clerk/add-mealkit",{message:"Error in adding the database",values:req.body});
        });
    }
    else{
        res.render("clerk/add-mealkit",{message:"Upload a jpg, jpeg, gif, or png only",values:req.body});
    }
}
    }
    else{
        res.redirect("/");
    }
})
router.post("/edit-mealkit/:id",(req,res)=>{
    if(req.session.check==="clerk")
    
    {
        req.body._id=req.params.id
        
        
        
        if(req.body.top!="true" && req.body.top!="false")
        {

    
            res.render("clerk/edit-mealkit",{message:"Please enter true or false for top meal",values:req.body})

        }
        else
        {
            if(!req.files)
            {
                menuList.menuModel.updateOne({
                    _id:req.params.id
                },{
                    title:req.body.title,
                    desc:req.body.desc,
                    price:req.body.price,
                    includes:req.body.includes,
                    servings:req.body.servings,
                    cookingTime:req.body.cookingTime,
                    catogery:req.body.catogery,
                    top:req.params.topl
                }).then(()=>{
                   res.render("clerk/edit-mealkit",{message:"Mealkit updated",values:req.body})
                           
                   
                })
                .catch((err)=>
                {
                    res.render("clerk/edit-mealkit",{message:err,values:req.body})
                 
                })
            }
            else
            {
                if(req.files.MealPic.name.match(/\.jpg/i)===null&&
                req.files.MealPic.name.match(/\.png/i)===null &&
                req.files.MealPic.name.match(/\.jpeg/i)===null
                &&req.files.MealPic.name.match(/\.gif/i)===null)
                {
                   
                    res.render("clerk/edit-mealkit",{message:"Olny jpg, jpeg, gif, or png.",values:req.body})
                }
                else
                {
                    menuList.menuModel.updateOne({
                        _id:req.params.id
                    },{
                        title:req.body.title,
                        desc:req.body.desc,
                        price:req.body.price,
                        includes:req.body.includes,
                        servings:req.body.servings,
                        cookingTime:req.body.cookingTime,
                        catogery:req.body.catogery,
                        top:req.params.topl
                    }).then((updated)=>
                    {
                        let uniqueName = `profile-pic-${updated._id}${path.parse(req.files.MealPic.name).ext}`;
                      
            
                        // Copy the image data to a file in the "/assets/profile-pics" folder.
                        req.files.MealPic.mv(`assets/images/Menu/${uniqueName}`)
                            .then(() => {
                                // Update the document so it includes the unique name.
                                menuList.menuModel.updateOne({
                                    _id: req.params.id
                                }, {
                                    "imageUrl": uniqueName
                                })
                                    .then(() => {
                                        // Success
                                       
                                        res.render("clerk/edit-mealkit",{message:"Meal kit edited",values:req.body});
                                    })
                                    .catch(err => {
                                        res.render("clerk/edit-mealkit",{message:err,values:req.body});
                                    });
                            })
                            .catch(err => {
                                res.render("clerk/edit-mealkit",{message:err,values:req.body});
                            });
                    }).catch((err)=>
                    {
                        res.render("clerk/edit-mealkit",{message:err,values:req.body})
                    }) 
                }
            }
        }
    }
    else
    {
        res.redirect("/");
    }
})
router.get("/remove-mealkit/:id",(req,res)=>{
    let Hakai=String(req.params.id);
  
    Hakai=Hakai.substring(1);
   
    const id= mongoose.Types.ObjectId(Hakai);
    menuList.menuModel.deleteOne({_id:id})
    .exec()
    .then(()=>{
        res.render("clerk/remove-mealkit",{message:"Mealkit deleated"})
    })
    .catch((err)=>
    {
        res.render("clerk/remove-mealkit",{message:err})
    })
})

module.exports = router;
