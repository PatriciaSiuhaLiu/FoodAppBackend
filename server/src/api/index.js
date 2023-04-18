const express = require("express");
const registerApi = require("./register");
const loginApi = require("./login");
const paymentApi = require("./payment");
const restaurantApi = require("./restaurantList");
const restaurantMenuApi = require("./menuItem");
const contact = require("./contactUs");
const cartAPI = require("./cartData");

const router = express.Router();
router.use(contact);
router.use(registerApi);
router.use(loginApi);
router.use(paymentApi);
router.use(restaurantApi);
router.use(restaurantMenuApi);
router.use(cartAPI);
module.exports = router;
