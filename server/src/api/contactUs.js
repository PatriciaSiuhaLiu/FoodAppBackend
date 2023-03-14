const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const db = require('../models/contact');
var mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Function to get the contact form data from request body and save it in the database.
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const dbRecord = {
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      replyStatus: false
  }
  // Save the contact form data to the database
  db.create(dbRecord)
      .then(() => res.send('Message saved'))
      .catch(err => {
      console.log(err);
      res.status(500).send('Error saving message');
  });
  // Nodemailer module is used to send emails
  const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
          user: "bf35cf7cbeca39",
          pass: "7ce38b66036942"
      }
  });

  //Mail configuration for the email that will be triggered when the contact form is submitted.
  //This email is to be sent to the organization from the customer's side.
  const mailOptions = {
    from: `${name} <${email}>`,
    to: 'Help Desk <queryhelpproject@gmail.com>',
    subject: `New Message from ${name}`,
    text: `${message} \nCustomer Details: \n Name:${name}\n Email:${email}`
  };

  //Function to send the mail to the organization on submission of contact form.
  //If the email is successfully sent, a confirmation email will be sent to the customer.
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Something went wrong.');
    } else {
      //Mail configuration for the email that will be triggered when the contact form is submitted.
      //This email is to be sent to the customer.
      transporter.sendMail({
          from: "Help Desk <queryhelpproject@gmail.com>",
          to: `${name} <${email}>`,
          subject: "Submission was successful",
          text: `Thank you for contacting us!\n\nForm Details:\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n
          This is an auto generated mail. Kindly do not reply.`
      },function(error, info){
        if(error) {
            console.log(error);
        } else{
            console.log('Message sent: ' + info.response);
        }
      });
      res.status(200).send('Success');
    }
  });
});

module.exports = app;