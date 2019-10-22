const express = require('express');
const router = express.Router();
const {Item, List, itemArray} = require('../models/Item');
const {ensureAuthenticated} = require('../config/auth')
router.use(express.static("public"));

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {user: req.user})
})

router.get('/:customList',  ensureAuthenticated, (req, res) => {

    try {
        const customList = req.params.customList.charAt(0).toUpperCase() + req.params.customList.slice(1).toLowerCase();

        List.findOne({name: customList}, (err, foundList) => {
            if (!foundList) {
                const list =  List.create({
                    name: customList,
                    items: itemArray
                });
                res.redirect(`/dashboard/${customList}`)
            } else {
                if (foundList.items.length === 0) {
                    itemArray.forEach(item => {
                        foundList.items.push(item)
                    })
                    foundList.save()
                };
                res.render("list", {listTitle: customList, items: foundList.items});
            };
        });        
    } catch (error) {
        console.log(error);        
    }
});

router.post('/listupdate', (req, res) => {

    try {
        const itemName = req.body.newItem;
        const listTitle = req.body.listTitle;
        
        const newItem = new Item ({
            name: itemName
        });
        List.findOne({name:listTitle}, (err, foundList) => {
            foundList.items.push(newItem);
            foundList.save();
        });
        res.redirect(`/dashboard/${listTitle}`);  
    } catch (error) {
        console.log(error);
    };
});

router.post('/delete', (req, res) => {
    try {
        const itemId = req.body.checkbox;
        const listTitle = req.body.listTitle;

        List.findOneAndUpdate({name: listTitle}, {$pull: {items: {_id: itemId}}}, (err, foundList) =>{
            if (!err) {
                res.redirect(`/dashboard/${listTitle}`)
            };
        });
     
    } catch (error) {
        console.log(error);
    };
});

module.exports = router