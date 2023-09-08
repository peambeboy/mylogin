const express = require("express");
const router = express.Router();
const Users = require("../models/Users");

router.post("/checkUsername", async (req, res) => {
    const { username } = req.body;
    
    try {
      // ตรวจสอบว่าชื่อผู้ใช้ซ้ำกันหรือไม่
      const existingUser = await Users.findOne({ username });
      
      if (existingUser) {
        res.json({ isUsernameTaken: true });
      } else {
        res.json({ isUsernameTaken: false });
      }
    } catch (error) {
      console.error("Error checking username:", error);
      res.status(500).json({ errorMessage: "Internal Server Error" });
    }
  });

router.post("/", async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "โปรดกรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    // ตรวจสอบว่าชื่อผู้ใช้หรืออีเมลซ้ำกันหรือไม่
    const existingUser = await Users.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        errorMessage: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้แล้ว",
      });
    }

    // สร้างบัญชีผู้ใช้ใหม่และบันทึกลงในฐานข้อมูล
    const newUser = new Users({ username, email, password });
    await newUser.save();

    res.status(200).json({ success: true, message: "สมัครสมาชิกสำเร็จ",newUser });
  } catch (error) {
    console.error("Error creating data:", error);
    res
      .status(500)
      .json({ success: false, errorMessage: "Internal Server Error" });
  }
});

module.exports = router;