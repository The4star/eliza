const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {type: String, required: true}
});

const listSchema = new Schema({
    name: {type: String, required: true},
    items: [itemSchema],
    userId: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

const List = mongoose.model('List', listSchema);
const Item = mongoose.model('Item', itemSchema); 

const item1 = new Item ({
    name: 'Welcome to your new Eliza list'
});

const item2 = new Item ({
    name: 'Click the plus to add an item'
});

const item3 = new Item ({
    name: '<<< Click this to delete an item'
});

const itemArray = [item1, item2, item3];

module.exports = {
    Item,
    List,
    itemArray,
    itemSchema,
    listSchema
};