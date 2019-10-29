const Pedido = require("./../models/pedido");
const DetallePedido = require("./../models/detallePedido");

const getAll = async (req, res) => {
  const pedidos = await Pedido.find({})
    .populate("cliente")
    .populate("detalles")
    .exec();
  res.status(200).json(pedidos);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const pedido = await Pedido.findOne({ _id: id })
    .populate("cliente")
    .populate("detalles")
    .exec();
  res.status(200).json(pedido);
};

const getByQuery = async (req, res) => {
  const query = req.body;
  const pedido = await Pedido.find(query, (err, docs) => {
    if (!err) {
      return docs;
    }
  })
    .populate("cliente")
    .populate("detalles")
    .exec();
  res.status(200).json(pedido);
};

const getByCliente = async (req, res) => {
  const forQuery = req.body;
  const pedidos = await Pedido.aggregate([
    {
      $match: {
        fecha: {
          $gte: new Date(forQuery.initDate),
          $lt: new Date(forQuery.endDate)
        }
      }
    },
    {
      $group: {
        _id: "$cliente",
        pedidos: { $push: { id: "$_id" } }
      }
    },
    {
      $lookup: {
        from: "clientes",
        localField: "_id",
        foreignField: "_id",
        as: "cliente_ref"
      }
    },
    {
      $lookup: {
        from: "pedidos",
        localField: "pedidos.id",
        foreignField: "_id",
        as: "pedidos_ref"
      }
    }
  ]).exec();
  const result = pedidos.map(x => {
    return {
      cliente: x.cliente_ref[0],
      pedidos: x.pedidos_ref
    };
  });

  res.status(200).json(result);
};

const insertPedido = async (req, res) => {
  const newPedido = new Pedido(req.body);
  newPedido.detalles = await DetallePedido.insertMany(req.body.detalles).then(
    data => {
      return data;
    }
  );
  const lastP = await Pedido.findOne({})
    .sort({ numero: -1 })
    .exec();
  newPedido.numero = (await !lastP) ? 1 : lastP.numero + 1;
  const pedido = await newPedido.save();
  res.status(200).json(pedido);
  const io = req.app.get("io");
  io.emit("refreshPedido");
};

const updatePedido = async (req, res) => {
  const { id } = req.params;
  const pedido = req.body;
  const result = await Pedido.findByIdAndUpdate(id, pedido);
  res.status(200).json({ _id: id, pedido: pedido });
  const io = req.app.get("io");
  io.emit("refreshPedido");
};

const deletePedido = async (req, res) => {
  const { id } = req.params;
  const result = await Pedido.findByIdAndDelete(id);
  res.status(200).json(result);
  const io = req.app.get("io");
  io.emit("refreshPedido");
};

module.exports = {
  getAll,
  getOne,
  insertPedido,
  updatePedido,
  deletePedido,
  getByQuery,
  getByCliente
};
