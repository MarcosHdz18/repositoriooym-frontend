import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from 'src/app/modules/shared/services/area.service';

@Component({
  selector: 'app-new-area',
  templateUrl: './new-area.component.html',
  styleUrls: ['./new-area.component.css']
})
export class NewAreaComponent implements OnInit {

  public areaForm: FormGroup;

  tituloFormulario: string;
  botonLabel: string;

  constructor(private fb: FormBuilder, private areaService: AreaService, private dialogRef: MatDialogRef<NewAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.tituloFormulario = "Agregar";
    this.botonLabel = "Guardar";

    this.areaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
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
      nombre: this.areaForm.get('nombre')?.value,
      descripcion: this.areaForm.get('descripcion')?.value
    };

    if (this.data != null) {
      // Actualizar registro
      this.areaService.updateArea(data, this.data.idArea).subscribe((data: any) => {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      });
    } else {
      // Crear un nuevo registro
      this.areaService.saveArea(data).subscribe((data: any) => {
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
    this.areaForm = this.fb.group({
      nombre: [data.nombre, Validators.required],
      descripcion: [data.descripcion, Validators.required]
    });
  }

  /**
   * Metodo para cerrar el dialog
   */
  onCancel() {
    this.dialogRef.close(3);
  }
}
