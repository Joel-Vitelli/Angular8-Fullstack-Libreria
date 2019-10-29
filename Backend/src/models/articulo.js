const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articuloSchema = new Schema({
  denominacion: String,
  precioCompra: mongoose.Types.Decimal128,
  precioVenta: mongoose.Types.Decimal128,
  stockActual: mongoose.Types.Decimal128,
  unidadMedidad: String,
  esInsumo: Boolean,
  rubro: String
});

// con decimal 128 obtengo un objeto json que no es correcto y lo trasformo con set
articuloSchema.set("toJSON", {
  transform: (doc, art) => {
    art.precioCompra = parseFloat(art.precioCompra);
    art.precioVenta = parseFloat(art.precioVenta);
    art.stockActual = parseFloat(art.stockActual);
    return art;
  }
});

const Articulo = mongoose.model("articulo", articuloSchema);

module.exports = Articulo;
