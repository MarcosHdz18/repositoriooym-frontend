import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Enpoint de los servicios REST del backend
const endpoint_url = environment.endpoint_url;

@Injectable({
  providedIn: 'root'
})
export class ResponsableService {

  constructor(private http: HttpClient) { }

  /**
   * Metodo que obtiene desde el backend todos los objetos de la lista de responsables
   * @returns servicio con todos los responsables
   */
  getResponsables() {
    const endpoint = `${endpoint_url}/responsables`;

    return this.http.get(endpoint);
  }

  /**
   * Metodo que persiste un objeto en la base de datos
   * @param body cuerpo con los datos que se guardaran en la base de datos
   * @returns servicio para persistir un objeto en la base de datos
   */
  saveResponsable(body: any) {
    const endpoint = `${endpoint_url}/responsables`;

    return this.http.post(endpoint, body);
  }

  /**
   * Metodo que se utilizara para realizar la actualizacion de un registro mediante el identificador unico
   * @param body data con las actualizaciones correspondientes
   * @param idResponsable identificador unico que se utilizara para la actualizacion
   * @returns json con la data actualizada
   */
  updateResponsable(body: any, idResponsable: any) {
    const endpoint = `${endpoint_url}/responsables/${idResponsable}`;

    return this.http.put(endpoint, body);
  }

  /**
   * Metodo que realiza la eliminacion del registro del responsable con el identificador unico
   * @param idResponsable identificador unico del responsable que se eliminara
   * @returns servicio con la eliminacion del responsable
   */
  deleteResponsable(idResponsable: any) {
    const endpoint = `${endpoint_url}/responsables/${idResponsable}`;

    return this.http.delete(endpoint);
  }
}
