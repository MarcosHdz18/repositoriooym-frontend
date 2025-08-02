import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Enpoint de los servicios REST del backend
const endpoint_url = environment.endpoint_url;

@Injectable({
    providedIn: 'root'
})
export class RegionService {

    /**
     * Variable que obtendra los servicios REST del backend
     * @param http Objeto que interactua con los distintos servicios REST del backend
     */
    constructor(private http: HttpClient) { }

    /**
     * Metodo que obtiene todas las areas desde el servicio REST respectivo
     * @returns servicio con todas las areas
     */
    getRegiones() {
        const endpoint = `${endpoint_url}/regiones`;

        return this.http.get(endpoint);
    }

    /**
     * Metodo que periste un registro en la base de datos
     * @param body json con la data a persistir en la base de datos
     * @returns servicio para persistir un registro en la base de datos
     */
    saveRegion(body: any) {
        const endpoint = `${endpoint_url}/regiones`;

        return this.http.post(endpoint, body);
    }

    /**
     * Metodo que se utilizara para actualizar un registro en la base de datos
     * @param body json con la data a actualizar en la base de datos
     * @param idRegion identificador unico que se utilizara para actualizar el registro
     * @returns servicio para actualizar un registro mediante su identificador unico
     */
    updateRegion(body: any, idRegion: any) {
        const endpoint = `${endpoint_url}/regiones/${idRegion}`;

        return this.http.put(endpoint, body);
    }

    /**
     * Metodo que se utilizara para el borrado de un registro a traves de su identificador
     * @param idRegion identificador unico del registro a eliminar
     * @returns servicio para eliminar un registro en la base de datos
     */
    deleteRegion(idRegion: any) {
        const endpoint = `${endpoint_url}/regiones/${idRegion}`;

        return this.http.delete(endpoint);
    }

    /**
     * Metodo que permite la exportacion de los datos en formato de libro de excel
     * @returns file export excel
     */
    exportRegionesExcel() {
        const endpoint = `${endpoint_url}/regiones/export/excel`;

        return this.http.get(endpoint, {
            responseType: 'blob'
        });

    }
}