import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Enpoint de los servicios REST del backend
const base_url = environment.endpoint_url;

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor() { }
}
