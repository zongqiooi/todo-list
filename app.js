const bodyParser = require("body-parser");
const express = require("express"); 
const mongoose = require("mongoose"); 
const _ = require("lodash"); 
const date = require(__dirname + "/date.js"); 

const app = express(); 

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/todolistDB'); 

    const itemsSchema = new mongoose.Schema({
        name: String
    });

    const listSchema = new mongoose.Schema({
        name: String, 
        items: [itemsSchema]
    });

    const Item = mongoose.model("Item", itemsSchema); 
    const List = mongoose.model("List", listSchema); 
    const items = []; 

    app.use(bodyParser.urlencoded({extended: true})); 
    app.use(express.static("public")); 
    app.set("view engine", "ejs"); 

    app.get("/", async function(req, res) {
        const foundItems = await Item.find({});
        
        if (foundItems.length === 0) {
            Item.insertMany(items); 
        }
        
        res.render("list", {listTitle: "Today", items: foundItems});
    }); 

    app.post("/", async function(req, res) {
        const newItem = req.body.newItem; 
        const name = req.body.list; 
        const item = new Item({
            name: newItem
        }); 

        if (name === "Today") {
            const foundItems = await Item.find({});
            foundItems.push(name); 
            item.save(); 
            res.redirect("/");    
        } 
        else {
            const foundList = await List.findOne({name: name}); 
            foundList.items.push(item); 
            foundList.save();
            res.redirect("/" + name); 
        }
    }); 

    app.post("/delete", async function(req, res) {
        const id = req.body.checkbox; 
        const listName = req.body.listName; 

        if (listName === "Today") {
            await Item.findByIdAndRemove(id); 
            res.redirect("/");
        }
        else {
            await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}); 
            res.redirect("/" + listName); 
        }
    }); 

    app.get("/:customListName", async function(req, res) {
        const customListName = _.capitalize(req.params.customListName); 
        const foundList = await List.findOne({name: customListName}); 

        if (foundList === null) {
            const list = new List({
                name: customListName,
                items: items
            });

            list.save(); 
            res.redirect("/" + customListName);
        }
        else {
            res.render("list", {listTitle: foundList.name, items: foundList.items});
        }
    });

    app.get("/about", function(req, res) {
        res.render("about"); 
    }); 

    app.listen(3000, function() {
        console.log("Server is running on port 3000"); 
    });
}