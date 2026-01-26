import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SitioElement } from 'src/app/models/sitio.model';
import { SitioService } from 'src/app/modules/shared/services/sitio.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { NewSitioComponent } from '../new-sitio/new-sitio.component';
import { DialogConfirmComponent } from 'src/app/modules/shared/components/dialog-confirm/dialog-confirm.component';
import { trigger as animationTrigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sitio',
  templateUrl: './sitio.component.html',
  styleUrls: ['./sitio.component.css'],
  animations: [
    animationTrigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SitioComponent implements OnInit {

  isAdmin: any;
  isPerfilInfraestructura: any;

  constructor(private sitioService: SitioService, private paginatorLabel: MatPaginatorIntl, public dialog: MatDialog,
    private snackbar: MatSnackBar, private utils: UtilsService) { }

  // Fuente de datos
  dataSource = new MatTableDataSource<SitioElement>();

  // Cabeceras de las columnas que se mostraran
  displayColumns: string[] = ['idSitio', 'nombre', 'treeChar', 'region', 'direccion', 'nombreContacto', 'telefonoContacto', 'correoContacto', 'acciones'];

  // Paginador del componente
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Ordenamiento por la columna en la tabla
  @ViewChild(MatSort) sitioSort!: MatSort;

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
    this.getSitios();
    this.isAdmin = this.utils.isAdmin();
    this.isPerfilInfraestructura = this.utils.isPerfilInfraestructura();
  }

  // Metodo que obtiene todos los sitios del servicio REST programado en el backend
  getSitios() {
    this.sitioService.getSitios().subscribe((data: any) => {
      console.log("Respuesta del servicio sitios: ", data);
      this.processSitioResponse(data);
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  // Procesamiento de la peticion del servicio REST que obtiene todos los responsables
  processSitioResponse(resp: any) {
    const dataSitios: SitioElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listSitios = resp.sitioResponse.sitios;
      listSitios.forEach((element: SitioElement) => {
        dataSitios.push(element);
      });
      this.dataSource = new MatTableDataSource<SitioElement>(dataSitios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sitioSort;
    }
  }

  // Metodo para actualizar un registro
  update(idSitio: number, nombre: string, treeChar: string, direccion: string, nombreContacto: string, telefonoContacto: string, correoContacto: string, region: any) {

    const dialogRef = this.dialog.open(NewSitioComponent, {
      width: '450px',
      data: { idSitio: idSitio, nombre: nombre, treeChar: treeChar, direccion: direccion, nombreContacto: nombreContacto, telefonoContacto: telefonoContacto, correoContacto: correoContacto, region: region }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Sitios actualizado con éxito", "Operación exitosa");
        this.getSitios();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al actualizar el sitio", "Operación fallida");
      }
    });
  }

  // Metodo para eliminar un responsable
  delete(sitio: SitioElement) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '450px',
      data: {
        idSitio: sitio.idSitio,
        nombreSitio: `${sitio.nombre}`,
        module: "sitio"
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Sitio eliminado con éxito", "Operación Exitosa");
        this.getSitios();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al eliminar el sitio", "Operación fallida");
      }

    })
  }

  // Metodo para guardar un responsable
  saveSitioDialog() {
    const dialogRef = this.dialog.open(NewSitioComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Sitio guardado con éxito", "Operación Exitosa");
        this.getSitios();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al guardar el sitio", "Operación fallida");
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
  filtrarSitios(event: Event) {
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
    this.sitioService.exportSitiosExcel().subscribe((data: any) => {
      let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let fileURL = URL.createObjectURL(file);
      var anchor = document.createElement("a");
      anchor.download = "Reporte sitios.xlsx";
      anchor.href = fileURL;
      anchor.click();
      this.openSnackbar("Exportación de archivo correcta", "Operación exitosa");
    }, (error: any) => {
      this.openSnackbar("Exportación de archivo incorrecta", "Operación fallida");
    });
  }

}
