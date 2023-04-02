import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const childRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
]

@NgModule({
  declarations: [],
  imports: [
  ]
})
export class RouterChildModule { }
