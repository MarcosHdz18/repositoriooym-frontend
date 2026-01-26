import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../../shared/services/utils.service';
import { RegionService } from '../../../shared/services/region.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RegionElement } from 'src/app/models/region.model';
import { NewRegionComponent } from '../new-region/new-region.component';
import { DialogConfirmComponent } from 'src/app/modules/shared/components/dialog-confirm/dialog-confirm.component';
import { trigger as animationTrigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css'],
  animations: [
    animationTrigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegionComponent implements OnInit {

  isAdmin: any;

  constructor(private regionService: RegionService, private paginatorLabel: MatPaginatorIntl, public dialog: MatDialog, private snackbar: MatSnackBar,
    private utils: UtilsService) { }

  // Fuente de datos
  dataSource = new MatTableDataSource<RegionElement>();

  // Cabeceras de las columnas que se mostraran
  displayColumns: string[] = ['idRegion', 'nombre', 'acciones'];

  // Paginador del componente
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Ordenamiento por la columna en la tabla
  @ViewChild(MatSort) regionSort!: MatSort;

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
    this.getRegiones();
    this.isAdmin = this.utils.isAdmin();
  }

  // Metodo que obtiene todas las areas del servicio REST programado en el backend
  getRegiones() {
    this.regionService.getRegiones().subscribe((data: any) => {
      console.log("Respuesta del servicio regiones: ", data);
      this.processRegionesResponse(data);
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  // Procesamiento de la peticion del servicio REST que obtiene todas las areas
  processRegionesResponse(resp: any) {
    const dataRegion: RegionElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listRegiones = resp.regionResponse.regiones;
      listRegiones.forEach((element: RegionElement) => {
        dataRegion.push(element);
      });
      this.dataSource = new MatTableDataSource<RegionElement>(dataRegion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.regionSort;
    }
  }

  // Metodo para actualizar un registro
  update(idRegion: number, nombre: string) {
    const dialogRef = this.dialog.open(NewRegionComponent, {
      width: '450px',
      data: { idRegion: idRegion, nombre: nombre }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Región actualizada con éxito", "Operación exitosa");
        this.getRegiones();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al actualizar la región", "Operación fallida");
      }
    });
  }

  // Metodo para eliminar un area
  delete(region: RegionElement) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '450px',
      data: { idRegion: region.idRegion, nombreRegion: region.nombre, module: "region" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Región eliminada con éxito", "Operación Exitosa");
        this.getRegiones();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al eliminar la región", "Operación fallida");
      }

    })
  }

  // Metodo para guardar un area
  saveRegionDialog() {
    const dialogRef = this.dialog.open(NewRegionComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Región guardada con éxito", "Operación Exitosa");
        this.getRegiones();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al guardar la región", "Operación fallida");
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
  filtrarRegiones(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Meotodo para limpiar la busqueda
  limpiarBusqueda(input: HTMLInputElement) {
    input.value = '';
    this.dataSource.filter = ''; // Reinicia el filtro
    input.focus(); // Coloca el cursor para volver a escribir
  }

  // Metodo que realiza la exportacion de los datos a un archivo de excel
  exportDataFileExcel() {
    this.regionService.exportRegionesExcel().subscribe((data: any) => {
      let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let fileURL = URL.createObjectURL(file);
      var anchor = document.createElement("a");
      anchor.download = "Reporte regiones.xlsx";
      anchor.href = fileURL;
      anchor.click();
      this.openSnackbar("Exportación de archivo correcta", "Operación exitosa");
    }, (error: any) => {
      this.openSnackbar("Exportación de archivo incorrecta", "Operación fallida");
    });
  }

}