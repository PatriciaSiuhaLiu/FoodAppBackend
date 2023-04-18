const db = require("../models/cart");
var bodyParser = require("body-parser");
const router = require("express").Router();

addItemToCart = async (req, res) => {
  const quantity = Number.parseInt(req.body.quantity);
  try {
    let productDetails = req.body.menuItem;
    if (!productDetails) {
      return res.status(500).json({
        type: "Not Found",
        msg: "Invalid request",
      });
    }
    let userId = req.body.userId;
    let cart = await db.findOne({ userId: userId }).exec();

    //--If Cart Exists ----
    if (cart) {
      //---- Check if index exists ----
      const indexFound = cart.items.findIndex(
        (item) => item.productId === productDetails.productId
      );
      //------This removes an item from the the cart if the quantity is set to zero, We can use this method to remove an item from the list  -------
      if (indexFound !== -1 && quantity == 0) {
        cart.items.splice(indexFound, 1);
        if (cart.items.length == 0) {
          cart.subTotal = 0;
        } else {
          cart.subTotal = parseInt(
            cart.items
              .map((item) => item.total)
              .reduce((acc, next) => acc + next)
          );
        }
      } else if (indexFound !== -1 && quantity < 0) {
        cart.items[indexFound].quantity =
          cart.items[indexFound].quantity + quantity;
        cart.items[indexFound].total =
          cart.items[indexFound].quantity * productDetails.price;
        cart.items[indexFound].price = productDetails.price;
        cart.subTotal = parseInt(
          cart.items.map((item) => item.total).reduce((acc, next) => acc + next)
        );
        if (0 == cart.items[indexFound].quantity) {
          cart.items.splice(indexFound, 1);
          if (cart.items.length == 0) {
            cart.subTotal = 0;
          } else {
            cart.subTotal = parseInt(
              cart.items
                .map((item) => item.total)
                .reduce((acc, next) => acc + next)
            );
          }
        }
      }
      //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
      else if (indexFound !== -1) {
        cart.items[indexFound].quantity =
          cart.items[indexFound].quantity + quantity;
        cart.items[indexFound].total =
          cart.items[indexFound].quantity * productDetails.price;
        cart.items[indexFound].price = productDetails.price;
        cart.subTotal = parseInt(
          cart.items.map((item) => item.total).reduce((acc, next) => acc + next)
        );
      }
      //----Check if quantity is greater than 0 then add item to items array ----
      else if (quantity > 0) {
        cart.items.push({
          productId: productDetails.productId,
          name: productDetails.name,
          quantity: quantity,
          price: productDetails.price,
          total: productDetails.price * quantity,
        });
        cart.subTotal = parseInt(
          cart.items.map((item) => item.total).reduce((acc, next) => acc + next)
        );
      }
      //----If quantity of price is 0 throw the error -------
      else {
        return res.status(400).json({
          type: "Invalid",
          msg: "Invalid request",
        });
      }
      let data = cart.save();
      res.status(200).json({
        type: "success",
        mgs: "Process successful",
        data: data,
      });
    }
    //------------ This creates a new cart and then adds the item to the cart that has been created------------
    else {
      const cartData = {
        items: [
          {
            productId: productDetails.productId,
            quantity: quantity,
            name: productDetails.name,
            total: productDetails.price * quantity,
            price: productDetails.price,
          },
        ],
        userId: userId,
        subTotal: parseInt(productDetails.price * quantity),
      };
      let data = db.create(cartData);
      res.json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "Invalid",
      msg: "Something went wrong",
      err: err,
    });
  }
};

getCart = async (req, res) => {
  try {
    let cart = await db.findOne({ userId: req.params.userId }).exec();
    if (!cart) {
      return res.status(400).json({
        type: "Invalid",
        msg: "Cart not Found",
      });
    }
    res.status(200).json({
      status: true,
      data: cart,
    });
  } catch (err) {
    res.status(400).json({
      type: "Invalid",
      msg: "Something went wrong",
      err: err,
    });
  }
};

emptyCart = async (req, res) => {
  try {
    let cart = await db.findOneAndDelete({ userId: req.params.userId }).exec();
    res.status(200).json({
      type: "success",
      mgs: "Cart has been emptied",
      data: cart,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      type: "Invalid",
      msg: "Something went wrong",
      err: err,
    });
  }
};

router.post("/cart", addItemToCart);
router.get("/cart/:userId", getCart);
router.delete("/cart/:userId", emptyCart);

module.exports = router;
