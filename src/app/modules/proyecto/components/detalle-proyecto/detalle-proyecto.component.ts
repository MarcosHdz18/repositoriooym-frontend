import { HttpEvent, HttpEventType } from '@angular/common/http';
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
  category?: string;
  idDocumentoAdjunto?: number;
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
  isPerfilInfraestructura: any;

  isDownloading: boolean = false;
  downloadProgress: number = 0;

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

    // Montamos la lista de documentos subidos
    const todos: DocItem[] = [
      { label: 'F60', key: 'f60', filename: this.data.f60, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'LLD', key: 'lld', filename: this.data.lld, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'HLD', key: 'hld', filename: this.data.hld, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'Memoria técnica', key: 'memoriaTecnica', filename: this.data.memoriaTecnica, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'SID', key: 'sid', filename: this.data.sid, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'Layout', key: 'layout', filename: this.data.layout, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'Presentacion', key: 'presentacion', filename: this.data.presentacion, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'SLA', key: 'sla', filename: this.data.sla, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'RTO', key: 'reportetransferenciaoperativa', filename: this.data.reporteTransferenciaOperativa, icon: 'integration_instructions', category: 'actas_aceptacion' },
      { label: 'Asignación Fuerza Espacio', key: 'asignacionfuerzaespacio', filename: this.data.asignacionFuerzaEspacio, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'Etiquetado', key: 'etiquetado', filename: this.data.etiquetado, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'Planos', key: 'planos', filename: this.data.planos, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'Proyecto ejecutivo', key: 'proyectoEjecutivo', filename: this.data.proyectoEjecutivo, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'Reporte fotográfico', key: 'reporteFotografico', filename: this.data.reporteFotografico, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'Inventario Hardware', key: 'inventariohardware', filename: this.data.inventarioHardware, icon: 'integration_instructions', category: 'documentacion_tecnica' },
      { label: 'ATP Físico', key: 'atpfisico', filename: this.data.atpFisico, icon: 'integration_instructions', category: 'protocolos_aceptacion' },
      { label: 'ATP Físico Firmado', key: 'atpfisicofirmado', filename: this.data.atpFisicoFirmado, icon: 'integration_instructions', category: 'protocolos_aceptacion' },
      { label: 'ATP Lógico', key: 'atplogico', filename: this.data.atpLogico, icon: 'integration_instructions', category: 'protocolos_aceptacion' },
      { label: 'Responsiva IaaS', key: 'cartaresponsivaiaas', filename: this.data.cartaResponsivaIaaS, icon: 'integration_instructions', category: 'actas_aceptacion' },
      { label: 'Responsiva Plataforma', key: 'cartaresponsivaplataforma', filename: this.data.cartaResponsivaPlataforma, icon: 'integration_instructions', category: 'actas_aceptacion' },
      { label: 'Responsiva Storage', key: 'cartaresponsivastorage', filename: this.data.cartaResponsivaStorage, icon: 'integration_instructions', category: 'actas_aceptacion' },
      { label: 'Responsiva HA', key: 'cartaresponsivaha', filename: this.data.cartaResponsivaHa, icon: 'integration_instructions', category: 'actas_aceptacion' },
      { label: 'Responsiva GSOC', key: 'cartaresponsivagsoc', filename: this.data.cartaResponsivaGsoc, icon: 'integration_instructions', category: 'actas_aceptacion' },
      { label: 'Responsiva Llaves', key: 'cartaresponsivallaves', filename: this.data.cartaResponsivaLlaves, icon: 'integration_instructions', category: 'actas_aceptacion' },
      { label: 'Otros archivos', key: 'otros', filename: this.data.otros, icon: 'integration_instructions', category: 'documentacion_tecnica' }
    ];

    // 2) Filtramos todo aquello que NO sea "na"
    this.documentosSubidos = todos.filter(doc =>
      doc.filename != null
      && doc.filename.trim() !== ''
      && doc.filename.toLowerCase() !== 'na'
    );


    if (this.data.adjuntos && Array.isArray(this.data.adjuntos)) {
      // Creamos un arreglo temporal con los nuevos adjuntos
      const nuevosAdjuntos = this.data.adjuntos.map((adj: any) => ({
        key: 'adjuntos',
        label: 'Archivo Adicional',
        filename: adj.nombreArchivo,
        icon: 'attachment',
        category: 'adjuntos_adicionales',
        idDocumentoAdjunto: adj.idDocumentoAdjunto
      }));
      this.documentosSubidos = [...this.documentosSubidos, ...nuevosAdjuntos];
    }
    
    this.isAdmin = this.util.isAdmin();
    this.isPerfilInfraestructura = this.util.isPerfilInfraestructura();
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
    const cantidad = this.nodosFiltrados.length;
    if (cantidad === 0) return;

    // Unimos los nodos filtrados con un salto de línea
    const textoACopiar = this.nodosFiltrados.join('\n');

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textoACopiar).then(() => {
        this.openSnackbar(`${cantidad} nodos copiados exitosamente`, "Operación exitosa");
      }).catch(err => {
        this.copiarFallback(textoACopiar, cantidad);
      });
    } else {
      this.copiarFallback(textoACopiar, cantidad);
    }
  }
  // Dialogo de operacion
  openSnackbar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.open(message, action, {
      duration: 5000,
      horizontalPosition: this.horizontalPositionSnackbar,
      verticalPosition: this.verticalPositionSnackbar
    });
  }

  // Función de respaldo para entornos HTTP (Producción sin SSL)
  private copiarFallback(texto: string, cantidad: number) {
    const textArea = document.createElement("textarea");
    textArea.value = texto;

    // Lo hacemos invisible pero presente en el DOM
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      const exitoso = document.execCommand('copy');
      if (exitoso) {
        this.openSnackbar(`${cantidad} nodos copiados exitosamente`, "Operación exitosa");
      } else {
        this.openSnackbar("No se pudieron copiar los nodos", "Error");
      }
    } catch (err) {
      console.error('Error en fallback de copia:', err);
      this.openSnackbar("Error al acceder al portapapeles", "Error");
    }
    document.body.removeChild(textArea);
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

  tieneDocumentos(categoria: string): number {
    if (!this.documentosSubidos) return 0;
    return this.documentosSubidos.filter(d => d.category === categoria).length;
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

    let downloadTimer: any;
    this.downloadProgress = 0;

    // Iniciamos un temporizador para mostrar el overlay de descarga si tarda más de 400ms
    downloadTimer = setTimeout(() => {
      this.isDownloading = true;
    }, 400); // Si la descarga tarda más de 400ms, mostramos el overlay

    console.log('Descargando archivo:', documento);

    const id = this.data.idProyecto;

    this.proyectoService.downloadFile(id, documento).subscribe({
      next: (event: HttpEvent<Blob>) => {

        // Manejo de eventos de progreso
        if (event.type === HttpEventType.DownloadProgress) {
          if (event.total) {
            this.downloadProgress = Math.round((100 * event.loaded) / event.total);
          }
        }

        // Cuando la descarga se completa
        if (event.type === HttpEventType.Response) {
          clearTimeout(downloadTimer);
          this.isDownloading = false;

          const blob = event.body!;
          // Extrae el filename real
          const contentDisp = event.headers.get('content-disposition') || '';
          const match = /filename="(.+)"/.exec(contentDisp);
          const filename = match ? match[1] : `${documento}_${id}`;

          // Crea enlace y dispara descarga
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          URL.revokeObjectURL(link.href);
        }

      },
      error: (err) => {
        if (downloadTimer) clearTimeout(downloadTimer);
        this.isDownloading = false;
        this.openSnackbar('Error al descargar el archivo', 'Cerrar');
      }
    });
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
}