const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const detallePedidoSchema = new Schema({
  cantidad: Number,
  subtotal: mongoose.Types.Decimal128,
  //Puede ir un tipo de Oferta o uno común!
  articulo: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "onModel", //referencia para populate segun tipo
    autopopulate: true
  },
  onModel: {
    type: String,
    require: true,
    enum: ["articulo", "articulooferta"] // tipos son iguales a ref de path de creacion de modelo.
  }
});

detallePedidoSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.subtotal = parseFloat(ret.subtotal);
  }
});

detallePedidoSchema.plugin(require("mongoose-autopopulate"));
const DetallePedido = mongoose.model("detallepedido", detallePedidoSchema);

module.exports = DetallePedido;
