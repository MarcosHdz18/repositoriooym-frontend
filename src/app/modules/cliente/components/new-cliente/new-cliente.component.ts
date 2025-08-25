import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClienteService } from 'src/app/modules/shared/services/cliente.service';

@Component({
  selector: 'app-new-cliente',
  templateUrl: './new-cliente.component.html',
  styleUrls: ['./new-cliente.component.css']
})
export class NewClienteComponent implements OnInit {

  public clienteForm: FormGroup;

  tituloFormulario: string;
  botonLabel: string;

  constructor(private fb: FormBuilder, private clienteService: ClienteService, private dialogRef: MatDialogRef<NewClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.tituloFormulario = "Agregar";
    this.botonLabel = "Guardar";

    this.clienteForm = this.fb.group({
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
      nombre: this.clienteForm.get('nombre')?.value,
      descripcion: this.clienteForm.get('descripcion')?.value
    };

    if (this.data != null) {
      // Actualizar registro
      this.clienteService.updateCliente(data, this.data.idCliente).subscribe((data: any) => {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      });
    } else {
      // Crear un nuevo registro
      this.clienteService.saveCliente(data).subscribe((data: any) => {
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
    this.clienteForm = this.fb.group({
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
