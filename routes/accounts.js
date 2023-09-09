const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const { DateTime } = require("luxon");

router.get("/", (req, res, next) => {
  Users.find()
    .then((account) => {
      res.json(account);
    })
    .catch((err) => {
      console.error("Error while retrieving data:", err);
      next(err);
    });
});

router.get("/:id", (req, res, next) => {
  Users.findById(req.params.id)
    .then((account) => {
      if (!account) {
        console.error("Data not found");
        return res.status(404).json({ error: "Data not found" });
      }
      console.log("Data found:", account);
      res.json(account);
    })
    .catch((err) => {
      console.error("Error while retrieving data:", err);
      next(err);
    });
});

router.put("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = {
      ...req.body,
      updated_at: DateTime.now()
        .setZone("Asia/Bangkok")
        .toFormat("yyyy-MM-dd HH:mm:ss"),
    };

    // Check if the updated username or email already exists in the database
    const existingUser = await Users.findOne({
      $or: [{ username: updatedData.username }, { email: updatedData.email }],
      _id: { $ne: id }, // Exclude the current user's ID from the search
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Update the user
    const updatedUser = await Users.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User updated:", updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error("Error while updating user:", err);
    next(err);
  }
});


router.delete("/delete/:id", (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    console.error("Invalid id");
    return res.status(400).json({ error: "Invalid id" });
  }

  Users.findByIdAndRemove(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        console.error("User not found");
        return res.status(404).json({ error: "User not found" });
      }
      console.log("User deleted:", deletedUser);
      res.json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      console.error("Error while deleting user:", err);
      next(err);
    });
});

module.exports = router;
