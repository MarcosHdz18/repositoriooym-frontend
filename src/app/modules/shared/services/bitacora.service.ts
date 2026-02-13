import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Enpoint de los servicios REST del backend
const base_url = environment.endpoint_url;

@Injectable({
    providedIn: 'root'
})
export class BitacoraService {

    /**
   * 
   * @param http Objeto que interactua con los distintos servicios REST del backend
   */
    constructor(private http: HttpClient) { }

    /** 
   * Metodo que obtiene desde el backend todos los objetos de la lista de bitacoras
   * @returns servicio con todos las bitacoras
   */
    getBitacora(): Observable<any[]> {

        const endpoint = `${base_url}/bitacoras`;

        return this.http.get<any[]>(endpoint);
    }
}