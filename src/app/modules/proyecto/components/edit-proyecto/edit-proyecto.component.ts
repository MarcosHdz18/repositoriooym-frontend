import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { KeycloakService } from 'keycloak-angular';
import { timer, zip } from 'rxjs';
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

  @ViewChild('scrollContainer') private myScrollContainer!: ElementRef;

  nodosList: string[] = [];
  isPerfilApp: any;
  isPerfilInfraestructura: any;

  // Posicion en pantalla del snackbar
  horizontalPositionSnackbar: MatSnackBarHorizontalPosition = 'center';
  verticalPositionSnackbar: MatSnackBarVerticalPosition = 'bottom';

  isLoading: boolean = false;
  progress: number = 0;
  tamanioTotalMB: string = '0';

  // Capturar el usuario activo para auditoria
  username: any;

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
  nombreArchivoMemoriaTecnica: string = '';
  nombreArchivoSid: string = '';
  nombreArchivoLayout: string = '';
  nombreArchivoPresentacion: string = '';
  nombreArchivoSla: string = '';
  nombreArchivoReporteFotografico: string = '';
  nombreArchivoAsignacionFuerzaEspacio: string = '';
  nombreArchivoEtiquetado: string = '';
  nombreArchivoPlanos: string = '';
  nombreArchivoProyectoEjecutivo: string = '';
  nombreArchivoInventarioHardware: string = '';
  nombreArchivoAtpFisico: string = '';
  nombreArchivoAtpLogico: string = '';
  nombreArchivoRto: string = '';
  nombreArchivoCartaResponsivaPlataforma: string = '';
  nombreArchivoCartaResponsivaIaaS: string = '';
  nombreArchivoCartaResponsivaStorage: string = '';
  nombreArchivoCartaResponsivaGsoc: string = '';
  nombreArchivoCartaResponsivaLlaves: string = '';
  nombreArchivoCartaResponsivaHa: string = '';
  nombreArchivoAtpFisicoFirmado: string = '';
  nombreArchivoOtros: string = '';

  // Variables para almacenar los archivos seleccionados
  selectedFileF60: File | null = null;
  selectedFileLld: File | null = null;
  selectedFileHld: File | null = null;
  selectedFileMemoriaTecnica: File | null = null;
  selectedFileSid: File | null = null;
  selectedFileLayout: File | null = null;
  selectedFilePresentacion: File | null = null;
  selectedFileSla: File | null = null;
  selectedFileReporteFotografico: File | null = null;
  selectedFileFuerzaEspacio: File | null = null;
  selectedFileEtiquetado: File | null = null;
  selectedFilePlanos: File | null = null;
  selectedFileProyectoEjecutivo: File | null = null;
  selectedFileInventario: File | null = null;
  selectedFileAtpFisico: File | null = null;
  selectedFileAtpLogico: File | null = null;
  selectedFileRto: File | null = null;
  selectedFileCartaPlataforma: File | null = null;
  selectedFileCartaIaaS: File | null = null;
  selectedFileCartaStorage: File | null = null;
  selectedFileCartaGsoc: File | null = null;
  selectedFileCartaLlaves: File | null = null;
  selectedFileCartaHa: File | null = null;
  selectedFileAtpFisicoFirmado: File | null = null;
  selectedFileOtros: File | null = null;

  // Arreglo de files para archivos adjuntos
  archivosParaSubir: File[] = [];
  isDragging = false;

  // Variable para identificar si es edición
  isEditMode = true;

  constructor(private fb: FormBuilder, private responsableService: ResponsableService, private tipoProyectoService: TipoProyectoService,
    private sitioService: SitioService, private clienteService: ClienteService, private proyectoService: ProyectoService, private dialogRef: MatDialogRef<EditProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProyectoElement, private util: UtilsService, private snackbar: MatSnackBar, private keycloakService: KeycloakService) {
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
      fileLld: [''],
      fileF60: [''],
      fileHld: [''],
      fileMemoriaTecnica: [''],
      fileSid: [''],
      fileLayout: [''],
      filePresentacion: [''],
      fileSla: [''],
      fileReporteFotografico: [''],
      fileAsignacionFuerzaEspacio: [''],
      fileEtiquetado: [''],
      filePlanos: [''],
      fileProyectoEjecutivo: [''],
      fileInventarioHardware: [''],
      fileAtpFisico: [''],
      fileAtpLogico: [''],
      fileReporteTransferenciaOperativa: [''],
      fileCartaResponsivaPlataforma: [''],
      fileCartaResponsivaIaaS: [''],
      fileCartaResponsivaStorage: [''],
      fileCartaResponsivaGsoc: [''],
      fileCartaResponsivaLlaves: [''],
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
    this.nombreArchivoMemoriaTecnica = this.fileNameSinCarpeta(this.data.memoriaTecnica);
    this.nombreArchivoSid = this.fileNameSinCarpeta(this.data.sid);
    this.nombreArchivoLayout = this.fileNameSinCarpeta(this.data.layout);
    this.nombreArchivoPresentacion = this.fileNameSinCarpeta(this.data.presentacion);
    this.nombreArchivoSla = this.fileNameSinCarpeta(this.data.sla);
    this.nombreArchivoReporteFotografico = this.fileNameSinCarpeta(this.data.reporteFotografico);
    this.nombreArchivoAsignacionFuerzaEspacio = this.fileNameSinCarpeta(this.data.asignacionFuerzaEspacio);
    this.nombreArchivoEtiquetado = this.fileNameSinCarpeta(this.data.etiquetado);
    this.nombreArchivoPlanos = this.fileNameSinCarpeta(this.data.planos);
    this.nombreArchivoProyectoEjecutivo = this.fileNameSinCarpeta(this.data.proyectoEjecutivo);
    this.nombreArchivoInventarioHardware = this.fileNameSinCarpeta(this.data.inventarioHardware);
    this.nombreArchivoAtpFisico = this.fileNameSinCarpeta(this.data.atpFisico);
    this.nombreArchivoAtpLogico = this.fileNameSinCarpeta(this.data.atpLogico);
    this.nombreArchivoRto = this.fileNameSinCarpeta(this.data.reporteTransferenciaOperativa);
    this.nombreArchivoCartaResponsivaPlataforma = this.fileNameSinCarpeta(this.data.cartaResponsivaPlataforma);
    this.nombreArchivoCartaResponsivaIaaS = this.fileNameSinCarpeta(this.data.cartaResponsivaIaaS);
    this.nombreArchivoCartaResponsivaStorage = this.fileNameSinCarpeta(this.data.cartaResponsivaStorage);
    this.nombreArchivoCartaResponsivaGsoc = this.fileNameSinCarpeta(this.data.cartaResponsivaGsoc);
    this.nombreArchivoCartaResponsivaLlaves = this.fileNameSinCarpeta(this.data.cartaResponsivaLlaves);
    this.nombreArchivoCartaResponsivaHa = this.fileNameSinCarpeta(this.data.cartaResponsivaHA);
    this.nombreArchivoAtpFisicoFirmado = this.fileNameSinCarpeta(this.data.atpFisicoFirmado);
    this.nombreArchivoOtros = this.fileNameSinCarpeta(this.data.otros);

    this.getResponsables();
    this.getTiposProyecto();
    this.getSitiosProyecto();
    this.getClientesProyecto();

    this.username = this.keycloakService.loadUserProfile().then(profile => {
      this.username = profile.firstName + ' ' + profile.lastName;
    });
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
  onFileChangedMemoriaTecnica(event: any) {
    this.selectedFileMemoriaTecnica = event.target.files[0];
    this.nombreArchivoMemoriaTecnica = event.target.files[0].name;
  }

  /**
  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
  * @param event evento que propicia la carga del archivo
  */
  onFileChangedSid(event: any) {
    this.selectedFileSid = event.target.files[0];
    this.nombreArchivoSid = event.target.files[0].name;
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
  onFileChangedEtiquetado(event: any) {
    this.selectedFileEtiquetado = event.target.files[0];
    this.nombreArchivoEtiquetado = event.target.files[0].name;
  }

  /**
   * Metodo que obtiene el nombre del archivo y se muestra en el formulario
   * @param event evento que propicia la carga del archivo
   */
  onFileChangedPlanos(event: any) {
    this.selectedFilePlanos = event.target.files[0];
    this.nombreArchivoPlanos = event.target.files[0].name;
  }

  /**
   * Metodo que obtiene el nombre del archivo y se muestra en el formulario
   * @param event evento que propicia la carga del archivo
   */
  onFileChangedProyectoEjecutivo(event: any) {
    this.selectedFileProyectoEjecutivo = event.target.files[0];
    this.nombreArchivoProyectoEjecutivo = event.target.files[0].name;
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

  /**  * Metodo que obtiene el nombre del archivo y se muestra en el formulario
   * @param event evento que propicia la carga del archivo
   */
  onFileChangedCartaResponsivaLlaves(event: any) {
    this.selectedFileCartaLlaves = event.target.files[0];
    this.nombreArchivoCartaResponsivaLlaves = event.target.files[0].name;
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

    this.isLoading = true;
    this.progress = 0;
    let totalBytes = 0;

    // 1. Calcular el tamaño total de los archivos seleccionados
    const filesArray = [
      this.selectedFileF60,
      this.selectedFileLld,
      this.selectedFileHld,
      this.selectedFileMemoriaTecnica,
      this.selectedFileSid,
      this.selectedFileLayout,
      this.selectedFilePresentacion,
      this.selectedFileSla,
      this.selectedFileReporteFotografico,
      this.selectedFileFuerzaEspacio,
      this.selectedFileEtiquetado,
      this.selectedFilePlanos,
      this.selectedFileProyectoEjecutivo,
      this.selectedFileInventario,
      this.selectedFileAtpFisico,
      this.selectedFileAtpLogico,
      this.selectedFileRto,
      this.selectedFileCartaPlataforma,
      this.selectedFileCartaIaaS,
      this.selectedFileCartaStorage,
      this.selectedFileCartaGsoc,
      this.selectedFileCartaLlaves,
      this.selectedFileCartaHa,
      this.selectedFileAtpFisicoFirmado,
      this.selectedFileOtros
    ];

    filesArray.forEach(f => { if (f) totalBytes += f.size; });
    this.archivosParaSubir.forEach(f => { if (f) totalBytes += f.size; });

    this.tamanioTotalMB = (totalBytes / (1024 * 1024)).toFixed(2) + ' MB';

    // 2. Mostrar snackbar informando al usuario sobre la carga de archivos
    this.openSnackbar(
      'Actualizando proyecto, por favor espere... (Cargando nuevos datos: ' + this.tamanioTotalMB + '). Por favor, no cierres el navegador ni la ventana hasta que se complete el proceso.',
      'Cerrar'
    );

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
    formData.append('usuarioActivo', this.username);

    // Agregamos los archivos adicionales al formulario para persistir a través de la url con el endpoin en backend
    this.archivosParaSubir.forEach(file => {
      formData.append('archivosAdicionales', file);
    });

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
    appendFileOrPendiente('fileMemoriaTecnica', this.selectedFileMemoriaTecnica);
    appendFileOrPendiente('fileSid', this.selectedFileSid);
    appendFileOrPendiente('fileLayout', this.selectedFileLayout);
    appendFileOrPendiente('filePresentacion', this.selectedFilePresentacion);
    appendFileOrPendiente('fileSla', this.selectedFileSla);
    appendFileOrPendiente('fileReporteFotografico', this.selectedFileReporteFotografico);
    appendFileOrPendiente('fileAsignacionFuerzaEspacio', this.selectedFileFuerzaEspacio);
    appendFileOrPendiente('fileEtiquetado', this.selectedFileEtiquetado);
    appendFileOrPendiente('filePlanos', this.selectedFilePlanos);
    appendFileOrPendiente('fileProyectoEjecutivo', this.selectedFileProyectoEjecutivo);
    appendFileOrPendiente('fileInventarioHardware', this.selectedFileInventario);
    appendFileOrPendiente('fileAtpFisico', this.selectedFileAtpFisico);
    appendFileOrPendiente('fileAtpLogico', this.selectedFileAtpLogico);
    appendFileOrPendiente('fileReporteTransferenciaOperativa', this.selectedFileRto);
    appendFileOrPendiente('fileCartaResponsivaPlataforma', this.selectedFileCartaPlataforma);
    appendFileOrPendiente('fileCartaResponsivaIaaS', this.selectedFileCartaIaaS);
    appendFileOrPendiente('fileCartaResponsivaStorage', this.selectedFileCartaStorage);
    appendFileOrPendiente('fileCartaResponsivaGsoc', this.selectedFileCartaGsoc);
    appendFileOrPendiente('fileCartaResponsivaLlaves', this.selectedFileCartaLlaves);
    appendFileOrPendiente('fileCartaResponsivaHa', this.selectedFileCartaHa);
    appendFileOrPendiente('fileAtpFisicoFirmado', this.selectedFileAtpFisicoFirmado);
    appendFileOrPendiente('fileOtros', this.selectedFileOtros);

    //3. Lógica de retraso para asegurar que el snackbar se muestre antes de iniciar la carga
    const minWaitTime = timer(1250); // Tiempo mínimo de espera en milisegundos
    const peticion$ = this.proyectoService.updateProyecto(this.data.idProyecto, formData);

    // 4. Llamada al servicio para actualizar el proyecto
    peticion$.subscribe({
      next: (event: any) => {
        // Si el evento es del tipo progreso de carga
        if (event.type === HttpEventType.UploadProgress) {
          // Actualizar el progreso de carga
          if (event.total) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else {
            this.progress = 0;
          }
        }
        // Si el evento es la respuesta final del servidor
        else if (event.type === HttpEventType.Response) {
          zip(minWaitTime).subscribe(() => {
            // Aquí se asegura que haya pasado el tiempo mínimo antes de continuar
            this.isLoading = false;
            this.snackbar.dismiss(); // Cerrar el snackbar de progreso
            this.openSnackbar('Proyecto actualizado exitosamente.', 'Cerrar');
            // 1 = éxito
            this.dialogRef.close(1);
          });
        }
      },
      error: err => {
        this.isLoading = false;
        console.error('error guardando proyecto', err);
        this.openSnackbar('Error al actualizar el proyecto. Por favor, intenta de nuevo.', 'Cerrar');
        // 2 = fracaso
        this.dialogRef.close(2);
      }
    });
  }

  /**
   * Metodos para remover el archivo
   */
  removeFileF60() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileF60: '' });
    this.selectedFileF60 = null;
    this.nombreArchivoF60 = this.fileNameSinCarpeta(this.data.f60) || 'NA';
    const inputEl = document.getElementById('file-f60') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileLld() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileLld: '' });
    this.selectedFileLld = null;
    this.nombreArchivoLld = this.fileNameSinCarpeta(this.data.lld) || 'NA';
    const inputEl = document.getElementById('file-lld') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileHld() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileHld: '' });
    this.selectedFileHld = null;
    this.nombreArchivoHld = this.fileNameSinCarpeta(this.data.hld) || 'NA';
    const inputEl = document.getElementById('file-hld') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileMemoriaTecnica() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileMemoriaTecnica: '' });
    this.selectedFileMemoriaTecnica = null;
    this.nombreArchivoMemoriaTecnica = '';
    const inputEl = document.getElementById('file-memoriaTecnica') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileSid() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileSid: '' });
    this.selectedFileSid = null;
    this.nombreArchivoSid = '';
    const inputEl = document.getElementById('file-sid') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileEtiquetado() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileEtiquetado: '' });
    this.selectedFileEtiquetado = null;
    this.nombreArchivoEtiquetado = '';
    const inputEl = document.getElementById('file-etiquetado') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFilePlanos() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ filePlanos: '' });
    this.selectedFilePlanos = null;
    this.nombreArchivoPlanos = '';
    const inputEl = document.getElementById('file-planos') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileProyectoEjecutivo() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileProyectoEjecutivo: '' });
    this.selectedFileProyectoEjecutivo = null;
    this.nombreArchivoProyectoEjecutivo = '';
    const inputEl = document.getElementById('file-proyectoEjecutivo') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileCartaLlaves() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaLlaves: '' });
    this.selectedFileCartaLlaves = null;
    this.nombreArchivoCartaResponsivaLlaves = '';
    const inputEl = document.getElementById('file-cartaLlaves') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileRto() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileReporteTransferenciaOperativa: '' });
    this.selectedFileRto = null;
    this.nombreArchivoRto = this.fileNameSinCarpeta(this.data.reporteTransferenciaOperativa) || 'NA';
    const inputEl = document.getElementById('file-rto') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileLayout() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileLayout: '' });
    this.selectedFileLayout = null;
    this.nombreArchivoLayout = this.fileNameSinCarpeta(this.data.layout) || 'NA';
    const inputEl = document.getElementById('file-layout') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFilePresentacion() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ filePresentacion: '' });
    this.selectedFilePresentacion = null;
    this.nombreArchivoPresentacion = this.fileNameSinCarpeta(this.data.presentacion) || 'NA';
    const inputEl = document.getElementById('file-presentacion') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileSla() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileSla: '' });
    this.selectedFileSla = null;
    this.nombreArchivoSla = this.fileNameSinCarpeta(this.data.sla) || 'NA';
    const inputEl = document.getElementById('file-sla') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileAtpFisico() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileAtpFisico: '' });
    this.selectedFileAtpFisico = null;
    this.nombreArchivoAtpFisico = this.fileNameSinCarpeta(this.data.atpFisico) || 'NA';
    const inputEl = document.getElementById('file-atpFisico') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileAtpLogico() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileAtpLogico: '' });
    this.selectedFileAtpLogico = null;
    this.nombreArchivoAtpLogico = this.fileNameSinCarpeta(this.data.atpLogico) || 'NA';
    const inputEl = document.getElementById('file-atpLogico') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileAtpFisicoFirmado() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileAtpFisicoFirmado: '' });
    this.selectedFileAtpFisicoFirmado = null;
    this.nombreArchivoAtpFisicoFirmado = this.fileNameSinCarpeta(this.data.atpFisicoFirmado) || 'NA';
    const inputEl = document.getElementById('file-atpFisicoFirmado') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaPlataforma() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaPlataforma: '' });
    this.selectedFileCartaPlataforma = null;
    this.nombreArchivoCartaResponsivaPlataforma = this.fileNameSinCarpeta(this.data.cartaResponsivaPlataforma) || 'NA';
    const inputEl = document.getElementById('file-cartaResponsivaPlataforma') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaIaaS() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaIaaS: '' });
    this.selectedFileCartaIaaS = null;
    this.nombreArchivoCartaResponsivaIaaS = this.fileNameSinCarpeta(this.data.cartaResponsivaIaaS) || 'NA';
    const inputEl = document.getElementById('file-cartaResponsivaIaaS') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaStorage() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaStorage: '' });
    this.selectedFileCartaStorage = null;
    this.nombreArchivoCartaResponsivaStorage = this.fileNameSinCarpeta(this.data.cartaResponsivaStorage) || 'NA';
    const inputEl = document.getElementById('file-cartaResponsivaStorage') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaHa() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaHa: '' });
    this.selectedFileCartaHa = null;
    this.nombreArchivoCartaResponsivaHa = this.fileNameSinCarpeta(this.data.cartaResponsivaHA) || 'NA';
    const inputEl = document.getElementById('file-cartaResponsivaHa') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaGsoc() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaGsoc: '' });
    this.selectedFileCartaGsoc = null;
    this.nombreArchivoCartaResponsivaGsoc = this.fileNameSinCarpeta(this.data.cartaResponsivaGsoc) || 'NA';
    const inputEl = document.getElementById('file-cartaResponsivaGsoc') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileReporteFotografico() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileReporteFotografico: '' });
    this.selectedFileReporteFotografico = null;
    this.nombreArchivoReporteFotografico = this.fileNameSinCarpeta(this.data.reporteFotografico) || 'NA';
    const inputEl = document.getElementById('file-reporteFotografico') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileFuerzaEspacio() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileAsignacionFuerzaEspacio: '' });
    this.selectedFileFuerzaEspacio = null;
    this.nombreArchivoAsignacionFuerzaEspacio = this.fileNameSinCarpeta(this.data.asignacionFuerzaEspacio) || 'NA';
    const inputEl = document.getElementById('file-asignacionFuerzaEspacio') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileInventario() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileInventarioHardware: '' });
    this.selectedFileInventario = null;
    this.nombreArchivoInventarioHardware = this.fileNameSinCarpeta(this.data.inventarioHardware) || 'NA';
    const inputEl = document.getElementById('file-inventarioHardware') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileOtros() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileOtros: '' });
    this.selectedFileOtros = null;
    this.nombreArchivoOtros = this.fileNameSinCarpeta(this.data.otros) || 'NA';
    const inputEl = document.getElementById('file-otros') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  // Dialogo de operacion
  openSnackbar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.open(message, action, {
      horizontalPosition: this.horizontalPositionSnackbar,
      verticalPosition: this.verticalPositionSnackbar
    });
  }

  // Operaciones para archivos adjuntos
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: any) {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.agregarArchivosALista(event.dataTransfer.files);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      this.agregarArchivosALista(event.target.files);
    }
  }

  agregarArchivosALista(files: FileList) {
    const nuevosArchivos = Array.from(files);
    this.archivosParaSubir.push(...nuevosArchivos);

    setTimeout(() => {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }

      const dialogContent = document.querySelector('mat-dialog-content');
      if (dialogContent) {
        dialogContent.scrollTo({
          top: dialogContent.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 150);
  }

  removerArchivo(index: number) {
    this.archivosParaSubir.splice(index, 1);
  }

  descargarAdjunto(idAdjunto: number, nombreArchivo: string) {

    if (!idAdjunto) {
      this.openSnackbar("Error: ID de archivo no válido", "Cerrar");
      return;
    }

    this.proyectoService.descargarAdjuntoMasivo(idAdjunto).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // El nombre se recuperará del header del Backend
        a.download = nombreArchivo;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Error al descargar:", err);
        this.openSnackbar("No se pudo descargar el archivo", "Cerrar");
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