import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from '../../services/area.service';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {

  idAreaDeleted = 0;
  idResponsableDeleted = 0;

  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>, @Inject (MAT_DIALOG_DATA) public data: any,
  private areaService: AreaService) { }

  ngOnInit(): void {
    this.idAreaDeleted = this.data.idAreaResponsableProyecto;
  }

  // Confirmacion para eliminar el registro seleccionado
  clickConfirmado() {
    if (this.data != null) {

      if (this.data.module == "area") {
        this.areaService.deleteArea(this.data.idAreaResponsableProyecto).subscribe((data: any) => {
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        });

      } else if (this.data.module == "responsable") {
        
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
