export interface Cliente {
  _id?: string;
  nombre: string;
  apellido: string;
  telefono: number;
  email: string;
  creacion: Date;
  domicilio: {
    calle: string;
    numero: number;
    localidad: string;
  };
}
