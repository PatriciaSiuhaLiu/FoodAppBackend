var express  = require('express');
const db = require('../models/restaurant');
var bodyParser = require('body-parser');
const router = express.Router();
// app.use(bodyParser.urlencoded({'extended':'true'}));            
// app.use(bodyParser.json());
const crypto = require('crypto');



router.get('/restaurants',(req,res) => {
    db.find({},function(err,results){
        if(err){
            res.send(err);
        }
        else{
            res.status(200).json({results});
        }
    })
})

router.get('/restaurants/:restaurant_id', function (req,res){
    const x = req.params.restaurant_id
    db.findById(x, function(err,results){
        if(err){
            res.send(err); 
        }
        else{
            res.status(200).json({results});
        }
    })
})

router.post('/restaurants', (req,res) => {

    const restaurant = {
        restaurant_id: crypto.randomUUID(),
        name: req.body.name,
        cuisine: req.body.cuisine,
        image: req.body.image,
        address: {
            building: req.body.building,
            street: req.body.street,
            zipcode: req.body.zipcode,
        },
        email: req.body.email,
        phone: req.body.phone
    };
    db.create(restaurant).then(
        ()=> {
            res.status(201).json(restaurant);
        },
        (err) => {
            res.status(500).send(err);
        }
    ); 
})



module.exports = router;