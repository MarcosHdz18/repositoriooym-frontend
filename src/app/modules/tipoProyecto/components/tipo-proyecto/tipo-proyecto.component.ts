import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TipoProyectoElement } from 'src/app/models/tipoProyectoElement';
import { TipoProyectoService } from 'src/app/modules/shared/services/tipoProyectoService.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { NewTipoProyectoComponent } from '../new-tipo-proyecto/new-tipo-proyecto.component';
import { DialogConfirmComponent } from 'src/app/modules/shared/components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-tipo-proyecto',
  templateUrl: './tipo-proyecto.component.html',
  styleUrls: ['./tipo-proyecto.component.css']
})
export class TipoProyectoComponent implements OnInit {

  isAdmin: any;

  constructor(private tipoProyectoService: TipoProyectoService, private paginatorLabel: MatPaginatorIntl, public dialog: MatDialog,
    private snackbar: MatSnackBar, private utils: UtilsService) { }

  // Fuente de datos
  dataSource = new MatTableDataSource<TipoProyectoElement>();

  // Cabeceras de las columnas que se mostraran
  displayColumns: string[] = ['idTipoProyecto', 'nombre', 'descripcion', 'acciones'];

  // Paginador del componente
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Ordenamiento por la columna en la tabla
  @ViewChild(MatSort) tipoProyectoSort!: MatSort;

  // Posicion en pantalla del snackbar
  horizontalPositionSnackbar: MatSnackBarHorizontalPosition = 'center';
  verticalPositionSnackbar: MatSnackBarVerticalPosition = 'bottom';

  // Metodo que inicializa el renderizado del componente

  ngOnInit(): void {
    this.paginatorLabel.itemsPerPageLabel = "Elementos por página";
    this.paginatorLabel.firstPageLabel = "Primer página";
    this.paginatorLabel.previousPageLabel = "Anterior";
    this.paginatorLabel.nextPageLabel = "Siguiente";
    this.paginatorLabel.lastPageLabel = "Última Página";
    this.getTiposProyecto();
    this.isAdmin = this.utils.isAdmin();
  }

  // Metodo que obtiene todos los tipos de proyecto del servicio REST programado en el backend
  getTiposProyecto() {
    this.tipoProyectoService.getTiposProyecto().subscribe((data: any) => {
      console.log("Respuesta del servicio tipos de proyecto: ", data);
      this.processTiposProyectoResponse(data);
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  // Procesa la respuesta de los tipos de proyecto y actualiza la fuente de datos
  processTiposProyectoResponse(resp: any) {

    const dataTiposProyecto: TipoProyectoElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listTipoProyecto = resp.tipoProyectoResponse.tiposProyecto;
      listTipoProyecto.forEach((element: TipoProyectoElement) => {
        dataTiposProyecto.push(element);
      });
      this.dataSource = new MatTableDataSource<TipoProyectoElement>(dataTiposProyecto);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.tipoProyectoSort;
    }
  }

  // Metodo para actualizar un registro
  update(idTipoProyecto: number, nombre: string, descripcion: string) {
    const dialogRef = this.dialog.open(NewTipoProyectoComponent, {
      width: '450px',
      data: { idTipoProyecto: idTipoProyecto, nombre: nombre, descripcion: descripcion }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Tipo de proyecto actualizado con éxito", "Operación exitosa");
        this.getTiposProyecto();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al actualizar el tipo de proyecto", "Operación fallida");
      }
    });
  }

  // Metodo para eliminar un tipo de proyecto
  delete(tipoProyecto: TipoProyectoElement) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '450px',
      data: { idTipoProyecto: tipoProyecto.idTipoProyecto, nombreTipoProyecto: tipoProyecto.nombre, module: "tipoProyecto" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Tipo de proyecto eliminado con éxito", "Operación Exitosa");
        this.getTiposProyecto();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al eliminar el departamento", "Operación fallida");
      }

    })
  }

  // Metodo para guardar un area
  saveTipoProyectoDialog() {
    const dialogRef = this.dialog.open(NewTipoProyectoComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Tipo de proyecto guardado con éxito", "Operación Exitosa");
        this.getTiposProyecto();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al guardar el tipo de proyecto", "Operación fallida");
      }
    });
  }

  // Dialogo de operacion
  openSnackbar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.open(message, action, {
      duration: 10000,
      horizontalPosition: this.horizontalPositionSnackbar,
      verticalPosition: this.verticalPositionSnackbar
    });
  }

  // Metodo para poder filtrar el contenido de la tabla
  filtrarTiposProyecto(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Metodo que realiza la exportacion de los datos a un archivo de excel
  exportDataFileExcel() {
    this.tipoProyectoService.exportTiposProyectoExcel().subscribe((data: any) => {
      let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let fileURL = URL.createObjectURL(file);
      var anchor = document.createElement("a");
      anchor.download = "Reporte tipos_proyecto.xlsx";
      anchor.href = fileURL;
      anchor.click();
      this.openSnackbar("Exportación de archivo correcta", "Operación exitosa");
    }, (error: any) => {
      this.openSnackbar("Exportación de archivo incorrecta", "Operación fallida");
    });
  }
}
