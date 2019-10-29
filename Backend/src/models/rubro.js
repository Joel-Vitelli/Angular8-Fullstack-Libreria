const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rubroSchema = new Schema({
  denominacion: String
});

const Rubro = mongoose.model("rubro", rubroSchema);

module.exports = Rubro;
