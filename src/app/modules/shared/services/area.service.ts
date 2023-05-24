import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Enpoint de los servicios REST del backend
const endpoint_url = environment.endpoint_url;

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  /**
   * Variable que obtendra los servicios REST del backend
   * @param http Objeto que interactua con los distintos servicios REST del backend
   */
  constructor(private http: HttpClient) { }

  /**
   * Metodo que obtiene todas las areas desde el servicio REST respectivo
   * @returns servicio con todas las areas
   */
  getAreas() {
    const endpoint = `${endpoint_url}/areas`;

    return this.http.get(endpoint);
  }

  /**
   * Metodo que periste un registro en la base de datos
   * @param body json con la data a persistir en la base de datos
   * @returns servicio para persistir un registro en la base de datos
   */
  saveArea(body: any) {
    const endpoint = `${endpoint_url}/areas`;

    return this.http.post(endpoint, body);
  }

  /**
   * Metodo que se utilizara para actualizar un registro en la base de datos
   * @param body json con la data a actualizar en la base de datos
   * @param idArea identificador unico que se utilizara para actualizar el registro
   * @returns servicio para actualizar un registro mediante su identificador unico
   */
  updateArea(body: any, idArea: any) {
    const endpoint = `${endpoint_url}/areas/${idArea}`;

    return this.http.put(endpoint, body);
  }

  /**
   * Metodo que se utilizara para el borrado de un registro a traves de su identificador
   * @param idArea identificador unico del registro a eliminar
   * @returns servicio para eliminar un registro en la base de datos
   */
  deleteArea(idArea: any) {
    const endpoint = `${endpoint_url}/areas/${idArea}`;

    return this.http.delete(endpoint);
  }

  /**
   * Metodo que permite la exportacion de los datos en formato de libro de excel
   * @returns file export excel
   */
  exportAreasExcel() {
    const endpoint = `${endpoint_url}/areas/export/excel`;

    return this.http.get(endpoint, {
      responseType: 'blob'
    });

  }
}
