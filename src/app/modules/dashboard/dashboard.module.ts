import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { AreasModule } from '../areas/areas.module';
import { ResponsableModule } from '../responsable/responsable.module';
import { ProyectoModule } from '../proyecto/proyecto.module';
import { MisionComponent } from './pages/mision/mision.component';
import { VisionComponent } from './pages/vision/vision.component';
import { ObjetivosComponent } from './pages/objetivos/objetivos.component';
import { TipoProyectoModule } from '../tipoProyecto/tipoProyecto.module';
import { ProyectosLegacyComponent } from './pages/proyectos-legacy/proyectos-legacy.component';
import { OrganigramaComponent } from './pages/organigrama/organigrama.component';
import { RegionModule } from '../region/region.module';
import { SitioModule } from '../sitio/sitio.module';
import { ClienteModule } from '../cliente/cliente.module';
import { BitacoraModule } from '../bitacora/bitacora.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    MisionComponent,
    VisionComponent,
    ObjetivosComponent,
    ProyectosLegacyComponent,
    OrganigramaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    AreasModule,
    ResponsableModule,
    RegionModule,
    ClienteModule,
    SitioModule,
    TipoProyectoModule,
    ProyectoModule,
    BitacoraModule
  ]
})
export class DashboardModule { }
