import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfirmComponent } from 'src/app/modules/shared/components/dialog-confirm/dialog-confirm.component';
import { ResponsableService } from 'src/app/modules/shared/services/responsable.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { NewResponsableComponent } from '../new-responsable/new-responsable.component';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsableComponent implements OnInit {

  isAdmin: any;

  constructor(private responsableService: ResponsableService, private paginatorLabel: MatPaginatorIntl, public dialog: MatDialog,
    private snackbar: MatSnackBar, private utils: UtilsService) { }

  // Fuente de datos
  dataSource = new MatTableDataSource<ResponsableElement>();

  // Cabeceras de las columnas que se mostraran
  displayColumns: string[] = ['idResponsable', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'numeroEmpleado', 'area', 'acciones'];

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
    this.getResponsables();
    this.isAdmin = this.utils.isAdmin();
  }

  // Metodo que obtiene todos los responsables del servicio REST programado en el backend
  getResponsables() {
    this.responsableService.getResponsables().subscribe((data: any) => {
      console.log("Respuesta del servicio responsables: ", data);
      this.processResponsablesResponse(data);
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  // Procesamiento de la peticion del servicio REST que obtiene todos los responsables
  processResponsablesResponse(resp: any) {
    const dataResponsables: ResponsableElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listResponsables = resp.responsableResponse.responsables;
      listResponsables.forEach((element: ResponsableElement ) => {
        dataResponsables.push(element);
      });
      this.dataSource = new MatTableDataSource<ResponsableElement>(dataResponsables);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.areaSort;
    }
  }

  // Metodo para actualizar un registro
  update(idResponsable: number, nombre: string, apellidoPaterno: string, apellidoMaterno: string, numeroEmpleado: number,
    area: any) {
    const dialogRef = this.dialog.open(NewResponsableComponent, {
      width: '450px',
      data: { idResponsable: idResponsable, nombre: nombre, apellidoPaterno: apellidoPaterno, apellidoMaterno: apellidoMaterno, numeroEmpleado: numeroEmpleado, area: area }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if(result == 1) {
        this.openSnackbar("Responsable actualizado con éxito", "Operación exitosa");
        this.getResponsables();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al actualizar el responsable", "Operación fallida");
      }
    });
  }

  // Metodo para eliminar un responsable
  delete(idResponsable: any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '450px',
      data: { idResponsable: idResponsable, module: "responsable" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Responsable eliminado con éxito", "Operación Exitosa");
        this.getResponsables();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al eliminar el responsable", "Operación fallida");
      }

    })
  }

  // Metodo para guardar un responsable
  saveResponsableDialog() {
    const dialogRef = this.dialog.open(NewResponsableComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Responsable guardado con éxito", "Operación Exitosa");
        this.getResponsables();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al guardar el responsable", "Operación fallida");
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
  filtrarResponsables(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

// Contrato con los datos del empate con el servicio REST del backend
export interface ResponsableElement {
  idResponsable: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroEmpleado: number;
  area: any;
}
