const ArticuloOferta = require("./../models/articuloOferta");
const DetallePedido = require("./../models/articuloOferta");
//User.update( {_id: req.body.email}, { $pull: { favoriteMovies: { id: req.params.id} }
//}, function(err, model){})
// usar pull para eliminar un articulo dentro del objeto art Oferta.

const getAll = async (req, res) => {
  const articulos = await ArticuloOferta.find({})
    .populate("detalle.articulo")
    .exec();
  res.status(200).json(articulos);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const articulo = await ArticuloOferta.findById({ _id: id });
  res.status(200).json(articulo);
};

const updateArticuloOferta = async (req, res) => {
  const { id } = req.params;
  const articulo = req.body;
  const result = await ArticuloOferta.findByIdAndUpdate(id, articulo);
  res.status(200).json({ _id: id, articulo: articulo });
  const io = req.app.get("io");
  io.emit("refreshOferta");
};

const deleteArticuloOferta = async (req, res) => {
  const { id } = req.params;

  const result = await ArticuloOferta.findByIdAndDelete(id);
  res.status(200).json(result);
  const io = req.app.get("io");
  io.emit("refreshOferta");
};

const insertArticuloOferta = async (req, res) => {
  const data = req.body;
  const artOferta = new ArticuloOferta(data);
  const newArt = await artOferta.save();
  const io = req.app.get("io");
  io.emit("refreshOferta");
  res.status(200).json(newArt);
};

module.exports = {
  getAll,
  getOne,
  updateArticuloOferta,
  deleteArticuloOferta,
  insertArticuloOferta
};

// const insertArticuloOferta = async (req, res) => {
//   const data = req.body;
//   const artOferta = new ArticuloOferta(data);
//   artOferta.detalle = await ArtDetalle.insertMany(data.detalle);
//   const newArt = await artOferta.save();
//   res.status(200).json(newArt);
// };
// para este metodo debo enviar un json como el siguiente
/* {
  "tiempoDeCoccion": 20,
  "nombre": "rodriguez",
  "precio": "1231234234",
  "detalle": [{
    "cantidad": 2,
    "articulo": "5cef2e31eaa3e91b1443c815"
  },{

    "cantidad": 3,
    "articulo": "5cef2e31eaa3e91b1443c815"
  }]
} */
