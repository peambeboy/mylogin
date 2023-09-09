const express = require('express');
const router = express.Router();

// เพิ่มการรองรับการแสดง HTML โดยใช้ res.sendFile
router.get('/', function(req, res, next) {
  // ระบุไฟล์ HTML ที่คุณต้องการแสดง
  res.sendFile(__dirname + '/index.html');
});

module.exports = router;
