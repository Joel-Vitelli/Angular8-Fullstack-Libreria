const Apertura = require("./../models/apertura");

const getAll = async (req, res) => {
  const aperturas = await Apertura.find({});
  res.status(200).json(aperturas);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const apertura = await Apertura.findById({ _id: id });
  res.status(200).json(apertura);
};

const getByQuery = async (req, res) => {
  const query = req.body;
  const result = await Apertura.find(query, (err, doc) => {
    if (!err) {
      return doc;
    }
  });
  res.status(200).json(result);
};

const insertApertura = async (req, res) => {
  const newApertura = new Apertura(req.body);
  const apertura = await newApertura.save();
  const io = req.app.get("io");
  io.emit("refreshHorario");
  res.status(200).json(apertura);
};

const updateApertura = async (req, res) => {
  const { id } = req.params;
  const apertura = req.body;
  const result = await Apertura.findOneAndUpdate({ _id: id }, apertura);
  res.status(200).json(result);
  const io = req.app.get("io");
  io.emit("refreshHorario");
};

module.exports = {
  getAll,
  getOne,
  getByQuery,
  updateApertura,
  insertApertura
};
