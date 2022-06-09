const Order = require("../models/Order");
const verify = require("./verifyToken");

const router = require("express").Router();


router.get("/income", verify.verifyTokenAndAdmin, async (req,res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  console.log(previousMonth)
  try{
    
    const income = await Order.aggregate([
      {$match:{ createdAt:{ $gte: previousMonth } } },
      {
        $project:{ 
          month:{$month:"$createdAt"},
          sales:"$amount",
        },
      },
      {
        $group:{
          _id:"$month",
          total:{$sum:"$sales"},
        },
      },
    ]);
    
    res.status(200).json(income);
  }catch(err){
    res.status(500).json(err);
  }
});

//GET ALL

router.get("/",verify.verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({"bla":"bla"});
  }catch(err){
    res.status(500).json(err);
  }
});

//GET USER ORDERS

router.get("/:userId", verify.verifyTokenAndAuthorization,async (req, res) => {
  try {
    const orders = await Order.find({userId:req.params.userId});
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//CREATE

router.post("/", verify.verifyToken, async (req,res) => {
  const newOrder = new Order(req.body);

  try{
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  }catch(err){
    res.status(500).json(err)
  };
})

//EDIT

router.put("/:id", verify.verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //DELETE

router.delete("/:id", verify.verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted!");
  } catch (err) {
    res.status(500).json("Order cannot be deleted!");
  }
});



module.exports = router