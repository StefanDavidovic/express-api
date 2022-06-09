const User = require("../models/User");
const verifyTokenAndAuthorization = require("./verifyToken");
const verify = require("./verifyToken");
const verifyToken = require("./verifyToken");

const router = require("express").Router();

//USERS

router.get("/", verify.verifyTokenAndAdmin, async (req, res) => {
  try {
    const query = req.query.new;
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(2)
      : await User.find();
    const usersWithoutPass = users.map((user) => {
      const { password, ...others } = user._doc;
      return others;
    });
    res.status(200).json(usersWithoutPass);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER

router.get("/:id", verify.verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//EDIT

router.put("/:id", verify.verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      JSON.stringify(req.body.password),
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id", verify.verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (err) {
    res.status(500).json("User cannot be deleted!");
  }
});

module.exports = router;
