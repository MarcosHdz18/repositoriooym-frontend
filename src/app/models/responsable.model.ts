/**
   * Contrato para obtener los registros de los responsables
   */
export interface ResponsableElement {
  idResponsable: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroEmpleado: number;
  area: {
    idArea: number;
    nombre: string;
  };
}