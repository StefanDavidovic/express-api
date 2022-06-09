const router = require("express").Router();

const Cart = require("../models/Cart");
const verify = require("./verifyToken");

//ALL

router.get("/",verify.verifyTokenAndAdmin, async (req, res) => {

  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  }catch(err){
    res.status(500).json(err);
  }
});

// //GET USER CARTS

router.get("/:userId", verify.verifyTokenAndAuthorization,async (req, res) => {
  try {
    const cart = await Cart.find({userId:req.params.userId});
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//CREATE

router.post("/", verify.verifyToken, async (req,res) => {
  const newCart = new Cart(req.body);

  try{
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  }catch(err){
    res.status(500).json(err)
  };
})

//EDIT

router.put("/:id", verify.verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id", verify.verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted!");
  } catch (err) {
    res.status(500).json("Cart cannot be deleted!");
  }
});


module.exports = router