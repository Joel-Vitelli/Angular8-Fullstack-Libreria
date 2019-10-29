export interface Articulo {
  _id: string;
  denominacion: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  unidadMedidad: string;
  esInsumo: boolean;
  rubro: string;
}
