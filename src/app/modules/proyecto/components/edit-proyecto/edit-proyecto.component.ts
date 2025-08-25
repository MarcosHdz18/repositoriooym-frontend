import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteElement } from 'src/app/models/cliente.model';
import { ProyectoElement } from 'src/app/models/proyecto.model';
import { ResponsableElement } from 'src/app/models/responsable.model';
import { SitioElement } from 'src/app/models/sitio.model';
import { TipoProyectoElement } from 'src/app/models/tipoProyectoElement';
import { ClienteService } from 'src/app/modules/shared/services/cliente.service';
import { ProyectoService } from 'src/app/modules/shared/services/proyecto.service';
import { ResponsableService } from 'src/app/modules/shared/services/responsable.service';
import { SitioService } from 'src/app/modules/shared/services/sitio.service';
import { TipoProyectoService } from 'src/app/modules/shared/services/tipoProyectoService.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';

@Component({
  selector: 'app-edit-proyecto',
  templateUrl: './edit-proyecto.component.html',
  styleUrls: ['./edit-proyecto.component.css']
})
export class EditProyectoComponent implements OnInit {

  nodosList: string[] = [];
  isPerfilApp: any;
  isPerfilInfraestructura: any;

  public proyectoForm!: FormGroup;
  tituloFormulario!: string;
  botonLabel!: string;
  responsables: ResponsableElement[] = [];
  tiposProyecto: TipoProyectoElement[] = [];
  sitios: SitioElement[] = [];
  clientes: ClienteElement[] = [];

  // Variables para almacenar los nombres de los archivos
  nombreArchivoF60: string = '';
  nombreArchivoLld: string = '';
  nombreArchivoHld: string = '';
  nombreArchivoLayout: string = '';
  nombreArchivoPresentacion: string = '';
  nombreArchivoSla: string = '';
  nombreArchivoReporteFotografico: string = '';
  nombreArchivoAsignacionFuerzaEspacio: string = '';
  nombreArchivoInventarioHardware: string = '';
  nombreArchivoAtpFisico: string = '';
  nombreArchivoAtpLogico: string = '';
  nombreArchivoRto: string = '';
  nombreArchivoCartaResponsivaPlataforma: string = '';
  nombreArchivoCartaResponsivaIaaS: string = '';
  nombreArchivoCartaResponsivaStorage: string = '';
  nombreArchivoCartaResponsivaGsoc: string = '';
  nombreArchivoCartaResponsivaHa: string = '';
  nombreArchivoAtpFisicoFirmado: string = '';
  nombreArchivoOtros: string = '';

  // Variables para almacenar los archivos seleccionados
  selectedFileF60: File | null = null;
  selectedFileLld: File | null = null;
  selectedFileHld: File | null = null;
  selectedFileLayout: File | null = null;
  selectedFilePresentacion: File | null = null;
  selectedFileSla: File | null = null;
  selectedFileReporteFotografico: File | null = null;
  selectedFileFuerzaEspacio: File | null = null;
  selectedFileInventario: File | null = null;
  selectedFileAtpFisico: File | null = null;
  selectedFileAtpLogico: File | null = null;
  selectedFileRto: File | null = null;
  selectedFileCartaPlataforma: File | null = null;
  selectedFileCartaIaaS: File | null = null;
  selectedFileCartaStorage: File | null = null;
  selectedFileCartaGsoc: File | null = null;
  selectedFileCartaHa: File | null = null;
  selectedFileAtpFisicoFirmado: File | null = null;
  selectedFileOtros: File | null = null;


  constructor( private fb: FormBuilder, private responsableService: ResponsableService, private tipoProyectoService: TipoProyectoService, 
    private sitioService: SitioService, private clienteService: ClienteService, private proyectoService: ProyectoService, private dialogRef: MatDialogRef<EditProyectoComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: ProyectoElement, private util: UtilsService ) {
    // Configuración del título y botón del formulario
    this.tituloFormulario = 'Actualizar';
    this.botonLabel = 'Actualizar';

    // Inicializar el formulario reactivo
    this.proyectoForm = this.fb.group({
      nombre: ['', Validators.required],
      nodosTexto: ['', Validators.required],
      fechaInicio: [null],
      fechaLiberacion: [null],
      responsable: [this.data.responsableProyecto.idResponsable, Validators.required],
      tipoProyecto: [this.data.tipoProyecto.idTipoProyecto, Validators.required],
      sitio: [this.data.sitio.idSitio, Validators.required],
      cliente: [this.data.cliente.idCliente, Validators.required],
      fileLld: ['',],
      fileF60: ['',],
      fileHld: ['',],
      fileLayout: [''],
      filePresentacion: [''],
      fileSla: [''],
      fileReporteFotografico: [''],
      fileAsignacionFuerzaEspacio: [''],
      fileInventarioHardware: [''],
      fileAtpFisico: [''],
      fileAtpLogico: [''],
      fileReporteTransferenciaOperativa: [''],
      fileCartaResponsivaPlataforma: [''],
      fileCartaResponsivaIaaS: [''],
      fileCartaResponsivaStorage: [''],
      fileCartaResponsivaGsoc: [''],
      fileCartaResponsivaHa: [''],
      fileAtpFisicoFirmado: [''],
      fileOtros: ['']
    });
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {

    this.isPerfilApp = this.util.isPerfilApp();
    this.isPerfilInfraestructura = this.util.isPerfilInfraestructura();

    // Fecha Inicio
    const fechaISOInicio = this.data.fechaInicio;
    let fechaInicioTransform: Date | null = null;

    if (fechaISOInicio && fechaISOInicio !== 'Pendiente') {
      // Convertir la fecha ISO a un objeto Date
      const [year, month, day] = fechaISOInicio.split('-').map(n => parseInt(n, 10));
      fechaInicioTransform = new Date(year, month - 1, day); // Meses en JavaScript son 0-indexados
    }

    // Convertir la fecha de liberación a un objeto Date si es necesario
    // Asumiendo que data.fechaLiberacion es una cadena en formato ISO o 'Pendiente'
    // Si es 'Pendiente', se dejará como null
    const fechaISO = this.data.fechaLiberacion;
    let fecha: Date | null = null;

    if (fechaISO && fechaISO !== 'Pendiente') {
      // Convertir la fecha ISO a un objeto Date
      const [year, month, day] = fechaISO.split('-').map(n => parseInt(n, 10));
      fecha = new Date(year, month - 1, day); // Meses en JavaScript son 0-indexados
    }

    // 1) parchear el formulario
    this.proyectoForm.patchValue({
      nombre: this.data.nombre,
      nodosTexto: this.data.nodos,
      fechaInicio: fechaInicioTransform ? fechaInicioTransform : null,
      fechaLiberacion: fecha ? fecha : null,
      responsable: this.data.responsableProyecto.idResponsable,
      tipoProyecto: this.data.tipoProyecto.idTipoProyecto,
      sitio: this.data.sitio.idSitio,
      cliente: this.data.cliente.idCliente
    });

    // 2) inicializar los nombres de archivo existentes
    this.nombreArchivoF60 = this.fileNameSinCarpeta(this.data.f60);
    this.nombreArchivoLld = this.fileNameSinCarpeta(this.data.lld);
    this.nombreArchivoHld = this.fileNameSinCarpeta(this.data.hld);
    this.nombreArchivoLayout = this.fileNameSinCarpeta(this.data.layout);
    this.nombreArchivoPresentacion = this.fileNameSinCarpeta(this.data.presentacion);
    this.nombreArchivoSla = this.fileNameSinCarpeta(this.data.sla);
    this.nombreArchivoReporteFotografico = this.fileNameSinCarpeta(this.data.reporteFotografico);
    this.nombreArchivoAsignacionFuerzaEspacio = this.fileNameSinCarpeta(this.data.asignacionFuerzaEspacio);
    this.nombreArchivoInventarioHardware = this.fileNameSinCarpeta(this.data.inventarioHardware);
    this.nombreArchivoAtpFisico = this.fileNameSinCarpeta(this.data.atpFisico);
    this.nombreArchivoAtpLogico = this.fileNameSinCarpeta(this.data.atpLogico);
    this.nombreArchivoRto = this.fileNameSinCarpeta(this.data.reporteTransferenciaOperativa);
    this.nombreArchivoCartaResponsivaPlataforma = this.fileNameSinCarpeta(this.data.cartaResponsivaPlataforma);
    this.nombreArchivoCartaResponsivaIaaS = this.fileNameSinCarpeta(this.data.cartaResponsivaIaaS);
    this.nombreArchivoCartaResponsivaStorage = this.fileNameSinCarpeta(this.data.cartaResponsivaStorage);
    this.nombreArchivoCartaResponsivaGsoc = this.fileNameSinCarpeta(this.data.cartaResponsivaGsoc);
    this.nombreArchivoCartaResponsivaHa = this.fileNameSinCarpeta(this.data.cartaResponsivaHA);
    this.nombreArchivoAtpFisicoFirmado = this.fileNameSinCarpeta(this.data.atpFisicoFirmado);
    this.nombreArchivoOtros = this.fileNameSinCarpeta(this.data.otros);

    this.getResponsables();
    this.getTiposProyecto();
    this.getSitiosProyecto();
    this.getClientesProyecto();
  }

  // Limpiar lista de nodos al iniciar el componente
  parseNodos() {
    const txt = this.proyectoForm.get('nodosTexto')!.value as string;
    this.nodosList = txt.split(/[\s,]+/).map(w => w.trim()).filter(w => w.length > 0);  // descartando cadenas vacías  
  }

  // Función para limpiar el nombre del archivo sin mostrar la carpeta o nombre del proyecto
  fileNameSinCarpeta(path: string): string {
    if (!path || path === 'NA') {
      return 'NA';
    }
    const parts = path.split('/');
    return parts[parts.length - 1];
  }

  /**
   * Metodo que obtiene todos los responsables del proyecto para pintarse en el select del formulario
   */
  getResponsables() {
    this.responsableService.getResponsables().subscribe((data: any) => {
      console.log("Respuesta del servicio responsables: ", data);
      this.responsables = data.responsableResponse.responsables;
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  /**
   * Metodo que obtiene todos los tipos de proyecto para pintarse en el select del formulario
   */
  getTiposProyecto() {
    this.tipoProyectoService.getTiposProyecto().subscribe((data: any) => {
      console.log("Respuesta del servicio tipos de proyecto: ", data);
      this.tiposProyecto = data.tipoProyectoResponse.tiposProyecto;
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  /**
   * Metodo que obtiene todos los sitios para pintarse en el select del formulario
   */
  getSitiosProyecto() {
    this.sitioService.getSitios().subscribe((data: any) => {
      console.log("Respuesta del servicio sitios: ", data);
      this.sitios = data.sitioResponse.sitios;
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  /**
   * Metodo que obtiene todos los clientes para pintarse en el select del formulario
   */
  getClientesProyecto() {
    this.clienteService.getClientes().subscribe((data: any) => {
      console.log("Respuesta del servicio clientes: ", data);
      this.clientes = data.clienteResponse.clientes;
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  /**
   * Metodo que obtiene el nombre del archivo y se muestra en el formulario
   * @param event evento que propicia la carga del archivo
   */
  onFileChangedLld(event: any) {
    this.selectedFileLld = event.target.files[0];
    this.nombreArchivoLld = event.target.files[0].name;
  }

  /**
   * Metodo que obtiene el nombre del archivo y se muestra en el formulario
   * @param event evento que propicia la carga del archivo
   */
  onFileChangedF60(event: any) {
    this.selectedFileF60 = event.target.files[0];
    this.nombreArchivoF60 = event.target.files[0].name;
  }

  /**
   * Metodo que obtiene el nombre del archivo y se muestra en el formulario
   * @param event evento que propicia la carga del archivo
   */
  onFileChangedHld(event: any) {
    this.selectedFileHld = event.target.files[0];
    this.nombreArchivoHld = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedLayout(event: any) {
    this.selectedFileLayout = event.target.files[0];
    this.nombreArchivoLayout = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedPresentacion(event: any) {
    this.selectedFilePresentacion = event.target.files[0];
    this.nombreArchivoPresentacion = event.target.files[0].name;
  }

  /**
   * Metodo que obtiene el nombre del archivo y se muestra en el formulario
   * @param event evento que propicia la carga del archivo
   */
  onFileChangedSla(event: any) {
    this.selectedFileSla = event.target.files[0];
    this.nombreArchivoSla = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedReporteFotografico(event: any) {
    this.selectedFileReporteFotografico = event.target.files[0];
    this.nombreArchivoReporteFotografico = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedFuerzaEspacio(event: any) {
    this.selectedFileFuerzaEspacio = event.target.files[0];
    this.nombreArchivoAsignacionFuerzaEspacio = event.target.files[0].name;
  }

  /**
 * Metodo que obtiene el nombre del archivo y se muestra en el formulario
 * @param event evento que propicia la carga del archivo
 */
  onFileChangedInventarioHardware(event: any) {
    this.selectedFileInventario = event.target.files[0];
    this.nombreArchivoInventarioHardware = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedAtpFisico(event: any) {
    this.selectedFileAtpFisico = event.target.files[0];
    this.nombreArchivoAtpFisico = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedAtpLogico(event: any) {
    this.selectedFileAtpLogico = event.target.files[0];
    this.nombreArchivoAtpLogico = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedRto(event: any) {
    this.selectedFileRto = event.target.files[0];
    this.nombreArchivoRto = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedCartaResponsivaPlataforma(event: any) {
    this.selectedFileCartaPlataforma = event.target.files[0];
    this.nombreArchivoCartaResponsivaPlataforma = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedCartaResponsivaIaaS(event: any) {
    this.selectedFileCartaIaaS = event.target.files[0];
    this.nombreArchivoCartaResponsivaIaaS = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedCartaResponsivaStorage(event: any) {
    this.selectedFileCartaStorage = event.target.files[0];
    this.nombreArchivoCartaResponsivaStorage = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedCartaResponsivaGsoc(event: any) {
    this.selectedFileCartaGsoc = event.target.files[0];
    this.nombreArchivoCartaResponsivaGsoc = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedCartaResponsivaHa(event: any) {
    this.selectedFileCartaHa = event.target.files[0];
    this.nombreArchivoCartaResponsivaHa = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedAtpFisicoFirmado(event: any) {
    this.selectedFileAtpFisicoFirmado = event.target.files[0];
    this.nombreArchivoAtpFisicoFirmado = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedOtros(event: any) {
    this.selectedFileOtros = event.target.files[0];
    this.nombreArchivoOtros = event.target.files[0].name;
  }

  /**
   * Metodo que realizara el guardado de los datos a traves del servicio REST destinado para tal fin
   */
  onSave() {

    const formData = new FormData();
    // campos de texto
    formData.append('nombre', this.proyectoForm.value.nombre);
    formData.append('nodos', this.proyectoForm.value.nodosTexto);
    formData.append('fechaInicio',
      this.proyectoForm.value.fechaInicio ? (this.proyectoForm.value.fechaInicio as Date).toISOString().slice(0, 10) : 'Pendiente');
    formData.append('fechaLiberacion',
      this.proyectoForm.value.fechaLiberacion
        ? (this.proyectoForm.value.fechaLiberacion as Date).toISOString().slice(0, 10)
        : 'Pendiente'
    );
    formData.append('responsableId', this.proyectoForm.value.responsable);
    formData.append('tipoProyectoId', this.proyectoForm.value.tipoProyecto);
    formData.append('sitioId', this.proyectoForm.value.sitio);
    formData.append('clienteId', this.proyectoForm.value.cliente);

    // helper para los archivos opcionales / existentes
    const appendFileOrPendiente = (campo: string, file: File | null) => {
      if (file) {
        formData.append(campo, file, file.name);
      } /**  else {
        // si no subió archivo nuevo, seguimos con el nombre que ya tenía en el back
        formData.append(campo, nombreActual || 'NA');
      }*/
    };

    appendFileOrPendiente('fileF60', this.selectedFileF60);
    appendFileOrPendiente('fileLld', this.selectedFileLld);
    appendFileOrPendiente('fileHld', this.selectedFileHld);
    appendFileOrPendiente('fileLayout', this.selectedFileLayout); 
    appendFileOrPendiente('filePresentacion', this.selectedFilePresentacion);
    appendFileOrPendiente('fileSla', this.selectedFileSla);
    appendFileOrPendiente('fileReporteFotografico', this.selectedFileReporteFotografico);
    appendFileOrPendiente('fileAsignacionFuerzaEspacio', this.selectedFileFuerzaEspacio);
    appendFileOrPendiente('fileInventarioHardware', this.selectedFileInventario);
    appendFileOrPendiente('fileAtpFisico', this.selectedFileAtpFisico);
    appendFileOrPendiente('fileAtpLogico', this.selectedFileAtpLogico);
    appendFileOrPendiente('fileReporteTransferenciaOperativa', this.selectedFileRto);
    appendFileOrPendiente('fileCartaResponsivaPlataforma', this.selectedFileCartaPlataforma);
    appendFileOrPendiente('fileCartaResponsivaIaaS', this.selectedFileCartaIaaS);
    appendFileOrPendiente('fileCartaResponsivaStorage', this.selectedFileCartaStorage);
    appendFileOrPendiente('fileCartaResponsivaGsoc', this.selectedFileCartaGsoc);
    appendFileOrPendiente('fileCartaResponsivaHa', this.selectedFileCartaHa);
    appendFileOrPendiente('fileAtpFisicoFirmado', this.selectedFileAtpFisicoFirmado);
    appendFileOrPendiente('fileOtros', this.selectedFileOtros);

    // Llamada al servicio para actualizar el proyecto
    this.proyectoService.updateProyecto(this.data.idProyecto, formData).subscribe({
      next: () => {
        // 1 = éxito
        this.dialogRef.close(1);
      },
      error: err => {
        console.error('error actualizando proyecto', err);
        // 2 = fracaso
        this.dialogRef.close(2);
      }
    });
  }

  /**
   * Metodo para cerrar el dialog
   */
  onCancel() {
    this.dialogRef.close(3);
  }
}