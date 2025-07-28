import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProyectoService } from 'src/app/modules/shared/services/proyecto.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { NewProyectoComponent } from '../new-proyecto/new-proyecto.component';
import { DialogConfirmComponent } from 'src/app/modules/shared/components/dialog-confirm/dialog-confirm.component';
import { DetalleProyectoComponent } from '../detalle-proyecto/detalle-proyecto.component';
import { EditProyectoComponent } from '../edit-proyecto/edit-proyecto.component';
import { ProyectoElement } from 'src/app/models/proyecto.model';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

  isAdmin: any;
  isEdit: any;
  isPefilApp: any;
  isPerfilInfraestructura: any;
  proyectos: ProyectoElement[] = [];
  maxMostrar = 6; // Número máximo de nodos a mostrar antes de "ver más"

  // Constructor del componente
  // Inyectamos los servicios que se utilizaran en el componente
  // ProyectoService: Servicio que interactua con el backend para obtener los proyectos
  // MatPaginatorIntl: Servicio que permite personalizar el paginador de Material Angular
  // MatDialog: Servicio que permite abrir dialogos modales
  // MatSnackBar: Servicio que permite mostrar mensajes emergentes (snackbar)
  // UtilsService: Servicio que contiene utilidades generales para la aplicación
  // MatPaginator: Componente de paginación de Material Angular
  // MatSort: Componente de ordenamiento de Material Angular
  constructor(private proyectoService: ProyectoService, private paginatorLabel: MatPaginatorIntl, public dialog: MatDialog,
    private snackbar: MatSnackBar, private util: UtilsService) { }

  ngOnInit(): void {
    this.paginatorLabel.itemsPerPageLabel = "Elementos por página";
    this.paginatorLabel.firstPageLabel = "Primer página";
    this.paginatorLabel.previousPageLabel = "Anterior";
    this.paginatorLabel.nextPageLabel = "Siguiente";
    this.paginatorLabel.lastPageLabel = "Última Página";
    this.getProyectos();
    this.isAdmin = this.util.isAdmin();
    this.isEdit = this.util.isEdit();
    this.isPefilApp = this.util.isPerfilApp();
    this.isPerfilInfraestructura = this.util.isPerfilInfraestructura();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.proyectoSort;
    // opcional: normalizar comparaciones (por ejemplo fecha como Date y responsable por nombre)
    this.dataSource.sortingDataAccessor = (item, prop) => {
      if (prop === 'fechaLiberacion') {
        return new Date(item.fechaLiberacion);
      }
      if (prop === 'responsable') {
        return item.responsableProyecto.nombre.toLowerCase();
      }
      // @ts-ignore
      return item[prop];
    };
  }

  //DataSource de los datos a pintar
  dataSource = new MatTableDataSource<ProyectoElement>();

  // Columnas que se mostraran en la tabla
  displayColumns: string[] = ['idProyecto', 'nombre', 'nodos', 'fechaLiberacion', 'anio', 'responsableProyecto', 'tipoProyecto', 'acciones'];

  // Paginador del componente
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Sort del componente
  @ViewChild(MatSort) proyectoSort!: MatSort;

  // Posicion en pantalla del snackbar
  horizontalPositionSnackbar: MatSnackBarHorizontalPosition = 'center';
  verticalPositionSnackbar: MatSnackBarVerticalPosition = 'bottom';

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

  // Procesamiento del servicio REST y se recorre el json
  processProyectosResponse(resp: any) {

    const dataProyectos: ProyectoElement[] = [];

    if (resp.metadata[0].code == '00') {

      let listProyectos = resp.proyectoResponse.proyectos;

      listProyectos.forEach((element: ProyectoElement) => {
        dataProyectos.push(element);
      });

      this.dataSource = new MatTableDataSource<ProyectoElement>(dataProyectos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.proyectoSort;
    }
  }

  // Metodo que actualiza un registro de proyecto en la base de datos
  editProyecto(idProyecto: number, nombre: string, fechaLiberacion: string, responsableProyecto: any, tipoProyecto: string) {

    const dialogRef = this.dialog.open(EditProyectoComponent, {
      width: '450px',
      data: { idProyecto: idProyecto, nombre: nombre, fechaLiberacion: fechaLiberacion, responsableProyecto: responsableProyecto, tipoProyecto: tipoProyecto }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Proyecto actualizado con éxito", "Operación exitosa");
        this.getProyectos();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al actualizar el proyecto", "Operación fallida");
      }
    });
  }

  // Metodo que elimina un registro en la base de datos
  deleteProyecto(proyecto: ProyectoElement) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '450px',
      data: { idProyecto: proyecto.idProyecto, nombreProyecto: proyecto.nombre ,module: "proyecto" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackbar("Proyecto eliminado con éxito", "Operación exitosa");
        this.getProyectos();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al eliminar el proyecto", "Operación fallida");
      }
    });
  }

  // Detalle del proyecto
  detalleProyecto(idProyecto: any, nombre: any, fechaLiberacion: any, f60: any, nodos: any, lld: any, hld: any, rto: any, atpFisico: any, atpLogico: any, atpFisicoFirmado: any,
    atpLogicoFirmado: any, cartaResponsivaPlataforma: any, cartaResponsivaIaaS: any, cartaResponsivaStorage: any, cartaResponsivaHa: any,
    cartaResponsivaGsoc: any, layout: any, sla: any, reporteFotografico: any, asignacionFuerzaEspacio: any, inventarioHardware: any) {
    const dialogRef = this.dialog.open(DetalleProyectoComponent, {
      width: '1000px',
      data: {
        idProyecto: idProyecto, nombre: nombre, fechaLiberacion: fechaLiberacion, f60: f60, lld: lld, nodos: nodos, hld: hld, reporteTransferenciaOperativa: rto, atpFisico: atpFisico, atpLogico: atpLogico, atpFisicoFirmado: atpFisicoFirmado,
        atpLogicoFirmado: atpLogicoFirmado, cartaResponsivaPlataforma: cartaResponsivaPlataforma, cartaResponsivaIaaS: cartaResponsivaIaaS, cartaResponsivaStorage: cartaResponsivaStorage,
        cartaResponsivaHa: cartaResponsivaHa, cartaResponsivaGsoc: cartaResponsivaGsoc, layout: layout, sla: sla, reporteFotografico: reporteFotografico,
        asignacionFuerzaEspacio: asignacionFuerzaEspacio, inventarioHardware: inventarioHardware
      }
    });
  }

  // Dialog para un nuevo registro en la base
  openNewProyectoDialog() {
    const dialogRef = this.dialog.open(NewProyectoComponent, {
      width: '1000px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackbar("Proyecto guardado con éxito", "Operación exitosa");
        this.getProyectos();
      } else if (result === 2) {
        this.openSnackbar("Se produjo un error al guardar el proyecto", "Operación fallida");
      }
    });
  }

  // Dialog para editar un registro en la base
  openEditProyectoDialog(proyecto: ProyectoElement) {
    const dialogRef = this.dialog.open(EditProyectoComponent, {
      width: '1000px',
      data: proyecto
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackbar("Proyecto actualizado con éxito", "Operación exitosa");
        this.getProyectos(); // Actualiza la lista de proyectos
      } else if (result === 2) {
        this.openSnackbar("Se produjo un error al actualizar el proyecto", "Operación fallida");
      }
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

  // Metodo para poder filtrar el contenido de la tabla
  filtrarProyectos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Metodo que realiza la exportacion de los datos a un archivo de Excel
  exportDataFileExcel() {
    this.proyectoService.exportProyectosExcel().subscribe((data: any) => {
      let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let fileURL = URL.createObjectURL(file);
      var anchor = document.createElement("a");
      anchor.download = "Reporte proyectos.xlsx";
      anchor.href = fileURL;
      anchor.click();
      this.openSnackbar("Exportación de archivo correcta", "Operación exitosa");
    }, (error: any) => {
      this.openSnackbar("Exportación de archivo incorrecta", "Operación fallida");
    });
  }
}
