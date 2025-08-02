import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegionService } from 'src/app/modules/shared/services/region.service';

@Component({
  selector: 'app-new-region',
  templateUrl: './new-region.component.html',
  styleUrls: ['./new-region.component.css']
})
export class NewRegionComponent implements OnInit {

  public regionForm: FormGroup;

  tituloFormulario: string;
  botonLabel: string;

  constructor(private fb: FormBuilder, private regionService: RegionService, private dialogRef: MatDialogRef<NewRegionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.tituloFormulario = "Agregar";
    this.botonLabel = "Guardar";

    this.regionForm = this.fb.group({
      nombre: ['', Validators.required],
    });

    if (data != null) {
      this.updateForm(data);
      this.tituloFormulario = "Actualizar";
      this.botonLabel = "Actualizar";
    }
  }

  ngOnInit(): void {
  }

  /**
  * Metodo que realizara el guardado de los datos a través del servicio REST destinado para tal fin
  */
  onSave() {

    let data = {
      nombre: this.regionForm.get('nombre')?.value
    };

    if (this.data != null) {
      // Actualizar registro
      this.regionService.updateRegion(data, this.data.idRegion).subscribe((data: any) => {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      });
    } else {
      // Crear un nuevo registro
      this.regionService.saveRegion(data).subscribe((data: any) => {
        console.log(data);
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      });
    }
  }

  /**
   * Metodo que actualiza el formulario con los datos del registro seleccionado
   */
  updateForm(data: any) {
    this.regionForm = this.fb.group({
      nombre: [data.nombre, Validators.required]
    });
  }

  /**
   * Metodo para cerrar el dialog
   */
  onCancel() {
    this.dialogRef.close(3);
  }

}
