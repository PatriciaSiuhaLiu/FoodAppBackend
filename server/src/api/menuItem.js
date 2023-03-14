const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Restaurant = require('../models/restaurant');
const crypto = require('crypto');



router.get('/restaurants/:_id/menuList', function (req, res) {

    const rest = Restaurant.findById(req.params._id, function (err, restaurant) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.status(200).json(restaurant.menu_list);
        }
    });

});

router.get('/restaurants/:_id/menuList/:menuId', (req, res) => {
    Restaurant.findById(req.params._id, (err, restaurant) => {
        if(err) {
            return res.status(500).send(err);
        }
        if (!restaurant) {
            return res.status(404).send({ message: 'Restaurant not found' });
        }
        const menu = restaurant.menu_list.find(item => item.menu_id == req.params.menuId)
        
        if(!menu) {
            return res.status(404).send({ message: "Menu not found"});
        }
        return res.status(200).json(menu);
    });
});

router.post('/restaurants/:_id/menuList', (req, res) => {

    Restaurant.findById(req.params._id, (error, restaurant) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!restaurant) {
            return res.status(404).send({ message: 'Restaurant not found' });
        }

        const menu = {
            menu_id: crypto.randomUUID(),
            menu_name: req.body.menu_name,
            menu_category: req.body.menu_category,
            menu_image: req.body.menu_image,
            menu_price: req.body.menu_price
        };

        restaurant.menu_list.push(menu);

        restaurant.save((error) => {
            if (error) {
                return res.status(500).send(error);
            }

            res.send(restaurant.menu_list);
        });
    });
});

router.put('/restaurants/:_id/menuList/:menu_id', (req, res) => {
    Restaurant.findById(req.params._id, (error, restaurant) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!restaurant) {
            return res.status(404).send({ message: 'Restaurant not found' });
        }

        const menu = restaurant.menu_list.find(item => item.menu_id == req.params.menu_id);

        if (!menu) {
            return res.status(404).send({ message: 'Menu item not found' });
        }

        if(req.body.menu_name)
            menu.menu_name = req.body.menu_name;

        if(req.body.menu_category)
            menu.menu_category = req.body.menu_category;

        if(req.body.menu_image)
            menu.menu_image = req.body.menu_image;

        if(req.body.menu_price)
            menu.menu_price = req.body.menu_price;

        restaurant.save((error) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.send(menu);
        });
    });
});

router.delete('/restaurants/:_id/menuList/:menuId', (req, res) => {

    Restaurant.findById(req.params._id, (error, restaurant) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!restaurant) {
            return res.status(404).send({ message: 'Restaurant not found' });
        }

        const menu = restaurant.menu_list.find(item => item.menu_id == req.params.menuId)

        if (!menu) {
            return res.status(404).send({ message: 'Menu not found' });
        }
        
        menu.remove();

        restaurant.save((error) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.send({ message: 'Menu deleted successfully' });
        });
    });
});

module.exports = router;
