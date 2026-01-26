import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClienteElement } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/modules/shared/services/cliente.service';
import { UtilsService } from 'src/app/modules/shared/services/utils.service';
import { NewClienteComponent } from '../new-cliente/new-cliente.component';
import { DialogConfirmComponent } from 'src/app/modules/shared/components/dialog-confirm/dialog-confirm.component';
import { trigger as animationTrigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  animations: [
    animationTrigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ClienteComponent implements OnInit {

  isAdmin: any;
  isPefilApp: any;
  isPerfilInfraestructura: any;

  constructor(private clienteService: ClienteService, private paginatorLabel: MatPaginatorIntl, public dialog: MatDialog,
    private snackbar: MatSnackBar, private util: UtilsService) { }

  // Fuente de datos
  dataSource = new MatTableDataSource<ClienteElement>();

  // Cabeceras de las columnas que se mostraran
  displayColumns: string[] = ['idCliente', 'nombre', 'descripcion', 'acciones'];

  // Paginador del componente
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Ordenamiento por la columna en la tabla
  @ViewChild(MatSort) clienteSort!: MatSort;

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
    this.getClientes();
    this.isAdmin = this.util.isAdmin();
    this.isPefilApp = this.util.isPerfilApp();
    this.isPerfilInfraestructura = this.util.isPerfilInfraestructura();
  }

  // Metodo que obtiene todas las areas del servicio REST programado en el backend
  getClientes() {
    this.clienteService.getClientes().subscribe((data: any) => {
      console.log("Respuesta del servicio clientes: ", data);
      this.processClientesResponse(data);
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  // Procesamiento de la peticion del servicio REST que obtiene todas las areas
  processClientesResponse(resp: any) {
    const dataCliente: ClienteElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listClientes = resp.clienteResponse.clientes;
      listClientes.forEach((element: ClienteElement) => {
        dataCliente.push(element);
      });
      this.dataSource = new MatTableDataSource<ClienteElement>(dataCliente);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.clienteSort;
    }
  }

  // Metodo para actualizar un registro
  update(idCliente: number, nombre: string, descripcion: string) {
    const dialogRef = this.dialog.open(NewClienteComponent, {
      width: '450px',
      data: { idCliente: idCliente, nombre: nombre, descripcion: descripcion }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Cliente actualizado con éxito", "Operación exitosa");
        this.getClientes();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al actualizar el cliente", "Operación fallida");
      }
    });
  }

  // Metodo para eliminar un cliente
  delete(cliente: ClienteElement) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '450px',
      data: { idCliente: cliente.idCliente, nombreCliente: cliente.nombre, module: "cliente" }
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Cliente eliminado con éxito", "Operación Exitosa");
        this.getClientes();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al eliminar el cliente", "Operación fallida");
      }

    })
  }

  // Metodo para guardar un area
  saveClienteDialog() {
    const dialogRef = this.dialog.open(NewClienteComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 1) {
        this.openSnackbar("Cliente guardado con éxito", "Operación Exitosa");
        this.getClientes();
      } else if (result == 2) {
        this.openSnackbar("Se produjo un error al guardar el cliente", "Operación fallida");
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
  filtrarClientes(event: Event) {
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
    this.clienteService.exportClientesExcel().subscribe((data: any) => {
      let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let fileURL = URL.createObjectURL(file);
      var anchor = document.createElement("a");
      anchor.download = "Reporte clientes.xlsx";
      anchor.href = fileURL;
      anchor.click();
      this.openSnackbar("Exportación de archivo correcta", "Operación exitosa");
    }, (error: any) => {
      this.openSnackbar("Exportación de archivo incorrecta", "Operación fallida");
    });
  }

}
