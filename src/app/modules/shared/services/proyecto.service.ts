import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProyectoElement } from 'src/app/models/proyecto.model';
import { environment } from 'src/environments/environment';

// Enpoint de los servicios REST del backend
const base_url = environment.endpoint_url;

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  /**
   * 
   * @param http Objeto que interactua con los distintos servicios REST del backend
   */
  constructor(private http: HttpClient) { }

  /** 
   * Metodo que obtiene desde el backend todos los objetos de la lista de proyectos
   * @returns servicio con todos los proyectos
   */
  getProyectos(): Observable<ProyectoElement> {
    const endpoint = `${base_url}/proyectos`

    return this.http.get<ProyectoElement>(endpoint);
  }

  /**
   * Metodo que persiste la data de tipo proyecto en la base de datos
   * @param body cuerpo con los datos que se guardaran en la base de datos
   * @returns servicio con el guardado de los proyectos
   */
  saveProyecto(body: any) {
    const endpoint = `${base_url}/proyectos`;

    return this.http.post(endpoint, body);
  }

  /**
   * Metodo que se utilizara para realizar la actualizacion de un registro mediante el identificador unico
   * @param body data con las actualizaciones correspondiente
   * @param idProyecto identificador unico que se utilizara para la actualizacion
   * @returns json con la data actualizada
   */
  updateProyecto(idProyecto: number, formData: FormData): Observable<ProyectoElement> {
    const endpoint = `${base_url}/proyectos/${idProyecto}`;

    return this.http.put<ProyectoElement>(endpoint, formData);
  }

  /**
   * Metodo que realiza la eliminacion del registro del proyecto con el identificador unico
   * @param idProyecto identificador unico del proyecto que se eliminara
   * @returns null
   */
  deleteProyecto(idProyecto: number): Observable<void> {
    const endpoint = `${base_url}/proyectos/${idProyecto}`;

    return this.http.delete<void>(endpoint);
  }

  /**
   * Metodo que realiza la busqueda por nombre de los proyectos
   * @param nombre parametro del nombre a buscar
   * @returns json con el listado de los proyectos filtrados por nombre
   */
  getProyectosByName(nombre: any) {
    const endpoint = `${base_url}/proyectos/filter/${nombre}`;

    return this.http.get(endpoint);
  }

  /**
   * Metodo que obtiene la URL del archivo en la base de datos
   * @param filename nombre del archivo guardado en la base de datos
   * @returns url con el nombre del archivo
   
  getUrlFile (filename: any) {
    const endpoint = `${base_url}/proyectos/documentacion_proyectos/${filename}`;

    return this.http.get(endpoint);
  }*/

  /**
   * Descarga un archivo de un proyecto como blob
   * @param id identificador del proyecto
   * @param documento nombre del documento a descargar (f60, lld, hld, layout, sla, reporteFotografico, asignacionFuerzaEspacio, inventarioHardware, atpFisico, atpFisicoFirmado)
   * @returns servicio que devuelve el archivo como blob
   */
  downloadFile(id: number, documento: string) {
    const endpoint = `${base_url}/proyectos/${id}/archivo/${documento}`;
    return this.http.get(endpoint, {
      observe: 'response',
      responseType: 'blob',
      headers: new HttpHeaders({ 'Accept': 'application/octet-stream' })
    });
  }

  /**
   * Metodo que permite la exportacion de los datos en formato de libro de excel
   * @returns file export excel
   */
  exportProyectosExcel() {
    const endpoint = `${base_url}/proyectos/export/excel`;

    return this.http.get(endpoint, { 
      responseType: 'blob'
    });

  }
}
