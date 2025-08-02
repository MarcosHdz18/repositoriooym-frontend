// Contrato con los datos del empate con el servicio REST del backend
export interface SitioElement {
  idSitio: number;
  nombre: string;
  treeChar: string;
  direccion: string;
  nombreContacto: string;
  telefonoContacto: string;
  correoContacto: string;
  region: {
    idRegion: number;
    nombre: string;
  }
}