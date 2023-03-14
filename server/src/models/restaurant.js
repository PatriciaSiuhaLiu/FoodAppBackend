var mongoose = require('mongoose');
var Schema = mongoose.Schema;

AddressSchema = new Schema({
    building: String,
    street: String,
    zipcode: String
});

ReviewSchema = new Schema({
    review_id: String,
    date: Date,
    score: Number,
    review: String
});

MenuSchema = new Schema({
    menu_id: String,
    menu_name: String,
    menu_category: String,
    menu_image: String,
    menu_price: Number
});
RestaurantSchema = new Schema({
    restaurant_id: String,
    name: String,
    cuisine: String,
    address: AddressSchema,
    reviews: [ReviewSchema],
    image: [String],
    menu_list: [MenuSchema],
    email: String,
    phone: String
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);



// load mongoose since we need it to define a model
// const { link } = require('fs');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// RestaurantSchema = new Schema({
//     restaurant_id: String,
//     name: String,
//     address: {
//         building: String,
//         street: String,
//         zipcode: String
//     },
//     cuisine: String,
//     reviews: [
//         {
//             date : Date,
//             score : Number,
//             review: String
//         }
//     ],
//     image: [
//         String
//     ],
//     menu_list: [
//         {
//            menu_id: Number,
//            menu_name: String,
//            menu_image: String
//         }
//     ]
// });
// module.exports = mongoose.model('restaurant', RestaurantSchema);