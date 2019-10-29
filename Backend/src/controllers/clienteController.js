const Cliente = require("./../models/cliente");

const getAll = async (req, res) => {
  const clientes = await Cliente.find({});
  res.status(200).json(clientes);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const cliente = await Cliente.findById({ _id: id });
  res.status(200).json(cliente);
};

const getClientByQuery = async (req, res) => {
  const query = req.body;
  const cliente = await Cliente.find(query).exec();
  res.status(200).json(cliente);
};

const getClientByEmail = async (req, res) => {
  const { email } = req.params;
  const cliente = await Cliente.findOne({ email: email }, (err, doc) => {
    if (!err) {
      return doc;
    }
  });
  return res.status(200).json(cliente);
};

const insertCliente = async (req, res) => {
  const newCliente = new Cliente(req.body);
  const cliente = await newCliente.save();
  res.status(200).json(cliente);
};

const updateCliente = async (req, res) => {
  const { id } = req.params;
  const cliente = req.body;
  const result = await Cliente.findByIdAndUpdate(id, cliente);
  res.status(200).json({ _id: id, cliente: cliente });
};

const deleteCliente = async (req, res) => {
  const { id } = req.params;
  const result = await Cliente.findByIdAndDelete(id);
  res.status(200).json(result);
};

module.exports = {
  getAll,
  getOne,
  insertCliente,
  getClientByEmail,
  getClientByQuery,
  updateCliente,
  deleteCliente
};
