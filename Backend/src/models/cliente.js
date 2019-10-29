const moongose = require("mongoose");

const Schema = moongose.Schema;

const clienteSchema = new Schema({
  nombre: String,
  apellido: String,
  telefono: Number,
  email: String,
  creacion: Date,
  domicilio: {
    calle: String,
    numero: Number,
    localidad: String
  }
});

const Cliente = moongose.model("cliente", clienteSchema);

module.exports = Cliente;
