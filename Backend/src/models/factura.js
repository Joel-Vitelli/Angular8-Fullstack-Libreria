const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const facturaSchema = new Schema({
  fecha: Date,
  numero: Number,
  montoDescuento: Schema.Types.Decimal128,
  total: Schema.Types.Decimal128,
  pedido: {
    type: Schema.Types.ObjectId,
    ref: "pedido"
  },
  detalles: [
    {
      type: Schema.Types.ObjectId,
      ref: "detallepedido"
    }
  ]
});

facturaSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.montoDescuento = parseFloat(ret.montoDescuento);
    ret.total = parseFloat(ret.total);
  }
});

const Factura = mongoose.model("factura", facturaSchema);

module.exports = Factura;
