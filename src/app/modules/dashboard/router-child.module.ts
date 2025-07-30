import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from '../areas/components/area/area.component';
import { ResponsableComponent } from '../responsable/components/responsable/responsable.component';
import { HomeComponent } from './components/home/home.component';
import { ProyectoComponent } from '../proyecto/components/proyecto/proyecto.component';
import { MisionComponent } from './pages/mision/mision.component';
import { VisionComponent } from './pages/vision/vision.component';
import { ObjetivosComponent } from './pages/objetivos/objetivos.component';
import { TipoProyectoComponent } from '../tipoProyecto/components/tipo-proyecto/tipo-proyecto.component';
import { ProyectosLegacyComponent } from './pages/proyectos-legacy/proyectos-legacy.component';
import { OrganigramaComponent } from './pages/organigrama/organigrama.component';

const childRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'mision', component: MisionComponent },
  { path: 'vision', component: VisionComponent },
  { path: 'objetivos', component: ObjetivosComponent },
  { path: 'organigrama', component: OrganigramaComponent },
  { path: 'area', component: AreaComponent },
  { path: 'responsable', component: ResponsableComponent },
  { path: 'tipoProyecto', component: TipoProyectoComponent },
  { path: 'proyecto', component: ProyectoComponent},
  { path: 'proyectosLegacy', component: ProyectosLegacyComponent}
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class RouterChildModule { }
