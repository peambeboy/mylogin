const express = require("express");
const router = express.Router();
const Users = require("../models/Users");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ username, password }).exec();

    if (user) {
      res.json({ success: true, message: "ล็อคอินสำเร็จ", user: user });
    } else {
      res.status(400).json({
        success: false,
        errorMessage: "ขออภัย ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "เกิดข้อผิดพลาดในการค้นหาผู้ใช้" });
  }
});

module.exports = router;
