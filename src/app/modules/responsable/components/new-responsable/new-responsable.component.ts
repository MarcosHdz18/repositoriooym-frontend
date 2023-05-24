import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from 'src/app/modules/shared/services/area.service';
import { ResponsableService } from 'src/app/modules/shared/services/responsable.service';

@Component({
  selector: 'app-new-responsable',
  templateUrl: './new-responsable.component.html',
  styleUrls: ['./new-responsable.component.css']
})
export class NewResponsableComponent implements OnInit {

  public responsableForm: FormGroup;
  tituloFormulario: string;
  botonLabel: string;
  areas: AreaElement[] = [];

  constructor(private fb: FormBuilder, private areaService: AreaService, private responsableService: ResponsableService,
    private dialogRef: MatDialogRef<NewResponsableComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.tituloFormulario = 'Agregar nuevo';
      this.botonLabel = 'Guardar';

      this.responsableForm = this.fb.group({
        nombre: ['', Validators.required],
        apellidoPaterno: ['', Validators.required],
        apellidoMaterno: ['', Validators.required],
        numeroEmpleado: ['', Validators.required],
        area: ['', Validators.required]
      });

      if (data != null) {
        this.updateForm(data);
        this.tituloFormulario = 'Actualizar';
        this.botonLabel = 'Actualizar';
      }
    }

  ngOnInit(): void {
    this.getAreas();
  }

  /**
   * Metodo que obtiene todas las areas para pintarse en el select del formulario
   */
  getAreas() {
    this.areaService.getAreas().subscribe((data: any) => {
      console.log("Respuesta del servicio areas: ", data);
      this.areas = data.areaResponse.areas;
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  /**
   * Metodo que realizara el guardado de los datos a través del servicio REST del backend
   */
  onSave() {
    let data = {
      nombre: this.responsableForm.get('nombre') ?.value,
      apellidoPaterno: this.responsableForm.get('apellidoPaterno') ?.value,
      apellidoMaterno: this.responsableForm.get('apellidoMaterno') ?.value,
      numeroEmpleado: this.responsableForm.get('numeroEmpleado') ?.value,
      area: this.responsableForm.get('area') ?.value
    }

    const saveData = new FormData();

    saveData.append('nombre', data.nombre);
    saveData.append('apellidoPaterno', data.apellidoPaterno);
    saveData.append('apellidoMaterno', data.apellidoMaterno);
    saveData.append('numeroEmpleado', data.numeroEmpleado);
    saveData.append('areaId', data.area);

    if (this.data != null) {
      // Llamado al servicio para actualizar un responsable
      this.responsableService.updateResponsable(saveData, this.data.idResponsable).subscribe((data: any) => {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      });
    } else {
      // Llamdo al servicio para guardar un responsable
      this.responsableService.saveResponsable(saveData).subscribe((data: any) => {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      });
    }
  }

  /**
   * Metodo que actualiza el formulario con los datos del registro seleccionado 
   * @param data data del formulario
   */
  updateForm(data: any) {
    this.responsableForm = this.fb.group({
      nombre: [data.nombre, Validators.required],
      apellidoPaterno: [data.apellidoPaterno, Validators.required],
      apellidoMaterno: [data.apellidoMaterno, Validators.required],
      numeroEmpleado: [data.numeroEmpleado, Validators.required],
      area: [data.area.idArea, Validators.required]
    });
  }

  /**
   * Metodo para cerrar el dialog
   */
  onCancel() {
    this.dialogRef.close(3);
  }

}

// Contrato con los datos del empate con el servicio REST del backend
export interface AreaElement {
  idArea: number;
  nombre: string;
  descripcion: string;
}
