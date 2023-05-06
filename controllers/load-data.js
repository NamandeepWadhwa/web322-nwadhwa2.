const express = require("express");
const router = express.Router();
const menu=require("../models/menu-list");

router.get("/meal-kits", (req, res) => {
    

if(req.session.user  && req.session.check==="clerk")
{

    menu.menuModel.find().count({}, (err, count) => {
        if (err) {
            res.render("load-data/meal-kits",{message:"Couldn't count the documents: " + err});
        }
        else if (count === 0) {
            // No documents exist, add the new documents.

            menu.menuModel.insertMany(menu.menu(), (err, docs) => {
                if (err) {
                    res.render("load-data/meal-kits",{message:"Couldn't insert the names, error: " + err});
                }
                else {
                    res.render("load-data/meal-kits",{message:"Success, data was uploaded!"});
                }
            });
        }
        else {
            res.render("load-data/meal-kits",{message:"There are already documents loaded."});
        }
    });
}
else{

    res.render("load-data/meal-kits",{message:"You are not authorized"})
}

})
module.exports = router;