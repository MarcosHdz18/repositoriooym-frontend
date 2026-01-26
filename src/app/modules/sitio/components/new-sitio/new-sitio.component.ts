import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegionElement } from 'src/app/models/region.model';
import { NewResponsableComponent } from 'src/app/modules/responsable/components/new-responsable/new-responsable.component';
import { AreaService } from 'src/app/modules/shared/services/area.service';
import { RegionService } from 'src/app/modules/shared/services/region.service';
import { ResponsableService } from 'src/app/modules/shared/services/responsable.service';
import { SitioService } from 'src/app/modules/shared/services/sitio.service';

@Component({
  selector: 'app-new-sitio',
  templateUrl: './new-sitio.component.html',
  styleUrls: ['./new-sitio.component.css']
})
export class NewSitioComponent implements OnInit {

  public sitioForm: FormGroup;
  tituloFormulario: string;
  botonLabel: string;
  regiones: RegionElement[] = [];

  constructor(private fb: FormBuilder, private regionService: RegionService, private sitioService: SitioService,
    private dialogRef: MatDialogRef<NewSitioComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.tituloFormulario = 'Agregar nuevo';
    this.botonLabel = 'Guardar';

    this.sitioForm = this.fb.group({
      nombre: ['', Validators.required],
      treeChar: ['', Validators.required],
      direccion: ['', Validators.required],
      nombreContacto: ['', Validators.required],
      telefonoContacto: ['', Validators.required],
      correoContacto: ['', Validators.required],
      region: ['', Validators.required]
    });

    if (data != null) {
      this.updateForm(data);
      this.tituloFormulario = 'Actualizar';
      this.botonLabel = 'Actualizar';
    }
  }

  ngOnInit(): void {
    this.getRegiones();
  }

  /**
   * Metodo que obtiene todas las areas para pintarse en el select del formulario
   */
  getRegiones() {
    this.regionService.getRegiones().subscribe((data: any) => {
      console.log("Respuesta del servicio regiones: ", data);
      this.regiones = data.regionResponse.regiones;
    }, (error: any) => {
      console.log("Error: ", error);
    });
  }

  /**
   * Metodo que realizara el guardado de los datos a través del servicio REST del backend
   */
  onSave() {
    let data = {
      nombre: this.sitioForm.get('nombre')?.value.toUpperCase(),
      treeChar: this.sitioForm.get('treeChar')?.value,
      direccion: this.sitioForm.get('direccion')?.value,
      nombreContacto: this.sitioForm.get('nombreContacto')?.value.toUpperCase(),
      telefonoContacto: this.sitioForm.get('telefonoContacto')?.value,
      correoContacto: this.sitioForm.get('correoContacto')?.value,
      region: this.sitioForm.get('region')?.value
    }

    const saveData = new FormData();

    saveData.append('nombre', data.nombre);
    saveData.append('treeChar', data.treeChar);
    saveData.append('direccion', data.direccion);
    saveData.append('nombreContacto', data.nombreContacto);
    saveData.append('telefonoContacto', data.telefonoContacto);
    saveData.append('correoContacto', data.correoContacto);
    saveData.append('regionId', data.region);

    if (this.data != null) {
      // Llamado al servicio para actualizar un responsable
      this.sitioService.updateSitio(saveData, this.data.idSitio).subscribe((data: any) => {
        this.dialogRef.close(1);
      }, (error: any) => {
        this.dialogRef.close(2);
      });
    } else {
      // Llamdo al servicio para guardar un responsable
      this.sitioService.saveSitio(saveData).subscribe((data: any) => {
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
    this.sitioForm = this.fb.group({
      nombre: [data.nombre, Validators.required],
      treeChar: [data.treeChar, Validators.required],
      direccion: [data.direccion, Validators.required],
      nombreContacto: [data.nombreContacto, Validators.required],
      telefonoContacto: [data.telefonoContacto, Validators.required],
      correoContacto: [data.correoContacto, Validators.required],
      region: [data.region.idRegion, Validators.required]
    });
  }


  /**
   * Metodo para cerrar el dialog
   */
  onCancel() {
    this.dialogRef.close(3);
  }
}
