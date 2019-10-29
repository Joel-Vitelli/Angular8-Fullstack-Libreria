const Articulo = require("./../models/articulo");
const Pedido = require("./../models/pedido");
const ArticuloOferta = require("./../models/articuloOferta");
const DetallePedido = require("./../models/detallePedido");

const getAll = async (req, res) => {
  const articulos = await Articulo.find({});
  res.status(200).json(articulos);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const articulo = await Articulo.findById({ _id: id });
  res.status(200).json(articulo);
};

const getByQuery = async (req, res) => {
  const query = req.body;
  const articulos = await Articulo.find(query, (err, doc) => {
    if (!err) {
      return doc;
    }
  });
  res.status(200).json(articulos);
};

const getTotalSales = async (req, res) => {
  const data = [];
  const articulos = await DetallePedido.aggregate([
    {
      $group: {
        _id: {
          articulo: "$articulo",
          onModel: "$onModel"
        },
        cantidad: { $sum: "$cantidad" }
      }
    },
    { $sort: { cantidad: -1 } }
  ]).exec();
  for (const art of articulos) {
    switch (art._id.onModel) {
      case "articulo":
        const a = await Articulo.findOne({ _id: art._id.articulo });
        await data.push({
          articulo: a.denominacion,
          cantidad: art.cantidad,
          precio: parseFloat(a.precioVenta)
        });
        break;
      case "articulooferta":
        const am = await ArticuloOferta.findOne({
          _id: art._id.articulo
        });

        await data.push({
          articulo: am.nombre,
          cantidad: art.cantidad,
          precio: parseFloat(am.precio)
        });
        break;
    }
  }
  res.status(200).json(data);
};

const insertArticulo = async (req, res) => {
  const newArticulo = new Articulo(req.body);
  const articulo = await newArticulo.save();
  const io = req.app.get("io");
  io.emit("refreshArticulo");
  res.status(200).json(articulo);
};

const updateArticulo = async (req, res) => {
  const { id } = req.params;
  const articulo = req.body;
  const result = await Articulo.findByIdAndUpdate(id, articulo);
  const io = req.app.get("io");
  io.emit("refreshArticulo");
  res.status(200).json({ _id: id, articulo: articulo });
};

const deleteArticulo = async (req, res) => {
  const { id } = req.params;
  const f = await ArticuloOferta.find({
    "detalle.articulo": { $in: id }
  }).exec();
  if (f) {
    res.status(403).json({ err: "exist" });
    return;
  }
  const d = await DetallePedido.find({
    articulo: { $in: id }
  }).exec();

  if (d) {
    res.status(403).json({ err: "exist" });
    return;
  }

  const result = await Articulo.findByIdAndDelete(id);
  const io = req.app.get("io");
  io.emit("refreshArticulo");
  res.status(200).json(result);
};

const decreaseStockArticulo = async (req, res) => {
  const queries = req.body;
  for (const q of queries) {
    await Articulo.findOneAndUpdate(
      { _id: q._id },
      { $inc: { stockActual: -q.cantidad } }
    );
  }
  res.status(200).json(queries);
  const io = req.app.get("io");
  io.emit("refreshArticuloXStock");
};

module.exports = {
  getAll,
  getOne,
  getByQuery,
  insertArticulo,
  updateArticulo,
  deleteArticulo,
  decreaseStockArticulo,
  getTotalSales
};
