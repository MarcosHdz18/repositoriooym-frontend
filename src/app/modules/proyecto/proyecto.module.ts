import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { NewProyectoComponent } from './components/new-proyecto/new-proyecto.component';
import { DetalleProyectoComponent } from './components/detalle-proyecto/detalle-proyecto.component';
import { EditProyectoComponent } from './components/edit-proyecto/edit-proyecto.component';
import { SharedModule } from "src/app/modules/shared/shared.module";

@NgModule({
  declarations: [
    ProyectoComponent,
    NewProyectoComponent,
    DetalleProyectoComponent,
    EditProyectoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
]
})
export class ProyectoModule { }
