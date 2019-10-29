const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pedidoSchema = new Schema({
  fecha: Date,
  numero: Number,
  estado: Number,
  horaEstimadaFin: Date,
  tipoEnvio: Number,
  cliente: {
    type: Schema.Types.ObjectId,
    ref: "cliente"
  },
  detalles: [
    {
      type: Schema.Types.ObjectId,
      ref: "detallepedido"
    }
  ]
});

const Pedido = mongoose.model("pedido", pedidoSchema);

module.exports = Pedido;
