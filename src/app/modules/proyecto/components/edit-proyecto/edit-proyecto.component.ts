import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProyectoElement } from 'src/app/models/proyecto.model';
import { ResponsableElement } from 'src/app/models/responsable.model';
import { TipoProyectoElement } from 'src/app/models/tipoProyectoElement';
import { ProyectoService } from 'src/app/modules/shared/services/proyecto.service';
import { ResponsableService } from 'src/app/modules/shared/services/responsable.service';
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

  // Variables para almacenar los nombres de los archivos
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

  // Variables para almacenar los archivos seleccionados
  selectedFileF60: File | null = null;
  selectedFileLld: File | null = null;
  selectedFileHld: File | null = null;
  selectedFileLayout: File | null = null;
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
  selectedFileAtpLogicoFirmado: File | null = null;
  selectedFileOtros: File | null = null;


  constructor( private fb: FormBuilder, private responsableService: ResponsableService, private tipoProyectoService: TipoProyectoService, private proyectoService: ProyectoService, 
    private dialogRef: MatDialogRef<EditProyectoComponent>, @Inject(MAT_DIALOG_DATA) public data: ProyectoElement, private util: UtilsService ) {
    // Configuración del título y botón del formulario
    this.tituloFormulario = 'Actualizar';
    this.botonLabel = 'Actualizar';

    // Inicializar el formulario reactivo
    this.proyectoForm = this.fb.group({
      nombre: ['', Validators.required],
      nodosTexto: ['', Validators.required],
      fechaLiberacion: [null],
      responsable: [this.data.responsableProyecto.idResponsable, Validators.required],
      tipoProyecto: [this.data.tipoProyecto.idTipoProyecto, Validators.required],
      fileLld: ['',],
      fileF60: ['',],
      fileHld: ['',],
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
      fileOtros: ['']
    });
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {

    this.isPerfilApp = this.util.isPerfilApp();
    this.isPerfilInfraestructura = this.util.isPerfilInfraestructura();

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
      fechaLiberacion: fecha ? fecha : null,
      responsable: this.data.responsableProyecto.idResponsable,
      tipoProyecto: this.data.tipoProyecto.idTipoProyecto
    });

    // 2) inicializar los nombres de archivo existentes
    this.nombreArchivoF60 = this.fileNameSinCarpeta(this.data.f60);
    this.nombreArchivoLld = this.fileNameSinCarpeta(this.data.lld);
    this.nombreArchivoHld = this.fileNameSinCarpeta(this.data.hld);
    this.nombreArchivoLayout = this.fileNameSinCarpeta(this.data.layout);
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
    this.nombreArchivoAtpLogicoFirmado = this.fileNameSinCarpeta(this.data.atpLogicoFirmado);
    this.nombreArchivoOtros = this.fileNameSinCarpeta(this.data.otros);

    this.getResponsables();
    this.getTiposProyecto();
  }

  // Limpiar lista de nodos al iniciar el componente
  parseNodos() {
    const txt = this.proyectoForm.get('nodosTexto')!.value as string;
    this.nodosList = txt.split(/[\s,]+/).map(w => w.trim()).filter(w => w.length > 0);  // descartando cadenas vacías  
  }

  // Función para limpiar el nombre del archivo sin mostrar la carpeta o nombre del proyecto
  fileNameSinCarpeta(path: string): string {
    if (!path || path === 'Pendiente') {
      return 'Pendiente';
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

    const formData = new FormData();
    // campos de texto
    formData.append('nombre', this.proyectoForm.value.nombre);
    formData.append('nodos', this.proyectoForm.value.nodosTexto);
    formData.append('fechaLiberacion',
      this.proyectoForm.value.fechaLiberacion
        ? (this.proyectoForm.value.fechaLiberacion as Date).toISOString().slice(0, 10)
        : 'Pendiente'
    );
    formData.append('responsableId', this.proyectoForm.value.responsable);
    formData.append('tipoProyectoId', this.proyectoForm.value.tipoProyecto);

    // helper para los archivos opcionales / existentes
    const appendFileOrPendiente = (campo: string, file: File | null, nombreActual: string) => {
      if (file) {
        formData.append(campo, file, file.name);
      } else {
        // si no subió archivo nuevo, seguimos con el nombre que ya tenía en el back
        formData.append(campo, nombreActual || 'Pendiente');
      }
    };

    appendFileOrPendiente('fileF60', this.selectedFileF60, this.nombreArchivoF60);
    appendFileOrPendiente('fileLld', this.selectedFileLld, this.nombreArchivoLld);
    appendFileOrPendiente('fileHld', this.selectedFileHld, this.nombreArchivoHld);
    appendFileOrPendiente('fileLayout', this.selectedFileLayout, this.nombreArchivoLayout);
    appendFileOrPendiente('fileSla', this.selectedFileSla, this.nombreArchivoSla);
    appendFileOrPendiente('fileReporteFotografico', this.selectedFileReporteFotografico, this.nombreArchivoReporteFotografico);
    appendFileOrPendiente('fileAsignacionFuerzaEspacio', this.selectedFileFuerzaEspacio, this.nombreArchivoAsignacionFuerzaEspacio);
    appendFileOrPendiente('fileInventarioHardware', this.selectedFileInventario, this.nombreArchivoInventarioHardware);
    appendFileOrPendiente('fileAtpFisico', this.selectedFileAtpFisico, this.nombreArchivoAtpFisico);
    appendFileOrPendiente('fileAtpLogico', this.selectedFileAtpLogico, this.nombreArchivoAtpLogico);
    appendFileOrPendiente('fileReporteTransferenciaOperativa', this.selectedFileRto, this.nombreArchivoRto);
    appendFileOrPendiente('fileCartaResponsivaPlataforma', this.selectedFileCartaPlataforma, this.nombreArchivoCartaResponsivaPlataforma);
    appendFileOrPendiente('fileCartaResponsivaIaaS', this.selectedFileCartaIaaS, this.nombreArchivoCartaResponsivaIaaS);
    appendFileOrPendiente('fileCartaResponsivaStorage', this.selectedFileCartaStorage, this.nombreArchivoCartaResponsivaStorage);
    appendFileOrPendiente('fileCartaResponsivaGsoc', this.selectedFileCartaGsoc, this.nombreArchivoCartaResponsivaGsoc);
    appendFileOrPendiente('fileCartaResponsivaHa', this.selectedFileCartaHa, this.nombreArchivoCartaResponsivaHa);
    appendFileOrPendiente('fileAtpFisicoFirmado', this.selectedFileAtpFisicoFirmado, this.nombreArchivoAtpFisicoFirmado);
    appendFileOrPendiente('fileAtpLogicoFirmado', this.selectedFileAtpLogicoFirmado, this.nombreArchivoAtpLogicoFirmado);
    appendFileOrPendiente('fileOtros', this.selectedFileOtros, this.nombreArchivoOtros);

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
   * Metodo que actualiza el formulario con los datos del registro seleccionado
   * @param data valor de la data ya llenado
   
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
    });*
  }*/

  /**
   * Metodo para cerrar el dialog
   */
  onCancel() {
    this.dialogRef.close(3);
  }
}