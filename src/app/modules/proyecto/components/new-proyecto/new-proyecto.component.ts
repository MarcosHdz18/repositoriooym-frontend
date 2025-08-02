import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProyectoService } from 'src/app/modules/shared/services/proyecto.service';
import { ResponsableService } from 'src/app/modules/shared/services/responsable.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ResponsableElement } from 'src/app/models/responsable.model';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { TipoProyectoService } from 'src/app/modules/shared/services/tipoProyectoService.service';
import { SitioService } from 'src/app/modules/shared/services/sitio.service';

@Component({
  selector: 'app-new-proyecto',
  templateUrl: './new-proyecto.component.html',
  styleUrls: ['./new-proyecto.component.css'],
  providers: [DatePipe]
})
export class NewProyectoComponent implements OnInit {

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  nodosList: string[] = [];
  isPerfilApp: any;
  isPerfilInfraestructura: any;

  public proyectoForm: FormGroup;
  tituloFormulario: string;
  botonLabel: string;
  responsables: ResponsableElement[] = [];
  tiposProyecto: any[] = [];
  sitios: any[] = [];
  selectedFileF60: any;
  selectedFileLld: any;
  selectedFileHld: any;
  selectedFileLayout: any;
  selectedFileSla: any;
  selectedFileReporteFotografico: any;
  selectedFileFuerzaEspacio: any;
  selectedFileInventario: any;
  selectedFileAtpFisico: any;
  selectedFileAtpLogico: any;
  selectedFileRto: any;
  selectedFileCartaPlataforma: any;
  selectedFileCartaIaaS: any;
  selectedFileCartaStorage: any;
  selectedFileCartaGsoc: any;
  selectedFileCartaHa: any;
  selectedFileAtpFisicoFirmado: any;
  selectedFileAtpLogicoFirmado: any;
  selectedFileOtros: any;
  nombreArchivoF60: string = '';
  nombreArchivoLld: string = '';
  nombreArchivoHld: string = '';
  nombreArchivoLayout: string = '';
  nombreArchivoSla: string = '';
  nombreArchivoFormatoFiltrado: string = '';
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
  nombreArchivoAtpLogicoFirmado: string = '';
  nombreArchivoOtros: string = '';

  constructor(private fb: FormBuilder, private responsableService: ResponsableService, private tipoProyectoService: TipoProyectoService, private sitioService: SitioService,
    private proyectoService: ProyectoService, private dialogRef: MatDialogRef<NewProyectoComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private util: UtilsService) {

      this.tituloFormulario = 'Agregar nuevo';
      this.botonLabel = 'Guardar';

      this.proyectoForm = this.fb.group({
        nombre: ['', Validators.required],
        nodosTexto: ['', Validators.required],
        fechaLiberacion: [null],
        responsable: ['', Validators.required],
        tipoProyecto: ['', Validators.required],
        sitio: ['', Validators.required],
        // Archivos opcionales del formulario
        fileLld: [''],
        fileF60: [''],
        fileHld: [''],
        fileLayout: [''],
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
        fileAtpLogicoFirmado: [''],
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
  }

  // Limpiar lista de nodos al iniciar el componente
  parseNodos() {
    const txt = this.proyectoForm.get('nodosTexto')!.value as string;
    this.nodosList = txt.split(/[\s,]+/).map(w => w.trim()).filter(w => w.length>0);  // descartando cadenas vacías  
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
  onFileChangedAtpLogicoFirmado(event: any) {
    this.selectedFileAtpLogicoFirmado = event.target.files[0];
    this.nombreArchivoAtpLogicoFirmado = event.target.files[0].name;
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

    // Construimos el formData para enviar los archivos y otros datos del formulario
    const subirDatos = new FormData();

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
    subirDatos.append('nombre', this.proyectoForm.get('nombre')?.value as string);
    subirDatos.append('nodos', this.proyectoForm.get('nodosTexto')?.value as string);
    subirDatos.append('responsableId', this.proyectoForm.get('responsable')?.value as string);
    subirDatos.append('tipoProyectoId', this.proyectoForm.get('tipoProyecto')?.value as string);
    subirDatos.append('sitioId', this.proyectoForm.get('sitio')?.value as string);
    subirDatos.append('regionId', this.proyectoForm.get('region')?.value as string);

    // Archivos opcionales del formulario: si existen, los agregamos al FormData; si no, enviamos "Pendiente de archivo"
    const pendingFiles = (fieldName: string, file: File | null) => {
      if (file) {
        subirDatos.append(fieldName, file, file.name);
      } else {
        subirDatos.append(fieldName, 'Pendiente de archivo');
      }
    };

    pendingFiles('fileLld', this.selectedFileLld);
    pendingFiles('fileF60', this.selectedFileF60);
    pendingFiles('fileHld', this.selectedFileHld);
    pendingFiles('fileLayout', this.selectedFileLayout);
    pendingFiles('fileSla', this.selectedFileSla);
    pendingFiles('fileReporteFotografico', this.selectedFileReporteFotografico);
    pendingFiles('fileAsignacionFuerzaEspacio', this.selectedFileFuerzaEspacio);
    pendingFiles('fileInventarioHardware', this.selectedFileInventario);
    pendingFiles('fileAtpFisico', this.selectedFileAtpFisico);
    pendingFiles('fileAtpLogico', this.selectedFileAtpLogico);
    pendingFiles('fileReporteTransferenciaOperativa', this.selectedFileRto);
    pendingFiles('fileCartaResponsivaPlataforma', this.selectedFileCartaPlataforma);
    pendingFiles('fileCartaResponsivaIaaS', this.selectedFileCartaIaaS);
    pendingFiles('fileCartaResponsivaStorage', this.selectedFileCartaStorage);
    pendingFiles('fileCartaResponsivaGsoc', this.selectedFileCartaGsoc);
    pendingFiles('fileCartaResponsivaHa', this.selectedFileCartaHa);
    pendingFiles('fileAtpFisicoFirmado', this.selectedFileAtpFisicoFirmado);
    pendingFiles('fileAtpLogicoFirmado', this.selectedFileAtpLogicoFirmado);
    pendingFiles('fileOtros', this.selectedFileOtros);

    // Llamada al servicio para guardar el proyecto
    this.proyectoService.saveProyecto(subirDatos).subscribe({
      next: () => {
        // 1 = éxito
        this.dialogRef.close(1);
      },
      error: err => {
        console.error('error guardando proyecto', err);
        // 2 = fracaso
        this.dialogRef.close(2);
      }
    });
  }

  /**
   * Metodo que actualiza el formulario con los datos del registro seleccionado
   * @param data valor de la data ya llenado
   */
  updateForm(data: any) {
    this.proyectoForm = this.fb.group({
      nombre: [data.nombre, Validators.required],
      fechaLiberacion: [data.fechaLiberacion ? new Date(data.fechaLiberacion) : null, Validators.required],
      responsable: [data.responsable.idResponsable, Validators.required],
      fileLld: ['', Validators.required],
      fileF60: ['', Validators.required],
      fileHld: ['', Validators.required],
      fileLayout: ['', Validators.required],
      fileSla: ['', Validators.required],
      fileReporteFotografico: ['', Validators.required],
      fileAsignacionFuerzaEspacio: ['', Validators.required],
      fileInventarioHardware: ['', Validators.required],
      fileAtpFisico: ['', Validators.required],
      fileAtpLogico: ['', Validators.required],
      fileReporteTransferenciaOperativa: ['', Validators.required],
      fileCartaResponsivaPlataforma: ['', Validators.required],
      fileCartaResponsivaIaaS: ['', Validators.required],
      fileCartaResponsivaStorage: ['', Validators.required],
      fileCartaResponsivaGsoc: ['', Validators.required],
      fileCartaResponsivaHa: ['', Validators.required],
      fileAtpFisicoFirmado: ['', Validators.required],
      fileAtpLogicoFirmado: ['', Validators.required],
      fileOtros: ['', Validators.required]
    });
  }

  /**
   * Metodo para cerrar el dialog
   */
  onCancel() {
    this.dialogRef.close(3);
  }
}