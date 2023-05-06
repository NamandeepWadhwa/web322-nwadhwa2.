const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModels");


router.get("/login", (req, res) => {
    
    res.render("user/login");
});
router.get("/sign-up", (req, res) => {
    res.render("user/sign-up");
});
router.post("/login",(req,res)=>{ 
    const clerk_selected=false;
   
    let passValidation=true;
    let validationMessages={};
    const errors=[];
    const {email,password,check}=req.body;
   
   if(check!="clerk" && check!="customer")
   {
    passValidation=false;
    validationMessages.radio="Please selcet one of the option";
   }

    
       
   
    if(typeof email!=='string' || email.trim().length==0)
    {
        passValidation=false;
        validationMessages.email="Email cannot be empty";
    }
    if(password.trim().length==0)
    {
        passValidation=false;
        validationMessages.password="Password cannot be empty";
    }
    if(passValidation)
    { 

        userModel.findOne({
            email: req.body.email
        })
            .then(user => {
                // Completed the search.
                if (user) {
                    // Found the user document.
                    // Compare the password submitted to the password in the document.
                    bcrypt.compare(req.body.password, user.password)
                        .then(isMatched => {
                            // Done comparing passwords.
    
                            if (isMatched) {
                                // Passwords match.
    
                                // Create a new session and store the user object.
                                req.session.user = user;
                                req.session.check=check;
                                

                               if(check==="clerk")
                               {
                               
                                res.redirect("/clerk/list-mealkits");
                               }
                               if(check==="customer")
                               {
                                req.session.cart=[];
                                res.redirect("/customer/cart");
                               }
                               
                                
                                
                                
                            }
                            else {
                                // Passwords are different.
                                errors.push("Password does not match the database.");
                                console.log(errors[0]);
    
                                res.render("user/login", {
                                    values: req.body,
                                    errors
                                });
                            }
                        })
                }
                else {
                    // User was not found.
                    errors.push("Email was not found in the database.");
                    console.log(errors[0]);
    
                    res.render("user/login", {
                        values: req.body,
                        errors
                    });
                }
            })
            .catch(err => {
                // Couldn't query the database.
                errors.push("Error finding the user in the database ... " + err);
                console.log(errors[0]);
    
                res.render("user/login", {
                    values: req.body,
                    errors
                });
            });
    }
    else
    {
        res.render("user/login", {
            values: req.body,
            validationMessages
        });
    }

});

router.post("/sign-up",(req,res)=>{ 
    const {firstname,lastname,email,password}=req.body;

    let passValidation=true;
    let validationMessages={};
   
    if(firstname.trim().length==0)
    {
        passValidation=false;
        validationMessages.firstname="First name cannot be empty";

    }
    
    if(lastname.trim().length==0)
    {
        
        passValidation=false;
        validationMessages.lastname="Last name cannot be empty";

    }
    let regexpemail=/^([a-zA-z0-9\.]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/
   if(!regexpemail.test(email))
   {
    passValidation=false;
    validationMessages.email="Enter a valid email";
    
   }
   let regCapatial=/[A-Z]/;
   let regnum=/[0-9]/;
   let regsymbol=/[\W\S_]/;
  
   
   if(password.trim().length>12 || password.trim().length<8||password.match[/^[A-Z]/] )
   {
     passValidation=false;
     validationMessages.password="Password length must be between 8 and 12";
   }
   else if(password.search(/[^A-Za-z0-9]/)==-1)
   {
    passValidation=false;
     validationMessages.password="Password length must contain a symbol";
   }
   else if(password.search(/[0-9]/)==-1)
   {
    passValidation=false;
     validationMessages.password="Password length must contain a number";
   }
   else if(password.search(/[A-Z]/)==-1)
   {
    passValidation=false;
     validationMessages.password="Password length must contain a capatial number";
   }
    if(passValidation)
    {

        const user = new userModel({
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
        });
        
        user.save()
            .then(userSaved => {
               
                                
                const sgMail = require("@sendgrid/mail");
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                
        
                const msg = {
                    to: `${email.trim()}`, //email
                    from: "naman23156@gmail.com",
                    subject: "Sign-up",
                    html:
                        `Dear ${firstname} ${lastname} I Namandeep Singh Wadhwa welcomes You to Qick-appetite<br>
                        A single place for all your cravings order now and get started`
                };
                
                sgMail.send(msg)
                    .then(() => {
                          res.render("user/welcome",{
                            values: req.body 
                          });
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect("user/sign-up");
                    });
            })
            .catch(err => {
                console.log("hakai");
                res.render("user/sign-up",{errors:"Email already registered",values:req.body})
            });
       
      
    }
    else
    {
        res.render("user/sign-up", {
            values: req.body,
            validationMessages
        });
    }

});
router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();

    res.redirect("/user/login");
});
module.exports = router;
