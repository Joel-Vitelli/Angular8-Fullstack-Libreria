const DetallePedido = require("./../models/detallePedido");

const getAll = async (req, res) => {
  const detalles = await DetallePedido.find({})
    .populate("articulo") //solo consulto la denominacion.
    .exec((err, doc) => {
      res.status(200).json(doc);
    });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const detallePedido = await DetallePedido.findById({ _id: id });
  res.status(200).json(detallePedido);
};

const insertDetallePedido = async (req, res) => {
  const newDetalle = new DetallePedido(req.body);
  const detallePedido = await newDetalle.save();
  res.status(200).json(detallePedido);
};

const updateDetallePedido = async (req, res) => {
  const { id } = req.params;
  const detallePedido = req.body;
  const result = await DetallePedido.findByIdAndUpdate(id, detallePedido);
  res.status(200).json({ _id: id, detallePedido: detallePedido });
};

const deleteDetallePedido = async (req, res) => {
  const { id } = req.params;
  const result = await DetallePedido.findByIdAndDelete(id);
  res.status(200).json(result);
};

module.exports = {
  getAll,
  getOne,
  insertDetallePedido,
  updateDetallePedido,
  deleteDetallePedido
};
