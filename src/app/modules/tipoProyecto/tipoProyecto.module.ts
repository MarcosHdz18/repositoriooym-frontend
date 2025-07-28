import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/modules/shared/shared.module";
import { TipoProyectoComponent } from './components/tipo-proyecto/tipo-proyecto.component';
import { NewTipoProyectoComponent } from './components/new-tipo-proyecto/new-tipo-proyecto.component';



@NgModule({
  declarations: [
    TipoProyectoComponent,
    NewTipoProyectoComponent    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class TipoProyectoModule { }
