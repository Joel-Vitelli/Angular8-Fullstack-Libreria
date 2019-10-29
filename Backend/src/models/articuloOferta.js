const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articuloOfertaSchema = new Schema({
  tiempoDeCoccion: Number,
  nombre: String,
  precio: Schema.Types.Decimal128,
  detalle: [
    {
      cantidad: Schema.Types.Decimal128,
      articulo: { type: Schema.Types.ObjectId, ref: "articulo" }
    }
  ]
});

articuloOfertaSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.precio = parseFloat(ret.precio);
    ret.detalle = ret.detalle.map(d => {
      return { cantidad: parseFloat(d.cantidad), articulo: d.articulo };
    });
  }
});

const ArticuloOferta = mongoose.model(
  "articulooferta",
  articuloOfertaSchema
);

module.exports = ArticuloOferta;
