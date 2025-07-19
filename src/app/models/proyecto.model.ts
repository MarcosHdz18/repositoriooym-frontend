/**
 * Representa un proyecto en la aplicación.
 * Sirve tanto para listados como para editar/crear.
 */
export interface ProyectoElement {
  idProyecto:        number;
  nombre:            string;
  fechaLiberacion:   string;       // en ISO (YYYY-MM-DD) o "Pendiente"
  anio?:             number;       // campo calculado con @Transient en backend
  nodos:             string;       // la cadena completa
  nodosList?:        string[];     // opcional: array de nodos ya parseados

  // Id del responsable (en lugar de objeto completo)
  responsableProyecto: {
    idResponsable: number;
    nombre:        string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };

  // Campos de los nombres de archivo que guardas
  f60:               string;
  lld:               string;
  hld:               string;
  layout:            string;
  sla:               string;
  reporteFotografico:string;
  asignacionFuerzaEspacio: string;
  inventarioHardware:      string;
  atpFisico:               string;
  atpFisicoFirmado:        string;
  atpLogico:               string;
  atpLogicoFirmado:        string;
  reporteTransferenciaOperativa: string;
  cartaResponsivaIaaS:    string;
  cartaResponsivaPlataforma: string;
  cartaResponsivaStorage: string;
  cartaResponsivaHA:      string;
  cartaResponsivaGsoc:    string;
}