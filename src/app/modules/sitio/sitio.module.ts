import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/modules/shared/shared.module";
import { SitioComponent } from './components/sitio/sitio.component';
import { NewSitioComponent } from './components/new-sitio/new-sitio.component';



@NgModule({
  declarations: [
    SitioComponent,
    NewSitioComponent,    
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
export class SitioModule { }
