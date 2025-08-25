import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Enpoint de los servicios REST del backend
const endpoint_url = environment.endpoint_url;

@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    /**
     * Variable que obtendra los servicios REST del backend
     * @param http Objeto que interactua con los distintos servicios REST del backend
     */
    constructor(private http: HttpClient) { }

    /**
     * Metodo que obtiene todas las areas desde el servicio REST respectivo
     * @returns servicio con todas las areas
     */
    getClientes() {
        const endpoint = `${endpoint_url}/clientes`;

        return this.http.get(endpoint);
    }

    /**
     * Metodo que periste un registro en la base de datos
     * @param body json con la data a persistir en la base de datos
     * @returns servicio para persistir un registro en la base de datos
     */
    saveCliente(body: any) {
        const endpoint = `${endpoint_url}/clientes`;

        return this.http.post(endpoint, body);
    }

    /**
     * Metodo que se utilizara para actualizar un registro en la base de datos
     * @param body json con la data a actualizar en la base de datos
     * @param idCliente identificador unico que se utilizara para actualizar el registro
     * @returns servicio para actualizar un registro mediante su identificador unico
     */
    updateCliente(body: any, idCliente: any) {
        const endpoint = `${endpoint_url}/clientes/${idCliente}`;

        return this.http.put(endpoint, body);
    }

    /**
     * Metodo que se utilizara para el borrado de un registro a traves de su identificador
     * @param idCliente identificador unico del registro a eliminar
     * @returns servicio para eliminar un registro en la base de datos
     */
    deleteArea(idCliente: any) {
        const endpoint = `${endpoint_url}/clientes/${idCliente}`;

        return this.http.delete(endpoint);
    }

    /**
     * Metodo que permite la exportacion de los datos en formato de libro de excel
     * @returns file export excel
     */
    exportClientesExcel() {
        const endpoint = `${endpoint_url}/clientes/export/excel`;

        return this.http.get(endpoint, {
            responseType: 'blob'
        });

    }
}
