const express = require("express");
const session = require("express-session");
const router = express.Router();
const menuList = require("../models/menu-list");

router.get("/cart", (req, res) => {
    
   
    if(req.session.user)
    {
        if(req.session.check==="customer")
           {
            let message="";
          res.render("customer/cart",prepareViewModel(req, message))
          }
          else{
            res.render("/")
          }
    }
   
    else
    {
        res.redirect("/")
    }
  

});

router.get("/add-meal/:title",(req,res)=>{
    
    if(req.session.check=="customer")
    {
        
        let title=req.params.title;
        title=title.substring(1);
        let cart = req.session.cart = req.session.cart || [];
        menuList.menuModel.findOne({title:title}).lean()
        .then((meal)=>{
            let message="";
            let ExtentedPrice=0;
            if (meal) {
                
                let found = false;
    
                cart.forEach(meal => {
                    if (meal.title == title) {
                       
                        found = true;
                        meal.qty++;
                    }
                });
               
            if (found) {
                message = "The meal was already in the cart, incremented the quantity by one."
            }
            else {
                
                cart.push({
                    title: title,
                    qty: 1,
                    meal,
                    ExtentedPrice
                });

             }
              cart.sort((a, b) => a.meal.title.localeCompare(b.meal.title));
              req.session.cart=cart;
            
            }
         else {
            //meal not foun 
            message = "The meal does not exist.";
         }
         
        res.render("customer/cart", prepareViewModel(req, message))
        })
        
    }
    
    else{
        message="You must be loged-in"
        res.send(message)
    }
    
   
})
router.get("/remove-meal/:title",(req,res)=>{
    if(req.session.check=="customer")
    {
        let title=req.params.title.substring(1);
    
        let message;
    let found = false;
    cart=req.session.cart;
    
    cart.forEach(meal => {
        if (meal.title == title) {
           
            found = true;
            meal.qty--;
        }
    });
    if(found)
    {
        const index = cart.findIndex(meal => title == meal.title); 
        cart.splice(index, 1);
            
    }
    else
    {
        message="Not a meal"
    }
    req.session.cart=cart; 
    res.render("customer/cart", prepareViewModel(req, message))

    }
    else
    {
        res.send("You must be loged-in")
    }
})
router.get("/order",(req,res)=>{
    let cart=req.session.cart
    const hasmeal = cart.length > 0;
    if(req.session.check=="customer")
    {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const cart=req.session.cart;
       firstName= req.session.user.firstName;
        lastName=req.session.user.lastName;
        let cartTotal=0;
        cart.forEach(meal => {
            cartTotal += meal.meal.price * meal.qty;
        });
        let meal2=[];
        cart.forEach(meal => {
            meal2.push(meal);
        });

        const msg = {
            to: `${req.session.user.email.trim()}`, //email
            from: "naman23156@gmail.com",
            subject: "Sign-up",
            Html:
                 
                `Dear ${req.session.user.firstName} ${req.session.user.lastName} Thank you for ordering. Below is your purchace details<br>
                Your total is- ${cartTotal}<br>
                
                 Your items are<br>
                 ${{meal2}}`
        };
        
        sgMail.send(msg)
            .then(() => {
                req.session.cart=[];
                  res.render("customer/order",{
                    
                    message: "Thank you for odering, your order conformation has been sent to your mail" 
                  });
            })
            .catch(err => {
                console.log(err);
                res.redirect("customer/order",{message:err});
            });
    }
    else{
        res.send("You must be loged-in")
    }
})

router.get("/RemoveOne-meal/:title",(req,res)=>{
  if(req.session.check=="customer")
  { 
    title=req.params.title.substring(1)
    let message;
    let found = false;
    cart=req.session.cart;
    
    cart.forEach(meal => {
        if (meal.title == title) {
           
            found = true;
            meal.qty--;
        }
    });
    if(found)
    {
        const index = cart.findIndex(meal => title == meal.title);
        if(cart[index].qty==0)
        {
            message = `Removed "${cart[index].meal.title}" from the cart.`;
            cart.splice(index, 1);
        }
        else
        {
            message=`Removed one quantity of ${cart[index].meal.title}`;
            
        }
        req.session.cart=cart;
    }
    else{
        message="No such mealkit in the mealkit"
    }
    res.render("customer/cart", prepareViewModel(req, message))
  }
  else
  {
    res.send("You must be loged-in")
  }
})
const prepareViewModel = function (req, message) {

    if (req.session && req.session.check=="customer") {
        // Is the user signed in and has a session been established.

        let cart = req.session.cart || [];
        let cartTotal = 0;

        // Check if the cart has any songs.
        const hasmeal = cart.length > 0;

        // If there are songs in the shopping cart, then calculate the order total.
        if (hasmeal) {
            cart.forEach(meal => {
                cartTotal += meal.meal.price * meal.qty;
            });
            cart.forEach(meal => {
                
                meal.ExtentedPrice= meal.meal.price * meal.qty;
                
            });
       
            req.session.cart=cart;
        }

        return {
            message,
            hasmeal,
            meal: cart,
            cartTotal: "$" + cartTotal.toFixed(2)
        };
    }
    else {
        // The user is not signed in, return default information.
        return {
            message,
            hasmeal: false,
            meals: [],
            cartTotal: "$0.00"
        };
    }
}
module.exports = router;
