import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from '../../services/area.service';
import { ResponsableService } from '../../services/responsable.service';
import { ProyectoService } from '../../services/proyecto.service';
import { TipoProyectoService } from '../../services/tipoProyectoService.service';
import { RegionService } from '../../services/region.service';
import { ClienteService } from '../../services/cliente.service';
import { SitioService } from '../../services/sitio.service';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {

  idAreaDeleted = 0;
  idResponsableDeleted = 0;
  idProyectoDeleted = 0;
  idTipoProyectoDeleted = 0;
  idRegionDeleted = 0;
  idSitioDeleted = 0;
  idClienteDeleted = 0;

  nombreArea = '';
  nombreResponsable = '';
  nombreRegion = '';
  nombreSitio = '';
  nombreProyecto = '';
  nombreTipoProyecto = '';
  nombreCliente = '';

  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private areaService: AreaService, private responsableService: ResponsableService, private regionService: RegionService,
    private tipoProyectoService: TipoProyectoService, private sitioService: SitioService, private clienteService: ClienteService, private proyectoService: ProyectoService) { }

  ngOnInit(): void {
    this.idAreaDeleted = this.data.idArea;
    this.idResponsableDeleted = this.data.idResponsable;
    this.idProyectoDeleted = this.data.idProyecto;
    this.idTipoProyectoDeleted = this.data.idTipoProyecto;
    this.idRegionDeleted = this.data.idRegion;
    this.idSitioDeleted = this.data.idSitio;
    this.idClienteDeleted = this.data.idCliente;

    this.nombreArea = this.data.nombreArea;
    this.nombreResponsable = this.data.nombreResponsable;
    this.nombreRegion = this.data.nombreRegion;
    this.nombreProyecto = this.data.nombreProyecto;
    this.nombreTipoProyecto = this.data.nombreTipoProyecto;
    this.nombreCliente = this.data.nombreCliente;
    this.nombreSitio = this.data.nombreSitio;
  }

  // Confirmacion para eliminar el registro seleccionado
  clickConfirmado() {
    if (this.data != null) {

      if (this.data.module == "area") {
        this.areaService.deleteArea(this.data.idArea).subscribe((data: any) => {
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        });

      } else if (this.data.module == "responsable") {
        this.responsableService.deleteResponsable(this.data.idResponsable).subscribe((data: any) => {
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        });
      } else if (this.data.module == "region") {
        this.regionService.deleteRegion(this.data.idRegion).subscribe((data: any) => {
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        });
      } else if (this.data.module == "tipoProyecto") {
        this.tipoProyectoService.deleteTipoProyecto(this.data.idTipoProyecto).subscribe((data: any) => {
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        });
      } else if (this.data.module == "sitio") {
        this.sitioService.deleteSitio(this.data.idSitio).subscribe((data: any) => {
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        });
      } else if (this.data.module == "proyecto") {
        this.proyectoService.deleteProyecto(this.data.idProyecto).subscribe((data: any) => {
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        });
      } else if (this.data.module == "cliente") {
        this.clienteService.deleteCliente(this.data.idCliente).subscribe((data: any) => {
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        });
      }

    } else {
      this.dialogRef.close(2);
    }
  }

  // Cierra el modal si se da clic en no
  clickNoConfirmado() {
    this.dialogRef.close(3);
  }

}
