const Factura = require("../models/factura");

const getAll = async (req, res) => {
  const facturas = await Factura.find({})
    .populate({ path: "pedido", populate: { path: "cliente" } })
    .populate("detalles")
    .exec();
  res.status(200).json(facturas);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const factura = await Factura.findById({ _id: id });
  res.status(200).json(factura);
};

const getByQuery = async (req, res) => {
  const query = req.body;
  const factura = await Factura.find(query, (err, docs) => {
    if (!err) {
      return docs;
    }
  })
    .populate({ path: "pedido", populate: { path: "cliente" } })
    .populate("detalles")
    .exec();
  res.status(200).json(factura);
};

const insertFactura = async (req, res) => {
  const newFactura = new Factura(req.body);
  
  const lastF = await Factura.findOne({})
    .sort({ numero: -1 })
    .exec();
  newFactura.numero = (await !lastF) ? 1 : lastF.numero + 1;
  const factura = await newFactura.save();
  res.status(200).json(factura);
  const io = req.app.get("io");
  io.emit("facturaAdded");
};

module.exports = {
  getAll,
  getOne,
  getByQuery,
  insertFactura
};
