import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ProyectoElement } from 'src/app/models/proyecto.model';
import { ProyectoService } from 'src/app/modules/shared/services/proyecto.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';

interface DocItem {
  key: string;
  label: string;
  filename: string | null;
  icon: string;
}

@Component({
  selector: 'app-detalle-proyecto',
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.css']
})
export class DetalleProyectoComponent implements OnInit {

  documentos: DocItem[] = [];
  documentosSubidos: DocItem[] = []; // Mostrar solo los documentos subidos
  proyectos: ProyectoElement[] = [];
  isAdmin: any;

  // Declaramos las variables
  searchTerm: string = '';
  nodosFiltrados: string[] = [];

  //DataSource de los datos a pintar
  dataSource = new MatTableDataSource<ProyectoElement>();

  // Posicion en pantalla del snackbar
  horizontalPositionSnackbar: MatSnackBarHorizontalPosition = 'center';
  verticalPositionSnackbar: MatSnackBarVerticalPosition = 'bottom';

  constructor(private proyectoService: ProyectoService, public dialog: MatDialog, private util: UtilsService, private dialogRef: MatDialogRef<DetalleProyectoComponent>,
    private snackbar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {

    // Procesamos los nodos directamente del objeto inyectado
    if (this.data.nodos) {
      this.data.nodosList = this.data.nodos
        .split(/\s+/)
        .filter((w: string) => w.trim().length > 0);
    }

    // Inicializamos la lista filtrada con todos los nodos al principio
    this.nodosFiltrados = this.data.nodosList ? [...this.data.nodosList] : [];

    this.buildDocumentList();

    // Montamos la lista de documentos subidos
    const todos: DocItem[] = [
      { label: 'F60', key: 'f60', filename: this.data.f60, icon: 'description' },
      { label: 'LLD', key: 'lld', filename: this.data.lld, icon: 'table_chart' },
      { label: 'HLD', key: 'hld', filename: this.data.hld, icon: 'table_chart' },
      { label: 'Layout', key: 'layout', filename: this.data.layout, icon: 'integration_instructions' },
      { label: 'Presentacion', key: 'presentacion', filename: this.data.presentacion, icon: 'integration_instructions' },
      { label: 'SLA', key: 'sla', filename: this.data.sla, icon: 'integration_instructions' },
      { label: 'RTO', key: 'reportetransferenciaoperativa', filename: this.data.reporteTransferenciaOperativa, icon: 'integration_instructions' },
      { label: 'Asignación Fuerza Espacio', key: 'asignacionfuerzaespacio', filename: this.data.asignacionFuerzaEspacio, icon: 'integration_instructions' },
      { label: 'Reporte fotográfico', key: 'reporteFotografico', filename: this.data.reporteFotografico, icon: 'integration_instructions' },
      { label: 'Inventario Hardware', key: 'inventariohardware', filename: this.data.inventarioHardware, icon: 'integration_instructions' },
      { label: 'ATP Físico', key: 'atpfisico', filename: this.data.atpFisico, icon: 'integration_instructions' },
      { label: 'ATP Físico Firmado', key: 'atpfisicofirmado', filename: this.data.atpFisicoFirmado, icon: 'integration_instructions' },
      { label: 'ATP Lógico', key: 'atplogico', filename: this.data.atpLogico, icon: 'integration_instructions' },
      { label: 'Responsiva IaaS', key: 'cartaresponsivaiaas', filename: this.data.cartaResponsivaIaaS, icon: 'integration_instructions' },
      { label: 'Responsiva Plataforma', key: 'cartaresponsivaplataforma', filename: this.data.cartaResponsivaPlataforma, icon: 'integration_instructions' },
      { label: 'Responsiva Storage', key: 'cartaresponsivastorage', filename: this.data.cartaResponsivaStorage, icon: 'integration_instructions' },
      { label: 'Responsiva HA', key: 'cartaresponsivaha', filename: this.data.cartaResponsivaHa, icon: 'integration_instructions' },
      { label: 'Responsiva GSOC', key: 'cartaresponsivagsoc', filename: this.data.cartaResponsivaGsoc, icon: 'integration_instructions' },
      { label: 'Otros archivos', key: 'otros', filename: this.data.otros, icon: 'integration_instructions' }
    ];

    // 2) Filtramos todo aquello que NO sea "Pendiente"
    this.documentosSubidos = todos.filter(doc =>
      doc.filename != null
      && doc.filename.trim() !== ''
      && doc.filename.toLowerCase() !== 'na'
    );

    //this.getProyectos();
    this.isAdmin = this.util.isAdmin();
  }

  // Filtra los nodos según el término de búsqueda
  // Función que se ejecuta cada que el usuario escribe
  aplicarFiltro() {
    if (!this.searchTerm) {
      this.nodosFiltrados = [...this.data.nodosList];
    } else {
      this.nodosFiltrados = this.data.nodosList.filter((n: string) =>
        n.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  copiarNodos() {
    if (this.nodosFiltrados.length === 0) return;

    // Unimos los nodos filtrados con un salto de línea
    const textoACopiar = this.nodosFiltrados.join('\n');

    navigator.clipboard.writeText(textoACopiar).then(() => {
      // Usamos el snackbar para notificar al usuario
      this.openSnackbar("Nodos copiados al portapapeles", "Éxito");
    }).catch(err => {
      console.error('Error al copiar: ', err);
    });
  }

  // Dialogo de operacion
    openSnackbar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
      return this.snackbar.open(message, action, {
        duration: 5000,
        horizontalPosition: this.horizontalPositionSnackbar,
        verticalPosition: this.verticalPositionSnackbar
      });
    }

  // Peticion al servicio REST del backend y que obtiene todos los proyectos
  getProyectos() {
    this.proyectoService.getProyectos().subscribe((data: any) => {
      console.log('Respuesta del servicio proyectos', data);
      this.proyectos = data.proyectoResponse.proyectos.map((p: any) => ({
        ...p,
        nodosList: p.nodos ? p.nodos.split(/\s+/)              // separa por espacios
          .filter((w: {
            trim: () => { (): any; new(): any; length: number; };
          }) => w.trim().length > 0) : [] // filtra palabras vacías
      }));
      this.dataSource.data = this.proyectos;
    }, (error: any) => {
      console.log('Error', error);
    });
  }

  onNodoListWheel(event: WheelEvent) {
    // evitamos el scroll vertical del documento
    event.preventDefault();

    // this.nodoListContainer es un @ViewChild apuntando al div.nodos-list
    const el = (event.currentTarget as HTMLElement);
    // desplazamos horizontalmente según deltaY
    el.scrollLeft += event.deltaY;
  }

  // Procesamiento del servicio REST y se recorre el json
  processProyectosResponse(resp: any) {

    const dataProyectos: ProyectoElement[] = [];

    if (resp.metadata[0].code == '00') {

      let listProyectos = resp.proyectoResponse.proyectos;

      listProyectos.forEach((element: ProyectoElement) => {
        dataProyectos.push(element);
      });

      this.dataSource = new MatTableDataSource<ProyectoElement>(dataProyectos);
      //this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.proyectoSort;
    }
  }

  /**
   * Metodo para cerrar el dialog
   */
  onCancel() {
    this.dialogRef.close(3);
  }

  /**
   * Metodo para descargar el archivo del proyecto
   * @param id identificador del proyecto
   * @param documento nombre del documento a descargar (f60, lld, hld, layout, sla, reporteFotografico, asignacionFuerzaEspacio, inventarioHardware, atpFisico, atpFisicoFirmado)
   */
  onDownloadFile(documento: string) {

    console.log('Descargando archivo:', documento);

    const id = this.data.idProyecto;

    this.proyectoService.downloadFile(id, documento)
      .subscribe((resp: HttpResponse<Blob>) => {
        const blob = resp.body!;
        // Extrae el filename real
        const contentDisp = resp.headers.get('content-disposition') || '';
        const match = /filename="(.+)"/.exec(contentDisp);
        const filename = match ? match[1] : `${documento}_${id}`;

        // Crea enlace y dispara descarga
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
      }, err => console.error('Error descargando', err));
  }

  /**
   * Metodo que se utiliza para mostrar un mensaje en pantalla
   * @param mensaje mensaje que se mostrara en pantalla
   * @param accion accion que se realizo 
   */
  buildDocumentList() {
    this.documentos = [
      { key: 'f60', label: 'F60', filename: this.data.f60, icon: 'description' },
      { key: 'lld', label: 'LLD', filename: this.data.lld, icon: 'table_chart' },
      { key: 'hld', label: 'HLD', filename: this.data.hld, icon: 'table_chart' },
      { key: 'layout', label: 'Layout', filename: this.data.layout, icon: 'integration_instructions' },
      { key: 'presentacion', label: 'Presentacion', filename: this.data.presentacion, icon: 'integration_instructions' },
      { key: 'sla', label: 'SLA', filename: this.data.sla, icon: 'integration_instructions' },
      { key: 'reporteFotografico', label: 'Reporte Fotográfico', filename: this.data.reporteFotografico, icon: 'integration_instructions' },
      { key: 'asignacionFuerzaEspacio', label: 'Asignación Fuerza Espacio', filename: this.data.asignacionFuerzaEspacio, icon: 'integration_instructions' },
      { key: 'inventarioHardware', label: 'Inventario Hardware', filename: this.data.inventarioHardware, icon: 'integration_instructions' },
      { key: 'atpFisico', label: 'ATP Físico', filename: this.data.atpFisico, icon: 'integration_instructions' },
      { key: 'atpFisicoFirmado', label: 'ATP Físico Firmado', filename: this.data.atpFisicoFirmado, icon: 'integration_instructions' },
      { key: 'atpLogico', label: 'ATP Lógico', filename: this.data.atpLogico, icon: 'integration_instructions' },
      { key: 'cartaResponsivaPlataforma', label: 'Responsiva Plataforma', filename: this.data.cartaResponsivaPlataforma, icon: 'integration_instructions' },
      { key: 'cartaResponsivaIaaS', label: 'Responsiva IaaS', filename: this.data.cartaResponsivaIaaS, icon: 'integration_instructions' },
      { key: 'cartaResponsivaStorage', label: 'Responsiva Storage', filename: this.data.cartaResponsivaStorage, icon: 'integration_instructions' },
      { key: 'cartaResponsivaHa', label: 'Responsiva HA', filename: this.data.cartaResponsivaHa, icon: 'integration_instructions' },
      { key: 'cartaResponsivaGsoc', label: 'Responsiva GSOC', filename: this.data.cartaResponsivaGsoc, icon: 'integration_instructions' },
      { key: 'otros', label: 'Otros archivos', filename: this.data.otros, icon: 'integration_instructions' }
    ];
    console.log('Documentos cargados:', this.documentos);
  }
}