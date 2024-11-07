const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); 
const jwtSecret = "Mynameismohammadmuneebahmedcvrce";
router.post(
  "/CreateUser",
  body("email").isEmail(),
  body("name").isLength({ min: 5 }),
  body("password", "Incorrect_Password").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);
      console.log("-----------------------------------------------------"+req.body);
      
      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      });

      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

router.post("/loginuser",
  [body("email").isEmail(), body("password", "Incorrect_Password").isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    let email = req.body.email;
    try {
      // Find the user by email
      let userData = await User.findOne({ email });
      
      if (!userData) {       
        // If the user is not found
        return res.status(400).json({ error: "Invalid credentials, user not found" });
      }

      // Debugging: Log the passwords to ensure they are correct
      console.log("Provided password:", req.body.password);
      console.log("Stored hashed password:", userData.password);

      // Compare provided password with the hashed password in the database
      const pwdcompare = await bcrypt.compare(req.body.password, userData.password);
      console.log("pc:"+pwdcompare);
      if (!pwdcompare) {
        // If password comparison fails
        return res.status(400).json({ error: "Invalid password" });
      }

      // Create JWT token for authenticated user
      const data = {
        user: {
          id: userData.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);
      return res.json({ success: true, authToken: authToken });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

module.exports = router;
