var express  = require('express');
var app = express();
var mongoose = require('mongoose');

const db = require('../models/user');
var bodyParser = require('body-parser'); 

app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());

// Function to add a new user in the database
app.post('/add', async (req, res) => {
    const user = {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        roles: [1000],
    };
    // Check if the details received are good to proceed with i.e. field values are apt
    if(user.name.length>0 && user.email.length>0 && user.password.length>=5){
        // Check if user with the same email already exists. If yes, throw error.
        const existingUser = await db.findOne({email: user.email});
        if (existingUser) {
            res.status(400).json({
                error: 'User with the same email already exists!'
            });
        }
        //If the user doesn't exist, create a new user.
        else{
            db.create(user, function(err, results) {
                if (err){
                    res.status(500).json({
                        error: err
                    });
                }
                else {
                    console.log("New user details have been added!!!");
                    res.status(201).json({
                        message: 'User created successfully'
                    });
                }    
            });
        }
    }
    //If field values are inappropriate, return an error.
    else{
        res.status(400).json({
            error: 'Please enter valid data!'
        }); 
    }
});

// Retrieve the user with the email
app.get('/users/:email', function(req, res) {
    var Email = req.params.email;
    db.find({email: Email}, function(err, results){   
    if(err){
        res.send(err);
    }
    else if(results.length==0){
        res.status(404).send("Email id entered is incorrect!");
    }
    else{
        console.log("User Exists!");
        res.status(200).json({results});
    }});    
});

// Route to update a User
app.put('/users/:email', function(req, res) {
    const filter = {email: req.params.email};
    const update = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password}
    if(update.name.length>0 && update.email.length>0 && update.password.length>=5){
        db.findOneAndUpdate(filter, update, {new: true}, function(err, results) {
            if (err) {
                res.status(500).send("Error updating user in database.");
            }
            else {
                res.status(200).send("The record has been successfully updated!");
            }
        });
    }
    else
    {
        res.status(400).send("Details entered are incorrect. Update failed!");
    }
});

// Route to delete a User
app.delete('/users/:email', function(req, res) {
    const filter = {email: req.params.email};
    db.findOneAndDelete(filter, function(err, user) {
        if (err) {
            res.status(500).send("Error deleting user in database.");
        } else {
            res.status(200).send("User deleted successfully.");
        }
    });
});

module.exports = app;
