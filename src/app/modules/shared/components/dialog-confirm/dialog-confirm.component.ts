import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from '../../services/area.service';
import { ResponsableService } from '../../services/responsable.service';
import { ProyectoService } from '../../services/proyecto.service';
import { TipoProyectoService } from '../../services/tipoProyectoService.service';

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

  nombreArea = '';
  nombreResponsable = '';
  nombreProyecto = '';
  nombreTipoProyecto = '';

  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>, @Inject (MAT_DIALOG_DATA) public data: any,
  private areaService: AreaService, private responsableService: ResponsableService, private tipoProyectoService: TipoProyectoService,
  private proyectoService: ProyectoService) { }

  ngOnInit(): void {
    this.idAreaDeleted = this.data.idArea;
    this.idResponsableDeleted = this.data.idResponsable;
    this.idProyectoDeleted = this.data.idProyecto;
    this.idTipoProyectoDeleted = this.data.idTipoProyecto;

    this.nombreArea = this.data.nombreArea;
    this.nombreResponsable = this.data.nombreResponsable;
    this.nombreProyecto = this.data.nombreProyecto;
    this.nombreTipoProyecto = this.data.nombreTipoProyecto;
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
      } else if (this.data.module == "tipoProyecto") {
        this.tipoProyectoService.deleteTipoProyecto(this.data.idTipoProyecto).subscribe((data: any) => {
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
