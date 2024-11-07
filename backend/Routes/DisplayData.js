const express = require("express");
const router = express.Router();

router.post('/foodData',(req,res)=>{
    try{
        // console.log(global.sample)
        res.send([global.sample,global.foodCategory])
    }
    catch(error)
    {
        console.log(error.message)
        res.send("Server error")
    }
})

module.exports = router;

