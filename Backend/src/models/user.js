const moongose = require("mongoose");

const Schema = moongose.Schema;

const userSchema = new Schema({
  email: String,
  roles: [String],
  name: String
});
//cliente
const User = moongose.model("user", userSchema);

module.exports = User;
