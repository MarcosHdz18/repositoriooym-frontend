import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from '../areas/components/area/area.component';
import { ResponsableComponent } from '../responsable/components/responsable/responsable.component';
import { HomeComponent } from './components/home/home.component';
import { ProyectoComponent } from '../proyecto/components/proyecto/proyecto.component';
import { ObjetivosComponent } from './pages/objetivos/objetivos.component';
import { TipoProyectoComponent } from '../tipoProyecto/components/tipo-proyecto/tipo-proyecto.component';
import { ProyectosLegacyComponent } from './pages/proyectos-legacy/proyectos-legacy.component';
import { OrganigramaComponent } from './pages/organigrama/organigrama.component';
import { RegionComponent } from '../region/components/region/region.component';
import { SitioComponent } from '../sitio/components/sitio/sitio.component';
import { ClienteComponent } from '../cliente/components/cliente/cliente.component';
import { BitacoraComponent } from '../bitacora/components/bitacora/bitacora.component';

const childRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  //{ path: 'mision', component: MisionComponent },
  //{ path: 'vision', component: VisionComponent },
  { path: 'objetivos', component: ObjetivosComponent },
  { path: 'organigrama', component: OrganigramaComponent },
  { path: 'area', component: AreaComponent },
  { path: 'responsable', component: ResponsableComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'region', component: RegionComponent },
  { path: 'sitio', component: SitioComponent },
  { path: 'tipoProyecto', component: TipoProyectoComponent },
  { path: 'proyecto', component: ProyectoComponent},
  { path: 'proyectosLegacy', component: ProyectosLegacyComponent},
  { path: 'bitacora', component: BitacoraComponent}
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class RouterChildModule { }
