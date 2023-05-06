/*************************************************************************************
* WEB322 - 2227 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Namandeep Singh Wadhwa
* Student ID    : 146466214
* Course/Section: WEB322/NEE
*
**************************************************************************************/

const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");

// Set up dotenv
const dotenv = require("dotenv");
dotenv.config({path: "./config/keys.env"});

app.use(session({
    secret: "Hakai",
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
 
    // res.locals.user is a global handlebars variable.
    // This means that every single handlebars file can access this variable.
    res.locals.user = req.session.user;
    res.locals.check=req.session.check
    res.locals.cart=req.session.cart;
    next();
});


// Set up Handlebars
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: { 
        compare: function(value){
            
             if(value==="clerk")
             {
                
                return `<li class="nav-item mx-3 my-2"> <a class="nav-link fs-5 text-danger" href="/clerk/list-mealkits">list-mealkits</a> </li>`
             }
             else if(value=="customer")
             {
                return `<li class="nav-item mx-3 my-2"> <a class="nav-link fs-5 text-danger" href="/customer/cart">shopping-cart</a> </li>`
            
             }
     
        },
    

    compareheader: function(value){
            
        if(value==="clerk")
        {
           
           return `<li class="py-2 fs-4 text-danger">
           <a class="text-decoration-none text-danger" href="/clerk/list-mealkits">list-mealkits</a>
         `
        }
        else if(value=="customer")
        {
           return `<li class="py-2 fs-4 text-danger">
           <a class="text-decoration-none text-danger" href="/customer/cart">shopping-cart</a>
         `
       
        }

    }
},

}));

app.set('view engine', '.hbs');


// Set up Body Parser.
app.use(express.urlencoded({ extended: true }));

// Set up express-upload
app.use(fileUpload());

// Set up express-session



// Connect to the MongoDb
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       
    }).then(() => {
        console.log("Connected to the MongoDB database.")
    })
    .catch(err => {
        console.log(`There was a problem connecting to MongoDB ... ${err}`);
    });


// Make the "assets" folder public and static.
app.use(express.static(path.join(__dirname, "/assets")));

// Load the controllers into Express
const generalController = require("./controllers/general");
const userController  = require("./controllers/user");
const clerkController=require("./controllers/clerk");
const customerController=require("./controllers/customer");
const loaddata=require("./controllers/load-data");
const meal=require("./controllers/meal")

app.use(express.json());

app.use("/", generalController);

app.use("/user/", userController);

app.use("/clerk/",clerkController)

app.use("/customer/",customerController);

app.use("/load-data/",loaddata);

app.use("/meal/",meal)



// Add your routes here
// e.g. app.get() { ... }



// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});



// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
  
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);