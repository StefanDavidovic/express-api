const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//REGISTER

router.post("/register", async (req,res)=>{
  const newUser = new User({
    username:req.body.username,
    email:req.body.email,
    password: CryptoJS.AES.encrypt(JSON.stringify(req.body.password), process.env.PASS_SEC).toString()
  })
  try{
    const savedUser = await newUser.save();
    res.status(201).json(savedUser)
  }catch(err){
    res.status(500).json(err);
  }

})


router.post("/login", async (req,res)=>{
  try{
    const user = await User.findOne({username:req.body.username});
    if(!user){
      return res.status(401).json("Wrong credentials");
    }

    const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const originalPassword = hashedPass.toString(CryptoJS.enc.Utf8);

    if(originalPassword !== req.body.password){
      return res.status(401).json("Wrong Credentials");
    }

    const accessToken = jwt.sign(
    {
      id:user.id,
      isAdmin:user.isAdmin
    }, 
      process.env.JWT_SEC_KEY,
      {expiresIn:"3d"}
    );

    const {password, ...others} = user._doc;

    return res.status(200).json({...others, accessToken});
  }catch(err){
    return res.status(500).json(err);
  };
})

module.exports = router