const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: String,
  password: String,
  email   : String,
  created_at: {
    type: String,
    default: () => {
      const now = new Date();
      now.setHours(now.getHours() + 7);
      return now.toISOString().slice(0, 19).replace("T", " ");
    },
  },
  updated_at: {
    type: String,
    default: () => {
      const now = new Date();
      now.setHours(now.getHours() + 7);
      return now.toISOString().slice(0, 19).replace("T", " ");
    },
  },
});

module.exports = mongoose.model("Users", UsersSchema);
