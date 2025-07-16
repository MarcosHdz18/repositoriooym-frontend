import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from '../areas/components/area/area.component';
import { ResponsableComponent } from '../responsable/components/responsable/responsable.component';
import { HomeComponent } from './components/home/home.component';
import { ProyectoComponent } from '../proyecto/components/proyecto/proyecto.component';

const childRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'area', component: AreaComponent },
  { path: 'responsable', component: ResponsableComponent },
  { path: 'proyecto', component: ProyectoComponent}
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class RouterChildModule { }
