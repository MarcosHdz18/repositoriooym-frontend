import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProyectoService } from 'src/app/modules/shared/services/proyecto.service';
import { ResponsableService } from 'src/app/modules/shared/services/responsable.service';
import { ResponsableElement } from 'src/app/models/responsable.model';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { TipoProyectoService } from 'src/app/modules/shared/services/tipoProyectoService.service';
import { SitioService } from 'src/app/modules/shared/services/sitio.service';
import { ClienteService } from 'src/app/modules/shared/services/cliente.service';
import { HttpEventType } from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { timer, zip } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-new-proyecto',
  templateUrl: './new-proyecto.component.html',
  styleUrls: ['./new-proyecto.component.css'],
  providers: [DatePipe]
})
export class NewProyectoComponent implements OnInit {

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

  archivosParaSubir: File[] = [];
  isDragging = false;

  public proyectoForm: FormGroup;
  tituloFormulario: string;
  botonLabel: string;
  responsables: ResponsableElement[] = [];
  tiposProyecto: any[] = [];
  sitios: any[] = [];
  clientes: any[] = [];
  selectedFileF60: any;
  selectedFileLld: any;
  selectedFileHld: any;
  selectedFileMemoriaTecnica: any;
  selectedFileSid: any;
  selectedFileLayout: any;
  selectedFilePresentacion: any;
  selectedFileSla: any;
  selectedFileReporteFotografico: any;
  selectedFileFuerzaEspacio: any;
  selectedFileEtiquetado: any;
  selectedFilePlanos: any;
  selectedFileProyectoEjecutivo: any;
  selectedFileInventario: any;
  selectedFileAtpFisico: any;
  selectedFileAtpLogico: any;
  selectedFileRto: any;
  selectedFileCartaPlataforma: any;
  selectedFileCartaIaaS: any;
  selectedFileCartaStorage: any;
  selectedFileCartaGsoc: any;
  selectedFileCartaLlaves: any;
  selectedFileCartaHa: any;
  selectedFileAtpFisicoFirmado: any;
  selectedFileOtros: any;
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

  constructor(private fb: FormBuilder, private responsableService: ResponsableService, private tipoProyectoService: TipoProyectoService, private sitioService: SitioService,
    private clienteService: ClienteService, private proyectoService: ProyectoService, private dialogRef: MatDialogRef<NewProyectoComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private util: UtilsService, private snackbar: MatSnackBar, private keycloakService: KeycloakService) {

    this.tituloFormulario = 'Agregar nuevo';
    this.botonLabel = 'Guardar';

    this.proyectoForm = this.fb.group({
      nombre: ['', Validators.required],
      nodosTexto: ['', Validators.required],
      fechaInicio: [null],
      fechaLiberacion: [null],
      responsable: ['', Validators.required],
      tipoProyecto: ['', Validators.required],
      sitio: ['', Validators.required],
      cliente: ['', Validators.required],
      // Archivos opcionales del formulario
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
      fileOtros: [''],
    });
  }

  ngOnInit(): void {
    // Perfil de Aplicaciones
    this.isPerfilApp = this.util.isPerfilApp();
    // Perfil de Infraestructura
    this.isPerfilInfraestructura = this.util.isPerfilInfraestructura();
    // Lista de responsables
    this.getResponsables();
    // Lista de tipos de proyecto
    this.getTiposProyecto();
    // Lista de sitios
    this.getSitios();
    // Lista de clientes
    this.getClientes();

    this.username = this.keycloakService.loadUserProfile().then(profile => {
      this.username = profile.firstName + ' ' + profile.lastName;
    });
  }

  // Limpiar lista de nodos al iniciar el componente
  parseNodos() {
    const txt = this.proyectoForm.get('nodosTexto')!.value as string;
    this.nodosList = txt.split(/[\s,]+/).map(w => w.trim()).filter(w => w.length > 0);  // descartando cadenas vacías  
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
  getSitios() {
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
  getClientes() {
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
      'Creando proyecto, por favor espere... (Tamaño total de archivos: ' + this.tamanioTotalMB + '). Por favor, no cierres el navegador ni la ventana hasta que se complete el proceso.',
      'Cerrar'
    );

    // 3. Enviar los archivos al backend
    // Construimos el formData para enviar los archivos y otros datos del formulario
    const subirDatos = new FormData();

    // Convertir la fecha a formato ISO y luego a string con el formato YYYY-MM-DD
    // Esto es necesario porque el backend espera la fecha en este formato
    // Si la fecha es nula, se asigna una cadena vacía
    // Nota: Asegurarse de que el campo fechaLiberacion en el formulario sea de tipo Date o null
    // Conversión de fecha a ISO-string o cadena vacía
    const fechaInicioVal: string = this.proyectoForm.get('fechaInicio')!.value ? (this.proyectoForm.get('fechaInicio')!.value as Date).toISOString()
      .split('T')[0]
      : 'Pendiente';
    subirDatos.append('fechaInicio', fechaInicioVal);

    // Convertir la fecha a formato ISO y luego a string con el formato YYYY-MM-DD
    // Esto es necesario porque el backend espera la fecha en este formato
    // Si la fecha es nula, se asigna una cadena vacía
    // Nota: Asegurarse de que el campo fechaLiberacion en el formulario sea de tipo Date o null
    // Conversión de fecha a ISO-string o cadena vacía
    const fechaLiberacionVal: string = this.proyectoForm.get('fechaLiberacion')!.value ? (this.proyectoForm.get('fechaLiberacion')!.value as Date).toISOString()
      .split('T')[0]
      : 'Pendiente';
    subirDatos.append('fechaLiberacion', fechaLiberacionVal);

    // Campos obligatorios del formulario
    subirDatos.append('nombre', this.proyectoForm.get('nombre')?.value.toUpperCase() as string);
    subirDatos.append('nodos', this.proyectoForm.get('nodosTexto')?.value as string);
    subirDatos.append('responsableId', this.proyectoForm.get('responsable')?.value as string);
    subirDatos.append('tipoProyectoId', this.proyectoForm.get('tipoProyecto')?.value as string);
    subirDatos.append('sitioId', this.proyectoForm.get('sitio')?.value as string);
    subirDatos.append('clienteId', this.proyectoForm.get('cliente')?.value as string);
    subirDatos.append('usuarioActivo', this.username);

    // Archivos opcionales del formulario: si existen, los agregamos al FormData; si no, enviamos "NA"
    const pendingFiles = (fieldName: string, file: File | null) => {
      if (file) {
        subirDatos.append(fieldName, file, file.name);
      } else {
        subirDatos.append(fieldName, 'NA');
      }
    };

    pendingFiles('fileLld', this.selectedFileLld);
    pendingFiles('fileF60', this.selectedFileF60);
    pendingFiles('fileHld', this.selectedFileHld);
    pendingFiles('fileMemoriaTecnica', this.selectedFileMemoriaTecnica);
    pendingFiles('fileSid', this.selectedFileSid);
    pendingFiles('fileLayout', this.selectedFileLayout);
    pendingFiles('filePresentacion', this.selectedFilePresentacion);
    pendingFiles('fileSla', this.selectedFileSla);
    pendingFiles('fileReporteFotografico', this.selectedFileReporteFotografico);
    pendingFiles('fileAsignacionFuerzaEspacio', this.selectedFileFuerzaEspacio);
    pendingFiles('fileEtiquetado', this.selectedFileEtiquetado);
    pendingFiles('filePlanos', this.selectedFilePlanos);
    pendingFiles('fileProyectoEjecutivo', this.selectedFileProyectoEjecutivo);
    pendingFiles('fileInventarioHardware', this.selectedFileInventario);
    pendingFiles('fileAtpFisico', this.selectedFileAtpFisico);
    pendingFiles('fileAtpLogico', this.selectedFileAtpLogico);
    pendingFiles('fileReporteTransferenciaOperativa', this.selectedFileRto);
    pendingFiles('fileCartaResponsivaPlataforma', this.selectedFileCartaPlataforma);
    pendingFiles('fileCartaResponsivaIaaS', this.selectedFileCartaIaaS);
    pendingFiles('fileCartaResponsivaStorage', this.selectedFileCartaStorage);
    pendingFiles('fileCartaResponsivaGsoc', this.selectedFileCartaGsoc);
    pendingFiles('fileCartaResponsivaLlaves', this.selectedFileCartaLlaves);
    pendingFiles('fileCartaResponsivaHa', this.selectedFileCartaHa);
    pendingFiles('fileAtpFisicoFirmado', this.selectedFileAtpFisicoFirmado);
    pendingFiles('fileOtros', this.selectedFileOtros);

    //Persistir archivos adjuntos
    this.archivosParaSubir.forEach(file => {
      subirDatos.append('archivosAdicionales', file);
    });

    //3. Lógica de retraso para asegurar que el snackbar se muestre antes de iniciar la carga
    const minWaitTime = timer(1250); // Tiempo mínimo de espera en milisegundos
    const peticion$ = this.proyectoService.saveProyecto(subirDatos);

    // 4. Llamada al servicio para guardar el proyecto
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
            this.openSnackbar('Proyecto guardado exitosamente.', 'Cerrar');
            // 1 = éxito
            this.dialogRef.close(1);
          });
        }
      },
      error: err => {
        this.isLoading = false;
        console.error('error guardando proyecto', err);
        this.openSnackbar('Error al guardar el proyecto. Por favor, intenta de nuevo.', 'Cerrar');
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
    this.nombreArchivoF60 = '';
    const inputEl = document.getElementById('file-f60') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileLld() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileLld: '' });
    this.selectedFileLld = null;
    this.nombreArchivoLld = '';
    const inputEl = document.getElementById('file-lld') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileHld() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileHld: '' });
    this.selectedFileHld = null;
    this.nombreArchivoHld = '';
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
    this.nombreArchivoRto = '';
    const inputEl = document.getElementById('file-rto') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileLayout() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileLayout: '' });
    this.selectedFileLayout = null;
    this.nombreArchivoLayout = '';
    const inputEl = document.getElementById('file-layout') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFilePresentacion() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ filePresentacion: '' });
    this.selectedFilePresentacion = null;
    this.nombreArchivoPresentacion = '';
    const inputEl = document.getElementById('file-presentacion') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileSla() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileSla: '' });
    this.selectedFileSla = null;
    this.nombreArchivoSla = '';
    const inputEl = document.getElementById('file-sla') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileAtpFisico() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileAtpFisico: '' });
    this.selectedFileAtpFisico = null;
    this.nombreArchivoAtpFisico = '';
    const inputEl = document.getElementById('file-atpFisico') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileAtpLogico() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileAtpLogico: '' });
    this.selectedFileAtpLogico = null;
    this.nombreArchivoAtpLogico = '';
    const inputEl = document.getElementById('file-atpLogico') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileAtpFisicoFirmado() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileAtpFisicoFirmado: '' });
    this.selectedFileAtpFisicoFirmado = null;
    this.nombreArchivoAtpFisicoFirmado = '';
    const inputEl = document.getElementById('file-atpFisicoFirmado') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaPlataforma() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaPlataforma: '' });
    this.selectedFileCartaPlataforma = null;
    this.nombreArchivoCartaResponsivaPlataforma = '';
    const inputEl = document.getElementById('file-cartaResponsivaPlataforma') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaIaaS() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaIaaS: '' });
    this.selectedFileCartaIaaS = null;
    this.nombreArchivoCartaResponsivaIaaS = '';
    const inputEl = document.getElementById('file-cartaResponsivaIaaS') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaStorage() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaStorage: '' });
    this.selectedFileCartaStorage = null;
    this.nombreArchivoCartaResponsivaStorage = '';
    const inputEl = document.getElementById('file-cartaResponsivaStorage') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaHa() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaHa: '' });
    this.selectedFileCartaHa = null;
    this.nombreArchivoCartaResponsivaHa = '';
    const inputEl = document.getElementById('file-cartaResponsivaHa') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileResponsivaGsoc() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileCartaResponsivaGsoc: '' });
    this.selectedFileCartaGsoc = null;
    this.nombreArchivoCartaResponsivaGsoc = '';
    const inputEl = document.getElementById('file-cartaResponsivaGsoc') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileReporteFotografico() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileReporteFotografico: '' });
    this.selectedFileReporteFotografico = null;
    this.nombreArchivoReporteFotografico = '';
    const inputEl = document.getElementById('file-reporteFotografico') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileFuerzaEspacio() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileAsignacionFuerzaEspacio: '' });
    this.selectedFileFuerzaEspacio = null;
    this.nombreArchivoAsignacionFuerzaEspacio = '';
    const inputEl = document.getElementById('file-asignacionFuerzaEspacio') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileInventario() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileInventarioHardware: '' });
    this.selectedFileInventario = null;
    this.nombreArchivoInventarioHardware = '';
    const inputEl = document.getElementById('file-inventarioHardware') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = ''; // reset visual del <input type="file">
    }
  }

  removeFileOtros() {
    // Limpia selección y fuerza ""
    this.proyectoForm.patchValue({ fileOtros: '' });
    this.selectedFileOtros = null;
    this.nombreArchivoOtros = '';
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

  // 3. Selección manual
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

  /**
   * Metodo para cerrar el dialog
   */
  onCancel() {
    this.dialogRef.close(3);
  }
}