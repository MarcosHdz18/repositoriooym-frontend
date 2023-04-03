import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfirmComponent } from 'src/app/modules/shared/components/dialog-confirm/dialog-confirm.component';
import { AreaService } from 'src/app/modules/shared/services/area.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { NewAreaComponent } from '../new-area/new-area.component';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  isAdmin: any;

  constructor(private areaService: AreaService, private paginatorLabel: MatPaginatorIntl, public dialog: MatDialog,
    private snackbar: MatSnackBar, private utils: UtilsService) { }

  // Fuente de datos
  dataSource = new MatTableDataSource<AreaElement>();

  // Cabeceras de las columnas que se mostraran
  displayColumns: string[] = ['idArea', 'nombre', 'descripcion', 'acciones'];

  // Paginador del componente
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Ordenamiento por la columna en la tabla
  @ViewChild(MatSort) areaSort!: MatSort;

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
    this.getAreas();
    this.isAdmin = this.utils.isAdmin();
  }

  // Metodo que obtiene todas las areas del servicio REST programado en el backend
  getAreas() {
    this.areaService.getAreas().subscribe((data: any) => {
      console.log("Respuesta del servicio areas: ", data);
      this.processAreasResponse(data);
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  // Procesamiento de la peticion del servicio REST que obtiene todas las areas
  processAreasResponse(resp: any) {
    const dataArea: AreaElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listAreas = resp.areaResponse.areas;
      listAreas.forEach((element: AreaElement ) => {
        dataArea.push(element);
      });
      this.dataSource = new MatTableDataSource<AreaElement>(dataArea);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.areaSort;
    }
  }

  // Metodo para actualizar un registro
  update(idArea: number, nombre: string, descripcion: string) {
    const dialogRef = this.dialog.open(NewAreaComponent, {
      width: '450px',
      data: { idArea: idArea, nombre: nombre, descripcion: descripcion }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if(result == 1) {
        this.openSnackbar("Área actualizada con éxito", "Operación exitosa");
        this.getAreas();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al actualizar el área", "Operación fallida");
      }
    });
  }

  // Metodo para eliminar un area
  delete(idArea: any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '450px',
      data: { idArea: idArea, module: "area" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Area eliminada con éxito", "Operación Exitosa");
        this.getAreas();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al eliminar el área", "Operación fallida");
      }

    })
  }

  // Metodo para guardar un area
  saveAreaDialog() {
    const dialogRef = this.dialog.open(NewAreaComponent , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Área guardada con éxito", "Operación Exitosa");
        this.getAreas();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al guardar el área", "Operación fallida");
      }
    });
  }

  // Dialogo de operacion
  openSnackbar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackbar.open(message, action, {
      duration: 5000,
      horizontalPosition: this.horizontalPositionSnackbar,
      verticalPosition: this.verticalPositionSnackbar
    });
  }

  // Metodo para poder filtrar el contenido de la tabla
  filtrarAreas(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

// Contrato con los datos del empate con el servicio REST del backend
export interface AreaElement {
  idArea: number;
  nombre: string;
  descripcion: string;
}
