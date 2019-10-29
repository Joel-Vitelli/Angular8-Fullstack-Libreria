//const express = require("express");
const router = require("express-promise-router")();

const rubroController = require("../controllers/rubroController");
const aperturaController = require("../controllers/aperturaController");
const articuloController = require("../controllers/articuloController");
const clienteController = require("../controllers/clienteController");
const artOfertaController = require("../controllers/artOfertaController");
const detallePedidoController = require("../controllers/detallePedidoController");
const pedidoController = require("../controllers/pedidoController");
const facturaController = require("../controllers/facturaController");
const userController = require("../controllers/userController");

//Router Rubro
const rubroStr = "/rubro";
router.get(rubroStr, rubroController.getAll);
router.get(rubroStr + "/:id", rubroController.getOne);
router.post(rubroStr, rubroController.insertRubro);
router.put(rubroStr + "/:id", rubroController.updateRubro);
router.delete(rubroStr + "/:id", rubroController.deleteRubro);

//Router Apertura
const aperturaStr = "/apertura";
router.get(aperturaStr, aperturaController.getAll);
router.get(aperturaStr + "/:id", aperturaController.getOne);
router.post(aperturaStr, aperturaController.insertApertura);
router.post(aperturaStr + "/byquery", aperturaController.getByQuery);
router.put(aperturaStr + "/:id", aperturaController.updateApertura);

//Router Articulo
const articuloStr = "/articulo";
router.get(articuloStr, articuloController.getAll);
router.get(articuloStr + "/:id", articuloController.getOne);
router.get("/totalsales", articuloController.getTotalSales);
router.post(
  articuloStr + "/decreasestock",
  articuloController.decreaseStockArticulo
);
router.post(articuloStr, articuloController.insertArticulo);
router.post(articuloStr + "/byquery", articuloController.getByQuery);
router.put(articuloStr + "/:id", articuloController.updateArticulo);
router.delete(articuloStr + "/:id", articuloController.deleteArticulo);

const artOfertaStr = "/oferta";
router.get(artOfertaStr, artOfertaController.getAll);
router.get(artOfertaStr + "/:id", artOfertaController.getOne);
router.post(
  artOfertaStr,
  artOfertaController.insertArticuloOferta
);
router.put(
  artOfertaStr + "/:id",
  artOfertaController.updateArticuloOferta
);
router.delete(
  artOfertaStr + "/:id",
  artOfertaController.deleteArticuloOferta
);

//Router Cliente
const clienteStr = "/cliente";
router.get(clienteStr, clienteController.getAll);
router.get(clienteStr + "/:id", clienteController.getOne);
router.get(clienteStr + "/byemail/:email", clienteController.getClientByEmail);
router.post(clienteStr + "/byquery/", clienteController.getClientByQuery);
router.post(clienteStr, clienteController.insertCliente);
router.put(clienteStr + "/:id", clienteController.updateCliente);
router.delete(clienteStr + "/:id", clienteController.deleteCliente);

//Router Detalle Pedido
const detallePedidoStr = "/detallepedido";
router.get(detallePedidoStr, detallePedidoController.getAll);
router.get(detallePedidoStr + "/:id", detallePedidoController.getOne);
router.post(detallePedidoStr, detallePedidoController.insertDetallePedido);
router.put(
  detallePedidoStr + "/:id",
  detallePedidoController.updateDetallePedido
);
router.delete(
  detallePedidoStr + "/:id",
  detallePedidoController.deleteDetallePedido
);

//Router Pedido
const pedidoStr = "/pedido";
router.get(pedidoStr, pedidoController.getAll);
router.get(pedidoStr + "/:id", pedidoController.getOne);
router.post("/pedidobycliente/", pedidoController.getByCliente);
router.post(pedidoStr, pedidoController.insertPedido);
router.post(pedidoStr + "/byquery/", pedidoController.getByQuery);
router.put(pedidoStr + "/:id", pedidoController.updatePedido);
router.delete(pedidoStr + "/:id", pedidoController.deletePedido);

//Router User
const userStr = "/user";
router.get(userStr, userController.getAll);
router.get(userStr + "/:id", userController.getOne);
router.post(userStr, userController.insertUser);
router.post(userStr + "/email", userController.getbyEmail);
router.put(userStr + "/:id", userController.updateUser);
router.delete(userStr + "/:id", userController.deleteUser);

//Router Facturas
const FacturaStr = "/Factura";
router.get(FacturaStr, facturaController.getAll);
router.get(FacturaStr + "/:id", facturaController.getOne);
router.post(FacturaStr + "/byquery/", facturaController.getByQuery);
router.post(FacturaStr, facturaController.insertFactura);

module.exports = router;
