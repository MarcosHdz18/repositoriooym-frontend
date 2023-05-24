import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsableComponent } from './components/responsable/responsable.component';
import { NewResponsableComponent } from './components/new-responsable/new-responsable.component';

@NgModule({
  declarations: [
    ResponsableComponent,
    NewResponsableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ResponsableModule { }
