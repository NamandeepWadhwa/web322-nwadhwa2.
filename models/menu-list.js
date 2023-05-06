const mongoose = require("mongoose");

const menuSchema=new mongoose.Schema({
    title: {type:String,
           required:true,
        unique:true},

    includes:  {type:String,
            required:true},
    desc:  {type:String,
             required:true},
            
     price:  {type:Number,
              required:true},
                     
     servings:    {type:Number,
                required:true,
                unique:false},
                         
     cookingTime:  {type:Number,
              required:true,
              unique:false},

  imageUrl:  {type:String,
    unique:true},

    catogery:  {type:String,
        required:true,
       unique:false},

       top:  {type:Boolean,
        required:true,
       unique:false}
   

});

module.exports.menuModel = mongoose.model("menu", menuSchema);



var menu=
[{
title:"Meatballs",
includes:"With Tomoto Ozro & side salad",
desc:"Comes with different meats",
price:13.99,
servings:2,
cookingTime:25,
imageUrl:"meatBalls.jpg",
catogery:"Classic",
top:true
},
{
    title:"Chicken Briyani",
    includes:"Served with green chilli sause",
    desc:"Best selling Indian food",
    price:13.99,
    servings:2,
    cookingTime:25,
    imageUrl:"biryani.jpg",
    catogery:"International",
    top:true
},
{
    title:"Caesar Salad",
    includes:"With creamy Caesar dressing",
    desc:"Best cure for your craving",
    price:13.99,
    servings:2,
    cookingTime:25,
    imageUrl:"caesar.jpg",
    catogery:"Classic",
    top:true
},
{
    title:"Dim Sum",
    includes:"Served with tea",
    desc:"Chienese breakfast",
    price:13.99,
    servings:2,
    cookingTime:25,
    imageUrl:"dim_sum.jpg",
    catogery:"International",
    top:false
},
{
    title:"Sushi",
    includes:"Served green paste and a pink slices",
    desc:"Best selling Indian food",
    price:13.99,
    servings:2,
    cookingTime:25,
    imageUrl:"sushi.jpg",
    catogery:"International",
    top:false

},
{
    title:"Seafood paella",
    includes:"Served rice and various herbs",
    desc:"Seafood from spain",
    price:13.99,
    servings:2,
    cookingTime:25,
    imageUrl:"spain_sea.jpg",
    catogery:"International",
    top:false

},];
module.exports.menu=function(){
    return menu;
}
module.exports.getMealsByCategory=function(){
    var i=0;
    var obj={};
    var final_ary=[];
    var mealKits=[];
    var new_catogery=true;
    var catogery_list=[];
    var catogery;
    for(i=0;i<menu.length;i++)
    {
      
        
        if(i!=0)
        {
          
           
          for(var k=0;k<catogery_list.length;k++)
          {
            if(menu[i].catogery===catogery_list[k])
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
            
            catogery_list.push(menu[i].catogery);
            
            
            catogery=menu[i].catogery;
            obj.catogery=catogery;
            mealKits.push(menu[i]);
            for(var j=i+1;j<menu.length;j++)
            {
                if(menu[j].catogery===catogery)
                {
                    mealKits.push(menu[j])
                }
            }
            obj.mealKits=mealKits;
             final_ary.push(obj);
             
        }

        obj={};
        mealKits=[];
    }
    
    return final_ary;
}
