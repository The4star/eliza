const express = require('express');
const router = express.Router();
const {Item, List, itemArray} = require('../models/Item');
const {ensureAuthenticated} = require('../config/auth')
router.use(express.static("public"));

router.get('/', ensureAuthenticated, (req, res) => {
    console.log(req.user)
    user = req.user;
    lists = user.lists.populate()
    res.render('dashboard', {user, lists})
})

router.get('/:customList',  ensureAuthenticated, async (req, res) => {

    try {
        const customList = req.params.customList.charAt(0).toUpperCase() + req.params.customList.slice(1).toLowerCase();
        const user = req.user;

        await List.findOne({name: customList, userId: user._id}, async (err, foundList) => {
            
            if (err) {
                throw err
            };

            if (!foundList) {
                const list = await List.create({
                    name: customList,
                    items: itemArray,
                    userId: user._id 
                });
                user.lists.push(list);
                user.save();
                res.redirect(`/dashboard/${customList}`);
            } else {
                res.render("list", {listTitle: customList, items: foundList.items});
            };
        });        
    } catch (error) {
        console.log(error);        
    }
});

router.post('/listupdate', async (req, res) => {

    try {
        const itemName = req.body.newItem;
        const listTitle = req.body.listTitle;
        const user = req.user;

        const newItem = new Item ({
            name: itemName
        });

       await List.findOne({name:listTitle, userId: user._id},(err, foundList) => {
            foundList.items.push(newItem);
            foundList.save();
        });
        res.redirect(`/dashboard/${listTitle}`);  
    } catch (error) {
        console.log(error);
    };
});

router.post('/delete', async (req, res) => {
    try {
        const itemId = req.body.checkbox;
        const listTitle = req.body.listTitle;
        const user = req.user;

        await List.findOneAndUpdate({name: listTitle, userId: user._id}, {$pull: {items: {_id: itemId}}}, (err, foundList) =>{
            if (!err) {
                res.redirect(`/dashboard/${listTitle}`)
            };
        });
    } catch (error) {
        console.log(error);
    };
});

module.exports = router