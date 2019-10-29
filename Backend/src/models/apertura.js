const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const apreturaSchema = new Schema({
  nrodia: Number,
  apertura: String,
  cierre: String,
  especial: String
});

const Apretura = mongoose.model("apertura", apreturaSchema);

module.exports = Apretura;
