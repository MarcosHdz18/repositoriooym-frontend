import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewAreaComponent } from './components/new-area/new-area.component';
import { AreaComponent } from './components/area/area.component';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AreaComponent,
    NewAreaComponent,    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AreasModule { }
