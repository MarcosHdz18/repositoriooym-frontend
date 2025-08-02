import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/modules/shared/shared.module";
import { RegionComponent } from './components/region/region.component';
import { NewRegionComponent } from './components/new-region/new-region.component';



@NgModule({
  declarations: [
    RegionComponent,
    NewRegionComponent,    
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
export class RegionModule { }
