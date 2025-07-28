import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoProyectoService } from 'src/app/modules/shared/services/tipoProyectoService.service';

@Component({
  selector: 'app-new-tipo-proyecto',
  templateUrl: './new-tipo-proyecto.component.html',
  styleUrls: ['./new-tipo-proyecto.component.css']
})
export class NewTipoProyectoComponent implements OnInit {

  public tipoProyectoForm!: FormGroup;

  tituloFormulario!: string;
  botonLabel!: string;

  constructor(private fb: FormBuilder, private tipoProyectoService: TipoProyectoService, private dialogRef: MatDialogRef<NewTipoProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    // Inicialización de variables para el título del formulario y la etiqueta del botón
    this.tituloFormulario = "Agregar";
    this.botonLabel = "Guardar";

    this.tipoProyectoForm = this.fb.group({
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
      nombre: this.tipoProyectoForm.get('nombre')?.value,
      descripcion: this.tipoProyectoForm.get('descripcion')?.value
    };

    if (this.data != null) {
      // Actualizar registro
      this.tipoProyectoService.updateTipoProyecto(data, this.data.idTipoProyecto).subscribe((data: any) => {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      });
    } else {
      // Crear un nuevo registro
      this.tipoProyectoService.saveTipoProyecto(data).subscribe((data: any) => {
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
    this.tipoProyectoForm = this.fb.group({
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
