const Rubro = require("./../models/rubro");

const getAll = async (req, res) => {
  const rubros = await Rubro.find({});
  res.status(200).json(rubros);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const rubro = await Rubro.findById({ _id: id });
  res.status(200).json(rubro);
};

const insertRubro = async (req, res) => {
  const newRubro = new Rubro(req.body);
  const rubro = await newRubro.save();
  res.status(200).json(rubro);
};

const updateRubro = async (req, res) => {
  const { id } = req.params;
  const rubro = req.body;
  const result = await Rubro.findByIdAndUpdate(id, rubro);
  res.status(200).json({ _id: id, rubro: rubro });
};

const deleteRubro = async (req, res) => {
  const { id } = req.params;
  const result = await Rubro.findByIdAndDelete(id);
  res.status(200).json(result);
};

module.exports = { getAll, getOne, insertRubro, updateRubro, deleteRubro };
