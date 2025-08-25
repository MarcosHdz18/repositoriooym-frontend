import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/modules/shared/shared.module";
import { ClienteComponent } from './components/cliente/cliente.component';
import { NewClienteComponent } from './components/new-cliente/new-cliente.component';



@NgModule({
  declarations: [
    ClienteComponent,
    NewClienteComponent   
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
export class ClienteModule { }
